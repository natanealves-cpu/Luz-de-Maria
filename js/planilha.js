/* =========================================================================
   PLANILHA — lê o catálogo de uma planilha do Google publicada em CSV.
   Só entra em ação se CONFIG.planilhaCSV estiver preenchido em js/config.js.
   Se a leitura falhar, a loja continua com os produtos do próprio config.js.
   ========================================================================= */

window.Planilha = (function () {
  'use strict';

  // Nomes aceitos para cada coluna (sem acento e em minúsculas).
  const COLUNAS = {
    id: ['id', 'codigo', 'sku'],
    nome: ['nome', 'produto'],
    preco: ['preco', 'valor', 'preco de venda'],
    categoria: ['categoria', 'secao', 'tipo'],
    descricao: ['descricao', 'detalhes', 'observacao'],
    estoque: ['estoque', 'quantidade', 'qtd'],
    imagem: ['imagem', 'foto', 'link da foto', 'url da foto'],
    emoji: ['emoji', 'icone'],
    ativo: ['ativo', 'publicar', 'mostrar'],
  };

  const NAO = ['nao', 'n', 'false', '0', 'off', 'oculto'];

  function normalizar(texto) {
    return String(texto == null ? '' : texto)
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/\p{M}/gu, '');
  }

  /* --------------------------- Leitura do CSV ---------------------------- */

  // Percorre caractere a caractere para respeitar vírgulas e quebras de linha
  // que estejam dentro de aspas — comum em descrições.
  function lerCSV(texto) {
    const linhas = [];
    let campo = '';
    let linha = [];
    let dentroDeAspas = false;

    const conteudo = texto.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

    for (let i = 0; i < conteudo.length; i++) {
      const c = conteudo[i];

      if (dentroDeAspas) {
        if (c === '"') {
          if (conteudo[i + 1] === '"') { campo += '"'; i++; }  // aspas escapadas
          else dentroDeAspas = false;
        } else {
          campo += c;
        }
        continue;
      }

      if (c === '"') dentroDeAspas = true;
      else if (c === ',') { linha.push(campo); campo = ''; }
      else if (c === '\n') { linha.push(campo); linhas.push(linha); linha = []; campo = ''; }
      else campo += c;
    }

    linha.push(campo);
    linhas.push(linha);

    // Descarta linhas totalmente vazias
    return linhas.filter((l) => l.some((v) => String(v).trim() !== ''));
  }

  // Descobre em qual posição está cada coluna, pelo cabeçalho da planilha.
  function mapearColunas(cabecalho) {
    const mapa = {};
    const titulos = cabecalho.map(normalizar);

    Object.keys(COLUNAS).forEach((campo) => {
      const posicao = titulos.findIndex((titulo) => COLUNAS[campo].indexOf(titulo) !== -1);
      if (posicao !== -1) mapa[campo] = posicao;
    });

    return mapa;
  }

  /* --------------------------- Conversão de dados ------------------------ */

  // Aceita "34,50", "R$ 34,50", "1.234,56" e "34.50".
  function lerPreco(bruto) {
    let texto = String(bruto || '').replace(/[^\d,.-]/g, '').trim();
    if (!texto) return NaN;

    const temVirgula = texto.indexOf(',') !== -1;
    const temPonto = texto.indexOf('.') !== -1;

    if (temVirgula && temPonto) {
      // Formato brasileiro: ponto é separador de milhar
      texto = texto.replace(/\./g, '').replace(',', '.');
    } else if (temVirgula) {
      texto = texto.replace(',', '.');
    }

    return parseFloat(texto);
  }

  // Vazio ou "-" significa vender sem controlar quantidade.
  function lerEstoque(bruto) {
    const texto = String(bruto == null ? '' : bruto).trim();
    if (texto === '' || texto === '-') return null;

    const numero = parseInt(texto.replace(/[^\d-]/g, ''), 10);
    if (isNaN(numero)) return null;

    return Math.max(0, numero);
  }

  function gerarId(nome, indice) {
    const base = normalizar(nome).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    return (base || 'item') + '-' + (indice + 1);
  }

  function converterLinha(linha, mapa, indice) {
    const valor = (campo) => (mapa[campo] === undefined ? '' : String(linha[mapa[campo]] || '').trim());

    const nome = valor('nome');
    const preco = lerPreco(valor('preco'));

    if (!nome || isNaN(preco)) return null;                       // linha incompleta
    if (NAO.indexOf(normalizar(valor('ativo'))) !== -1) return null; // marcada como oculta

    const estoque = lerEstoque(valor('estoque'));

    return {
      id: valor('id') || gerarId(nome, indice),
      nome: nome,
      preco: preco,
      categoria: valor('categoria') || 'Outros',
      descricao: valor('descricao'),
      imagem: valor('imagem'),
      emoji: valor('emoji'),
      estoque: estoque,
      esgotado: estoque === 0,
    };
  }

  /* ------------------------------- Público ------------------------------- */

  // Devolve { produtos, categorias } ou lança erro se a planilha não responder.
  async function carregar(url, categoriasBase) {
    const resposta = await fetch(url, { cache: 'no-store' });
    if (!resposta.ok) throw new Error('A planilha respondeu com erro ' + resposta.status);

    const linhas = lerCSV(await resposta.text());
    if (linhas.length < 2) throw new Error('A planilha está vazia');

    const mapa = mapearColunas(linhas[0]);
    if (mapa.nome === undefined || mapa.preco === undefined) {
      throw new Error('A planilha precisa das colunas "nome" e "preco"');
    }

    const produtos = linhas.slice(1)
      .map((linha, i) => converterLinha(linha, mapa, i))
      .filter(Boolean);

    if (produtos.length === 0) throw new Error('Nenhum produto válido na planilha');

    // Ids repetidos quebrariam o carrinho: mantém o primeiro de cada.
    const vistos = {};
    const unicos = produtos.filter((p) => {
      if (vistos[p.id]) return false;
      vistos[p.id] = true;
      return true;
    });

    // Mantém a ordem de categorias do config.js e acrescenta as novas no fim.
    const daPlanilha = [];
    unicos.forEach((p) => {
      if (daPlanilha.indexOf(p.categoria) === -1) daPlanilha.push(p.categoria);
    });

    const conhecidas = (categoriasBase || []).filter((c) => daPlanilha.indexOf(c) !== -1);
    const novas = daPlanilha.filter((c) => conhecidas.indexOf(c) === -1);

    return { produtos: unicos, categorias: conhecidas.concat(novas) };
  }

  return { carregar: carregar, lerCSV: lerCSV, lerPreco: lerPreco, lerEstoque: lerEstoque };
})();

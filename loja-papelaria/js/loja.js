/* =========================================================================
   LOJA — catálogo, busca, filtro, carrinho e envio do pedido pelo WhatsApp.
   Não é preciso editar este arquivo para usar a loja: veja js/config.js.
   ========================================================================= */

(function () {
  'use strict';

  const CHAVE_CARRINHO = 'loja:carrinho';

  // Estado da tela
  let categoriaAtiva = 'Todos';
  let termoBusca = '';
  // Catálogo em uso: começa com o do config.js e é substituído pela planilha
  // do Google quando CONFIG.planilhaCSV está preenchido.
  let catalogo = PRODUTOS.slice();
  let categorias = CATEGORIAS.slice();
  let carrinho = carregarCarrinho();

  // Elementos
  const el = {
    nome: document.getElementById('loja-nome'),
    sub: document.getElementById('loja-sub'),
    slogan: document.getElementById('loja-slogan'),
    marcaIcone: document.getElementById('marca-icone'),
    rodape: document.getElementById('rodape-texto'),
    busca: document.getElementById('busca'),
    limparBusca: document.getElementById('limpar-busca'),
    filtros: document.getElementById('filtros'),
    grade: document.getElementById('grade'),
    contador: document.getElementById('contador'),
    semResultado: document.getElementById('sem-resultado'),
    badge: document.getElementById('badge-carrinho'),
    abrirCarrinho: document.getElementById('abrir-carrinho'),
    fecharCarrinho: document.getElementById('fechar-carrinho'),
    carrinho: document.getElementById('carrinho'),
    overlay: document.getElementById('overlay'),
    itens: document.getElementById('carrinho-itens'),
    total: document.getElementById('total'),
    form: document.getElementById('form-pedido'),
    clienteNome: document.getElementById('cliente-nome'),
    clienteObs: document.getElementById('cliente-obs'),
    erro: document.getElementById('erro-form'),
    enviar: document.getElementById('enviar-pedido'),
    limparCarrinho: document.getElementById('limpar-carrinho'),
    aviso: document.getElementById('aviso'),
  };

  /* ------------------------------ Utilidades ----------------------------- */

  const moeda = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
  const ESPACO_FIXO = String.fromCharCode(160);

  function formatar(valor) {
    // O Intl separa "R$" do valor com espaço não-quebrável; trocamos por espaço
    // comum para a mensagem do WhatsApp não sair com caracteres estranhos.
    return moeda.format(valor).split(ESPACO_FIXO).join(' ');
  }

  // Remove acentos e caixa para a busca não depender de digitação exata
  function normalizar(texto) {
    return (texto || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/\p{M}/gu, ''); // tira acentos: "lápis" e "lapis" acham o mesmo item
  }

  function acharProduto(id) {
    return catalogo.find((p) => p.id === id);
  }

  // Quantidade máxima que pode ser vendida: null = sem controle de estoque.
  function limiteDe(produto) {
    return (produto && typeof produto.estoque === 'number') ? produto.estoque : null;
  }

  let avisoTimer;
  function avisar(mensagem) {
    el.aviso.textContent = mensagem;
    el.aviso.hidden = false;
    clearTimeout(avisoTimer);
    avisoTimer = setTimeout(() => { el.aviso.hidden = true; }, 2200);
  }

  /* ----------------------------- Persistência ---------------------------- */

  function carregarCarrinho() {
    try {
      const bruto = JSON.parse(localStorage.getItem(CHAVE_CARRINHO)) || {};
      // Guarda só quantidades válidas. Itens que sumiram do catálogo são
      // ignorados na hora de exibir, e não aqui — o catálogo da planilha
      // pode ainda não ter chegado neste momento.
      const limpo = {};
      Object.keys(bruto).forEach((id) => {
        const qtd = Number(bruto[id]);
        if (qtd > 0) limpo[id] = Math.floor(qtd);
      });
      return limpo;
    } catch (e) {
      return {};
    }
  }

  function salvarCarrinho() {
    try {
      localStorage.setItem(CHAVE_CARRINHO, JSON.stringify(carrinho));
    } catch (e) {
      /* navegação privada pode bloquear: a loja segue funcionando na sessão */
    }
  }

  /* ------------------------------- Catálogo ------------------------------ */

  // Nome completo da loja: "Luz de Maria" + "Boutique Criativa"
  function nomeCompleto() {
    return [CONFIG.nome, CONFIG.sub].filter(Boolean).join(' ');
  }

  function montarIdentidade() {
    document.title = nomeCompleto() + ' — Loja';
    el.nome.textContent = CONFIG.nome;
    el.sub.textContent = CONFIG.sub || '';
    el.slogan.textContent = CONFIG.slogan || '';
    el.rodape.textContent = CONFIG.rodape || '';

    // Se houver arquivo de logo configurado, ele entra no lugar do símbolo SVG.
    if (CONFIG.logo) {
      const img = document.createElement('img');
      img.src = CONFIG.logo;
      img.alt = nomeCompleto();
      const svg = el.marcaIcone.innerHTML;
      img.addEventListener('error', () => { el.marcaIcone.innerHTML = svg; });
      el.marcaIcone.innerHTML = '';
      el.marcaIcone.appendChild(img);
    }
  }

  function montarFiltros() {
    const lista = ['Todos'].concat(categorias);
    el.filtros.innerHTML = '';

    lista.forEach((categoria) => {
      const botao = document.createElement('button');
      botao.type = 'button';
      botao.className = 'chip';
      botao.textContent = categoria;
      botao.setAttribute('aria-pressed', String(categoria === categoriaAtiva));
      botao.addEventListener('click', () => {
        categoriaAtiva = categoria;
        montarFiltros();
        renderCatalogo();
      });
      el.filtros.appendChild(botao);
    });
  }

  function produtosVisiveis() {
    const busca = normalizar(termoBusca);

    return catalogo.filter((produto) => {
      const naCategoria = categoriaAtiva === 'Todos' || produto.categoria === categoriaAtiva;
      if (!naCategoria) return false;
      if (!busca) return true;

      const alvo = normalizar(produto.nome + ' ' + (produto.descricao || '') + ' ' + produto.categoria);
      // Todos os termos digitados precisam aparecer ("caneta azul" acha o item certo)
      return busca.split(/\s+/).every((parte) => alvo.includes(parte));
    });
  }

  // Na planilha basta escrever "caneta.jpg": o site completa para "img/caneta.jpg".
  // Links completos (http/https) e caminhos que já apontam para uma pasta passam direto.
  function caminhoImagem(valor) {
    const caminho = String(valor || '').trim();
    if (!caminho) return '';
    if (/^(https?:)?\/\//i.test(caminho)) return caminho;
    if (caminho.charAt(0) === '/' || caminho.indexOf('/') !== -1) return caminho;
    return 'img/' + caminho;
  }

  function figura(produto, className) {
    const box = document.createElement('div');
    box.className = className;

    if (produto.imagem) {
      const img = document.createElement('img');
      img.src = caminhoImagem(produto.imagem);
      img.alt = produto.nome;
      img.loading = 'lazy';
      // Se a foto não carregar, cai no emoji em vez de mostrar imagem quebrada
      img.addEventListener('error', () => {
        box.textContent = produto.emoji || CONFIG.imagemPadrao;
      });
      box.appendChild(img);
    } else {
      box.textContent = produto.emoji || CONFIG.imagemPadrao;
    }

    return box;
  }

  function criarCard(produto) {
    const li = document.createElement('li');
    li.className = 'card' + (produto.esgotado ? ' card--esgotado' : '');

    li.appendChild(figura(produto, 'card__figura'));

    const corpo = document.createElement('div');
    corpo.className = 'card__corpo';

    const categoria = document.createElement('span');
    categoria.className = 'card__categoria';
    categoria.textContent = produto.categoria;

    const nome = document.createElement('h3');
    nome.className = 'card__nome';
    nome.textContent = produto.nome;

    const descricao = document.createElement('p');
    descricao.className = 'card__descricao';
    descricao.textContent = produto.descricao || '';

    const preco = document.createElement('span');
    preco.className = 'card__preco';
    preco.textContent = formatar(produto.preco);

    // Aviso de estoque baixo, só quando a planilha controla quantidade
    const limite = limiteDe(produto);
    let tag = null;
    if (limite !== null && limite > 0 && limite <= 3) {
      tag = document.createElement('span');
      tag.className = 'card__estoque';
      tag.textContent = limite === 1 ? 'Última unidade' : 'Últimas ' + limite + ' unidades';
    }

    const botao = document.createElement('button');
    botao.type = 'button';
    botao.className = 'card__acao';
    botao.textContent = produto.esgotado ? 'Esgotado' : 'Adicionar';
    botao.disabled = Boolean(produto.esgotado);
    botao.addEventListener('click', () => adicionar(produto.id));

    corpo.append(categoria, nome, descricao, preco);
    if (tag) corpo.appendChild(tag);
    corpo.appendChild(botao);
    li.appendChild(corpo);
    return li;
  }

  function renderCatalogo() {
    const lista = produtosVisiveis();

    el.grade.innerHTML = '';
    lista.forEach((produto) => el.grade.appendChild(criarCard(produto)));

    el.semResultado.hidden = lista.length > 0;
    el.contador.textContent = lista.length === 1
      ? '1 produto encontrado'
      : lista.length + ' produtos encontrados';
  }

  /* ------------------------------- Carrinho ------------------------------ */

  function itensDoCarrinho() {
    return Object.keys(carrinho)
      .map((id) => ({ produto: acharProduto(id), quantidade: carrinho[id] }))
      .filter((item) => item.produto);
  }

  function totalPedido() {
    return itensDoCarrinho().reduce((soma, i) => soma + i.produto.preco * i.quantidade, 0);
  }

  function totalItens() {
    return itensDoCarrinho().reduce((soma, i) => soma + i.quantidade, 0);
  }

  function adicionar(id) {
    const produto = acharProduto(id);
    if (!produto || produto.esgotado) return;

    const limite = limiteDe(produto);
    if (limite !== null && (carrinho[id] || 0) >= limite) {
      avisar('Temos só ' + limite + (limite === 1 ? ' unidade' : ' unidades') + ' em estoque');
      return;
    }

    carrinho[id] = (carrinho[id] || 0) + 1;
    salvarCarrinho();
    renderCarrinho();
    avisar(produto.nome + ' adicionado');
  }

  function alterarQuantidade(id, delta) {
    const limite = limiteDe(acharProduto(id));
    const nova = (carrinho[id] || 0) + delta;

    if (nova <= 0) {
      delete carrinho[id];
    } else if (limite !== null && nova > limite) {
      avisar('Temos só ' + limite + (limite === 1 ? ' unidade' : ' unidades') + ' em estoque');
      return;
    } else {
      carrinho[id] = nova;
    }
    salvarCarrinho();
    renderCarrinho();
  }

  function criarLinhaItem(item) {
    const { produto, quantidade } = item;

    const linha = document.createElement('div');
    linha.className = 'item';

    linha.appendChild(figura(produto, 'item__figura'));

    const info = document.createElement('div');
    const nome = document.createElement('div');
    nome.className = 'item__nome';
    nome.textContent = produto.nome;

    const preco = document.createElement('div');
    preco.className = 'item__preco';
    preco.textContent = quantidade + ' × ' + formatar(produto.preco)
      + '  =  ' + formatar(produto.preco * quantidade);

    info.append(nome, preco);

    const controles = document.createElement('div');
    controles.className = 'quantidade';

    const menos = document.createElement('button');
    menos.type = 'button';
    menos.textContent = '−';
    menos.setAttribute('aria-label', 'Remover uma unidade de ' + produto.nome);
    menos.addEventListener('click', () => alterarQuantidade(produto.id, -1));

    const qtd = document.createElement('span');
    qtd.textContent = String(quantidade);

    const mais = document.createElement('button');
    mais.type = 'button';
    mais.textContent = '+';
    mais.setAttribute('aria-label', 'Adicionar uma unidade de ' + produto.nome);
    mais.addEventListener('click', () => alterarQuantidade(produto.id, 1));

    controles.append(menos, qtd, mais);
    linha.append(info, controles);
    return linha;
  }

  function renderCarrinho() {
    const itens = itensDoCarrinho();

    el.itens.innerHTML = '';

    if (itens.length === 0) {
      const vazio = document.createElement('p');
      vazio.className = 'carrinho__vazio';
      vazio.textContent = 'Seu carrinho está vazio. Escolha os produtos no catálogo.';
      el.itens.appendChild(vazio);
    } else {
      itens.forEach((item) => el.itens.appendChild(criarLinhaItem(item)));
    }

    el.total.textContent = formatar(totalPedido());
    el.enviar.disabled = itens.length === 0;
    el.limparCarrinho.hidden = itens.length === 0;

    const quantidade = totalItens();
    el.badge.textContent = String(quantidade);
    el.badge.hidden = quantidade === 0;
  }

  function abrirCarrinho() {
    el.carrinho.hidden = false;
    el.overlay.hidden = false;
    document.body.style.overflow = 'hidden';
    el.clienteNome.focus();
  }

  function fecharCarrinho() {
    el.carrinho.hidden = true;
    el.overlay.hidden = true;
    document.body.style.overflow = '';
    el.abrirCarrinho.focus();
  }

  /* ------------------------------- WhatsApp ------------------------------ */

  function montarMensagem(nomeCliente, observacoes) {
    const linhas = [];

    linhas.push('*Novo pedido — ' + nomeCompleto() + '*');
    linhas.push('');
    linhas.push('*Cliente:* ' + nomeCliente);
    linhas.push('');
    linhas.push('*Itens:*');

    itensDoCarrinho().forEach((item) => {
      linhas.push('• ' + item.quantidade + 'x ' + item.produto.nome
        + ' — ' + formatar(item.produto.preco * item.quantidade));
    });

    linhas.push('');
    linhas.push('*Total: ' + formatar(totalPedido()) + '*');

    if (observacoes) {
      linhas.push('');
      linhas.push('*Observações:* ' + observacoes);
    }

    return linhas.join('\n');
  }

  function enviarPedido(evento) {
    evento.preventDefault();

    const nomeCliente = el.clienteNome.value.trim();
    const observacoes = el.clienteObs.value.trim();
    const numero = String(CONFIG.whatsapp || '').replace(/\D/g, '');

    el.erro.hidden = true;

    if (itensDoCarrinho().length === 0) {
      mostrarErro('Adicione pelo menos um produto ao carrinho.');
      return;
    }

    if (nomeCliente.length < 2) {
      mostrarErro('Informe seu nome para que possamos identificar o pedido.');
      el.clienteNome.focus();
      return;
    }

    if (numero.length < 12) {
      mostrarErro('O número de WhatsApp da loja não está configurado corretamente '
        + '(veja o campo "whatsapp" em js/config.js).');
      return;
    }

    const url = 'https://wa.me/' + numero
      + '?text=' + encodeURIComponent(montarMensagem(nomeCliente, observacoes));

    window.open(url, '_blank', 'noopener');
  }

  function mostrarErro(mensagem) {
    el.erro.textContent = mensagem;
    el.erro.hidden = false;
  }

  /* -------------------------------- Eventos ------------------------------ */

  el.busca.addEventListener('input', () => {
    termoBusca = el.busca.value;
    el.limparBusca.hidden = termoBusca === '';
    renderCatalogo();
  });

  el.limparBusca.addEventListener('click', () => {
    el.busca.value = '';
    termoBusca = '';
    el.limparBusca.hidden = true;
    renderCatalogo();
    el.busca.focus();
  });

  el.abrirCarrinho.addEventListener('click', abrirCarrinho);
  el.fecharCarrinho.addEventListener('click', fecharCarrinho);
  el.overlay.addEventListener('click', fecharCarrinho);

  document.addEventListener('keydown', (evento) => {
    if (evento.key === 'Escape' && !el.carrinho.hidden) fecharCarrinho();
  });

  el.form.addEventListener('submit', enviarPedido);

  el.limparCarrinho.addEventListener('click', () => {
    carrinho = {};
    salvarCarrinho();
    renderCarrinho();
    avisar('Carrinho esvaziado');
  });

  /* ------------------------- Catálogo da planilha ------------------------ */

  // Se a planilha reduzir o estoque de algo que já está no carrinho, ajusta
  // a quantidade em vez de deixar o cliente pedir o que não existe.
  function ajustarCarrinhoAoEstoque() {
    let mudou = false;

    Object.keys(carrinho).forEach((id) => {
      const produto = acharProduto(id);
      if (!produto) return;                       // some da tela, mas não apaga

      const limite = limiteDe(produto);
      if (limite === null) return;

      if (limite === 0) { delete carrinho[id]; mudou = true; }
      else if (carrinho[id] > limite) { carrinho[id] = limite; mudou = true; }
    });

    if (mudou) {
      salvarCarrinho();
      avisar('Ajustamos seu carrinho ao estoque disponível');
    }
  }

  function carregarPlanilha() {
    if (!CONFIG.planilhaCSV || !window.Planilha) return;

    el.contador.textContent = 'Carregando produtos...';

    Planilha.carregar(CONFIG.planilhaCSV, CATEGORIAS)
      .then((dados) => {
        catalogo = dados.produtos;
        categorias = dados.categorias;

        // A categoria filtrada pode não existir mais na planilha
        if (categoriaAtiva !== 'Todos' && categorias.indexOf(categoriaAtiva) === -1) {
          categoriaAtiva = 'Todos';
        }

        ajustarCarrinhoAoEstoque();
        montarFiltros();
        renderCatalogo();
        renderCarrinho();
      })
      .catch((erro) => {
        // A loja continua no ar com os produtos do config.js.
        console.warn('Não foi possível ler a planilha:', erro.message);
        renderCatalogo();
      });
  }

  /* -------------------------------- Início ------------------------------- */

  montarIdentidade();
  montarFiltros();
  renderCatalogo();
  renderCarrinho();
  carregarPlanilha();
})();

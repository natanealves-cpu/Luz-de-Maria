/* =========================================================================
   CONFIGURAÇÃO DA LOJA
   Este é o único arquivo que você precisa editar no dia a dia.
   ========================================================================= */

const CONFIG = {
  // Nome da marca (linha principal) e a linha menor abaixo dele.
  // As duas juntas formam o nome usado na mensagem do WhatsApp.
  nome: 'Luz de Maria',
  sub: 'Boutique Criativa',
  slogan: 'Papelaria criativa, presentes e material escolar',

  // Logo próprio (opcional). Se você salvar o arquivo em img/logo.png e apontar
  // aqui, ele substitui o símbolo desenhado no cabeçalho.
  // Ex.: logo: 'img/logo.png'
  logo: '',

  // Número que vai RECEBER os pedidos.
  // Formato: código do país + DDD + número, só dígitos. Ex.: 5561999998888
  whatsapp: '5511974818083',

  // Texto opcional exibido no rodapé
  rodape: 'Atendimento de segunda a sábado, das 9h às 18h.',

  // Planilha do Google publicada em CSV (Arquivo > Compartilhar > Publicar na
  // web > aba Produtos > CSV). Deixe vazio para usar a lista PRODUTOS daqui.
  // Só funciona com o site hospedado (Vercel), não abrindo o arquivo direto.
  planilhaCSV: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSduB6JSt8sr0jqmEJHDH4ysDxCBXWcxnw6cVrTuILV2bjpt6b8NVw8WjZkhwETBhPGD5dvNw-71zJ8/pub?output=csv',

  // Símbolo/emoji usado quando um produto não tem foto
  imagemPadrao: '🛒',
};

/* =========================================================================
   CATEGORIAS
   A ordem aqui é a ordem dos filtros na tela.
   ========================================================================= */

const CATEGORIAS = [
  'Escrita',
  'Cadernos',
  'Escolar',
  'Arte',
  'Organização',
];

/* =========================================================================
   PRODUTOS
   - id:        precisa ser único (usado no carrinho)
   - nome:      nome que aparece no card e no pedido
   - preco:     número, em reais (use ponto, não vírgula: 12.90)
   - categoria: precisa ser um dos nomes da lista CATEGORIAS acima
   - descricao: texto curto (opcional)
   - emoji:     usado quando não há foto (opcional)
   - imagem:    caminho de uma foto, ex.: 'img/caderno.jpg' (opcional)
   - esgotado:  true para bloquear a compra sem apagar o produto (opcional)
   ========================================================================= */

const PRODUTOS = [
  {
    id: 'can-001',
    nome: 'Caneta esferográfica azul (caixa c/ 50)',
    preco: 42.90,
    categoria: 'Escrita',
    descricao: 'Ponta 1.0 mm, escrita macia. Caixa fechada.',
    emoji: '🖊️',
  },
  {
    id: 'can-002',
    nome: 'Caneta gel colorida — kit c/ 12',
    preco: 34.50,
    categoria: 'Escrita',
    descricao: 'Cores vibrantes, secagem rápida.',
    emoji: '🖍️',
  },
  {
    id: 'can-003',
    nome: 'Marca-texto pastel — kit c/ 6',
    preco: 19.90,
    categoria: 'Escrita',
    descricao: 'Tons suaves, ponta chanfrada.',
    emoji: '🖌️',
  },
  {
    id: 'lap-001',
    nome: 'Lapiseira 0.7 mm com grip',
    preco: 12.00,
    categoria: 'Escrita',
    descricao: 'Corpo emborrachado, acompanha grafites.',
    emoji: '✏️',
  },
  {
    id: 'cad-001',
    nome: 'Caderno universitário 10 matérias',
    preco: 38.90,
    categoria: 'Cadernos',
    descricao: '200 folhas, capa dura, espiral reforçado.',
    emoji: '📓',
  },
  {
    id: 'cad-002',
    nome: 'Caderno inteligente A5',
    preco: 79.90,
    categoria: 'Cadernos',
    descricao: 'Folhas removíveis, capa personalizável.',
    emoji: '📔',
  },
  {
    id: 'cad-003',
    nome: 'Bloco de anotações pautado A5',
    preco: 14.50,
    categoria: 'Cadernos',
    descricao: '80 folhas destacáveis.',
    emoji: '🗒️',
  },
  {
    id: 'esc-001',
    nome: 'Kit escolar completo',
    preco: 89.90,
    categoria: 'Escolar',
    descricao: 'Estojo, lápis, borracha, apontador, régua e cola.',
    emoji: '🎒',
  },
  {
    id: 'esc-002',
    nome: 'Tesoura escolar sem ponta',
    preco: 9.90,
    categoria: 'Escolar',
    descricao: 'Lâmina em aço inox, cabo ergonômico.',
    emoji: '✂️',
  },
  {
    id: 'esc-003',
    nome: 'Cola branca lavável 90 g',
    preco: 6.50,
    categoria: 'Escolar',
    descricao: 'Não tóxica, secagem transparente.',
    emoji: '🧴',
  },
  {
    id: 'art-001',
    nome: 'Lápis de cor — estojo c/ 36',
    preco: 64.90,
    categoria: 'Arte',
    descricao: 'Pigmentação intensa, mina resistente.',
    emoji: '🌈',
  },
  {
    id: 'art-002',
    nome: 'Tinta guache — 6 cores',
    preco: 22.00,
    categoria: 'Arte',
    descricao: 'Potes de 15 ml, lavável.',
    emoji: '🎨',
  },
  {
    id: 'art-003',
    nome: 'Bloco de papel canson A4',
    preco: 28.90,
    categoria: 'Arte',
    descricao: '20 folhas, 140 g/m².',
    emoji: '📄',
  },
  {
    id: 'org-001',
    nome: 'Planner permanente 2026',
    preco: 69.90,
    categoria: 'Organização',
    descricao: 'Visão mensal e semanal, adesivos inclusos.',
    emoji: '📅',
  },
  {
    id: 'org-002',
    nome: 'Pasta catálogo com 50 plásticos',
    preco: 32.00,
    categoria: 'Organização',
    descricao: 'Capa em polipropileno, tamanho ofício.',
    emoji: '📁',
  },
  {
    id: 'org-003',
    nome: 'Kit organizador de mesa',
    preco: 54.90,
    categoria: 'Organização',
    descricao: 'Porta-canetas, porta-clipes e bandeja.',
    emoji: '🗂️',
    esgotado: true,
  },
];

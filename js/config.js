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
  // Só funciona com o site hospedado, não abrindo o arquivo direto.
  planilhaCSV: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSduB6JSt8sr0jqmEJHDH4ysDxCBXWcxnw6cVrTuILV2bjpt6b8NVw8WjZkhwETBhPGD5dvNw-71zJ8/pub?output=csv',

  // Símbolo/emoji usado quando um produto não tem foto
  imagemPadrao: '🛒',
};

/* =========================================================================
   CATEGORIAS
   A ordem aqui é a ordem dos filtros na tela.
   ========================================================================= */

const CATEGORIAS = [
  'Cadernos',
  'Chaveiro',
];

/* =========================================================================
   PRODUTOS — LISTA DE RESERVA

   No dia a dia o catálogo vem da planilha do Google. Esta lista só entra em
   cena se a planilha não responder (fora do ar, link trocado, publicação
   cancelada). Por isso ela espelha os produtos reais: se algo falhar, o
   visitante vê a loja de verdade, não produtos de exemplo.

   Não precisa manter esta lista perfeitamente igual à planilha. Vale
   atualizar de vez em quando, quando o catálogo mudar bastante.

   Repare que aqui não há estoque: se a planilha está fora do ar, não temos
   como saber a quantidade real, então é melhor não afirmar nada.
   ========================================================================= */

const PRODUTOS = [
  {
    id: 'cad-001',
    nome: 'Caderno Inteligente Rosa Coelho',
    preco: 29.90,
    categoria: 'Cadernos',
    imagem: 'caderno_inteligente_rosa_coelho.jpeg',
    emoji: '📓',
  },
  {
    id: 'cad-002',
    nome: 'Caderno Inteligente Azul Coelho',
    preco: 29.90,
    categoria: 'Cadernos',
    imagem: 'caderno_inteligente_azul_coelho.jpeg',
    emoji: '📔',
  },
  {
    id: 'cad-003',
    nome: 'Caderno Inteligente Branco Koala',
    preco: 29.90,
    categoria: 'Cadernos',
    imagem: 'caderno_inteligente_branco_koala.jpeg',
    emoji: '📔',
  },
  {
    id: 'cad-004',
    nome: 'Caderno Inteligente Rosa Borboleta',
    preco: 29.90,
    categoria: 'Cadernos',
    imagem: 'caderno_inteligente_rosa_borboleta.jpeg',
    emoji: '📔',
  },
  {
    id: 'cha-001',
    nome: 'Chaveiro Bolsinha Amarelo',
    preco: 20.00,
    categoria: 'Chaveiro',
    descricao: 'Mini Chaveiro de Bolsinha',
    imagem: 'chaveiro_bolsinha_amarelo.jpeg',
    emoji: '👜',
  },
  {
    id: 'cha-002',
    nome: 'Chaveiro Bolsinha Branco',
    preco: 20.00,
    categoria: 'Chaveiro',
    descricao: 'Mini Chaveiro de Bolsinha',
    imagem: 'chaveiro_bolsinha_branco.jpeg',
    emoji: '👜',
  },
  {
    id: 'cha-003',
    nome: 'Chaveiro Bolsinha Rosa',
    preco: 20.00,
    categoria: 'Chaveiro',
    descricao: 'Mini Chaveiro de Bolsinha',
    imagem: 'chaveiro_bolsinha_rosa.jpeg',
    emoji: '👜',
  },
  {
    id: 'cha-004',
    nome: 'Chaveiro Bolsinha Rosa Escuro',
    preco: 20.00,
    categoria: 'Chaveiro',
    descricao: 'Mini Chaveiro de Bolsinha',
    imagem: 'chaveiro_bolsinha_rosaescuro.jpeg',
    emoji: '👜',
  },
  {
    id: 'cha-005',
    nome: 'Chaveiro Bolsinha Azul',
    preco: 20.00,
    categoria: 'Chaveiro',
    descricao: 'Mini Chaveiro de Bolsinha',
    imagem: 'chaveiro_bolsinha_azul.jpeg',
    emoji: '👜',
  },
];

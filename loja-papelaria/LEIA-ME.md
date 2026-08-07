# Luz de Maria Boutique Criativa — loja com pedido pelo WhatsApp

Loja de página única (HTML, CSS e JavaScript puros). O cliente monta o carrinho no
site e, ao finalizar, o navegador abre o WhatsApp já com o pedido escrito, pronto
para enviar ao número da loja.

Não há servidor, banco de dados nem pagamento online: o fechamento do pedido
acontece na conversa do WhatsApp.

## Como abrir

Dê dois cliques em `index.html`. Funciona direto do computador, sem instalar nada.

## Arquivos

| Arquivo | Para que serve |
| --- | --- |
| `index.html` | Estrutura da página |
| `css/estilo.css` | Aparência (cores, fontes, layout) |
| `js/config.js` | **Nome da loja, número do WhatsApp, logo, link da planilha, categorias e produtos** |
| `js/planilha.js` | Leitura do catálogo na planilha do Google (opcional) |
| `js/loja.js` | Funcionamento (busca, filtro, carrinho, estoque, montagem da mensagem) |
| `favicon.svg` | Ícone que aparece na aba do navegador |
| `img/` | Fotos dos produtos (veja `img/COMO-USAR.txt`) |
| `modelo-produtos.xlsx` | Planilha modelo para importar no Google Planilhas |

No dia a dia você só precisa mexer em `js/config.js` — ou só na planilha, se usar
o modo planilha descrito no item 5.

## 1. Colocar o seu número de WhatsApp

Em `js/config.js`, troque o valor de `whatsapp`:

```js
whatsapp: '5561999998888',
```

O formato é **código do país + DDD + número, só dígitos**, sem `+`, espaço ou traço.
Brasil é `55`. Exemplo: (61) 99999-8888 vira `5561999998888`.

Enquanto o número não for válido, o botão de envio mostra um aviso em vez de abrir
o WhatsApp.

## 2. Cadastrar seus produtos

Ainda em `js/config.js`, cada produto é um bloco dentro de `PRODUTOS`:

```js
{
  id: 'can-001',                     // único, não repita
  nome: 'Caneta gel colorida',
  preco: 34.50,                      // ponto, nunca vírgula
  categoria: 'Escrita',              // precisa existir na lista CATEGORIAS
  descricao: 'Cores vibrantes.',     // opcional
  emoji: '🖍️',                       // usado quando não há foto
  imagem: 'img/caneta.jpg',          // opcional; se existir, substitui o emoji
  esgotado: true,                    // opcional; deixa o produto sem botão
},
```

Para usar fotos, crie a pasta `img` dentro de `loja-papelaria` e aponte o caminho
em `imagem`. Se a foto não carregar, o site volta a mostrar o emoji sozinho.

Para criar uma categoria nova, acrescente o nome na lista `CATEGORIAS` — o filtro
aparece automaticamente na tela.

## 3. Identidade visual

As cores foram tiradas do logo e ficam no início de `css/estilo.css`, no bloco
`:root`. Para mudar qualquer uma, troque só o código de cor:

| Variável | Cor | Onde aparece |
| --- | --- | --- |
| `--cor-marca` | `#bb8853` | dourado do logo: botões, filtro ativo, símbolo |
| `--cor-marca-escura` | `#9c6d3e` | nome da marca, títulos, hover dos botões |
| `--cor-marca-clara` | `#f6ece0` | fundos suaves (miniaturas, hover) |
| `--cor-fundo` | `#faf6f0` | off-white do fundo da página |
| `--cor-texto` | `#3b3229` | marrom dos textos |
| `--cor-zap` | `#1fa855` | verde só do botão de enviar pelo WhatsApp |

O botão de envio continua verde de propósito: é a cor que o cliente reconhece
como "isso abre o WhatsApp". Se preferir ele dourado, troque `--cor-zap` por
`#bb8853`.

O nome no cabeçalho vem de `nome` e `sub` em `js/config.js` — "Luz de Maria" na
linha grande e "Boutique Criativa" na linha espaçada abaixo. Os dois juntos formam
o nome que aparece no WhatsApp.

### Usar o arquivo do logo

O símbolo do cabeçalho hoje é um desenho em SVG feito a partir do logo (chama,
coração e brilhos em linha contínua) — funciona sem depender de arquivo nenhum.
Para usar a imagem original:

1. crie a pasta `img` dentro de `loja-papelaria`;
2. salve o logo como `img/logo.png` (de preferência com fundo transparente);
3. em `js/config.js`, escreva `logo: 'img/logo.png'`.

Se o arquivo não for encontrado, o site volta sozinho para o símbolo desenhado.

### Ícone da aba (favicon)

É o arquivo `favicon.svg`, na raiz da pasta: o mesmo símbolo da marca, com traço
mais grosso para continuar legível em 16 pixels, sobre um quadradinho creme
arredondado. Para trocar por outro desenho, substitua o arquivo mantendo o nome.

## 4. Publicar na Vercel

São arquivos estáticos, então a Vercel serve a pasta sem nenhuma configuração.

**Pelo site (sem instalar nada):** entre em vercel.com, crie a conta, clique em
*Add New → Project → Deploy* e arraste a pasta `loja-papelaria`. Em segundos você
recebe um endereço `nome-do-projeto.vercel.app`.

**Pelo terminal**, se preferir:

```bash
npx vercel --cwd "loja-papelaria"
```

O primeiro comando pede login e faz um deploy de teste; para publicar de vez,
rode de novo com `--prod`.

Para usar domínio próprio (ex.: `luzdemariaboutique.com.br`), é em *Settings →
Domains* dentro do projeto na Vercel.

Toda vez que você mudar um arquivo, precisa subir de novo — **exceto** se estiver
usando a planilha do item 5: nesse caso, preço, estoque e produtos mudam sozinhos,
sem novo deploy.

## 5. Catálogo pela planilha do Google (opcional)

Nesse modo você para de editar código: a planilha vira o cadastro, e o site lê
ela toda vez que alguém abre a loja.

**Passo a passo**

1. Importe `modelo-produtos.xlsx` no Google Planilhas (*Arquivo → Importar*).
   Ele já vem com as colunas certas, lista suspensa de categoria e uma aba de
   instruções.
2. Preencha a aba **Produtos** com os seus itens.
3. *Arquivo → Compartilhar → **Publicar na web***.
4. Em conteúdo, escolha **a aba Produtos** (não o documento inteiro);
   em formato, escolha **CSV**. Clique em *Publicar* e copie o link.
5. Cole o link em `js/config.js`:

```js
planilhaCSV: 'https://docs.google.com/spreadsheets/d/e/.../pub?gid=0&single=true&output=csv',
```

6. Suba o site para a Vercel de novo (só desta vez).

**Colunas da planilha**

| Coluna | Obrigatória | Observação |
| --- | --- | --- |
| `id` | não | Código único. Se ficar vazio, o site gera um a partir do nome. Depois de publicado, não mude: quem tiver o item no carrinho perde ele. |
| `nome` | **sim** | Linha sem nome é ignorada. |
| `preco` | **sim** | Só o número (`34,50`). Aceita `R$ 1.234,56`. Linha sem preço válido é ignorada. |
| `categoria` | não | Vira filtro na loja. Vazio cai em "Outros". |
| `estoque` | não | `0` = esgotado · `1` a `3` = mostra "últimas unidades" · vazio ou `-` = vende sem controlar |
| `descricao` | não | Frase curta abaixo do nome. |
| `imagem` | não | Nome do arquivo na pasta `img` ou link direto de uma foto. |
| `emoji` | não | Usado quando não há foto. |
| `ativo` | não | `nao` esconde o produto sem apagar a linha. |

**Fotos dos produtos**

Salve as fotos na pasta `img` e escreva **só o nome do arquivo** na coluna
`imagem` da planilha — o site completa o caminho sozinho:

| Na planilha | O site usa |
| --- | --- |
| `caneta-gel.jpg` | `img/caneta-gel.jpg` |
| `img/promo/kit.jpg` | `img/promo/kit.jpg` (caminho respeitado) |
| `https://.../foto.jpg` | o link, direto |
| vazio | o emoji do produto |

Use nomes sem acento, sem espaço e em minúsculas. Se a foto não for
encontrada, o card mostra o emoji em vez de imagem quebrada — nada quebra.

Detalhe importante: **foto é arquivo do site, não da planilha**. Preço e estoque
mudam sozinhos; foto nova só aparece depois de um novo deploy na Vercel. As
recomendações de tamanho e formato estão em `img/COMO-USAR.txt`.

**O que esperar**

- A alteração aparece no site em alguns minutos — o Google leva um tempo para
  atualizar a versão publicada da planilha.
- O carrinho respeita o estoque: o cliente não consegue pedir mais do que existe,
  e se o estoque cair enquanto ele navega, o carrinho é ajustado com um aviso.
- **A baixa é manual.** O site não escreve na planilha, e o pedido só vira venda
  quando você confirma no WhatsApp — descontar no clique deixaria o estoque errado
  toda vez que alguém desistisse. Ajuste a coluna `estoque` ao confirmar.
- Se a planilha sair do ar ou o link estiver errado, o site continua funcionando
  com a lista `PRODUTOS` do `js/config.js`. Vale manter ali uma cópia razoável.
- A aba publicada fica **pública** para quem tiver o link. Custo, margem,
  fornecedor e qualquer dado de cliente ficam em outra aba não publicada.
- Esse modo **só funciona com o site hospedado**. Abrindo `index.html` por duplo
  clique, o navegador bloqueia a leitura da planilha e a loja usa o `config.js`.

## Como fica o pedido recebido

```
*Novo pedido — Luz de Maria Boutique Criativa*

*Cliente:* Maria Teste

*Itens:*
• 2x Caneta esferográfica azul (caixa c/ 50) — R$ 85,80
• 1x Caderno universitário 10 matérias — R$ 38,90

*Total: R$ 124,70*

*Observações:* Retirar na loja
```

## Limitações conscientes

- O carrinho fica salvo no navegador do cliente (`localStorage`), não no servidor.
- O estoque é informativo e a baixa é manual: o site lê a quantidade, mas nunca
  escreve na planilha.
- Dois clientes podem pedir a mesma última unidade quase ao mesmo tempo; quem
  confirma é você, na conversa.
- Preços e produtos ficam visíveis para qualquer visitante (no código da página ou
  na planilha publicada) — não coloque ali nada que não possa ser público.
- Não há pagamento nem cálculo de frete; isso é combinado na conversa.

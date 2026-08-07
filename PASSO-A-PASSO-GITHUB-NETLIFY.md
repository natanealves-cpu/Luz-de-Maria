# Passo a passo: GitHub + Netlify

Objetivo: publicar o site pela Netlify, com os arquivos guardados no GitHub.
Depois disso, **adicionar uma foto vira arrastar o arquivo no site do GitHub** —
a Netlify republica sozinha em cerca de 20 segundos.

Tempo estimado: 15 minutos, uma única vez. Nada aqui derruba o site que já está
no ar na Vercel; ele continua funcionando enquanto você monta isto.

---

## Parte 1 — Criar a conta e o repositório no GitHub

1. Entre em **github.com** e crie sua conta (é gratuita).
2. Confirme o e-mail que eles enviam — sem isso não dá para criar repositório.
3. Clique no **+** no canto superior direito → **New repository**.
4. Preencha:
   - **Repository name:** `luz-de-maria-loja`
   - **Description:** Loja virtual da Luz de Maria Boutique Criativa
   - **Public** ou **Private**: pode escolher Private. O site continua público
     do mesmo jeito; só o código fica reservado.
   - **Não** marque "Add a README file" (já temos os nossos arquivos).
5. Clique em **Create repository**.

## Parte 2 — Enviar a pasta do site

Na tela que aparece, procure o link **"uploading an existing file"**
(fica na frase "or upload an existing file").

1. Clique nele.
2. Abra a pasta `loja-papelaria` no computador.
3. Selecione **todo o conteúdo** dela — inclusive as pastas `css`, `img` e `js`
   — e arraste para a área indicada no navegador.
4. Espere as barras de envio terminarem (são poucos arquivos, é rápido).
5. Em **Commit changes**, escreva `versão inicial da loja` e clique no botão
   verde **Commit changes**.

Confira se apareceram as pastas `css`, `img` e `js`. Se alguma faltou, repita o
envio só dela — não quebra nada enviar de novo.

## Parte 3 — Ligar a Netlify no repositório

1. Entre em **netlify.com** e crie a conta. Na tela de cadastro, escolha
   **"Sign up with GitHub"**: já deixa as duas contas conversando.
2. No painel, clique em **Add new site** → **Import an existing project**.
3. Escolha **GitHub** e autorize o acesso quando ele pedir.
4. Na lista, selecione o repositório `luz-de-maria-loja`.
5. A tela de configuração vem preenchida sozinha (o arquivo `netlify.toml` na
   pasta já diz o que fazer). Não precisa digitar comando de build nada.
6. Clique em **Deploy**.

Em menos de um minuto o site está no ar, num endereço tipo
`nome-aleatorio-123.netlify.app`.

## Parte 4 — Ajustar o endereço

1. No painel do site: **Site configuration** → **Change site name**.
2. Coloque `luz-de-maria-boutique-criativa` (ou o que preferir).
3. O endereço passa a ser `luz-de-maria-boutique-criativa.netlify.app`.

Se um dia quiser domínio próprio (ex.: `luzdemariaboutique.com.br`), é em
**Domain management** no mesmo painel.

---

## Como fica o dia a dia depois disso

### Mudar preço, estoque ou cadastrar produto

Na **planilha do Google**, como já é hoje. Não mexe em GitHub nem em Netlify.
A mudança aparece no site em alguns minutos.

### Adicionar uma foto

1. Entre no repositório no GitHub.
2. Abra a pasta **img**.
3. **Add file** → **Upload files** → arraste a foto.
4. **Commit changes**.
5. Escreva o nome do arquivo na coluna `imagem` da planilha.

A Netlify publica sozinha. Dá para fazer pelo celular, pelo navegador ou pelo
aplicativo do GitHub.

### Trocar cor, texto ou layout

Isso é código: me chame que eu faço a alteração.

---

## Perguntas que costumam aparecer

**Preciso apagar o site da Vercel?**
Não. Dá para manter os dois no ar, cada um com seu endereço. Quando estiver
confiante na Netlify, divulgue só o endereço dela e deixe o outro parado — ou
apague, se preferir.

**E se eu subir uma foto errada?**
O GitHub guarda o histórico. Dá para restaurar a versão anterior sem perder
nada. É justamente a vantagem dele sobre a pasta no computador.

**A pasta no meu computador ainda importa?**
Ela vira sua cópia de trabalho. O que vale para o site é o que está no GitHub.
Sempre que mexer direto no GitHub, baixe a versão atualizada de vez em quando
para as duas não ficarem diferentes.

**O `modelo-produtos.xlsx` e os arquivos de instrução ficam públicos?**
Sim, ficam acessíveis para quem souber o endereço exato. Hoje não há problema:
são dados de exemplo e instruções. Se um dia a planilha modelo tiver custo,
margem ou fornecedor, tire-a da pasta antes de enviar.

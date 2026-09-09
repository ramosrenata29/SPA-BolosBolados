# Análise da Especificação (SPEC) - SPA Bolos Bolados

## 1. Visão Geral do Projeto
O **SPA Bolos Bolados** é uma aplicação Single Page Application (SPA) responsiva para exibição de cardápio e realização de pedidos de bolos caseiros, confeitados e kits de festa. A hospedagem é direcionada ao **GitHub Pages**, utilizando estritamente a stack **HTML, CSS e JavaScript puros** (Vanilla JS), sem gerenciadores de pacotes, compiladores ou dependências de build externas.

---

## 2. Requisitos Funcionais e Fluxo do Usuário

### 2.1. Cardápio e Exibição de Produtos
- **Fonte de Dados**: Carregamento assíncrono a partir de arquivo `JSON` local (`products.json`).
- **Estrutura de Produtos**:
  - `id`: Identificador único (ex: `"bolo-chocolate-01"`).
  - `name`: Nome do produto.
  - `category`: Categoria (`caseiro`, `confeitado`, `kit`).
  - `price`: Valor numérico (ex: `45.90`).
  - `unit`: Unidade de medida (`fatia`, `inteiro`, `kg`).
  - `description`: Descrição do bolo/produto.
  - `image`: URL ou imagem ilustrativa (sem emojis na UI).
  - `promo`: Booleano indicando promoção/destaque.
  - `promoLabel`: Rótulo promocional (ex: *"Leve 3 pague 2"*).
- **Navegação Sem Cadastro Inicial**: O cardápio é exibido de imediato no acesso inicial. O cadastro é exigido somente na etapa de checkout.

### 2.2. Carrinho de Compras
- **Persistência**: Armazenamento dos itens do carrinho no `localStorage` do navegador para manter o estado em recargas.
- **Interatividade**: Adicionar/remover itens, alterar quantidades, visualizar subtotal e total geral.

### 2.3. Checkout, Cadastro e Geolocalização
- **Formulário de Cadastro**:
  - Dados exigidos: Nome completo, WhatsApp, E-mail e Endereço.
- **Captura de Geolocalização (`navigator.geolocation`)**:
  - Etapa obrigatória durante o cadastro.
  - **Regra Rígida**: Se a permissão for negada pelo usuário, o cadastro e a finalização da compra devem ser **interrompidos**, impedindo a conclusão do pedido.

### 2.4. Camada de Segurança Extra e Prova de Vida
- **`CredentialsContainer` (WebAuthn API)**:
  - Solicitação de verificação/credenciais nativas do dispositivo (biometria/PIN/passkey) como camada de prova de vida antes de seguir ao pagamento.
  - Tratamento suave para fallbacks simulados em navegadores sem suporte ao WebAuthn.

### 2.5. Pagamento e Envio de Pedido
- **Simulação de Gateway de Pagamento**:
  - Interface genérica para simular o pagamento (ex: Cartão de Crédito, PIX, Boleto) sem processamento financeiro real.
- **Integração com WhatsApp**:
  - Montagem de mensagem formatada contendo: itens do pedido, total, dados do cliente e coordenadas de geolocalização.
  - Redirecionamento direto via `https://wa.me/...`.

---

## 3. O que o Sistema NÃO deve fazer
1. **Processar pagamento real**: Trata-se de uma simulação visual/de fluxo.
2. **Cadastrar/Editar produtos via Painel**: Todos os produtos são estáticos no arquivo JSON.
3. **Controlar Logística de Delivery**: Sem cálculo de frete dinâmico ou rastreamento em tempo real de entregadores.

---

## 4. UI/UX e Design System (`DESIGN.md`)

### 4.1. Paleta de Cores
- **Primary (`#A13700` / `#7A2800`)**: Ações principais, destaques da marca e botões.
- **Secondary / Coral (`#FA5F57`)**: Tags de promoção, badges de urgência e destaques.
- **Tertiary / Emerald (`#1BB890`)**: Indicadores de confirmação, etapas e checkout.
- **Supporting Gold (`#D48B00`)** & **Forest (`#256C4B`)**: Avaliações e badges complementares.
- **Superfícies**: Fundo `#FFF8F6` / `#FDFBF7`, cards `#FFFFFF` com bordas sutis `#EFE8DC`.

### 4.2. Tipografia
- **Google Fonts**: `Montserrat` (Títulos e Preços) e `Raleway` (Textos corridos e descrições).
- **Sem Emojis**: Utilização exclusiva de **Google Material Symbols Outlined** (`font-variation-settings: 'FILL' 0, 'wght' 400`).

---

## 5. Diretrizes de Desenvolvimento (`agents.md`)
- Quebrar a aplicação em módulos/arquivos menores e organizados.
- Gerar relatório detalhado de todas as alterações e implementações efetuadas.
- Esclarecer dúvidas antes da implementação (etapa já concluída com validação do usuário).

---

## 6. Estrutura Proposta de Arquivos
```
app/
├── index.html
├── data/
│   └── products.json
├── css/
│   ├── variables.css
│   ├── base.css
│   ├── components.css
│   └── layout.css
├── js/
│   ├── app.js
│   ├── cart.js
│   ├── checkout.js
│   ├── location.js
│   └── auth.js
├── ANALISE_SPEC.md
└── RELATORIO_IMPLEMENTACAO.md
```

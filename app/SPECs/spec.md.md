# App SPA de Bolos 

## Contexto 
Criar uma aplicação SPA, com stack HTML, CSS, JS puro, sem pacotes ou dependência para hospedar no GitHub Pages. 
A aplicação será um cardápio estilo ''lanchonete'' porém para bolos caseiros e confeitados 

## Recursos do APP

 1. Carregar os dados do cardápio a partir de uma **estrutura JSON** contendo todas as informaçõe do produto, organizando por tipo de bolo, categoria de produto, outros dados triviais e um destaque para eventuais produtos em promoção ou kit festa de aniversário com docinhos, velas e balões) 
 2. O aplicativo SPA irá carregar, já na primeira tela, a lista de produtos. Nãoexige cadastro até o checkout.
 3. O SPA decerá usar **localstorage** para armazenar os itens no carrinho.
 4. Ao finaliar a compra no carrinho o usuário então deverá se cadastrar (nome, whatsapp, email e endereço) e durante o cadastro adicionar a localização (**geolocation**) 
 5. Caso o usuário **não permita** a captura de sua localização, encerre o cadastro, e não siga com a finalização da compra.
 6. Após o cadastro, pedir as credenciais do dispositivo (**CredentialsContainer**) com uma camada extra de segurança e prova de vida. 
 7. Após validar as credenciais, simular um gatway de pagamento genêrico. 
 8. Pedidos via whatsapp 

## O que o aplicativo não deve fazer 

 1. Processar o pagamento. Será apenas uma manipulação.
 2. Cadastrar produtos. Iremos carregar os dados de um arquivo JSON fictício, gerado por IA.
 3. O aplicativo não controla delivery. 

## JSON Exemplo 

    {
      "products": [
        {
          "id": "bolo-chocolate-01",
          "name": "Bolo de Chocolate",
          "category": "caseiro | confeitado | kit",
          "price": 45.90,
          "unit": "fatia | inteiro | kg",
          "description": "texto curto",
          "image": "url ou emoji",
          "promo": false,
          "promoLabel": "opcional, ex: 'Leve 3 pague 2'"
        }
      ]
    }


## UI/UX

 1. Utilize a paleta de cores:
`#A13700` `#FA5F57` `#1BB890` `#D48B00` `#256C4B`
 2. Use Google Fonts:  `Montserrat` para titulos e `Raleway` para texto corrido. E aplique versões condensadas das fontes quando conveniente.
 3. **Não use emoji**. Utilize Google Icons.
 4. Interface minimalista, fundo branco 
 5. Adicione pequenas animações em botões e transições de tela. 


# Exotica - Ótica & Acessórios

Este é o projeto do site da Exotica, uma loja de óculos e acessórios.

## Estrutura do Projeto

```
exotica/
├── css/
│   └── styles.css
├── js/
│   └── main.js
├── images/
│   └── products/
│       ├── rayban-aviador-1.jpg
│       ├── rayban-aviador-2.jpg
│       ├── rayban-aviador-3.jpg
│       ├── rayban-aviador-4.jpg
│       └── rayban-wayfarer.jpg
├── index.html
├── produtos.html
└── produto-detalhes.html
```

## Como Testar

1. Primeiro, certifique-se de ter todas as imagens necessárias na pasta `images/products/`. Você pode usar suas próprias imagens de óculos ou fazer o download de algumas imagens de exemplo.

2. Para testar o site localmente, você pode:
   - Usar o Live Server do VS Code
   - Usar o Python para criar um servidor local:
     ```bash
     python -m http.server 8000
     ```
   - Ou simplesmente abrir os arquivos HTML diretamente no navegador

3. Funcionalidades para testar:
   - Na página inicial:
     - Menu de navegação
     - Slider de produtos
     - Categorias
     - Newsletter
   
   - Na página de produtos:
     - Filtros
     - Ordenação
     - Grid de produtos
     - Paginação
   
   - Na página de detalhes do produto:
     - Galeria de imagens
     - Seleção de tamanho e cor
     - Quantidade
     - Adicionar ao carrinho
     - Favoritar
     - Abas de informações

## Observações

- O site é totalmente responsivo e deve funcionar bem em dispositivos móveis
- As interações como adicionar ao carrinho e favoritar são apenas demonstrativas
- As imagens dos produtos precisam ser adicionadas manualmente na pasta `images/products/`

## Cores do Tema

```css
--primary-color: #F07C00;    /* Laranja principal */
--secondary-color: #262626;  /* Preto */
--accent-color: #945535;     /* Marrom */
--light-accent: #FADC89;     /* Amarelo claro */
--medium-accent: #EDAD6D;    /* Bege */
``` 
import { defineConfig } from 'vite'

export default defineConfig({
  root: 'src',
  server: {
    port: 1234,
    open: true
  },
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: '/index.html',
        produtos: '/produtos.html',
        contato: '/contato.html',
        sobre: '/sobre.html',
        carrinho: '/carrinho.html',
        checkout: '/checkout.html',
        confirmacao: '/confirmacao.html',
        conta: '/conta.html',
        'produto-detalhes': '/produto-detalhes.html'
      }
    }
  }
}) 
// Elementos do DOM
const sidebar = document.querySelector('.sidebar');
const filterToggle = document.querySelector('.filter-toggle');
const priceSlider = document.querySelector('.price-slider');
const minPriceInput = document.querySelector('#min-price');
const maxPriceInput = document.querySelector('#max-price');
const sortSelect = document.querySelector('#sort-products');
const productsGrid = document.querySelector('.products-list');
const paginationContainer = document.querySelector('.pagination');

// Toggle do menu de filtros no mobile
if (filterToggle) {
    filterToggle.addEventListener('click', () => {
        sidebar.classList.toggle('active');
    });
}

// Fechar sidebar ao clicar fora
document.addEventListener('click', (e) => {
    if (sidebar.classList.contains('active') && 
        !sidebar.contains(e.target) && 
        !filterToggle.contains(e.target)) {
        sidebar.classList.remove('active');
    }
});

// Atualizar inputs de preço ao mover o slider
if (priceSlider) {
    priceSlider.addEventListener('input', (e) => {
        const value = e.target.value;
        const min = e.target.min;
        const max = e.target.max;
        const percentage = ((value - min) / (max - min)) * 100;
        
        // Atualizar valor do input
        maxPriceInput.value = value;
        
        // Atualizar background do slider
        e.target.style.background = `linear-gradient(to right, var(--primary-color) ${percentage}%, var(--border-color) ${percentage}%)`;
    });
}

// Atualizar slider ao digitar nos inputs
[minPriceInput, maxPriceInput].forEach(input => {
    if (input) {
        input.addEventListener('change', (e) => {
            const value = e.target.value;
            if (input === minPriceInput) {
                priceSlider.min = value;
            } else {
                priceSlider.value = value;
            }
            // Disparar evento de input para atualizar o background
            priceSlider.dispatchEvent(new Event('input'));
        });
    }
});

// Ordenação de produtos
if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
        const value = e.target.value;
        // Implementar lógica de ordenação aqui
        sortProducts(value);
    });
}

// Função para ordenar produtos
function sortProducts(criteria) {
    const products = Array.from(productsGrid.children);
    
    products.sort((a, b) => {
        const priceA = parseFloat(a.querySelector('.product-price').dataset.price);
        const priceB = parseFloat(b.querySelector('.product-price').dataset.price);
        
        switch(criteria) {
            case 'price-asc':
                return priceA - priceB;
            case 'price-desc':
                return priceB - priceA;
            case 'name-asc':
                return a.querySelector('.product-name').textContent.localeCompare(
                    b.querySelector('.product-name').textContent
                );
            case 'name-desc':
                return b.querySelector('.product-name').textContent.localeCompare(
                    a.querySelector('.product-name').textContent
                );
            default:
                return 0;
        }
    });
    
    // Limpar e readicionar produtos ordenados
    productsGrid.innerHTML = '';
    products.forEach(product => productsGrid.appendChild(product));
}

// Paginação
function createPagination(totalPages, currentPage) {
    paginationContainer.innerHTML = '';
    
    // Botão anterior
    const prevButton = document.createElement('button');
    prevButton.innerHTML = '<i class="fas fa-chevron-left"></i>';
    prevButton.disabled = currentPage === 1;
    prevButton.addEventListener('click', () => goToPage(currentPage - 1));
    paginationContainer.appendChild(prevButton);
    
    // Números das páginas
    const pageNumbers = document.createElement('div');
    pageNumbers.className = 'page-numbers';
    
    for (let i = 1; i <= totalPages; i++) {
        if (
            i === 1 || 
            i === totalPages || 
            (i >= currentPage - 1 && i <= currentPage + 1)
        ) {
            const pageLink = document.createElement('a');
            pageLink.href = '#';
            pageLink.textContent = i;
            pageLink.className = i === currentPage ? 'active' : '';
            pageLink.addEventListener('click', (e) => {
                e.preventDefault();
                goToPage(i);
            });
            pageNumbers.appendChild(pageLink);
        } else if (
            i === currentPage - 2 || 
            i === currentPage + 2
        ) {
            const dots = document.createElement('span');
            dots.textContent = '...';
            pageNumbers.appendChild(dots);
        }
    }
    
    paginationContainer.appendChild(pageNumbers);
    
    // Botão próximo
    const nextButton = document.createElement('button');
    nextButton.innerHTML = '<i class="fas fa-chevron-right"></i>';
    nextButton.disabled = currentPage === totalPages;
    nextButton.addEventListener('click', () => goToPage(currentPage + 1));
    paginationContainer.appendChild(nextButton);
}

// Função para mudar de página
function goToPage(page) {
    // Implementar lógica de mudança de página aqui
    createPagination(totalPages, page);
    // Atualizar produtos mostrados
    updateProductsDisplay(page);
}

// Função para atualizar exibição dos produtos
function updateProductsDisplay(page) {
    const productsPerPage = 12;
    const start = (page - 1) * productsPerPage;
    const end = start + productsPerPage;
    
    // Esconder todos os produtos
    Array.from(productsGrid.children).forEach((product, index) => {
        product.style.display = 
            index >= start && index < end ? 'block' : 'none';
    });
}

// Função para filtrar produtos por categoria
function filterByCategory() {
    const urlParams = new URLSearchParams(window.location.search);
    const categoria = urlParams.get('categoria');
    
    if (!categoria) return;
    
    const products = Array.from(productsGrid.children);
    products.forEach(product => {
        const productCategory = product.dataset.category;
        if (productCategory !== categoria) {
            product.style.display = 'none';
        }
    });
    
    // Atualizar contador de resultados
    updateResultsCount();
}

// Função para atualizar contador de resultados
function updateResultsCount() {
    const visibleProducts = Array.from(productsGrid.children).filter(
        product => product.style.display !== 'none'
    );
    const showingResults = document.querySelector('.showing-results');
    const start = ((currentPage - 1) * productsPerPage) + 1;
    const end = Math.min(start + productsPerPage - 1, visibleProducts.length);
    const total = visibleProducts.length;
    
    showingResults.textContent = `Mostrando ${start}-${end} de ${total} produtos`;
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    // Configurar paginação inicial
    const totalProducts = productsGrid.children.length;
    const productsPerPage = 12;
    const totalPages = Math.ceil(totalProducts / productsPerPage);
    
    createPagination(totalPages, 1);
    updateProductsDisplay(1);
    
    // Aplicar filtro de categoria se houver
    filterByCategory();
    
    // Disparar evento input inicial para o slider
    if (priceSlider) {
        priceSlider.dispatchEvent(new Event('input'));
    }
}); 
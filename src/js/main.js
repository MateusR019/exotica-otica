// Função para inicializar o site quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    initHeader();
    initProductDetails();
    initCatalog();
    fixImagePaths();
    createWhatsAppButton();
    initStoreSelector();
    initCart();
    updateCartCount();
    
    // Inicializar o slider
    initSlider();
    
    // Inicializar a galeria de produtos
    initProductGallery();
    
    // Inicializar as opções de produto
    initProductOptions();
    
    // Adicionar evento aos botões "Adicionar ao Carrinho" na página de produtos
    const addToCartButtons = document.querySelectorAll('.action-btn[aria-label="Adicionar ao carrinho"]');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const productCard = this.closest('.product-card');
            const productName = productCard.querySelector('h3 a').textContent;
            const productPrice = productCard.querySelector('.price').textContent.replace('R$ ', '').replace(',', '.');
            const productImage = productCard.querySelector('img').getAttribute('src');
            
            addToCart({
                id: generateProductId(productName),
                name: productName,
                price: parseFloat(productPrice),
                image: productImage,
                quantity: 1
            });
            
            updateCartCount();
            showCartNotification(productName);
        });
    });
    
    // Adicionar evento ao botão "Adicionar ao Carrinho" na página de detalhes do produto
    const addToCartBtn = document.querySelector('.btn-primary');
    if (addToCartBtn && addToCartBtn.innerHTML.includes('Adicionar ao Carrinho')) {
        addToCartBtn.addEventListener('click', function() {
            const productName = document.querySelector('.product-title').textContent;
            const productPrice = document.querySelector('.current-price').textContent.replace('R$ ', '').replace(',', '.');
            const productImage = document.querySelector('.product-image-main img').getAttribute('src');
            
            // Verificar se tamanho e cor foram selecionados (se aplicável)
            const sizeSelector = document.querySelector('.size-options');
            const colorSelector = document.querySelector('.color-options');
            
            let size = null;
            let color = null;
            
            if (sizeSelector) {
                const selectedSize = sizeSelector.querySelector('.option.selected');
                if (!selectedSize) {
                    alert('Por favor, selecione o tamanho antes de adicionar ao carrinho.');
                    return;
                }
                size = selectedSize.getAttribute('data-value');
            }
            
            if (colorSelector) {
                const selectedColor = colorSelector.querySelector('.option.selected');
                if (!selectedColor) {
                    alert('Por favor, selecione a cor antes de adicionar ao carrinho.');
                    return;
                }
                color = selectedColor.getAttribute('data-value');
            }
            
            addToCart({
                id: generateProductId(productName, size, color),
                name: productName,
                price: parseFloat(productPrice),
                image: productImage,
                quantity: 1,
                size: size,
                color: color
            });
            
            updateCartCount();
            showCartNotification(productName);
        });
    }
    
    // Renderizar a página do carrinho se estivermos na página do carrinho
    if (window.location.pathname.includes('carrinho.html')) {
        renderCartPage();
        
        // Adicionar evento para atualizar o carrinho
        const updateCartBtn = document.getElementById('update-cart');
        if (updateCartBtn) {
            updateCartBtn.addEventListener('click', function() {
                updateCartQuantities();
                renderCartPage();
            });
        }
    }
    
    // Inicializar a página de conta
    initAccountPage();
    
    // Inicializar a página de checkout
    initCheckoutPage();
    
    // Inicializar a página de confirmação
    initConfirmationPage();
    
    // Inicializar botões de compra direta
    initDirectBuyButtons();
});

// Funções do Header
function initHeader() {
    // Menu mobile
    const menuButton = document.querySelector('.menu-button');
    if (menuButton) {
        menuButton.addEventListener('click', toggleMenu);
    }
    
    // Adicionar botão de menu mobile se não existir
    if (!menuButton && window.innerWidth <= 768) {
        createMobileMenuButton();
    }
    
    // Ajustar menu em resize
    window.addEventListener('resize', function() {
        if (window.innerWidth <= 768 && !document.querySelector('.menu-button')) {
            createMobileMenuButton();
        } else if (window.innerWidth > 768 && document.querySelector('.menu-button')) {
            const nav = document.querySelector('nav');
            if (nav) nav.classList.remove('active');
            document.querySelector('.menu-button').remove();
        }
    });
}

function createMobileMenuButton() {
    const header = document.querySelector('header .container');
    if (!header) return;
    
    const menuButton = document.createElement('button');
    menuButton.className = 'menu-button';
    menuButton.setAttribute('aria-label', 'Abrir menu');
    menuButton.innerHTML = '<i class="fas fa-bars"></i>';
    menuButton.addEventListener('click', toggleMenu);
    
    // Inserir após o logo
    const logo = document.querySelector('.logo');
    if (logo && logo.nextSibling) {
        header.insertBefore(menuButton, logo.nextSibling);
    } else {
        header.appendChild(menuButton);
    }
    
    // Adicionar estilo CSS inline para o botão
    const style = document.createElement('style');
    style.textContent = `
        .menu-button {
            background: none;
            border: none;
            font-size: 1.5rem;
            color: var(--primary-color);
            cursor: pointer;
            padding: 8px;
            display: none;
            border-radius: 4px;
            transition: background-color 0.3s ease, color 0.3s ease;
        }
        
        .menu-button:hover {
            background-color: var(--light-bg);
            color: #FF9933;
        }
        
        @media (max-width: 768px) {
            .menu-button {
                display: block;
                order: 2;
            }
            
            nav {
                display: none;
                width: 100%;
                background-color: white;
                padding: 15px;
                border-radius: 8px;
                box-shadow: 0 5px 15px rgba(240, 124, 0, 0.1);
                margin-top: 10px;
            }
            
            nav.active {
                display: block;
            }
            
            nav ul {
                flex-direction: column;
                align-items: flex-start;
            }
            
            nav ul li {
                width: 100%;
                margin: 8px 0;
            }
            
            nav ul li a {
                display: block;
                padding: 8px 15px;
                width: 100%;
            }
        }
    `;
    document.head.appendChild(style);
}

function toggleMenu() {
    const nav = document.querySelector('nav');
    if (nav) {
        nav.classList.toggle('active');
    }
}

// Funções da página de detalhes do produto
function initProductDetails() {
    const productDetails = document.querySelector('.product-details');
    if (!productDetails) return;

    initGallery();
    initTabs();
    initQuantity();
    initAddToCart();
}

function initGallery() {
    const mainImg = document.getElementById('main-img');
    const thumbnails = document.querySelectorAll('.thumbnail-images img');
    
    thumbnails.forEach(thumb => {
        thumb.addEventListener('click', function() {
            // Remove active class from all thumbnails
            thumbnails.forEach(t => t.classList.remove('active'));
            // Add active class to clicked thumbnail
            this.classList.add('active');
            // Update main image
            mainImg.src = this.src;
        });
    });
}

function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons and panels
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanels.forEach(panel => panel.classList.remove('active'));

            // Add active class to clicked button and corresponding panel
            button.classList.add('active');
            const panelId = button.getAttribute('data-tab');
            document.getElementById(panelId).classList.add('active');
        });
    });
}

function initQuantity() {
    const minusBtn = document.querySelector('.qty-btn.minus');
    const plusBtn = document.querySelector('.qty-btn.plus');
    const qtyInput = document.querySelector('.quantity input');

    if (!minusBtn || !plusBtn || !qtyInput) return;

    minusBtn.addEventListener('click', () => {
        const currentValue = parseInt(qtyInput.value);
        if (currentValue > 1) {
            qtyInput.value = currentValue - 1;
        }
    });

    plusBtn.addEventListener('click', () => {
        const currentValue = parseInt(qtyInput.value);
        if (currentValue < 10) {
            qtyInput.value = currentValue + 1;
        }
    });

    qtyInput.addEventListener('change', () => {
        let value = parseInt(qtyInput.value);
        if (isNaN(value) || value < 1) value = 1;
        if (value > 10) value = 10;
        qtyInput.value = value;
    });
}

function initAddToCart() {
    const addToCartBtn = document.querySelector('.add-to-cart .btn-primary');
    const favoriteBtn = document.querySelector('.add-to-cart .favorite');

    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', () => {
            // Verificar se tamanho e cor foram selecionados
            const selectedSize = document.querySelector('.size-btn.active');
            const selectedColor = document.querySelector('.color-btn.active');

            if (!selectedSize || !selectedColor) {
                alert('Por favor, selecione o tamanho e a cor antes de adicionar ao carrinho.');
                return;
            }

            // Adicionar ao carrinho (será implementado posteriormente)
            const quantity = document.querySelector('.quantity input').value;
            console.log('Produto adicionado ao carrinho:', {
                quantity,
                size: selectedSize.textContent,
                color: selectedColor.getAttribute('title')
            });

            // Atualizar contador do carrinho
            const cartCount = document.querySelector('.cart-count');
            if (cartCount) {
                cartCount.textContent = parseInt(cartCount.textContent || 0) + parseInt(quantity);
            }

            // Feedback visual
            addToCartBtn.textContent = '✓ Adicionado!';
            setTimeout(() => {
                addToCartBtn.innerHTML = '<i class="fas fa-shopping-cart"></i> Adicionar ao Carrinho';
            }, 2000);
        });
    }

    if (favoriteBtn) {
        favoriteBtn.addEventListener('click', () => {
            const icon = favoriteBtn.querySelector('i');
            icon.classList.toggle('far');
            icon.classList.toggle('fas');
            
            // Feedback visual
            if (icon.classList.contains('fas')) {
                favoriteBtn.setAttribute('title', 'Remover dos favoritos');
            } else {
                favoriteBtn.setAttribute('title', 'Adicionar aos favoritos');
            }
        });
    }
}

// Funções da página de catálogo
function initCatalog() {
    const productsPage = document.querySelector('.products-section');
    if (!productsPage) return;
    
    // Inicializar filtros
    initFilters();
    
    // Inicializar ordenação
    initSorting();
    
    // Inicializar ações dos produtos
    initProductActions();
}

function initFilters() {
    // Filtro de categorias
    const categoryLinks = document.querySelectorAll('.category-filter li a');
    categoryLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            categoryLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            // Evitar a navegação que causa a repetição de "src/" na URL
            if (this.getAttribute('href') !== '#') {
                // Usar caminho absoluto para evitar problemas de navegação
                const href = this.getAttribute('href');
                if (href && !href.startsWith('#')) {
                    window.location.href = '/' + href.replace(/^\//, '');
                    return;
                }
            }
            
            // Aqui seria implementada a lógica de filtro real
            console.log('Filtro por categoria:', this.textContent.trim());
        });
    });
    
    // Filtro de preço
    const priceSlider = document.querySelector('.slider');
    if (priceSlider) {
        priceSlider.addEventListener('input', function() {
            // Atualizar o valor exibido
            const value = this.value;
            const maxInput = document.querySelector('.price-inputs input[name="max"]');
            if (maxInput) maxInput.value = value;
        });
    }
}

function initSorting() {
    const sortSelect = document.getElementById('sort-by');
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            // Aqui seria implementada a lógica de ordenação real
            console.log('Ordenar por:', this.value);
        });
    }
}

function initProductActions() {
    const actionButtons = document.querySelectorAll('.product-actions .action-btn');
    actionButtons.forEach(button => {
        button.addEventListener('click', function() {
            const action = this.querySelector('i').className;
            const product = this.closest('.product');
            const productName = product.querySelector('h3').textContent;
            
            if (action.includes('fa-heart')) {
                console.log('Adicionado aos favoritos:', productName);
            } else if (action.includes('fa-shopping-cart')) {
                console.log('Adicionado ao carrinho:', productName);
                // Atualizar contador do carrinho
                const cartCount = document.querySelector('.cart-count');
                if (cartCount) {
                    cartCount.textContent = parseInt(cartCount.textContent) + 1;
                }
            } else if (action.includes('fa-search')) {
                // Redirecionar para a página de detalhes
                window.location.href = 'produto-detalhes.html';
            }
        });
    });
}

// Função para corrigir caminhos de imagens
function fixImagePaths() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        const src = img.getAttribute('src');
        if (src && src.startsWith('images/')) {
            img.setAttribute('src', 'assets/' + src);
        }
    });
}

// Adiciona estilos CSS para os elementos criados dinamicamente
const style = document.createElement('style');
style.textContent = `
    .toast {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background-color: var(--primary-color);
        color: white;
        padding: 12px 20px;
        border-radius: 4px;
        box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
        z-index: 9999;
        transform: translateY(100px);
        opacity: 0;
        transition: all 0.3s ease;
    }
    
    .toast.show {
        transform: translateY(0);
        opacity: 1;
    }
    
    .menu-toggle {
        display: none;
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        color: var(--text-color);
    }
    
    @media (max-width: 768px) {
        .menu-toggle {
            display: block;
        }
        
        nav {
            position: absolute;
            top: 100%;
            left: 0;
            width: 100%;
            background-color: white;
            padding: 0;
            max-height: 0;
            overflow: hidden;
            transition: max-height 0.3s ease;
            box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
            z-index: 1000;
        }
        
        nav.active {
            max-height: 300px;
            padding: 15px 0;
        }
        
        nav ul {
            flex-direction: column;
            padding: 0 20px;
        }
        
        nav ul li {
            margin: 10px 0;
        }
    }
    
    .filter-toggle {
        display: none;
        margin-left: auto;
    }
    
    @media (max-width: 992px) {
        .filter-toggle {
            display: block;
        }
        
        .sidebar {
            position: fixed;
            top: 0;
            left: -300px;
            width: 280px;
            height: 100%;
            background-color: white;
            z-index: 1001;
            padding: 20px;
            overflow-y: auto;
            transition: left 0.3s ease;
            box-shadow: 5px 0 15px rgba(0, 0, 0, 0.1);
        }
        
        .sidebar.active {
            left: 0;
        }
    }
    
    .action-btn.added {
        background-color: var(--success-color);
        color: white;
        transform: scale(1.1);
    }
`;

document.head.appendChild(style);

// Função para criar o botão de WhatsApp
function createWhatsAppButton() {
    const whatsappNumber = '5519971620494';
    const whatsappMessage = encodeURIComponent('Olá! Vim do site da Exotica Ótica e gostaria de mais informações.');
    
    const whatsappButton = document.createElement('a');
    whatsappButton.href = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;
    whatsappButton.className = 'whatsapp-button';
    whatsappButton.target = '_blank';
    whatsappButton.rel = 'noopener noreferrer';
    whatsappButton.setAttribute('aria-label', 'Contato via WhatsApp');
    
    const icon = document.createElement('i');
    icon.className = 'fab fa-whatsapp';
    icon.setAttribute('aria-hidden', 'true');
    
    const tooltip = document.createElement('span');
    tooltip.className = 'whatsapp-tooltip';
    tooltip.textContent = 'Fale conosco!';
    
    whatsappButton.appendChild(icon);
    whatsappButton.appendChild(tooltip);
    
    document.body.appendChild(whatsappButton);
}

// Função para inicializar o seletor de lojas na página de contato
function initStoreSelector() {
    const storeButtons = document.querySelectorAll('.store-btn');
    const storeMap = document.getElementById('store-map');
    
    if (!storeButtons.length || !storeMap) return;
    
    // Mapas das lojas
    const storeMaps = {
        'americana': 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3679.0456307475166!2d-47.33307492376868!3d-22.7525344793936!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94c89bea4e5b7c8f%3A0x4e8c1c6e1c7c2a4a!2sR.%20Rui%20Barbosa%2C%20331%20-%20Centro%2C%20Americana%20-%20SP%2C%2013465-030!5e0!3m2!1spt-BR!2sbr!4v1647887291102!5m2!1spt-BR!2sbr',
        'santa-barbara': 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3680.0456307475166!2d-47.41307492376868!3d-22.7525344793936!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94c89bea4e5b7c8f%3A0x4e8c1c6e1c7c2a4a!2sAv.%20São%20Paulo%2C%201722%20-%20Cidade%20Nova%2C%20Santa%20Bárbara%20d%27Oeste%20-%20SP!5e0!3m2!1spt-BR!2sbr!4v1647887291102!5m2!1spt-BR!2sbr',
        'nova-odessa': 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3680.0456307475166!2d-47.29307492376868!3d-22.7825344793936!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94c89bea4e5b7c8f%3A0x4e8c1c6e1c7c2a4a!2sR.%20Aristeu%20Valente%2C%20319%20-%20Centro%2C%20Nova%20Odessa%20-%20SP!5e0!3m2!1spt-BR!2sbr!4v1647887291102!5m2!1spt-BR!2sbr',
        'capivari': 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3680.0456307475166!2d-47.50307492376868!3d-22.9925344793936!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94c89bea4e5b7c8f%3A0x4e8c1c6e1c7c2a4a!2sR.%20Quinze%20de%20Novembro%2C%20551%20-%20Centro%2C%20Capivari%20-%20SP!5e0!3m2!1spt-BR!2sbr!4v1647887291102!5m2!1spt-BR!2sbr'
    };
    
    storeButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remover classe ativa de todos os botões
            storeButtons.forEach(btn => btn.classList.remove('active'));
            
            // Adicionar classe ativa ao botão clicado
            this.classList.add('active');
            
            // Atualizar o mapa
            const store = this.getAttribute('data-store');
            if (storeMaps[store]) {
                storeMap.src = storeMaps[store];
            }
        });
    });
}

// Funcionalidade do Carrinho de Compras
function initCart() {
    if (!localStorage.getItem('cart')) {
        localStorage.setItem('cart', JSON.stringify([]));
    }
}

function getCart() {
    return JSON.parse(localStorage.getItem('cart')) || [];
}

function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function addToCart(product) {
    const cart = getCart();
    const existingProductIndex = cart.findIndex(item => item.id === product.id);
    
    if (existingProductIndex !== -1) {
        cart[existingProductIndex].quantity += product.quantity;
    } else {
        cart.push(product);
    }
    
    saveCart(cart);
}

function removeFromCart(productId) {
    const cart = getCart();
    const updatedCart = cart.filter(item => item.id !== productId);
    saveCart(updatedCart);
}

function updateCartCount() {
    const cart = getCart();
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    const cartCountElements = document.querySelectorAll('.cart-count');
    
    cartCountElements.forEach(element => {
        element.textContent = count;
        element.setAttribute('aria-label', `${count} itens no carrinho`);
    });
}

function showCartNotification(productName) {
    // Criar notificação
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <div class="notification-content">
            <p class="notification-title">Produto adicionado!</p>
            <p class="notification-text">${productName} foi adicionado ao carrinho</p>
            <a href="carrinho.html" class="notification-link">Ver carrinho</a>
        </div>
    `;
    
    // Adicionar ao DOM
    document.body.appendChild(notification);
    
    // Mostrar notificação
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Remover notificação após 3 segundos
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 5000);
}

function generateProductId(name, size = null, color = null) {
    let id = name.toLowerCase().replace(/[^a-z0-9]/g, '-');
    if (size) id += `-${size}`;
    if (color) id += `-${color}`;
    return id;
}

function renderCartPage() {
    const cart = getCart();
    const cartEmptyElement = document.getElementById('cart-empty');
    const cartItemsElement = document.getElementById('cart-items');
    const cartSummaryElement = document.getElementById('cart-summary');
    const cartItemListElement = document.getElementById('cart-item-list');
    
    if (cart.length === 0) {
        // Mostrar mensagem de carrinho vazio
        if (cartEmptyElement) cartEmptyElement.style.display = 'block';
        if (cartItemsElement) cartItemsElement.style.display = 'none';
        if (cartSummaryElement) cartSummaryElement.style.display = 'none';
        return;
    }
    
    // Mostrar itens do carrinho
    if (cartEmptyElement) cartEmptyElement.style.display = 'none';
    if (cartItemsElement) cartItemsElement.style.display = 'block';
    if (cartSummaryElement) cartSummaryElement.style.display = 'block';
    
    if (cartItemListElement) {
        cartItemListElement.innerHTML = '';
        
        // Adicionar cada item ao carrinho
        cart.forEach(item => {
            const cartItemElement = document.createElement('div');
            cartItemElement.className = 'cart-item';
            cartItemElement.innerHTML = `
                <div class="cart-item-details">
                    <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                    <div class="cart-item-info">
                        <h3>${item.name}</h3>
                        ${item.size ? `<p>Tamanho: ${item.size}</p>` : ''}
                        ${item.color ? `<p>Cor: ${item.color}</p>` : ''}
                    </div>
                </div>
                <div class="cart-item-price">R$ ${item.price.toFixed(2).replace('.', ',')}</div>
                <div class="cart-quantity">
                    <button class="quantity-btn minus" data-id="${item.id}">-</button>
                    <input type="number" value="${item.quantity}" min="1" class="quantity-input" data-id="${item.id}">
                    <button class="quantity-btn plus" data-id="${item.id}">+</button>
                </div>
                <div class="cart-item-subtotal">R$ ${(item.price * item.quantity).toFixed(2).replace('.', ',')}</div>
                <button class="remove-item" data-id="${item.id}"><i class="fas fa-trash"></i></button>
            `;
            
            cartItemListElement.appendChild(cartItemElement);
        });
        
        // Adicionar eventos aos botões de quantidade
        const minusButtons = document.querySelectorAll('.quantity-btn.minus');
        const plusButtons = document.querySelectorAll('.quantity-btn.plus');
        const removeButtons = document.querySelectorAll('.remove-item');
        
        minusButtons.forEach(button => {
            button.addEventListener('click', function() {
                const id = this.getAttribute('data-id');
                updateItemQuantity(id, -1);
            });
        });
        
        plusButtons.forEach(button => {
            button.addEventListener('click', function() {
                const id = this.getAttribute('data-id');
                updateItemQuantity(id, 1);
            });
        });
        
        removeButtons.forEach(button => {
            button.addEventListener('click', function() {
                const id = this.getAttribute('data-id');
                removeFromCart(id);
                renderCartPage();
                updateCartCount();
            });
        });
    }
    
    // Atualizar resumo do carrinho
    updateCartSummary();
}

function updateItemQuantity(productId, change) {
    const cart = getCart();
    const productIndex = cart.findIndex(item => item.id === productId);
    
    if (productIndex !== -1) {
        cart[productIndex].quantity += change;
        
        // Garantir que a quantidade não seja menor que 1
        if (cart[productIndex].quantity < 1) {
            cart[productIndex].quantity = 1;
        }
        
        saveCart(cart);
        renderCartPage();
        updateCartCount();
    }
}

function updateCartQuantities() {
    const quantityInputs = document.querySelectorAll('.quantity-input');
    const cart = getCart();
    
    quantityInputs.forEach(input => {
        const id = input.getAttribute('data-id');
        const newQuantity = parseInt(input.value);
        
        if (newQuantity > 0) {
            const productIndex = cart.findIndex(item => item.id === id);
            if (productIndex !== -1) {
                cart[productIndex].quantity = newQuantity;
            }
        }
    });
    
    saveCart(cart);
    updateCartCount();
}

function updateCartSummary() {
    const cart = getCart();
    const subtotalElement = document.getElementById('cart-subtotal');
    const totalElement = document.getElementById('cart-total');
    
    if (subtotalElement && totalElement) {
        const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        
        subtotalElement.textContent = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;
        totalElement.textContent = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;
    }
}

// Funcionalidade da página de conta
function initAccountPage() {
    // Verificar se estamos na página de conta
    if (!window.location.pathname.includes('conta.html')) return;
    
    // Gerenciar as abas da conta
    const tabLinks = document.querySelectorAll('.account-menu a');
    const tabContents = document.querySelectorAll('.account-tab');
    const tabTriggers = document.querySelectorAll('[data-tab-trigger]');
    
    // Função para mostrar uma aba específica
    function showTab(tabId) {
        // Esconder todas as abas
        tabContents.forEach(tab => {
            tab.classList.remove('active');
        });
        
        // Remover a classe ativa de todos os links
        tabLinks.forEach(link => {
            link.classList.remove('active');
        });
        
        // Mostrar a aba selecionada
        const selectedTab = document.getElementById(tabId);
        if (selectedTab) {
            selectedTab.classList.add('active');
        }
        
        // Adicionar classe ativa ao link correspondente
        const selectedLink = document.querySelector(`.account-menu a[data-tab="${tabId}"]`);
        if (selectedLink) {
            selectedLink.classList.add('active');
        }
    }
    
    // Adicionar evento de clique aos links das abas
    tabLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const tabId = this.getAttribute('data-tab');
            
            if (tabId === 'logout') {
                // Simular logout
                alert('Você foi desconectado com sucesso!');
                window.location.href = 'index.html';
                return;
            }
            
            showTab(tabId);
        });
    });
    
    // Adicionar evento de clique aos links de gatilho de abas
    tabTriggers.forEach(trigger => {
        trigger.addEventListener('click', function(e) {
            e.preventDefault();
            const tabId = this.getAttribute('data-tab-trigger');
            showTab(tabId);
        });
    });
    
    // Gerenciar formulário de endereço
    const addAddressBtn = document.getElementById('add-address-btn');
    const cancelAddressBtn = document.getElementById('cancel-address-btn');
    const addressForm = document.querySelector('.address-form');
    
    if (addAddressBtn) {
        addAddressBtn.addEventListener('click', function() {
            addressForm.style.display = 'block';
            this.style.display = 'none';
        });
    }
    
    if (cancelAddressBtn) {
        cancelAddressBtn.addEventListener('click', function() {
            addressForm.style.display = 'none';
            addAddressBtn.style.display = 'block';
        });
    }
    
    // Gerenciar formulário de detalhes da conta
    const accountDetailsForm = document.getElementById('account-details-form');
    if (accountDetailsForm) {
        accountDetailsForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('account-name').value;
            const email = document.getElementById('account-email').value;
            const currentPassword = document.getElementById('current-password').value;
            const newPassword = document.getElementById('new-password').value;
            const confirmPassword = document.getElementById('confirm-password').value;
            
            // Validar campos
            if (!name || !email) {
                alert('Por favor, preencha todos os campos obrigatórios.');
                return;
            }
            
            // Validar e-mail
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Por favor, insira um endereço de e-mail válido.');
                return;
            }
            
            // Validar senhas se estiver alterando
            if (currentPassword || newPassword || confirmPassword) {
                if (!currentPassword) {
                    alert('Por favor, insira sua senha atual.');
                    return;
                }
                
                if (!newPassword) {
                    alert('Por favor, insira sua nova senha.');
                    return;
                }
                
                if (newPassword !== confirmPassword) {
                    alert('As senhas não coincidem.');
                    return;
                }
                
                if (newPassword.length < 6) {
                    alert('A nova senha deve ter pelo menos 6 caracteres.');
                    return;
                }
            }
            
            // Simular atualização bem-sucedida
            alert('Seus dados foram atualizados com sucesso!');
            
            // Atualizar nome do usuário em todos os lugares
            const userNameElements = document.querySelectorAll('.user-name');
            userNameElements.forEach(element => {
                element.textContent = name;
            });
            
            // Limpar campos de senha
            document.getElementById('current-password').value = '';
            document.getElementById('new-password').value = '';
            document.getElementById('confirm-password').value = '';
        });
    }
    
    // Gerenciar formulário de endereço
    const addressFormElement = document.getElementById('address-form');
    if (addressFormElement) {
        addressFormElement.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Simular adição de endereço
            alert('Endereço adicionado com sucesso!');
            
            // Esconder formulário e mostrar botão de adicionar
            addressForm.style.display = 'none';
            addAddressBtn.style.display = 'block';
            
            // Limpar formulário
            this.reset();
        });
    }
}

// Funcionalidade da página de checkout
function initCheckoutPage() {
    // Verificar se estamos na página de checkout
    if (!window.location.pathname.includes('checkout.html')) return;
    
    // Renderizar os itens do carrinho no resumo do pedido
    renderCheckoutItems();
    
    // Gerenciar métodos de pagamento
    const paymentMethods = document.querySelectorAll('.payment-method');
    const paymentRadios = document.querySelectorAll('input[name="payment-method"]');
    
    // Mostrar o conteúdo do método de pagamento selecionado
    function showPaymentMethod(methodValue) {
        paymentMethods.forEach(method => {
            if (method.getAttribute('data-method') === methodValue) {
                method.classList.add('active');
            } else {
                method.classList.remove('active');
            }
        });
    }
    
    // Mostrar o método de pagamento padrão (cartão de crédito)
    showPaymentMethod('credit-card');
    
    // Adicionar evento de alteração aos radios de método de pagamento
    paymentRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            showPaymentMethod(this.value);
        });
    });
    
    // Adicionar evento de clique aos métodos de pagamento
    paymentMethods.forEach(method => {
        method.addEventListener('click', function() {
            const radio = this.querySelector('input[type="radio"]');
            radio.checked = true;
            showPaymentMethod(radio.value);
        });
    });
    
    // Gerenciar formulário de checkout
    const checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validar campos obrigatórios
            const requiredInputs = this.querySelectorAll('[required]');
            let isValid = true;
            
            requiredInputs.forEach(input => {
                if (!input.value.trim()) {
                    isValid = false;
                    input.classList.add('error');
                } else {
                    input.classList.remove('error');
                }
            });
            
            if (!isValid) {
                alert('Por favor, preencha todos os campos obrigatórios.');
                return;
            }
            
            // Validar método de pagamento selecionado
            const selectedPaymentMethod = document.querySelector('input[name="payment-method"]:checked');
            if (!selectedPaymentMethod) {
                alert('Por favor, selecione um método de pagamento.');
                return;
            }
            
            // Validar campos específicos do método de pagamento
            if (selectedPaymentMethod.value === 'credit-card') {
                const cardNumber = document.getElementById('card-number');
                const cardExpiry = document.getElementById('card-expiry');
                const cardCvv = document.getElementById('card-cvv');
                const cardName = document.getElementById('card-name');
                
                if (!cardNumber.value || !cardExpiry.value || !cardCvv.value || !cardName.value) {
                    alert('Por favor, preencha todos os campos do cartão de crédito.');
                    return;
                }
            }
            
            // Simular finalização do pedido
            alert('Pedido finalizado com sucesso! Você será redirecionado para a página de confirmação.');
            
            // Salvar informações de entrega
            const name = document.getElementById('checkout-name').value;
            const street = document.getElementById('checkout-street').value;
            const number = document.getElementById('checkout-number').value;
            const neighborhood = document.getElementById('checkout-neighborhood').value;
            const city = document.getElementById('checkout-city').value;
            const state = document.getElementById('checkout-state').value;
            const cep = document.getElementById('checkout-cep').value;
            
            const shippingAddress = `
                ${name}<br>
                ${street}, ${number}<br>
                ${neighborhood}<br>
                ${city} - ${state}, ${cep}<br>
                Brasil
            `;
            
            localStorage.setItem('shipping-address', shippingAddress);
            
            // Salvar método de pagamento
            const paymentMethodValue = document.querySelector('input[name="payment-method"]:checked').value;
            let paymentMethodText = 'Cartão de Crédito';
            
            if (paymentMethodValue === 'boleto') {
                paymentMethodText = 'Boleto Bancário';
            } else if (paymentMethodValue === 'pix') {
                paymentMethodText = 'PIX';
            }
            
            localStorage.setItem('payment-method', paymentMethodText);
            
            // Salvar total do pedido
            const total = document.getElementById('checkout-total').textContent;
            localStorage.setItem('order-total', total);
            
            // Limpar o carrinho
            localStorage.setItem('cart', JSON.stringify([]));
            
            // Redirecionar para a página de confirmação
            window.location.href = 'confirmacao.html';
        });
    }
}

// Renderizar os itens do carrinho na página de checkout
function renderCheckoutItems() {
    const cart = getCart();
    const checkoutItemsElement = document.getElementById('checkout-items');
    
    if (!checkoutItemsElement) return;
    
    checkoutItemsElement.innerHTML = '';
    
    if (cart.length === 0) {
        checkoutItemsElement.innerHTML = '<p>Seu carrinho está vazio.</p>';
        return;
    }
    
    // Adicionar cada item ao resumo do pedido
    cart.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'checkout-item';
        itemElement.innerHTML = `
            <div class="checkout-item-details">
                <span>${item.name} x ${item.quantity}</span>
                <span>R$ ${(item.price * item.quantity).toFixed(2).replace('.', ',')}</span>
            </div>
        `;
        
        checkoutItemsElement.appendChild(itemElement);
    });
    
    // Atualizar valores do resumo
    updateCheckoutSummary();
}

// Atualizar o resumo do pedido na página de checkout
function updateCheckoutSummary() {
    const cart = getCart();
    const subtotalElement = document.getElementById('checkout-subtotal');
    const totalElement = document.getElementById('checkout-total');
    const shippingElement = document.getElementById('checkout-shipping');
    
    if (subtotalElement && totalElement) {
        const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        const shipping = subtotal > 0 ? 15 : 0; // Frete fixo de R$ 15,00
        
        subtotalElement.textContent = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;
        shippingElement.textContent = shipping > 0 ? `R$ ${shipping.toFixed(2).replace('.', ',')}` : 'Grátis';
        totalElement.textContent = `R$ ${(subtotal + shipping).toFixed(2).replace('.', ',')}`;
    }
}

// Funcionalidade da página de confirmação
function initConfirmationPage() {
    // Verificar se estamos na página de confirmação
    if (!window.location.pathname.includes('confirmacao.html')) return;
    
    // Gerar número de pedido aleatório
    const orderNumber = Math.floor(100000 + Math.random() * 900000);
    
    // Obter data atual formatada
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    const formattedDate = `${day}/${month}/${year}`;
    
    // Atualizar informações do pedido
    document.getElementById('order-number').textContent = orderNumber;
    document.getElementById('order-date').textContent = formattedDate;
    
    // Atualizar total do pedido
    const orderTotal = document.getElementById('order-total');
    if (orderTotal) {
        const total = localStorage.getItem('order-total');
        if (total) {
            orderTotal.textContent = total;
        }
    }
    
    // Simular informações de entrega
    const shippingAddress = document.getElementById('shipping-address');
    if (shippingAddress) {
        const address = localStorage.getItem('shipping-address');
        if (address) {
            shippingAddress.innerHTML = address;
        }
    }
    
    // Simular método de pagamento
    const paymentMethod = document.getElementById('payment-method');
    if (paymentMethod) {
        const method = localStorage.getItem('payment-method');
        if (method) {
            paymentMethod.textContent = method;
        }
    }
}

// Função para inicializar os botões de compra direta
function initDirectBuyButtons() {
    const buyButtons = document.querySelectorAll('.add-to-cart-btn');
    
    buyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.getAttribute('data-product-id');
            const productName = this.getAttribute('data-product-name');
            const productPrice = parseFloat(this.getAttribute('data-product-price'));
            
            // Obter a imagem do produto a partir do elemento pai
            const productElement = this.closest('.product');
            let productImage = 'assets/images/products/kit-limpeza.jpg'; // Imagem padrão
            
            if (productElement) {
                const imgElement = productElement.querySelector('.product-image img');
                if (imgElement) {
                    productImage = imgElement.getAttribute('src');
                }
            }
            
            const product = {
                id: productId,
                name: productName,
                price: productPrice,
                quantity: 1,
                image: productImage
            };
            
            addToCart(product);
            updateCartCount();
            showCartNotification(productName);
        });
    });
} 
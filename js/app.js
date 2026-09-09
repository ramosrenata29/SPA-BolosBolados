/**
 * app.js - Inicializador da Aplicação, Event Listeners e Renderização de Produtos
 */

let allProducts = [];

document.addEventListener('DOMContentLoaded', () => {
  initApp();
  initEventListeners();
});

async function initApp() {
  try {
    const response = await fetch('data/products.json');
    if (!response.ok) {
      throw new Error(`Erro ao carregar catálogo: status ${response.status}`);
    }
    const data = await response.json();
    allProducts = data.products || [];
    renderProducts(allProducts);
    window.cartService.updateUI();
  } catch (error) {
    console.error('Falha ao inicializar catálogo de produtos:', error);
    const container = document.getElementById('products-container');
    if (container) {
      container.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: var(--color-error);">
          <span class="material-symbols-outlined" style="font-size: 3rem;">error</span>
          <p style="margin-top: 1rem; font-weight: 600;">Não foi possível carregar os produtos do cardápio.</p>
        </div>
      `;
    }
  }
}

function renderProducts(products) {
  const container = document.getElementById('products-container');
  if (!container) return;

  if (products.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: var(--color-text-muted);">
        <p>Nenhum produto encontrado nesta categoria.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = products.map(product => {
    const promoBadge = product.promo
      ? `<span class="promo-tag">${product.promoLabel || 'Destaque'}</span>`
      : '';

    const priceFormatted = `R$ ${product.price.toFixed(2).replace('.', ',')}`;

    return `
      <article class="product-card">
        <div class="product-img-wrapper">
          ${promoBadge}
          <img src="${product.image}" alt="${product.name}" onerror="this.onerror=null; this.parentNode.innerHTML='<span class=\'material-symbols-outlined product-img-fallback\'>cake</span>';">
        </div>
        <div class="product-body">
          <span class="product-category-lbl">${product.category}</span>
          <h3 class="product-title">${product.name}</h3>
          <p class="product-desc">${product.description}</p>
          <div class="product-footer">
            <div>
              <div class="product-price">${priceFormatted}</div>
              <div class="product-unit">/ ${product.unit}</div>
            </div>
            <button class="add-cart-btn" onclick="handleAddToCart('${product.id}')">
              <span class="material-symbols-outlined">add_shopping_cart</span>
              Adicionar
            </button>
          </div>
        </div>
      </article>
    `;
  }).join('');
}

function handleAddToCart(productId) {
  const product = allProducts.find(p => p.id === productId);
  if (product) {
    window.cartService.addItem(product);
    toggleCartDrawer(true);
  }
}

function initEventListeners() {
  // Drawer do Carrinho
  const cartTrigger = document.getElementById('cart-trigger');
  const closeDrawerBtn = document.getElementById('close-drawer');
  const drawerOverlay = document.getElementById('drawer-overlay');

  if (cartTrigger) cartTrigger.addEventListener('click', () => toggleCartDrawer(true));
  if (closeDrawerBtn) closeDrawerBtn.addEventListener('click', () => toggleCartDrawer(false));
  if (drawerOverlay) drawerOverlay.addEventListener('click', () => toggleCartDrawer(false));

  // Filtros de Categoria
  const filterSection = document.getElementById('category-filters');
  if (filterSection) {
    filterSection.addEventListener('click', (e) => {
      const chip = e.target.closest('.filter-chip');
      if (!chip) return;

      document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');

      const category = chip.getAttribute('data-category');
      if (category === 'todos') {
        renderProducts(allProducts);
      } else {
        const filtered = allProducts.filter(p => p.category === category);
        renderProducts(filtered);
      }
    });
  }

  // Finalizar Compra Trigger
  const proceedBtn = document.getElementById('proceed-checkout-btn');
  if (proceedBtn) {
    proceedBtn.addEventListener('click', () => {
      toggleCartDrawer(false);
      window.checkoutManager.openCheckoutModal();
    });
  }

  // Fechar Modal
  const closeModalBtn = document.getElementById('close-modal-btn');
  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', () => window.checkoutManager.closeCheckoutModal());
  }
}

function toggleCartDrawer(open) {
  const drawer = document.getElementById('cart-drawer');
  const overlay = document.getElementById('drawer-overlay');

  if (drawer && overlay) {
    if (open) {
      drawer.classList.add('active');
      overlay.classList.add('active');
    } else {
      drawer.classList.remove('active');
      overlay.classList.remove('active');
    }
  }
}

/**
 * cart.js - Gerenciamento do Carrinho de Compras com LocalStorage
 */

const CART_STORAGE_KEY = 'bolos_bolados_cart';

class CartService {
  constructor() {
    this.items = this.loadCart();
  }

  loadCart() {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Erro ao carregar carrinho do localStorage:', e);
      return [];
    }
  }

  saveCart() {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(this.items));
    } catch (e) {
      console.error('Erro ao salvar carrinho no localStorage:', e);
    }
  }

  addItem(product) {
    const existing = this.items.find(item => item.id === product.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      this.items.push({
        id: product.id,
        name: product.name,
        price: product.price,
        unit: product.unit,
        image: product.image,
        quantity: 1
      });
    }
    this.saveCart();
    this.updateUI();
  }

  removeItem(productId) {
    this.items = this.items.filter(item => item.id !== productId);
    this.saveCart();
    this.updateUI();
  }

  updateQuantity(productId, delta) {
    const item = this.items.find(i => i.id === productId);
    if (item) {
      item.quantity += delta;
      if (item.quantity <= 0) {
        this.removeItem(productId);
        return;
      }
      this.saveCart();
      this.updateUI();
    }
  }

  clearCart() {
    this.items = [];
    this.saveCart();
    this.updateUI();
  }

  getTotalItemsCount() {
    return this.items.reduce((sum, item) => sum + item.quantity, 0);
  }

  getSubtotal() {
    return this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  updateUI() {
    const badge = document.getElementById('cart-count-badge');
    if (badge) {
      badge.textContent = this.getTotalItemsCount();
    }

    const container = document.getElementById('cart-items-container');
    const subtotalEl = document.getElementById('cart-subtotal');
    const totalEl = document.getElementById('cart-total');

    if (!container) return;

    if (this.items.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 3rem 1rem; color: var(--color-text-muted);">
          <span class="material-symbols-outlined" style="font-size: 3.5rem; color: var(--color-border-dark);">shopping_cart</span>
          <p style="margin-top: 1rem; font-weight: 500;">Seu carrinho está vazio.</p>
          <p style="font-size: 0.85rem; margin-top: 0.5rem;">Escolha seus bolos favoritos e adicione aqui!</p>
        </div>
      `;
      if (subtotalEl) subtotalEl.textContent = 'R$ 0,00';
      if (totalEl) totalEl.textContent = 'R$ 0,00';
      return;
    }

    container.innerHTML = this.items.map(item => `
      <div class="cart-item">
        <div class="cart-item-details">
          <div class="cart-item-title">${item.name}</div>
          <div class="cart-item-price">R$ ${item.price.toFixed(2).replace('.', ',')} / ${item.unit}</div>
          <div class="cart-qty-ctrl">
            <button class="qty-btn" onclick="window.cartService.updateQuantity('${item.id}', -1)" aria-label="Diminuir quantidade">
              <span class="material-symbols-outlined" style="font-size: 1rem;">remove</span>
            </button>
            <span class="qty-val">${item.quantity}</span>
            <button class="qty-btn" onclick="window.cartService.updateQuantity('${item.id}', 1)" aria-label="Aumentar quantidade">
              <span class="material-symbols-outlined" style="font-size: 1rem;">add</span>
            </button>
          </div>
        </div>
        <div style="text-align: right;">
          <div style="font-weight: 700; font-family: var(--font-heading);">
            R$ ${(item.price * item.quantity).toFixed(2).replace('.', ',')}
          </div>
          <button class="remove-item-btn" onclick="window.cartService.removeItem('${item.id}')" title="Remover item">
            <span class="material-symbols-outlined" style="font-size: 1.2rem;">delete</span>
          </button>
        </div>
      </div>
    `).join('');

    const subtotalFormatted = `R$ ${this.getSubtotal().toFixed(2).replace('.', ',')}`;
    if (subtotalEl) subtotalEl.textContent = subtotalFormatted;
    if (totalEl) totalEl.textContent = subtotalFormatted;
  }
}

window.cartService = new CartService();

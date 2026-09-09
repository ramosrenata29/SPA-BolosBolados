/**
 * checkout.js - Orquestrador do Fluxo de Checkout, Cadastro, Geo, Segurança e Pagamento
 */

class CheckoutManager {
  constructor() {
    this.currentStep = 1; // 1: Cadastro & Geo, 2: Prova de Vida/Segurança, 3: Pagamento, 4: Sucesso
    this.userData = null;
    this.userLocation = null;
  }

  openCheckoutModal() {
    if (window.cartService.items.length === 0) {
      alert('Seu carrinho está vazio! Adicione itens antes de finalizar.');
      return;
    }

    const modalOverlay = document.getElementById('modal-overlay');
    if (modalOverlay) {
      modalOverlay.classList.add('active');
      this.currentStep = 1;
      this.renderStep();
    }
  }

  closeCheckoutModal() {
    const modalOverlay = document.getElementById('modal-overlay');
    if (modalOverlay) {
      modalOverlay.classList.remove('active');
    }
  }

  renderStep() {
    const contentEl = document.getElementById('modal-step-content');
    if (!contentEl) return;

    if (this.currentStep === 1) {
      this.renderStep1Registration(contentEl);
    } else if (this.currentStep === 2) {
      this.renderStep2Security(contentEl);
    } else if (this.currentStep === 3) {
      this.renderStep3Payment(contentEl);
    } else if (this.currentStep === 4) {
      this.renderStep4Success(contentEl);
    }
  }

  /* --- Passo 1: Cadastro + Geolocalização Obrigatória --- */
  renderStep1Registration(container) {
    container.innerHTML = `
      <h2 style="font-size: 1.4rem; color: var(--color-primary-dark); margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.5rem;">
        <span class="material-symbols-outlined">person_add</span>
        Cadastro & Geolocalização
      </h2>
      <p style="font-size: 0.875rem; color: var(--color-text-muted); margin-bottom: 1.25rem;">
        Preencha seus dados. A captura de localização é <strong>obrigatória</strong> para a validação da entrega.
      </p>

      <div id="checkout-error-box" class="status-box error" style="display: none;"></div>

      <form id="checkout-form-step1" onsubmit="window.checkoutManager.handleStep1Submit(event)">
        <div class="form-group">
          <label class="form-label" for="user-name">Nome Completo *</label>
          <input type="text" id="user-name" class="form-control" required placeholder="Ex: Maria Silva">
        </div>

        <div class="form-group">
          <label class="form-label" for="user-whatsapp">WhatsApp *</label>
          <input type="tel" id="user-whatsapp" class="form-control" required placeholder="Ex: (11) 99999-9999">
        </div>

        <div class="form-group">
          <label class="form-label" for="user-email">E-mail *</label>
          <input type="email" id="user-email" class="form-control" required placeholder="Ex: maria@email.com">
        </div>

        <div class="form-group">
          <label class="form-label" for="user-address">Endereço de Entrega *</label>
          <input type="text" id="user-address" class="form-control" required placeholder="Rua, número, bairro e complemento">
        </div>

        <button type="submit" class="btn-primary" id="btn-submit-step1">
          <span class="material-symbols-outlined">location_on</span>
          Capturar Localização & Continuar
        </button>
      </form>
    `;
  }

  async handleStep1Submit(event) {
    event.preventDefault();
    const errorBox = document.getElementById('checkout-error-box');
    const submitBtn = document.getElementById('btn-submit-step1');

    if (errorBox) errorBox.style.display = 'none';

    const name = document.getElementById('user-name').value.trim();
    const whatsapp = document.getElementById('user-whatsapp').value.trim();
    const email = document.getElementById('user-email').value.trim();
    const address = document.getElementById('user-address').value.trim();

    if (!name || !whatsapp || !email || !address) {
      if (errorBox) {
        errorBox.textContent = 'Por favor, preencha todos os campos obrigatórios.';
        errorBox.style.display = 'flex';
      }
      return;
    }

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <span class="material-symbols-outlined" style="animation: spin 1s linear infinite;">sync</span>
        Obtendo Geolocalização...
      `;
    }

    try {
      const location = await window.locationService.requestLocation();
      this.userData = { name, whatsapp, email, address };
      this.userLocation = location;

      this.currentStep = 2;
      this.renderStep();
    } catch (err) {
      if (errorBox) {
        errorBox.innerHTML = `<span class="material-symbols-outlined">error</span> ${err.message}`;
        errorBox.style.display = 'flex';
      }
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `
          <span class="material-symbols-outlined">location_on</span>
          Capturar Localização & Continuar
        `;
      }
    }
  }

  /* --- Passo 2: Validação de Segurança & Prova de Vida --- */
  renderStep2Security(container) {
    container.innerHTML = `
      <h2 style="font-size: 1.4rem; color: var(--color-primary-dark); margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.5rem;">
        <span class="material-symbols-outlined">security</span>
        Verificação de Segurança
      </h2>
      <p style="font-size: 0.875rem; color: var(--color-text-muted); margin-bottom: 1.5rem;">
        Usamos as credenciais nativas do dispositivo (WebAuthn / CredentialsContainer) como camada extra de proteção e prova de vida para sua transação.
      </p>

      <div class="status-box success">
        <span class="material-symbols-outlined">check_circle</span>
        <div>
          <strong>Localização Confirmada:</strong><br>
          Lat: ${this.userLocation.latitude.toFixed(5)}, Long: ${this.userLocation.longitude.toFixed(5)}
        </div>
      </div>

      <button id="auth-check-btn" class="btn-primary" onclick="window.checkoutManager.handleSecurityCheck()">
        <span class="material-symbols-outlined">fingerprint</span>
        Validar Credenciais do Dispositivo
      </button>
    `;
  }

  async handleSecurityCheck() {
    const btn = document.getElementById('auth-check-btn');
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = `
        <span class="material-symbols-outlined" style="animation: spin 1s linear infinite;">sync</span>
        Validando Prova de Vida...
      `;
    }

    await window.authService.authenticateUser();
    this.currentStep = 3;
    this.renderStep();
  }

  /* --- Passo 3: Gateway de Pagamento Genérico --- */
  renderStep3Payment(container) {
    const totalFormatted = `R$ ${window.cartService.getSubtotal().toFixed(2).replace('.', ',')}`;

    container.innerHTML = `
      <h2 style="font-size: 1.4rem; color: var(--color-primary-dark); margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.5rem;">
        <span class="material-symbols-outlined">payments</span>
        Pagamento Simulado
      </h2>
      <p style="font-size: 0.875rem; color: var(--color-text-muted); margin-bottom: 1rem;">
        Selecione a forma de pagamento desejada para simulação do gateway.
      </p>

      <div style="background-color: var(--color-surface-bg); padding: 1rem; border-radius: var(--radius-base); margin-bottom: 1.25rem;">
        <div style="font-size: 0.85rem; color: var(--color-text-muted);">Total do Pedido:</div>
        <div style="font-size: 1.5rem; font-weight: 700; color: var(--color-primary-dark); font-family: var(--font-heading);">${totalFormatted}</div>
      </div>

      <div class="form-group">
        <label class="form-label">Forma de Pagamento</label>
        <select id="payment-method-select" class="form-control">
          <option value="pix">PIX (Aprovação Instantânea)</option>
          <option value="cartao">Cartão de Crédito na Entrega</option>
          <option value="dinheiro">Dinheiro na Entrega</option>
        </select>
      </div>

      <button class="btn-primary" style="background-color: var(--color-tertiary);" onclick="window.checkoutManager.processSimulatedPayment()">
        <span class="material-symbols-outlined">lock</span>
        Confirmar & Processar Pagamento
      </button>
    `;
  }

  processSimulatedPayment() {
    const method = document.getElementById('payment-method-select').value;
    this.paymentMethod = method;

    this.currentStep = 4;
    this.renderStep();
  }

  /* --- Passo 4: Conclusão & Envio via WhatsApp --- */
  renderStep4Success(container) {
    const cartItems = window.cartService.items;
    const itemsSummary = cartItems.map(i => `• ${i.quantity}x ${i.name} (R$ ${(i.price * i.quantity).toFixed(2).replace('.', ',')})`).join('\n');
    const totalVal = `R$ ${window.cartService.getSubtotal().toFixed(2).replace('.', ',')}`;

    const whatsappMsg = `*NOVO PEDIDO - BOLOS BOLADOS*\n\n` +
      `*Cliente:* ${this.userData.name}\n` +
      `*WhatsApp:* ${this.userData.whatsapp}\n` +
      `*E-mail:* ${this.userData.email}\n` +
      `*Endereço:* ${this.userData.address}\n` +
      `*Localização GPS:* https://maps.google.com/?q=${this.userLocation.latitude},${this.userLocation.longitude}\n\n` +
      `*Itens do Pedido:*\n${itemsSummary}\n\n` +
      `*Total:* ${totalVal}\n` +
      `*Pagamento:* ${this.paymentMethod.toUpperCase()} (Simulado)`;

    const encodedMsg = encodeURIComponent(whatsappMsg);
    const whatsappUrl = `https://wa.me/5511999999999?text=${encodedMsg}`;

    container.innerHTML = `
      <div style="text-align: center; padding: 1rem 0;">
        <span class="material-symbols-outlined" style="font-size: 4rem; color: var(--color-tertiary);">check_circle</span>
        <h2 style="font-size: 1.5rem; color: var(--color-primary-dark); margin: 0.5rem 0;">Pedido Confirmado com Sucesso!</h2>
        <p style="font-size: 0.9rem; color: var(--color-text-muted); margin-bottom: 1.5rem;">
          Seu pedido foi processado na simulação. Agora clique no botão abaixo para enviar os detalhes diretamente para o nosso WhatsApp.
        </p>

        <a href="${whatsappUrl}" target="_blank" class="btn-primary" style="background-color: #25D366; text-decoration: none;" onclick="window.checkoutManager.finishOrder()">
          <span class="material-symbols-outlined">chat</span>
          Enviar Pedido no WhatsApp
        </a>
      </div>
    `;
  }

  finishOrder() {
    window.cartService.clearCart();
    setTimeout(() => {
      this.closeCheckoutModal();
      const drawer = document.getElementById('cart-drawer');
      const overlay = document.getElementById('drawer-overlay');
      if (drawer) drawer.classList.remove('active');
      if (overlay) overlay.classList.remove('active');
    }, 500);
  }
}

window.checkoutManager = new CheckoutManager();

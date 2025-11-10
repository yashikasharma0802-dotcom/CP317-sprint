// Simple checkout/cart + promo code logic
(function () {
  // Sample promo codes definition: code -> {type, amount, description}
  // type: 'percent' or 'fixed'
  const PROMOS = {
    'SAVE10': { type: 'percent', amount: 10, description: '10% off' },
    'HAWK20': { type: 'fixed', amount: 20, description: '$20 off' },
    'FALL5':  { type: 'percent', amount: 5, description: '5% off' }
  };

  // Cart items array: {id, name, price, qty}
  let cart = [];
  let appliedPromo = null;
  // default save helper (will be replaced if cart helper is present)
  let saveCartToStorage = function () {
    try { localStorage.setItem('cart', JSON.stringify(cart)); } catch (e) { /* ignore */ }
  };

  // Helpers
  const $ = id => document.getElementById(id);

  function formatMoney(n) {
    return '$' + n.toFixed(2);
  }

  function calcSubtotal() {
    return cart.reduce((s, item) => s + Number(item.price || 0) * (item.qty || 1), 0);
  }

  function calcDiscountAmount(subtotal, promo) {
    if (!promo) return 0;
    if (promo.type === 'percent') return subtotal * (promo.amount / 100);
    if (promo.type === 'fixed') return Math.min(promo.amount, subtotal);
    return 0;
  }

  function renderCart() {
    const container = $('cart-items');
    container.innerHTML = '';
    if (cart.length === 0) {
      container.innerHTML = '<p>Your cart is empty. Use the test button to load sample items.</p>';
    }

    cart.forEach(item => {
      const el = document.createElement('div');
      el.className = 'cart-item';
      el.innerHTML = `
        ${item.image ? `<img class="cart-thumb" src="${item.image}" alt="${item.name}">` : ''}
        <div style="flex:1; min-width:0;">
          <div class="cart-name">${item.name}</div>
          <div class="cart-price">${formatMoney(Number(item.price))}</div>
        </div>
        <div class="cart-qty">Qty: <button class="qty-decrease" data-id="${item.id}">-</button> <span class="qty-val">${item.qty || 1}</span> <button class="qty-increase" data-id="${item.id}">+</button></div>
        <div><button class="remove-item" data-id="${item.id}">Remove</button></div>
      `;
      container.appendChild(el);
    });

    // attach handlers for qty/remove
    container.querySelectorAll('.qty-increase').forEach(b => b.addEventListener('click', function () {
      const id = this.getAttribute('data-id');
      const it = cart.find(i => i.id === id);
      if (it) { it.qty = (it.qty || 1) + 1; saveCartToStorage(); renderCart(); }
    }));
    container.querySelectorAll('.qty-decrease').forEach(b => b.addEventListener('click', function () {
      const id = this.getAttribute('data-id');
      const it = cart.find(i => i.id === id);
      if (it) { it.qty = Math.max(0, (it.qty || 1) - 1); saveCartToStorage(); cart = cart.filter(i=>i.qty>0); renderCart(); }
    }));
    container.querySelectorAll('.remove-item').forEach(b => b.addEventListener('click', function () {
      const id = this.getAttribute('data-id');
      cart = cart.filter(i => i.id !== id); saveCartToStorage(); renderCart();
    }));

    updateSummary();
  }

  function updateSummary() {
    const subtotal = calcSubtotal();
    const discountAmount = calcDiscountAmount(subtotal, appliedPromo);
    const total = Math.max(0, subtotal - discountAmount);

    $('subtotal').textContent = formatMoney(subtotal);
    if (appliedPromo) {
      $('discount-row').style.display = '';
      $('applied-code').textContent = appliedPromo.code + ' — ' + appliedPromo.description;
      $('discount-amount').textContent = '-'+formatMoney(discountAmount);
    } else {
      $('discount-row').style.display = 'none';
      $('applied-code').textContent = '';
      $('discount-amount').textContent = '-$0.00';
    }
    $('total').textContent = formatMoney(total);
  }

  function applyPromoCode(code) {
    const up = String(code || '').trim().toUpperCase();
    if (!up) {
      appliedPromo = null;
      $('promo-message').textContent = '';
      updateSummary();
      return;
    }

    const promo = PROMOS[up];
    if (!promo) {
      appliedPromo = null;
      $('promo-message').textContent = 'Invalid or expired code.';
      updateSummary();
      return false;
    }

    appliedPromo = Object.assign({ code: up }, promo);
    $('promo-message').textContent = `Applied ${up}: ${promo.description}`;
    updateSummary();
    return true;
  }

  // Test helpers
  function loadSampleItems() {
    cart = [
      { id: 'sample-1', name: 'Hawk Tee', price: 34.99, qty: 1 },
      { id: 'sample-2', name: 'Hawk Hoodie', price: 64.5, qty: 1 },
      { id: 'sample-3', name: 'Hawk Mug', price: 12.0, qty: 1 }
    ];
    appliedPromo = null;
    $('promo-code').value = '';
    $('promo-message').textContent = '';
    saveCartToStorage();
    renderCart();
  }

  function runSampleTests() {
    console.log('Running sample promo tests');
    loadSampleItems();
    const subtotal = calcSubtotal();
    console.log('Subtotal:', subtotal);

    ['SAVE10','HAWK20','INVALID','FALL5'].forEach(code => {
      applyPromoCode(code);
      const discount = calcDiscountAmount(subtotal, appliedPromo);
      const total = Math.max(0, subtotal - discount);
      console.log(`Code=${code} -> discount=${discount.toFixed(2)} total=${total.toFixed(2)}`);
    });

    // clear applied promo at end
    appliedPromo = null;
    updateSummary();
  }

  // Wire up DOM
  document.addEventListener('DOMContentLoaded', function () {
    // Load saved cart from localStorage if present (cart.js may have saved it)
    try {
      if (window.Cart && typeof window.Cart.getCart === 'function') {
        cart = window.Cart.getCart() || [];
      } else {
        cart = JSON.parse(localStorage.getItem('cart') || '[]');
      }
    } catch (e) { cart = []; }

    // if cart helper is available, use it for persistence
    if (window.Cart && typeof window.Cart.saveCart === 'function' && typeof window.Cart.getCart === 'function') {
      saveCartToStorage = function () { window.Cart.saveCart(cart); };
      try { cart = window.Cart.getCart() || []; } catch (e) { cart = cart || []; }
    } else {
      // fallback: use localStorage directly
      saveCartToStorage = function () { try { localStorage.setItem('cart', JSON.stringify(cart)); } catch (e) {} };
    }
    // expose save helper for debugging
    window.__checkout_saveCart = saveCartToStorage;
    $('apply-promo').addEventListener('click', function () {
      const code = $('promo-code').value;
      applyPromoCode(code);
    });

    $('clear-promo').addEventListener('click', function () {
      appliedPromo = null;
      $('promo-code').value = '';
      $('promo-message').textContent = '';
      updateSummary();
    });

    $('add-sample-items').addEventListener('click', loadSampleItems);
    $('run-sample-tests').addEventListener('click', runSampleTests);

    // whenever localStorage cart changes externally (other page), refresh
    window.addEventListener('storage', function (ev) {
      if (ev.key === 'cart') {
        try { cart = JSON.parse(ev.newValue || '[]'); } catch (e) { cart = []; }
        renderCart();
      }
    });

    // initial render
    renderCart();
  });

  // Expose for manual testing in console (optional)
  window.__checkout = {
    PROMOS, cart, loadSampleItems, applyPromoCode, calcSubtotal, calcDiscountAmount
  };

})();

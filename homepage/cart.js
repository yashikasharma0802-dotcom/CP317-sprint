// Simple cart helper: stores cart in localStorage under key 'cart'
(function () {
  const STORAGE_KEY = 'cart';

  function getCart() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    } catch (e) {
      return [];
    }
  }

  function saveCart(cart) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  }

  function addToCart(item) {
    const cart = getCart();
    const existing = cart.find(i => i.id === item.id);
    if (existing) {
      existing.qty = (existing.qty || 1) + 1;
    } else {
      cart.push(Object.assign({ qty: 1 }, item));
    }
    saveCart(cart);
    alert(item.name + ' added to cart');
    return cart;
  }

  function removeFromCart(id) {
    let cart = getCart();
    cart = cart.filter(i => i.id !== id);
    saveCart(cart);
    return cart;
  }

  function updateQty(id, qty) {
    const cart = getCart();
    const item = cart.find(i => i.id === id);
    if (!item) return cart;
    item.qty = Math.max(0, qty);
    const newCart = cart.filter(i => i.qty > 0);
    saveCart(newCart);
    return newCart;
  }

  // Wire up add-to-cart buttons (if present on the page)
  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.add-to-cart').forEach(btn => {
      btn.addEventListener('click', function () {
        const id = this.getAttribute('data-id');
        const name = this.getAttribute('data-name') || this.getAttribute('data-title') || this.dataset.name || 'Item';
        const price = Number(this.getAttribute('data-price') || this.dataset.price || 0);
        const image = this.getAttribute('data-image') || this.dataset.image || '';
        if (!id) {
          console.warn('add-to-cart button missing data-id');
          return;
        }
        addToCart({ id, name, price, image });
      });
    });
  });

  window.Cart = { getCart, saveCart, addToCart, removeFromCart, updateQty };
})();

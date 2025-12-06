// payment.js
// Centralized module for checkout rendering, validation, and mock payment processing

// Load cart from localStorage
let cart = JSON.parse(localStorage.getItem("hawkshop_cart") || "[]");

// Utility to calculate subtotal, tax, and total
function calculateTotals() {
  let subtotal = 0;

  cart.forEach(item => {
    subtotal += item.price * item.quantity;
  });

  const taxRate = 0.13;
  const tax = subtotal * taxRate;
  const total = subtotal + tax;

  return { subtotal, tax, total };
}

// Render order summary on checkout page
function renderOrderSummary() {
  const itemsList = document.getElementById("order-items");
  const subtotalEl = document.getElementById("summary-subtotal");
  const taxEl = document.getElementById("summary-tax");
  const totalEl = document.getElementById("summary-total");

  if (!itemsList || !subtotalEl || !taxEl || !totalEl) {
    return;
  }

  itemsList.innerHTML = "";

  // Empty cart scenario
  if (!cart.length) {
    const li = document.createElement("li");
    li.textContent = "Your cart is empty.";
    itemsList.appendChild(li);

    subtotalEl.textContent = "$0.00";
    taxEl.textContent = "$0.00";
    totalEl.textContent = "$0.00";
    return;
  }

  cart.forEach(item => {
    const li = document.createElement("li");
    li.textContent = `${item.title} x ${item.quantity}`;
    itemsList.appendChild(li);
  });

  const { subtotal, tax, total } = calculateTotals();
  subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
  taxEl.textContent = `$${tax.toFixed(2)}`;
  totalEl.textContent = `$${total.toFixed(2)}`;
}

// Basic validation for billing and payment fields
function validatePayment(data) {
  const errors = [];

  if (!data.name) {
    errors.push("Name is required.");
  }

  if (!data.email || !data.email.includes("@")) {
    errors.push("A valid email address is required.");
  }

  if (!data.address) {
    errors.push("Address is required.");
  }

  if (!data.city) {
    errors.push("City is required.");
  }

  if (!data.postal) {
    errors.push("Postal code is required.");
  }

  // Card number: 16 digits, spaces allowed in input
  const digitsOnly = data.cardNumber.replace(/\s+/g, "");
  if (!/^\d{16}$/.test(digitsOnly)) {
    errors.push("Card number must contain exactly 16 digits.");
  }

  // Expiry format: MM/YY
  if (!/^\d{2}\/\d{2}$/.test(data.expiry)) {
    errors.push("Expiry must be in MM/YY format.");
  }

  // CVV: 3 or 4 digits
  if (!/^\d{3,4}$/.test(data.cvv)) {
    errors.push("CVV must be 3 or 4 digits.");
  }

  return errors;
}

// Simulate payment gateway call
function mockCharge() {
  return new Promise(resolve => {
    // Simulate latency to make it feel realistic
    setTimeout(() => {
      resolve({ status: "approved" });
    }, 600);
  });
}

// Initialize checkout screen behavior
function initPaymentModule() {
  const form = document.getElementById("checkout-form");
  const errorEl = document.getElementById("checkout-error");
  const successSection = document.getElementById("checkout-success");

  // Defensive check so the same file can be reused or included in other pages if needed
  if (!form || !errorEl || !successSection) {
    return;
  }

  // Initial render of current order
  renderOrderSummary();

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!cart.length) {
      errorEl.textContent = "Your cart is empty. Please add items before checking out.";
      return;
    }

    errorEl.textContent = "";

    const formData = new FormData(form);
    const data = {
      name: (formData.get("name") || "").toString().trim(),
      email: (formData.get("email") || "").toString().trim(),
      address: (formData.get("address") || "").toString().trim(),
      city: (formData.get("city") || "").toString().trim(),
      postal: (formData.get("postal") || "").toString().trim(),
      cardNumber: (formData.get("cardNumber") || "").toString().trim(),
      expiry: (formData.get("expiry") || "").toString().trim(),
      cvv: (formData.get("cvv") || "").toString().trim()
    };

    const errors = validatePayment(data);
    if (errors.length) {
      errorEl.textContent = errors.join(" ");
      return;
    }

    const submitButton = form.querySelector("button[type='submit']");
    const originalLabel = submitButton ? submitButton.textContent : "Pay";

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "Processing...";
    }

    const result = await mockCharge();

    if (submitButton) {
      submitButton.disabled = false;
      submitButton.textContent = originalLabel;
    }

    if (result.status === "approved") {
      // Save order to local order history so it shows on the My Orders page
      try {
        const existing = JSON.parse(localStorage.getItem("orders") || "[]");
        const { subtotal, tax, total } = calculateTotals();
        const now = new Date();
        const id = `ORD-${now.getFullYear()}-${String(existing.length + 1).padStart(3, "3")}`;

        const items = cart.map(item => ({
          name: item.title || item.name,
          quantity: item.quantity,
          price: item.price,
          image: item.image || ""
        }));

        const addressString = [data.address, data.city, data.postal].filter(Boolean).join(", ");

        const newOrder = {
          id,
          date: now.toISOString(),
          status: "Processing",
          items,
          subtotal,
          tax,
          total,
          address: addressString
        };

        existing.push(newOrder);
        localStorage.setItem("orders", JSON.stringify(existing));
      } catch (e) {
        // If anything goes wrong with saving order history, fail silently
      }

      // Clear cart and flip UI to success state
      localStorage.removeItem("hawkshop_cart");
      cart = [];

      form.classList.add("hidden");
      successSection.classList.remove("hidden");
    } else {
      errorEl.textContent = "Payment was declined. Please try again.";
    }
  });
}

// Initialize module when DOM is ready
document.addEventListener("DOMContentLoaded", initPaymentModule);

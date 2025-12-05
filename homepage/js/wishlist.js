(function () {
  const STORAGE_KEY = "wishlist";

  function getWishlist() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    } catch (e) {
      return [];
    }
  }

  function saveWishlist(list) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  }

  function readPriceFromText(text) {
    if (!text) return 0;
    const match = String(text).replace(/[^0-9.]/g, "");
    const n = parseFloat(match);
    return isNaN(n) ? 0 : n;
  }

  function buildItemFromButton(button) {
    const dataset = button.dataset || {};
    const productCard = button.closest(".work");

    const id =
      dataset.id ||
      button.getAttribute("data-id") ||
      (productCard &&
        productCard.querySelector("[data-id]") &&
        productCard.querySelector("[data-id]").getAttribute("data-id")) ||
      (productCard && productCard.querySelector("h3") && productCard.querySelector("h3").innerText) ||
      null;

    const name =
      dataset.name ||
      button.getAttribute("data-name") ||
      (productCard && productCard.querySelector("h3") && productCard.querySelector("h3").innerText) ||
      "Item";

    const price =
      dataset.price ||
      button.getAttribute("data-price") ||
      (productCard &&
        productCard.querySelector(".price") &&
        readPriceFromText(productCard.querySelector(".price").textContent));

    const image =
      dataset.image ||
      button.getAttribute("data-image") ||
      (productCard &&
        productCard.querySelector("img") &&
        productCard.querySelector("img").getAttribute("src")) ||
      "";

    return {
      id: id || name,
      name,
      price: Number(price || 0),
      image,
    };
  }

  function addItemToWishlist(item) {
    let wishlist = getWishlist();
    const key = item.id || item.name;
    if (!wishlist.some((w) => (w.id || w.name) === key)) {
      wishlist.push({
        id: item.id || item.name,
        name: item.name,
        price: Number(item.price || 0),
        image: item.image || "",
      });
      saveWishlist(wishlist);
      alert(item.name + " added to wishlist!");
    }
  }

  function renderWishlist(listContainer) {
    let wishlist = getWishlist();
    listContainer.innerHTML = "";

    if (!wishlist.length) {
      listContainer.innerHTML =
        '<p style="text-align:center;margin-top:20px;">Your wishlist is empty. Browse products and tap "Add to Wishlist" to save favourites.</p>';
      return;
    }

    wishlist.forEach((item) => {
      const card = document.createElement("div");
      card.className = "work";

      const img = document.createElement("img");
      img.src = item.image || "images/logos/hawkshop.png";
      img.alt = item.name;

      const layer = document.createElement("div");
      layer.className = "layer";

      const title = document.createElement("h3");
      title.textContent = item.name;

      const priceEl = document.createElement("p");
      priceEl.className = "price";
      if (item.price) {
        priceEl.textContent = "$" + Number(item.price).toFixed(2);
      } else {
        priceEl.textContent = "";
      }

      const buttonGroup = document.createElement("div");
      buttonGroup.className = "product-btn-group";

      const addCartBtn = document.createElement("button");
      addCartBtn.textContent = "Add to Cart";
      addCartBtn.className = "product-btn add-to-cart-from-wishlist";
      addCartBtn.dataset.id = item.id || item.name;
      addCartBtn.dataset.name = item.name;
      addCartBtn.dataset.price = item.price || 0;
      addCartBtn.dataset.image = item.image || "";

      const removeBtn = document.createElement("button");
      removeBtn.textContent = "Remove";
      removeBtn.className = "product-btn remove-from-wishlist";
      removeBtn.dataset.id = item.id || item.name;

      addCartBtn.addEventListener("click", function () {
        const payload = {
          id: this.dataset.id,
          name: this.dataset.name,
          price: Number(this.dataset.price || 0),
          image: this.dataset.image || "",
        };

        if (window.Cart && typeof window.Cart.addToCart === "function") {
          window.Cart.addToCart(payload);
        } else {
          try {
            let cart = JSON.parse(localStorage.getItem("cart") || "[]");
            const existing = cart.find((c) => c.id === payload.id);
            if (existing) {
              existing.qty = (existing.qty || 1) + 1;
            } else {
              cart.push(Object.assign({ qty: 1 }, payload));
            }
            localStorage.setItem("cart", JSON.stringify(cart));
            alert(payload.name + " added to cart");
          } catch (e) {}
        }
      });

      removeBtn.addEventListener("click", function () {
        const removeId = this.dataset.id;
        let wishlistNow = getWishlist();
        wishlistNow = wishlistNow.filter(
          (w) => (w.id || w.name) !== removeId
        );
        saveWishlist(wishlistNow);
        card.remove();
      });

      buttonGroup.appendChild(addCartBtn);
      buttonGroup.appendChild(removeBtn);

      layer.appendChild(title);
      if (priceEl.textContent) {
        layer.appendChild(priceEl);
      }
      layer.appendChild(buttonGroup);

      card.appendChild(img);
      card.appendChild(layer);

      listContainer.appendChild(card);
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    const buttons = document.querySelectorAll(".add-to-wishlist");
    buttons.forEach((button) => {
      button.addEventListener("click", function () {
        const item = buildItemFromButton(this);
        if (!item || !item.name) return;
        addItemToWishlist(item);
      });
    });

    const listContainer = document.getElementById("wishlist-items");
    if (listContainer) {
      renderWishlist(listContainer);
    }
  });

  window.Wishlist = {
    getWishlist,
    saveWishlist,
    addItemToWishlist,
  };
})();

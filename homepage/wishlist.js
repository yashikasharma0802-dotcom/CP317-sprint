// 1) Add to Wishlist button clicks
const buttons = document.querySelectorAll(".add-to-wishlist");

buttons.forEach(button => {
  button.addEventListener("click", function () {

    let productCard = this.closest(".work"); // the outer product card div
    let itemName = productCard.querySelector("h3").innerText;
    let itemImage = productCard.querySelector("img").getAttribute("src");

    let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

    // store product as object {name, image}
    if (!wishlist.some(item => item.name === itemName)) {
      wishlist.push({ name: itemName, image: itemImage });
      localStorage.setItem("wishlist", JSON.stringify(wishlist));
      alert(itemName + " added to wishlist!");
    }
  });
});

// 2) Display wishlist items on wishlist.html 
let listContainer = document.getElementById("wishlist-items");

if (listContainer) {
  let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

  wishlist.forEach(item => {
    // Create card container (same class naming style as merch grid)
    let card = document.createElement("div");
    card.className = "work";

    // Card image
    let img = document.createElement("img");
    img.src = item.image;

    // Overlay/Info section
    let layer = document.createElement("div");
    layer.className = "layer";

    let title = document.createElement("h3");
    title.textContent = item.name;

    let removeBtn = document.createElement("button");
    removeBtn.textContent = "Remove";
    removeBtn.className = "remove-from-wishlist";

    // Remove logic
    removeBtn.addEventListener("click", function () {
      wishlist = wishlist.filter(w => w.name !== item.name);
      localStorage.setItem("wishlist", JSON.stringify(wishlist));
      card.remove();
    });

    layer.appendChild(title);
    layer.appendChild(removeBtn);
    card.appendChild(img);
    card.appendChild(layer);
    listContainer.appendChild(card);
  });
}

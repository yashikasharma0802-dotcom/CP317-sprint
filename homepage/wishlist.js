let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
let listContainer = document.getElementById("wishlist-items");

wishlist.forEach(item => {
  let li = document.createElement("li");
  li.textContent = item;
  listContainer.appendChild(li);
});

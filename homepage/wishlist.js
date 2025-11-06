// 1) Add to Wishlist button clicks
const buttons = document.querySelectorAll(".add-to-wishlist");

buttons.forEach(button => {
  button.addEventListener("click", function () {
    let itemName = this.parentElement.querySelector("h3").innerText;

    let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

    if (!wishlist.includes(itemName)) {
      wishlist.push(itemName);
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
    let li = document.createElement("li");
    li.textContent = item;
    listContainer.appendChild(li);
  });
}

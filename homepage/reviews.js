// --------------------
// 1. Leave Review Button
// --------------------
const reviewButtons = document.querySelectorAll(".leave-review");

reviewButtons.forEach(btn => {
    btn.addEventListener("click", function () {
        let product = this.getAttribute("data-product");

        let rating = prompt("Rate this product (1–5 stars):");
        rating = parseInt(rating);

        if (isNaN(rating) || rating < 1 || rating > 5) {
            alert("Invalid rating.");
            return;
        }

        let reviewText = prompt("Write a short review (optional):") || "";

        let reviews = JSON.parse(localStorage.getItem("reviews")) || [];

        reviews.push({
            product: product,
            rating: rating,
            text: reviewText,
            date: new Date().toLocaleString()
        });

        localStorage.setItem("reviews", JSON.stringify(reviews));
        alert("Thanks! Your review was submitted.");
    });
});

// --------------------
// 2. Display All Reviews (reviews.html)
// --------------------
let list = document.getElementById("review-list");

if (list) {
    let reviews = JSON.parse(localStorage.getItem("reviews")) || [];

    reviews.forEach(r => {
        // Card container
        let card = document.createElement("div");
        card.className = "work";

        // Fake image in case product doesn’t have one
        let img = document.createElement("img");
        img.src = "images/logos/hawkshop.png";

        let layer = document.createElement("div");
        layer.className = "layer";

        let title = document.createElement("h3");
        title.textContent = r.product;

        // Star rating
        let stars = document.createElement("p");
        stars.innerHTML = "⭐".repeat(r.rating) + "☆".repeat(5 - r.rating);

        // Review text
        let text = document.createElement("p");
        text.textContent = r.text || "(no written review)";

        // Date
        let date = document.createElement("small");
        date.textContent = r.date;

        layer.appendChild(title);
        layer.appendChild(stars);
        layer.appendChild(text);
        layer.appendChild(date);

        card.appendChild(img);
        card.appendChild(layer);

        list.appendChild(card);
    });
}

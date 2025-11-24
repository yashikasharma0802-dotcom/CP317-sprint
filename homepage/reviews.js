// =======================================
// 0. Modal Elements
// =======================================
const modal = document.getElementById("review-modal");
const closeBtn = document.getElementById("close-review");
const submitBtn = document.getElementById("submit-review");
const productTitle = document.getElementById("review-product-title");

const ratingSelect = document.getElementById("review-rating");
const reviewText = document.getElementById("review-text");

let currentProduct = null;

// =======================================
// 1. Leave Review Button → open modal
// =======================================
const reviewButtons = document.querySelectorAll(".leave-review");

reviewButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        currentProduct = btn.getAttribute("data-product");

        // Set modal title (product name)
        productTitle.textContent = currentProduct;

        // Reset fields
        ratingSelect.value = "5";
        reviewText.value = "";

        modal.style.display = "flex";
    });
});

// =======================================
// 2. Close Modal
// =======================================
if (closeBtn) {
    closeBtn.addEventListener("click", () => {
        modal.style.display = "none";
    });
}

// =======================================
// 3. Submit Review
// =======================================
if (submitBtn) {
    submitBtn.addEventListener("click", () => {
        let rating = parseInt(ratingSelect.value);
        let text = reviewText.value.trim();

        let reviews = JSON.parse(localStorage.getItem("reviews")) || [];

        reviews.push({
            product: currentProduct,
            rating: rating,
            text: text,
            date: new Date().toLocaleString()
        });

        localStorage.setItem("reviews", JSON.stringify(reviews));

        modal.style.display = "none";
        alert("Your review was submitted!");
        location.reload(); // Refresh product page to show new review
    });
}

// =======================================
// 4. Reviews Page (reviews.html)
// Display ALL reviews
// =======================================
const reviewListPage = document.getElementById("review-list");

if (reviewListPage) {
    let reviews = JSON.parse(localStorage.getItem("reviews")) || [];

    reviews.forEach(r => {
        let card = document.createElement("div");
        card.className = "review-card";

        card.innerHTML = `
            <h3>${r.product}</h3>
            <p>${"⭐".repeat(r.rating)}${"☆".repeat(5 - r.rating)}</p>
            <p>${r.text || "(no written review)"}</p>
            <small>${r.date}</small>
        `;

        reviewListPage.appendChild(card);
    });
}

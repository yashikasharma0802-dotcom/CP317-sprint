// navbar.js — global auth-aware navbar behaviour
(function () {
  document.addEventListener("DOMContentLoaded", function () {
    // Make sure we have Auth and a <nav>
    if (!window.Auth || typeof Auth.currentUser !== "function") return;

    const nav = document.querySelector("nav");
    if (!nav) return;

    const user = Auth.currentUser();

    // 1) SHOW / HIDE PROTECTED NAV LINKS
    // These anchors should only be visible when logged in
    const protectedAnchors = nav.querySelectorAll(
      'a[href="wishlist.html"], ' +
      'a[href="order-history.html"], ' +
      'a[href="inventory.html"], ' +
      'a[href="reviews.html"]'
    );

    protectedAnchors.forEach((a) => {
      const wrapper = a.parentElement || a; // usually the <li>
      if (!user) {
        wrapper.style.display = "none";
      } else {
        wrapper.style.display = "";
      }
    });

    // 2) USER ICON + SIGN IN / SIGN OUT TEXT
    const userIcon = nav.querySelector(".fa-regular.fa-user");
    const userIconLink = userIcon ? userIcon.closest("a") : null;
    if (!userIconLink) return;

    // Add a small span right after the user icon
    let accountArea = document.getElementById("accountArea");
    if (!accountArea) {
      accountArea = document.createElement("span");
      accountArea.id = "accountArea";
      accountArea.style.marginLeft = "8px";
      accountArea.style.fontSize = "0.95rem";
      userIconLink.after(accountArea);
    }

    if (user) {
      // Logged in: icon stays, text becomes "Hi, Name  [Sign out]"
      userIconLink.href = "#";
      accountArea.innerHTML = `
        <span>Hi, ${user.name}</span>
        <button id="logoutBtn" class="auth-button">Sign out</button>
      `;

      const logoutBtn = document.getElementById("logoutBtn");
      if (logoutBtn) {
        logoutBtn.addEventListener("click", function (e) {
          e.preventDefault();
          Auth.logout();
          // After logout, send them to home (or login, your choice)
          window.location.href = "index.html";
        });
      }
    } else {
      // Not logged in: icon goes to login, text = "Sign in / Register"
      userIconLink.href = "login.html";
      accountArea.innerHTML = `
        <a href="login.html" class="auth-link">Sign in / Register</a>
      `;
    }
  });
})();

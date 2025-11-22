
// navbar.js — updates the user icon & sign in / out actions
(function () {
  const userIconLink = document.querySelector("nav a:has(.fa-regular.fa-user)");
  const nav = document.querySelector("nav");
  if (!nav || !userIconLink) return;

  const accountArea = document.createElement("span");
  accountArea.id = "accountArea";
  accountArea.style.marginLeft = "8px";
  accountArea.style.fontSize = "0.95rem";
  nav.appendChild(accountArea);

  const user = Auth.currentUser();

  if (user) {
    userIconLink.href = "#";
    accountArea.innerHTML = `
      <span>Hi, ${user.name}</span>
      <button id="logoutBtn" style="margin-left:8px;cursor:pointer;">Sign out</button>
    `;
    document.getElementById("logoutBtn").addEventListener("click", () => {
      Auth.logout();
      window.location.reload();
    });
  } else {
    userIconLink.href = "login.html";
    accountArea.innerHTML = `<a href="signup.html" style="margin-left:8px;">Create account</a>`;
  }
})();

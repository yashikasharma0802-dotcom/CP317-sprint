/* auth.js — handles account creation, login, logout using localStorage.
   (For front-end demo purposes only — not production secure.)
*/
const Auth = (() => {
  const USERS_KEY = "users";
  const SESSION_KEY = "session";

  // read / write helpers
  const readUsers = () => JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
  const writeUsers = (users) => localStorage.setItem(USERS_KEY, JSON.stringify(users));

  function userExists(email) {
    return readUsers().some((u) => u.email === email);
  }

  function createUser({ name, email, password }) {
    const users = readUsers();
    users.push({ name, email, password });
    writeUsers(users);
  }

  function login(email, password) {
    const u = readUsers().find((u) => u.email === email && u.password === password);
    if (!u) return false;

    localStorage.setItem(SESSION_KEY, JSON.stringify({
      email: u.email,
      name: u.name
    }));

    return true;
  }

  function logout() {
    localStorage.removeItem(SESSION_KEY);
  }

  function currentUser() {
    return JSON.parse(localStorage.getItem(SESSION_KEY) || "null");
  }

  function requireAuth(redirectTo = "login.html") {
    if (!currentUser()) window.location.href = redirectTo;
  }

  // ✅ FIXED: properly defined function + correct session key
  function isLoggedIn() {
    return !!localStorage.getItem(SESSION_KEY);
  }

  return { userExists, createUser, login, logout, currentUser, requireAuth, isLoggedIn };
})();

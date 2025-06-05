import LoginPresenter from "./login-presenter.js";

export default class LoginPage {
  constructor() {
    this.presenter = new LoginPresenter(this);
  }

  async render() {
    return `
      <section class="login">
        <h2>Login</h2>
        <form id="loginForm">
          <label for="email">Email</label>
          <input type="email" id="email" name="email" placeholder="Email" required />

          <label for="password">Password</label>
          <input type="password" id="password" name="password" placeholder="Password" required />

          <button type="submit">Login</button>
          <p id="loginMessage"></p>
        </form>
      </section>
    `;
  }

  async afterRender() {
    document.getElementById("loginForm").addEventListener("submit", (e) => {
      e.preventDefault();
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;

      this.presenter.handleLogin(email, password);
    });
  }

  showLoading(isLoading) {
    document.querySelector("button").disabled = isLoading;
  }

  showSuccess(message) {
    const msg = document.getElementById("loginMessage");
    msg.textContent = message;
    msg.style.color = "green";
  }

  showError(message) {
    const msg = document.getElementById("loginMessage");
    msg.textContent = message;
    msg.style.color = "red";
  }

  redirectToHome() {
    window.location.hash = "#/home";
  }
}

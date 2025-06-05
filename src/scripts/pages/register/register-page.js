import RegisterPresenter from "../register/register-presenter.js";

export default class RegisterPage {
  constructor() {
    this.presenter = new RegisterPresenter(this);
  }

  async render() {
    return `
      <section class="register">
        <h2>Register</h2>
        <form id="registerForm">
          <label for="name">Nama</label>
          <input type="text" id="name" name="name" placeholder="Name" required />

          <label for="email">Email</label>
          <input type="email" id="email" name="email" placeholder="Email" required />

          <label for="password">Password</label>
          <input type="password" id="password" name="password" placeholder="Password" required />

          <button type="submit">Register</button>
          <p id="registerMessage"></p>
        </form>
      </section>
    `;
  }

  async afterRender() {
    document.getElementById("registerForm").addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("name").value;
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;

      this.presenter.handleRegister(name, email, password);
    });
  }

  showLoading(isLoading) {
    document.querySelector("button").disabled = isLoading;
  }

  showSuccess(message) {
    const msg = document.getElementById("registerMessage");
    msg.textContent = message;
    msg.style.color = "green";
  }

  showError(message) {
    const msg = document.getElementById("registerMessage");
    msg.textContent = message;
    msg.style.color = "red";
  }

  redirectToLogin() {
    window.location.hash = "#/login";
  }
}

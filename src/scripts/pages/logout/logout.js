import LogoutPresenter from "./logout-presenter.js";

export default class LogoutPage {
  constructor() {
    this.presenter = new LogoutPresenter(this);
  }

  async render() {
    return `
      <section class="logout">
        <h2>Apakah kamu yakin ingin logout?</h2>
        <button id="logoutButton">Logout</button>
      </section>
    `;
  }

  async afterRender() {
    document.getElementById("logoutButton").addEventListener("click", () => {
      this.presenter.handleLogout();
    });
  }

  redirectToLogin() {
    window.location.hash = "#/";
  }
}

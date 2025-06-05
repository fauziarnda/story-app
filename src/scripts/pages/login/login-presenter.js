import AuthModel from "../../../scripts/api/auth.js";

export default class LoginPresenter {
  constructor(view) {
    this.view = view;
  }

  async handleLogin(email, password) {
    try {
      this.view.showLoading(true);

      const loginResult = await AuthModel.login({ email, password });

      this.view.showLoading(false);
      this.view.showSuccess(
        "Login berhasil, selamat datang " + loginResult.name
      );
      this.view.redirectToHome();
    } catch (error) {
      this.view.showLoading(false);
      this.view.showError(error.message);
    }
  }
}

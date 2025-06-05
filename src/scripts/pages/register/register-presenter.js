import AuthModel from "../../../scripts/api/auth.js";

export default class RegisterPresenter {
  constructor(view) {
    this.view = view;
  }

  async handleRegister(name, email, password) {
    try {
      this.view.showLoading(true);

      const message = await AuthModel.register({ name, email, password });

      this.view.showLoading(false);
      this.view.showSuccess(message);
      this.view.redirectToLogin();
    } catch (error) {
      this.view.showLoading(false);
      this.view.showError(error.message);
    }
  }
}

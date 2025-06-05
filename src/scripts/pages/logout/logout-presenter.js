import AuthModel from "../../../scripts/api/auth.js";

export default class LogoutPresenter {
  constructor(view) {
    this.view = view;
  }

  handleLogout() {
    AuthModel.logout();
    this.view.redirectToLogin();
  }
}

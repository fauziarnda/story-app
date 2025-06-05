export default class LandingPage {
  async render() {
    return `
      <section class="landing">
        <h1>Selamat Datang di Aplikasi Cerita</h1>
        <p>Bagikan dan lihat cerita dari pengguna lainnya!</p>
        <div class="buttons">
          <a href="#/login"><button>Login</button></a>
          <a href="#/register"><button>Daftar</button></a>
        </div>
      </section>
    `;
  }

  async afterRender() {}
}

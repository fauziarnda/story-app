export default class AboutPage {
  async render() {
    return `
      <h1 class="content-title">About Page</h1>
      <p>Ini adalah halaman about.</p>
      <p>Mari kita kembali ke halaman utama <a href="/">Home</a>!</p>
    `;
  }

  async afterRender() {}
}

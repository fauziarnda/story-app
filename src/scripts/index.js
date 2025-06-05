import App from './app.js';
import '../styles/styles.css';
import './pages/addStory/add-story.css';
import { registerServiceWorker } from './utils/index.js';

function updateNavbarVisibility() {
  const navbar = document.getElementById('navbar');
  const token = localStorage.getItem('token');

  if (!token) {
    navbar.style.display = 'none';
    navbar.setAttribute('aria-hidden', 'true');
  } else {
    navbar.style.display = 'flex';
    navbar.removeAttribute('aria-hidden');
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  updateNavbarVisibility();

  const content = document.querySelector('#content');
  const app = new App({ content });
  await app.renderPage();

  await registerServiceWorker();

  window.addEventListener('hashchange', async () => {
    console.log('Hash changed to:', location.hash);
    await app.renderPage();
    updateNavbarVisibility();
  });
});

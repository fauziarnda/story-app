import { getActiveRoute } from './routes/url-parser.js';
import routes from './routes/routes.js';
import { generateSubscribeButtonTemplate } from '../template/index.js';
import { subscribe, unsubscribe } from './utils/notification-helper.js';
import { registerServiceWorker } from './utils/index.js';

export default class App {
  #content;
  #onAuthChange;

  constructor({ content, onAuthChange }) {
    this.#content = content;
    this.#onAuthChange = onAuthChange;
  }

  async #setupPushNotification() {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    const isSubscribed = Boolean(subscription);

    const pushNotificationTools = document.getElementById(
      'push-notification-tools'
    );
    pushNotificationTools.innerHTML =
      generateSubscribeButtonTemplate(isSubscribed);

    const subscribeButton = document.getElementById('subscribe-button');
    subscribeButton.addEventListener('click', async () => {
      if (isSubscribed) {
        await unsubscribe();
      } else {
        await subscribe();
      }

      // Refresh tampilan tombol setelah aksi
      await this.#setupPushNotification();
    });

    document
      .getElementById('trigger-push')
      .addEventListener('click', async () => {
        const registration = await navigator.serviceWorker.ready;
        registration.active.postMessage('trigger-push');
      });
  }

  async renderPage() {
    const routeName = getActiveRoute();

    if (routeName === '/' && localStorage.getItem('token')) {
      window.location.hash = '#/home';
      return;
    }

    const route = routes[routeName];
    const page = route();

    if (document.startViewTransition) {
      await document.startViewTransition(async () => {
        this.#content.innerHTML = await page.render();
        await page.afterRender?.();
      });
    } else {
      this.#content.innerHTML = await page.render();
      await page.afterRender?.();
    }

    console.log(
      '[App] Memanggil setupPushNotification dan registerServiceWorker'
    );
    await this.#setupPushNotification();

    // await registerServiceWorker();

    if (typeof this.#onAuthChange === 'function') {
      this.#onAuthChange();
    }
  }
}

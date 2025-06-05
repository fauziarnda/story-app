export function generateSubscribeButtonTemplate(isSubscribed) {
  return `
    <button id="subscribe-button" style="padding: 6px 12px; cursor: pointer;">
      ${isSubscribed ? 'Unsubscribe' : 'Subscribe'}
    </button>
    <button id="trigger-push" style="padding: 6px 12px; cursor: pointer; margin-left: 10px;">
      Simulasikan Notifikasi
    </button>
  `;
}

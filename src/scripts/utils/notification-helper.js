const VAPID_PUBLIC_KEY =
  'BCCs2eonMI-6H2ctvFaWg-UYdDv387Vno_bzUzALpB442r2lCnsHmtrx8biyPi_E-1fSGABK_Qs_GlvPoJJqxbk';

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}

export async function subscribe() {
  const permission = await Notification.requestPermission();

  if (permission !== 'granted') {
    alert('Izin notifikasi tidak diberikan.');
    return;
  }

  const registration = await navigator.serviceWorker.ready;
  console.log('SW ready:', registration);

  const pushSubscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
  });

  const token = localStorage.getItem('token'); // atau dari state auth

  const response = await fetch(
    'https://story-api.dicoding.dev/v1/notifications/subscribe',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        endpoint: pushSubscription.endpoint,
        keys: {
          p256dh: pushSubscription.getKey('p256dh')
            ? btoa(
                String.fromCharCode(
                  ...new Uint8Array(pushSubscription.getKey('p256dh'))
                )
              )
            : null,
          auth: pushSubscription.getKey('auth')
            ? btoa(
                String.fromCharCode(
                  ...new Uint8Array(pushSubscription.getKey('auth'))
                )
              )
            : null,
        },
      }),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    console.error('Gagal subscribe:', result.message);
    alert('Gagal berlangganan notifikasi.');
    return;
  }

  console.log('Berhasil berlangganan push notification:', result);
  alert('Berhasil langganan notifikasi!');
}

export async function unsubscribe() {
  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.getSubscription();

  if (subscription) {
    const isUnsubscribed = await subscription.unsubscribe();
    if (isUnsubscribed) {
      console.log('Berhasil unsubscribe dari notifikasi.');

      const token = localStorage.getItem('token');
      await fetch('https://story-api.dicoding.dev/v1/notifications/subscribe', {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ endpoint: subscription.endpoint }),
      });

      alert('Berhasil berhenti langganan notifikasi.');
    } else {
      alert('Gagal berhenti langganan notifikasi.');
    }
  } else {
    alert('Tidak ada langganan notifikasi yang aktif.');
  }
}

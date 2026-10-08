// sw.js only exists in builds (integrations/service-worker.ts). Updates never reload the page,
// so a roll in progress is never lost.
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    const base = import.meta.env.BASE_URL;
    navigator.serviceWorker.register(`${base}sw.js`).catch((error: unknown) => {
      console.error('Service worker registration failed', error);
    });
  });
}

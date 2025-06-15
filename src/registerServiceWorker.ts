
export function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/service-worker.js')
        .then(reg => {
          // Service worker registered
        })
        .catch(err => {
          // Silently ignore error
        });
    });
  }
}

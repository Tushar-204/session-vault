// Relays "Restore All Tabs" requests from the SessionVault web app to the background
// service worker, which opens each URL via chrome.tabs.create (bypasses popup blockers).
window.addEventListener('message', (event) => {
  if (event.source !== window) return;
  const msg = event.data;
  if (msg && msg.type === 'SV_RESTORE_TABS' && Array.isArray(msg.urls)) {
    chrome.runtime.sendMessage({ type: 'SV_RESTORE_TABS', urls: msg.urls }, () => {
      window.postMessage({ type: 'SV_RESTORE_ACK' }, '*');
    });
  }
});

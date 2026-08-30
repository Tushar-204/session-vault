// Relays "Restore All Tabs" requests from the SessionVault web app to the background
// service worker, which opens each URL via chrome.tabs.create (bypasses popup blockers).
// ACK is sent immediately so the web app's fallback never fires.
console.log('[SessionVault] restore bridge ready');
window.addEventListener('message', (event) => {
  const msg = event.data;
  if (msg && msg.type === 'SV_RESTORE_TABS' && Array.isArray(msg.urls)) {
    window.postMessage({ type: 'SV_RESTORE_ACK' }, '*');
    chrome.runtime.sendMessage({ type: 'SV_RESTORE_TABS', urls: msg.urls });
  }
});

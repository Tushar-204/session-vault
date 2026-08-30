import toast from 'react-hot-toast';

// Opens every tab URL. Prefers the Chrome extension (chrome.tabs.create opens all
// tabs without the browser's popup-blocker). Falls back to window.open, which may
// only open the first tab if the user hasn't allowed pop-ups for this site.
export const restoreTabs = (tabs) => {
  const urls = (tabs || []).map((t) => t.url).filter(Boolean);
  if (urls.length === 0) {
    toast.error('No tabs to restore.');
    return;
  }

  let handled = false;
  const onAck = (e) => {
    if (e.data && e.data.type === 'SV_RESTORE_ACK') handled = true;
  };
  window.addEventListener('message', onAck);
  window.postMessage({ type: 'SV_RESTORE_TABS', urls }, '*');

  setTimeout(() => {
    window.removeEventListener('message', onAck);
    if (!handled) {
      // Extension bridge not present — popup blockers would only allow the first tab,
      // so open just that one and tell the user to install the extension for the rest.
      if (urls[0]) window.open(urls[0], '_blank');
      toast.error('Install the SessionVault extension to restore all tabs at once.');
    } else {
      toast.success(`Restoring ${urls.length} tab${urls.length > 1 ? 's' : ''}...`);
    }
  }, 500);
};

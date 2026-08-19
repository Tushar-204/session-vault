/**
 * SessionVault Chrome Extension Background Service Worker (Manifest V3)
 */

let API_BASE = 'http://localhost:5000/api/v1';
let CLIENT_URL = 'http://localhost:5173';

async function loadConfig() {
  const stored = await chrome.storage.local.get(['apiUrl', 'clientUrl']);
  if (stored.apiUrl) API_BASE = stored.apiUrl;
  if (stored.clientUrl) CLIENT_URL = stored.clientUrl;
}

// Setup Context Menus on Installation
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'save-current-window',
    title: 'Vault: Save Current Window Session',
    contexts: ['action', 'page'],
  });

  chrome.contextMenus.create({
    id: 'open-sessionvault-dashboard',
    title: 'Open SessionVault Dashboard',
    contexts: ['action', 'page'],
  });
});

// Handle Context Menu Clicks
  chrome.contextMenus.onClicked.addListener(async (info, tab) => {
    if (info.menuItemId === 'open-sessionvault-dashboard') {
      await loadConfig();
      chrome.tabs.create({ url: CLIENT_URL });
    } else if (info.menuItemId === 'save-current-window') {
      await saveCurrentWindowSession();
    }
  });

  // Open many tabs at once (used by the web app's "Restore All" via the content script).
  // chrome.tabs.create is not subject to the browser popup-blocker, so all tabs open.
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message && message.type === 'SV_RESTORE_TABS' && Array.isArray(message.urls)) {
      message.urls.forEach((url) => {
        if (url) chrome.tabs.create({ url });
      });
      sendResponse({ ok: true });
    }
  });

// Function to capture current window tabs and send to SessionVault API
async function saveCurrentWindowSession() {
  try {
    await loadConfig();
    const tabs = await chrome.tabs.query({ currentWindow: true });
    const authData = await chrome.storage.local.get(['token']);

    if (!authData.token) {
      chrome.notifications.create({
        type: 'basic',
        iconUrl: '../icons/icon48.png',
        title: 'SessionVault Authentication Needed',
        message: 'Please log in to your SessionVault account via the extension popup.',
      });
      return;
    }

    const payload = {
      title: `Quick Save - ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`,
      description: 'Captured automatically via Chrome Extension Context Menu',
      color: '#3b82f6',
      tabs: tabs.map((t, idx) => ({
        title: t.title,
        url: t.url,
        favIconUrl: t.favIconUrl || '',
        pinned: t.pinned,
        index: idx,
      })),
    };

    const response = await fetch(`${API_BASE}/workspaces`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authData.token}`,
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      chrome.notifications.create({
        type: 'basic',
        iconUrl: '../icons/icon48.png',
        title: 'Session Vaulted!',
        message: `Successfully saved ${tabs.length} tabs to your SessionVault workspace.`,
      });
    }
  } catch (error) {
    console.error('Failed to save session:', error);
  }
}

const API_BASE_INPUT = document.getElementById('api-url');
const SAVE_INTERVAL_INPUT = document.getElementById('save-interval');
const AUTO_SAVE_CHECK = document.getElementById('auto-save');
const SAVE_BTN = document.getElementById('btn-save-options');
const STATUS_MSG = document.getElementById('status-msg');

document.addEventListener('DOMContentLoaded', async () => {
  const stored = await chrome.storage.local.get(['apiUrl', 'saveInterval', 'autoSave']);

  if (stored.apiUrl) API_BASE_INPUT.value = stored.apiUrl;
  if (stored.saveInterval) SAVE_INTERVAL_INPUT.value = stored.saveInterval;
  if (stored.autoSave !== undefined) AUTO_SAVE_CHECK.checked = stored.autoSave;
});

SAVE_BTN.addEventListener('click', async () => {
  const apiUrl = API_BASE_INPUT.value.trim();
  const saveInterval = parseInt(SAVE_INTERVAL_INPUT.value, 10) || 5;
  const autoSave = AUTO_SAVE_CHECK.checked;

  if (!apiUrl) {
    STATUS_MSG.textContent = 'Please enter a valid API URL.';
    STATUS_MSG.style.color = '#f87171';
    return;
  }

  await chrome.storage.local.set({ apiUrl, saveInterval, autoSave });
  STATUS_MSG.textContent = 'Settings saved successfully!';
  STATUS_MSG.style.color = '#4ade80';
  setTimeout(() => { STATUS_MSG.textContent = ''; }, 3000);
});
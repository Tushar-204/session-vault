const API_BASE = 'http://localhost:5000/api/v1';

document.addEventListener('DOMContentLoaded', async () => {
  const authView = document.getElementById('auth-view');
  const mainView = document.getElementById('main-view');
  const tabCounter = document.getElementById('tab-counter');
  const previewCount = document.getElementById('preview-count');
  const tabList = document.getElementById('tab-list');
  const workspaceTitle = document.getElementById('workspace-title');
  const workspaceTags = document.getElementById('workspace-tags');
  const btnSave = document.getElementById('btn-save-session');
  const btnDashboard = document.getElementById('btn-open-dashboard');
  const btnLogin = document.getElementById('btn-login');
  const statusMsg = document.getElementById('status-msg');

  // Check stored auth token
  const storage = await chrome.storage.local.get(['token']);
  const token = storage.token;

  if (!token) {
    authView.classList.remove('hidden');
    mainView.classList.add('hidden');
  } else {
    authView.classList.add('hidden');
    mainView.classList.remove('hidden');
  }

  // Query active window open tabs
  const tabs = await chrome.tabs.query({ currentWindow: true });
  tabCounter.textContent = `${tabs.length} Tabs`;
  previewCount.textContent = tabs.length;

  workspaceTitle.value = `Workspace Session - ${new Date().toLocaleDateString()}`;

  // Render preview tabs list
  tabList.innerHTML = '';
  tabs.forEach((tab) => {
    const li = document.createElement('li');
    li.className = 'tab-item';
    const icon = tab.favIconUrl || 'https://www.google.com/s2/favicons?domain=google.com&sz=64';
    li.innerHTML = `
      <img src="${icon}" class="tab-favicon" onError="this.src='https://www.google.com/s2/favicons?domain=google.com&sz=64'" />
      <span>${tab.title || tab.url}</span>
    `;
    tabList.appendChild(li);
  });

  // Handle Login
  btnLogin.addEventListener('click', async () => {
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const authError = document.getElementById('auth-error');

    if (!email || !password) {
      authError.textContent = 'Please enter email and password.';
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (res.ok && data.data?.accessToken) {
        await chrome.storage.local.set({ token: data.data.accessToken });
        authView.classList.add('hidden');
        mainView.classList.remove('hidden');
      } else {
        authError.textContent = data.message || 'Login failed.';
      }
    } catch (err) {
      authError.textContent = 'Unable to connect to SessionVault server.';
    }
  });

  // Save Session
  btnSave.addEventListener('click', async () => {
    btnSave.disabled = true;
    btnSave.textContent = 'Vaulting...';

    const tagsArray = workspaceTags.value
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const payload = {
      title: workspaceTitle.value.trim() || 'Untitled Workspace',
      description: `Saved from Chrome Extension on ${new Date().toLocaleString()}`,
      tags: tagsArray,
      color: '#3b82f6',
      tabs: tabs.map((t, idx) => ({
        title: t.title || 'Untitled Tab',
        url: t.url,
        favIconUrl: t.favIconUrl || '',
        pinned: t.pinned,
        index: idx,
      })),
    };

    try {
      const currentToken = (await chrome.storage.local.get(['token'])).token;
      const res = await fetch(`${API_BASE}/workspaces`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${currentToken}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        statusMsg.textContent = '✨ Session saved successfully!';
        setTimeout(() => window.close(), 1200);
      } else {
        statusMsg.textContent = data.message || 'Error saving session.';
        btnSave.disabled = false;
        btnSave.textContent = 'Save Session';
      }
    } catch (err) {
      statusMsg.textContent = 'Connection error.';
      btnSave.disabled = false;
      btnSave.textContent = 'Save Session';
    }
  });

  // Open Dashboard
  btnDashboard.addEventListener('click', () => {
    chrome.tabs.create({ url: 'http://localhost:5173' });
  });
});

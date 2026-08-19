// Single source of truth for backend URLs in the browser app.
// Override with VITE_API_URL at build time (e.g. https://api.sessionvault.com/api/v1).
export const API_URL = import.meta.env.VITE_API_URL || '/api/v1';

// Socket.io needs the server origin (strip the /api/v1 suffix).
export const SOCKET_URL = API_URL.replace(/\/api\/v1$/, '') || window.location.origin;

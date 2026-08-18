# SessionVault

Industrial-grade Browser Workspace Manager for Chrome. Save, organize, restore, search, favorite, share, and sync your browser sessions across devices.

## Features

- **Save & Restore Sessions** — Capture open browser tabs into named workspaces
- **Folder Organization** — Group workspaces into folders
- **Full-Text Search** — Search across workspaces, tabs, and folders
- **Favorites** — Pin important sessions for quick access
- **Share Sessions** — Generate secure public share links
- **Export / Import** — Backup and migrate sessions as JSON
- **Auto-Save** — Chrome Extension auto-detects tab changes
- **Chrome Extension** — 1-click save from context menu or popup
- **Real-Time Sync** — WebSocket-powered live updates
- **Dark Mode** — Beautiful glassmorphism UI with light/dark themes
- **Role-Based Auth** — JWT + Refresh Token with HttpOnly cookies

## Tech Stack

| Tier | Technology |
|:---|:---|
| Frontend | React 18, Vite, JavaScript, Tailwind CSS |
| Backend | Node.js, Express, MongoDB, Mongoose |
| Realtime | Socket.io |
| Auth | JWT, Refresh Tokens, Bcrypt, HttpOnly Cookies |
| Extension | Manifest V3 (Chrome Tabs API) |
| Security | Helmet, Rate Limiting, CORS, Input Validation |

## Project Structure

```
sessionvault/
├── client/           # React Frontend (Vite + Tailwind)
├── server/           # Express Backend (REST API + WebSockets)
├── extension/        # Chrome Extension (Manifest V3)
├── docs/             # Documentation
└── docker-compose.yml
```

## Quick Start

### Prerequisites

- Node.js 20+
- MongoDB 7.x
- Chrome browser (for extension)

### 1. Install Dependencies

```bash
# Server
cd server && npm install

# Client
cd client && npm install
```

### 2. Environment Setup

```bash
# Copy .env.example to .env in server directory
cp server/.env.example server/.env
```

Edit `server/.env` with your MongoDB URI, JWT secrets, and SMTP credentials.

### 3. Start the Application

```bash
# Terminal 1: Start MongoDB
mongod

# Terminal 2: Start Server
cd server && npm run dev

# Terminal 3: Start Client
cd client && npm run dev
```

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000/api/v1`

### 4. Chrome Extension (Development)

1. Open Chrome → `chrome://extensions`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the `extension/` directory
5. The extension popup lets you save tabs, log in, and manage sessions

### Docker

```bash
docker-compose up -d
```

## API

see [API Documentation](docs/API.md)

## Security

- Passwords hashed with bcrypt (12 salt rounds)
- JWT access tokens (15 min) + refresh tokens (7 days)
- Refresh tokens stored in HttpOnly, SameSite cookies
- Rate limiting on all API endpoints
- Helmet security headers
- Input validation with Zod
- CORS restricted to client URL

## License

MIT
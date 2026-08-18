# SessionVault — Deployment Guide

## Prerequisites

- Docker and Docker Compose installed
- MongoDB Atlas account (or local MongoDB instance)
- Cloudinary account (optional, for favicon/image storage)
- SMTP credentials (optional, for email verification/password reset)

## Method 1: Docker Compose (Recommended)

### 1. Clone the repository

```bash
git clone <repo-url>
cd sessionvault
```

### 2. Environment Variables

Copy the example env file and fill in your values:

```bash
cp server/.env.example server/.env
```

Edit `server/.env`:

```env
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/sessionvault
JWT_ACCESS_SECRET=your_super_secret_key_here
JWT_REFRESH_SECRET=another_super_secret_key_here
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
EMAIL_FROM=no-reply@sessionvault.io
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 3. Deploy

```bash
docker-compose up -d
```

The application will be available at:

- Frontend: `http://localhost` (port 80 via nginx)
- Backend API: `http://localhost/api/v1/health`

### 4. Verify

```bash
curl http://localhost/api/v1/health
```

## Method 2: Manual Deployment

### Backend

```bash
cd server
npm install
npm run build
npm start
```

### Frontend

```bash
cd client
npm install
npm run build
```

Serve the `client/dist` folder using nginx or any static file server.

### Process Manager (Production)

Use PM2 for the Node.js backend:

```bash
npm install -g pm2
pm2 start src/server.js --name sessionvault-server
pm2 save
pm2 startup
```

## Production Recommendations

1. **MongoDB**: Use MongoDB Atlas for managed cloud database with automatic backups
2. **Reverse Proxy**: Use nginx or Caddy in front of Express for SSL termination
3. **SSL**: Always enable HTTPS in production. Use Let's Encrypt for free certificates
4. **Rate Limiting**: Adjust rate limits in `server/src/middleware/rateLimiter.middleware.js` based on expected traffic
5. **Environment**: Set `NODE_ENV=production` in all environments
6. **Secrets**: Use a secrets manager (AWS Secrets Manager, HashiCorp Vault) for production secrets
7. **Monitoring**: Integrate with a logging service (Datadog, Sentry) for error tracking
8. **CDN**: Serve static assets and favicons through a CDN

## Scaling

- **Horizontal Scaling**: Run multiple backend instances behind a load balancer
- **Database**: Ensure MongoDB is configured with replica sets for high availability
- **Caching**: Add Redis for session caching and rate limiting
- **WebSocket Stickiness**: If scaling Socket.io, configure sticky sessions in your load balancer

## CI/CD (GitHub Actions Example)

```yaml
name: Deploy SessionVault
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Deploy to Server
        run: |
          ssh user@server "cd /opt/sessionvault && git pull && docker-compose up -d"
```
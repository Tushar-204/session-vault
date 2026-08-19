import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import routes from './routes/index.js';
import { errorHandler } from './middleware/error.middleware.js';
import { apiLimiter } from './middleware/rateLimiter.middleware.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

// Security Headers
app.use(helmet());

// Cross-Origin Resource Sharing (CORS)
// Reflect the requesting origin so the web client and Chrome extension work from any
// deployed domain without needing CLIENT_URL kept in sync. Credentials (cookies) stay
// allowed because we echo the specific origin rather than '*'.
app.use(
  cors({
    origin: (origin, callback) => callback(null, origin || true),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// HTTP Request Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Request Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Rate Limiter
app.use('/api', apiLimiter);

// API Version 1 Routes
app.use('/api/v1', routes);

// Serve the built frontend (copied to server/public during deploy)
const publicDir = path.resolve(__dirname, '../public');
app.use(express.static(publicDir));

// SPA fallback — let the client router handle all other GET routes
app.get(/^(?!\/api\/).*/, (req, res) => {
  res.sendFile(path.join(publicDir, 'index.html'));
});

// Global Error Handling Middleware
app.use(errorHandler);

export default app;

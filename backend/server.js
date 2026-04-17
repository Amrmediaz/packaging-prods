import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.routes.js';
import usersRoutes from './routes/users.routes.js';
import roleRoutes from './routes/roles.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';
import mongoose from 'mongoose';

console.log('🔵 Server starting...');
const env = process.env.NODE_ENV || 'development';
// dotenv.config({ path: `.env.${env}` });
dotenv.config({ path: '/Users/macbook/Downloads/pacin/packin/.env.development' });


// Connect to database
connectDB();

const app = express();

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Security Middleware
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// Helmet - sets secure HTTP headers automatically


// Rate limiting - prevent brute force attacks
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,                  // max 100 requests per 15 min
  message: {
    success: false,
    message: 'Too many requests - please try again later',
  },
});

// Stricter limit for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,                   // max 10 login attempts
  message: {
    success: false,
    message: 'Too many login attempts - please try again later',
  },
});

app.use('/api', limiter);
app.use('/api/auth/login', authLimiter);

// CORS - only allow our frontend
app.use(cors({
  origin: '*',
  credentials: false,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));


app.use(helmet());
// Body parser with size limit
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Sanitize data - prevent MongoDB injection
app.use(mongoSanitize());

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Routes
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━

app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/dashboard', dashboardRoutes);
// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: '🚀 Server is running',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// Unknown routes
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: process.env.NODE_ENV === 'development'
      ? err.message
      : 'Internal Server Error',
  });
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Start Server
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const PORT = 3000;

// Adding '0.0.0.0' is the key for cloud deployments (AWS, DigitalOcean, etc.)
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server is globally accessible on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
});
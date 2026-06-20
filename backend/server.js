const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const crypto = require('crypto'); // ✅ FIX: ensure crypto is available
require('dotenv').config();

const authRoutes = require('./routes/auth.routes');
const registrationRoutes = require('./routes/registration.routes');
const adminRoutes = require('./routes/admin.routes');

const app = express();

/* ── Trust proxy (important for rate limit behind proxies) ── */
app.set('trust proxy', 1);

/* ── CORS ── */
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:4200',
  process.env.ADMIN_URL || 'http://localhost:4200',
  'https://akiira-tech.com',
  'https://akiiratech.onrender.com',
  'http://localhost:4200',
  'http://localhost:3000'
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) {
      return callback(null, true);
    }
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('❌ Blocked by CORS:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
}));

// Handle preflight requests
app.options('*', cors());

/* ── Body parser ── */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ── Rate limiting ── */
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

app.use('/api/', limiter);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
});

app.use('/api/auth/', authLimiter);

/* ── Routes ── */
app.use('/api/auth', authRoutes);
app.use('/api/registrations', registrationRoutes);
app.use('/api/admin', adminRoutes);

/* ── Health Check ── */
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

/* ── 404 Handler ── */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

/* ── Global Error Handler ── */
app.use((err, req, res, next) => {
  console.error('🔥 Error:', err);

  res.status(500).json({
    success: false,
    message: 'Internal server error',
  });
});

/* ── MongoDB Connection ── */
const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;

if (!mongoUri) {
  console.error('❌ MongoDB URI not found in .env file');
  process.exit(1);
}

mongoose.set('strictQuery', true);

mongoose
  .connect(mongoUri)
  .then(async () => {
    console.log('✅ MongoDB connected');

    // seed admin safely — must actually invoke the function, not just require it
    const seedAdmin = require('./utils/seedAdmin');
    await seedAdmin();

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });
// ===== Imports =====
// server.js
import express from 'express';
import http from 'http';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';

import { connectDB } from './config/db.js';
import { notFound, errorHandler } from './middleware/error.js';

// Routes
import authRoutes from './routes/authRoutes.js';
import workshopRoutes from './routes/workshopRoutes.js';
import bookingRoutes from './routes/bookingsRoutes.js';
import stripeRoutes from './routes/stripeRoutes.js';

// Socket
import { initSocket } from './socket.js';

// ===== Config =====
dotenv.config();
const app = express();

// ===== Middleware =====
// Handle Stripe raw body for webhook
app.use((req, res, next) => {
  if (req.originalUrl.startsWith('/api/stripe/webhook')) {
    return next();
  }
  express.json()(req, res, next);
});

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(morgan('dev'));
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));

// ===== Routes =====
app.get('/', (req, res) => res.send('API is running'));
app.use('/api/auth', authRoutes);
app.use('/api/workshops', workshopRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/stripe', stripeRoutes);

// ===== Error Handlers =====
app.use(notFound);
app.use(errorHandler);

// ===== Start Server =====
const startServer = async () => {
  try {
    await connectDB();

    const server = http.createServer(app);
    initSocket(server, process.env.CLIENT_URL);

    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error(`❌ Server error: ${error.message}`);
    process.exit(1);
  }
};

startServer();

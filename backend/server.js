/**
 * Express API Gateway & Backend Server Entry Point
 * High-Level Design (HLD) Microservice Architecture
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const db = require('./config/db');
const rateLimiter = require('./middleware/rateLimiter');
const errorHandler = require('./middleware/errorHandler');

// Route Modules
const authRoutes = require('./routes/authRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const consultationRoutes = require('./routes/consultationRoutes');
const prescriptionRoutes = require('./routes/prescriptionRoutes');
const adminRoutes = require('./routes/adminRoutes');
const hldRoutes = require('./routes/hldRoutes');

// Seed Runner
const { seedInitialData } = require('./seed/seedData');

const app = express();
const PORT = process.env.PORT || 5000;

// ==========================================
// 1. API GATEWAY GLOBAL MIDDLEWARE
// ==========================================
app.use(cors({
  origin: '*', // Allows frontend connections
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(morgan(':date[iso] | :method :url | Status: :status | :response-time ms'));
app.use(rateLimiter);

// Gateway Health Check & Service Registry
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ONLINE',
    gateway: 'Express API Gateway',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// ==========================================
// 2. CENTRALIZED API ROUTING LAYER
// ==========================================
app.use('/api/auth', authRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/consultations', consultationRoutes);
app.use('/api/prescriptions', prescriptionRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/hld', hldRoutes);

// ==========================================
// 3. 404 CATCH-ALL ROUTE
// ==========================================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'NotFound',
    message: `API endpoint '${req.originalUrl}' does not exist on this API Gateway.`,
    statusCode: 404
  });
});

// ==========================================
// 4. CENTRALIZED ERROR HANDLER
// ==========================================
app.use(errorHandler);

// ==========================================
// 5. SERVER BOOTSTRAP
// ==========================================
async function startServer() {
  try {
    // Connect to database (live MongoDB or in-memory adapter fallback)
    await db.connect();

    // Populate initial seed data (doctors, demo accounts)
    await seedInitialData();

    app.listen(PORT, () => {
      console.log('================================================================');
      console.log(`🚀 HEALTHCARE API GATEWAY RUNNING ON PORT ${PORT}`);
      console.log(`🌐 Base URL: http://localhost:${PORT}`);
      console.log(`📡 Architecture Endpoints: http://localhost:${PORT}/api/hld/architecture`);
      console.log('================================================================');
    });
  } catch (err) {
    console.error('Failed to start API Gateway server:', err);
    process.exit(1);
  }
}

startServer();

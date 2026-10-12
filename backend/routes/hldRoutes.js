const express = require('express');
const router = express.Router();
const db = require('../config/db');
const cache = require('../config/redis');
const queue = require('../config/queue');

// GET /api/hld/architecture (Public demonstration endpoint for HLD Architecture Page)
router.get('/architecture', async (req, res) => {
  const cacheStatus = cache.getStatus();
  const queueStatus = queue.getStatus();
  const dbStatus = db.getStatus();

  const totalCacheRequests = cacheStatus.hits + cacheStatus.misses;
  const hitRate = totalCacheRequests > 0 ? ((cacheStatus.hits / totalCacheRequests) * 100).toFixed(1) : 0;

  res.status(200).json({
    success: true,
    systemName: 'Online Doctor Appointment & Digital Prescription Platform',
    architecture: 'High-Level Design (HLD) Microservice-Modular Architecture',
    components: {
      gateway: {
        name: 'Centralized Express API Gateway',
        port: process.env.PORT || 5000,
        responsibilities: [
          'Inbound Traffic Termination',
          'JWT Authentication Verification',
          'Role-Based Authorization (RBAC)',
          'Token-Bucket Rate Limiting (120 req/min)',
          'Path Routing to Specialized Microservices',
          'Global Error Interception'
        ]
      },
      services: [
        { name: 'Authentication Service', prefix: '/api/auth', status: 'ONLINE', purpose: 'Credentials, JWT issuance, password hashing' },
        { name: 'Doctor Service', prefix: '/api/doctors', status: 'ONLINE', purpose: 'Doctor discovery, availability calculation, Redis cache' },
        { name: 'Appointment Service', prefix: '/api/appointments', status: 'ONLINE', purpose: 'Atomic slot reservation, concurrency control' },
        { name: 'Consultation Service', prefix: '/api/consultations', status: 'ONLINE', purpose: 'Clinical records, diagnosis, status updates' },
        { name: 'Prescription Service', prefix: '/api/prescriptions', status: 'ONLINE', purpose: 'Digital Rx generation, medicine dosages' },
        { name: 'Notification Service', prefix: '/api/notifications', status: 'ONLINE', purpose: 'Asynchronous event queuing & alert delivery' },
        { name: 'Admin Service', prefix: '/api/admin', status: 'ONLINE', purpose: 'Platform telemetry, user moderation, analytics' }
      ],
      database: {
        ...dbStatus,
        details: 'MongoDB Document Store with B-Tree indexes on email, specialization, and compound (doctorId, date, status).'
      },
      caching: {
        ...cacheStatus,
        hitRate: `${hitRate}%`,
        details: 'Redis LRU In-Memory Cache with TTL (300s) and automatic cache invalidation on availability updates.'
      },
      messaging: {
        ...queueStatus,
        details: 'Asynchronous event-driven queue for booking confirmations, reminders, and prescription notifications.'
      }
    },
    concurrencyMechanism: {
      strategy: 'Atomic Slot Reservation Lock',
      description: 'Acquires a mutex lock per (doctorId, date, timeSlot) during appointment booking to prevent double-booking under concurrent load.'
    }
  });
});

module.exports = router;

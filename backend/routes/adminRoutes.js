const express = require('express');
const router = express.Router();
const { User, Doctor, Appointment, Prescription } = require('../models');
const { protect, authorize } = require('../middleware/authMiddleware');
const queue = require('../config/queue');
const cache = require('../config/redis');
const db = require('../config/db');

// GET /api/admin/dashboard (Admin only)
router.get('/dashboard', protect, authorize('admin'), async (req, res, next) => {
  try {
    const totalPatients = await User.countDocuments({ role: 'patient' });
    const totalDoctors = await Doctor.countDocuments();
    const totalAppointments = await Appointment.countDocuments();
    const completedAppointments = await Appointment.countDocuments({ status: 'COMPLETED' });
    const cancelledAppointments = await Appointment.countDocuments({ status: 'CANCELLED' });
    const confirmedAppointments = await Appointment.countDocuments({ status: 'CONFIRMED' });
    const totalPrescriptions = await Prescription.countDocuments();

    // Financial revenue estimation
    const allAppointments = await Appointment.find({});
    const totalRevenue = allAppointments
      .filter(a => a.status === 'COMPLETED' || a.status === 'CONFIRMED')
      .reduce((sum, a) => sum + (a.consultationFee || 50), 0);

    // Recent activity
    const recentAppointments = allAppointments.slice(0, 10);
    const recentUsers = (await User.find({})).slice(0, 10);

    res.status(200).json({
      success: true,
      data: {
        stats: {
          totalPatients,
          totalDoctors,
          totalAppointments,
          confirmedAppointments,
          completedAppointments,
          cancelledAppointments,
          totalPrescriptions,
          totalRevenue
        },
        systemStatus: {
          database: db.getStatus(),
          cache: cache.getStatus(),
          queue: queue.getStatus()
        },
        recentAppointments,
        recentUsers
      }
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/admin/appointments (Admin only)
router.get('/appointments', protect, authorize('admin'), async (req, res, next) => {
  try {
    const appointments = await Appointment.find({});
    res.status(200).json({
      success: true,
      data: appointments
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

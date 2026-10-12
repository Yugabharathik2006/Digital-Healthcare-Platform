const express = require('express');
const router = express.Router();
const appointmentService = require('../services/appointmentService');
const { protect, authorize } = require('../middleware/authMiddleware');

// POST /api/appointments (Book appointment)
router.post('/', protect, async (req, res, next) => {
  try {
    const appointment = await appointmentService.bookAppointment(req.user, req.body);
    res.status(201).json({
      success: true,
      message: 'Appointment successfully booked and confirmed',
      data: appointment
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/appointments/my (List appointments for authenticated user)
router.get('/my', protect, async (req, res, next) => {
  try {
    const appointments = await appointmentService.getMyAppointments(req.user);
    res.status(200).json({
      success: true,
      data: appointments
    });
  } catch (err) {
    next(err);
  }
});

// PATCH /api/appointments/:id/cancel
router.patch('/:id/cancel', protect, async (req, res, next) => {
  try {
    const { reason } = req.body;
    const cancelled = await appointmentService.cancelAppointment(req.params.id, req.user, reason);
    res.status(200).json({
      success: true,
      message: 'Appointment cancelled successfully',
      data: cancelled
    });
  } catch (err) {
    next(err);
  }
});

// PATCH /api/appointments/:id/complete (Doctor or Admin)
router.patch('/:id/complete', protect, authorize('doctor', 'admin'), async (req, res, next) => {
  try {
    const completed = await appointmentService.completeAppointment(req.params.id, req.user);
    res.status(200).json({
      success: true,
      message: 'Appointment marked as completed',
      data: completed
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

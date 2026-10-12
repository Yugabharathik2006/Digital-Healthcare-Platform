const express = require('express');
const router = express.Router();
const doctorService = require('../services/doctorService');
const { protect, authorize } = require('../middleware/authMiddleware');

// GET /api/doctors (search & filter with Redis caching)
router.get('/', async (req, res, next) => {
  try {
    const data = await doctorService.getDoctors(req.query);
    res.status(200).json({
      success: true,
      data
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/doctors/:id
router.get('/:id', async (req, res, next) => {
  try {
    const doctor = await doctorService.getDoctorById(req.params.id);
    res.status(200).json({
      success: true,
      data: doctor
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/doctors/:id/availability?date=YYYY-MM-DD
router.get('/:id/availability', async (req, res, next) => {
  try {
    const date = req.query.date || new Date().toISOString().split('T')[0];
    const availability = await doctorService.getDoctorAvailability(req.params.id, date);
    res.status(200).json({
      success: true,
      data: availability
    });
  } catch (err) {
    next(err);
  }
});

// PUT /api/doctors/availability (Doctor role only)
router.put('/availability', protect, authorize('doctor', 'admin'), async (req, res, next) => {
  try {
    const result = await doctorService.updateAvailability(req.user._id, req.body);
    res.status(200).json({
      success: true,
      message: 'Doctor availability and profile updated successfully. Cache invalidated.',
      data: result
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const consultationService = require('../services/consultationService');
const { protect, authorize } = require('../middleware/authMiddleware');

// POST /api/consultations (Doctor only)
router.post('/', protect, authorize('doctor', 'admin'), async (req, res, next) => {
  try {
    const consultation = await consultationService.recordConsultation(req.user, req.body);
    res.status(201).json({
      success: true,
      message: 'Consultation recorded and appointment completed successfully',
      data: consultation
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const prescriptionService = require('../services/prescriptionService');
const { protect, authorize } = require('../middleware/authMiddleware');

// POST /api/prescriptions (Doctor only)
router.post('/', protect, authorize('doctor', 'admin'), async (req, res, next) => {
  try {
    const prescription = await prescriptionService.createPrescription(req.user, req.body);
    res.status(201).json({
      success: true,
      message: 'Digital prescription issued and published successfully',
      data: prescription
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/prescriptions/my (Authenticated user's prescriptions)
router.get('/my', protect, async (req, res, next) => {
  try {
    const prescriptions = await prescriptionService.getMyPrescriptions(req.user);
    res.status(200).json({
      success: true,
      data: prescriptions
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/prescriptions/:id
router.get('/:id', protect, async (req, res, next) => {
  try {
    const prescription = await prescriptionService.getPrescriptionById(req.params.id, req.user);
    res.status(200).json({
      success: true,
      data: prescription
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

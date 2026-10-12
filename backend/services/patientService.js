/**
 * Patient Service Module
 * Handles patient profile management and medical history.
 */

const { User, Appointment, Prescription } = require('../models');

const patientService = {
  async getProfile(patientId) {
    const user = await User.findById(patientId);
    if (!user) {
      const err = new Error('Patient profile not found');
      err.statusCode = 404;
      throw err;
    }

    const appointmentsCount = await Appointment.countDocuments({ patientId });
    const prescriptionsCount = (await Prescription.find({ patientId })).length;

    const { password, ...safeData } = user;
    return {
      ...safeData,
      stats: {
        totalAppointments: appointmentsCount,
        totalPrescriptions: prescriptionsCount
      }
    };
  }
};

module.exports = patientService;

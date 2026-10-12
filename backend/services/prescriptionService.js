/**
 * Prescription Service Module
 * Handles issuing digital prescriptions by authorized doctors and secure retrieval by patients.
 */

const { Prescription, Appointment, Doctor } = require('../models');
const queue = require('../config/queue');

const prescriptionService = {
  /**
   * Create and publish a digital prescription
   */
  async createPrescription(doctorUser, data) {
    const { appointmentId, consultationId, diagnosis, medicines, advice, followUpDate } = data;

    if (!appointmentId || !diagnosis || !medicines || !Array.isArray(medicines) || medicines.length === 0) {
      const err = new Error('Appointment ID, diagnosis, and at least one medicine entry are required');
      err.statusCode = 400;
      throw err;
    }

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      const err = new Error(`Appointment with ID ${appointmentId} not found`);
      err.statusCode = 404;
      throw err;
    }

    // Verify requesting user is the assigned doctor
    const doctorRecord = await Doctor.findOne({ userId: doctorUser._id });
    if (!doctorRecord || String(appointment.doctorId) !== String(doctorRecord._id)) {
      const err = new Error('Forbidden: Only the assigned doctor is authorized to create a prescription for this appointment.');
      err.statusCode = 403;
      throw err;
    }

    const newPrescription = await Prescription.create({
      consultationId: consultationId || '',
      appointmentId: appointment._id,
      patientId: appointment.patientId,
      patientName: appointment.patientName,
      doctorId: doctorRecord._id,
      doctorName: doctorRecord.name,
      doctorSpecialization: doctorRecord.specialization,
      diagnosis,
      medicines,
      advice: advice || 'Follow prescribed dosage and dietary recommendations.',
      followUpDate: followUpDate || 'After 7 days'
    });

    // Mark appointment as COMPLETED if not already
    if (appointment.status !== 'COMPLETED') {
      await Appointment.findByIdAndUpdate(appointment._id, {
        status: 'COMPLETED',
        completedAt: new Date().toISOString()
      });
    }

    // Queue digital prescription alert to patient
    await queue.publish('PRESCRIPTION_ISSUED', {
      prescriptionId: newPrescription._id,
      prescriptionNumber: newPrescription.prescriptionNumber,
      patientName: appointment.patientName,
      patientEmail: appointment.patientEmail,
      doctorName: doctorRecord.name,
      diagnosis
    });

    return newPrescription;
  },

  /**
   * Get digital prescriptions for the current authenticated user
   */
  async getMyPrescriptions(user) {
    if (user.role === 'admin') {
      return await Prescription.find({});
    }

    if (user.role === 'doctor') {
      const doctor = await Doctor.findOne({ userId: user._id });
      if (!doctor) return [];
      return await Prescription.find({ doctorId: doctor._id });
    }

    // Patient view
    return await Prescription.find({ patientId: user._id });
  },

  /**
   * Get prescription by ID with strict ownership validation
   */
  async getPrescriptionById(id, user) {
    const rx = await Prescription.findById(id);
    if (!rx) {
      const err = new Error(`Prescription with ID ${id} not found`);
      err.statusCode = 404;
      throw err;
    }

    // Authorization check
    const isPatientOwner = String(rx.patientId) === String(user._id);
    const doctorRecord = user.role === 'doctor' ? await Doctor.findOne({ userId: user._id }) : null;
    const isIssuingDoctor = doctorRecord && String(rx.doctorId) === String(doctorRecord._id);
    const isAdmin = user.role === 'admin';

    if (!isPatientOwner && !isIssuingDoctor && !isAdmin) {
      const err = new Error('Forbidden: You are not authorized to access this prescription record.');
      err.statusCode = 403;
      throw err;
    }

    return rx;
  }
};

module.exports = prescriptionService;

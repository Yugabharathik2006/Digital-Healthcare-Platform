/**
 * Consultation Service Module
 * Handles recording doctor-patient clinical consultations, diagnosis, vitals,
 * and automatic transition of appointment status to COMPLETED.
 */

const { Consultation, Appointment, Doctor } = require('../models');
const queue = require('../config/queue');

const consultationService = {
  async recordConsultation(doctorUser, data) {
    const { appointmentId, symptoms, diagnosis, vitalSigns, clinicalNotes } = data;

    if (!appointmentId || !diagnosis) {
      const err = new Error('Appointment ID and diagnosis are required');
      err.statusCode = 400;
      throw err;
    }

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      const err = new Error(`Appointment with ID ${appointmentId} not found`);
      err.statusCode = 404;
      throw err;
    }

    // Verify doctor identity
    const doctorRecord = await Doctor.findOne({ userId: doctorUser._id });
    if (!doctorRecord || String(appointment.doctorId) !== String(doctorRecord._id)) {
      const err = new Error('Forbidden: Only the assigned doctor can record this consultation.');
      err.statusCode = 403;
      throw err;
    }

    // Create consultation record
    const consultation = await Consultation.create({
      appointmentId,
      patientId: appointment.patientId,
      doctorId: doctorRecord._id,
      symptoms: symptoms || appointment.symptoms,
      diagnosis,
      vitalSigns,
      clinicalNotes
    });

    // Mark appointment as COMPLETED
    await Appointment.findByIdAndUpdate(appointmentId, {
      status: 'COMPLETED',
      completedAt: new Date().toISOString()
    });

    // Publish consultation event
    await queue.publish('CONSULTATION_COMPLETED', {
      consultationId: consultation._id,
      appointmentId,
      patientId: appointment.patientId,
      patientName: appointment.patientName,
      doctorName: doctorRecord.name,
      diagnosis
    });

    return consultation;
  }
};

module.exports = consultationService;

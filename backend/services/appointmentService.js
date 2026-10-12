/**
 * Appointment Service Module
 * Implements atomic slot reservation, double-booking prevention,
 * asynchronous notification queuing, and appointment lifecycle management.
 */

const { Appointment, Doctor, User } = require('../models');
const db = require('../config/db');
const cache = require('../config/redis');
const queue = require('../config/queue');

const appointmentService = {
  /**
   * Book an appointment with atomic slot reservation & concurrency control
   */
  async bookAppointment(patientUser, appointmentData) {
    const { doctorId, date, timeSlot, symptoms, notes } = appointmentData;

    if (!doctorId || !date || !timeSlot) {
      const err = new Error('Doctor ID, date, and time slot are required');
      err.statusCode = 400;
      throw err;
    }

    // 1. Verify doctor exists
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      const err = new Error('Selected doctor not found');
      err.statusCode = 404;
      throw err;
    }

    // 2. Atomic Slot Reservation Lock to prevent race conditions & double-booking
    const lockAcquired = db.acquireSlotLock(doctorId, date, timeSlot);
    if (!lockAcquired) {
      const err = new Error(`The requested slot (${timeSlot} on ${date}) is already booked or being reserved. Please choose another slot.`);
      err.statusCode = 409; // Conflict
      throw err;
    }

    try {
      // 3. Create appointment with CONFIRMED status
      const newAppointment = await Appointment.create({
        patientId: patientUser._id,
        patientName: patientUser.name,
        patientEmail: patientUser.email,
        doctorId: doctor._id,
        doctorName: doctor.name,
        specialization: doctor.specialization,
        consultationFee: doctor.consultationFee,
        date,
        timeSlot,
        symptoms: symptoms || '',
        notes: notes || ''
      });

      // 4. Invalidate availability cache for this doctor
      await cache.invalidatePattern(`doctor:profile:${doctorId}`);

      // 5. Asynchronously queue notification (Email / SMS)
      await queue.publish('APPOINTMENT_CONFIRMED', {
        appointmentId: newAppointment._id,
        appointmentNumber: newAppointment.appointmentNumber,
        patientName: patientUser.name,
        patientEmail: patientUser.email,
        doctorName: doctor.name,
        date,
        timeSlot,
        fee: doctor.consultationFee
      });

      return newAppointment;
    } finally {
      // 6. Release lock from atomic concurrency set
      db.releaseSlotLock(doctorId, date, timeSlot);
    }
  },

  /**
   * Get appointments for the authenticated user based on role
   */
  async getMyAppointments(user) {
    if (user.role === 'admin') {
      return await Appointment.find({});
    }

    if (user.role === 'doctor') {
      // Find doctor record linked to this user account
      const doctor = await Doctor.findOne({ userId: user._id });
      if (!doctor) {
        return [];
      }
      return await Appointment.find({ doctorId: doctor._id });
    }

    // Default: Patient view (only their own appointments)
    return await Appointment.find({ patientId: user._id });
  },

  /**
   * Cancel an appointment (Only patient, doctor, or admin permitted)
   */
  async cancelAppointment(appointmentId, user, reason) {
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      const err = new Error(`Appointment with ID ${appointmentId} not found`);
      err.statusCode = 404;
      throw err;
    }

    // Role check: Only owner patient, assigned doctor, or admin can cancel
    const isPatientOwner = String(appointment.patientId) === String(user._id);
    const doctorRecord = user.role === 'doctor' ? await Doctor.findOne({ userId: user._id }) : null;
    const isDoctorAssigned = doctorRecord && String(appointment.doctorId) === String(doctorRecord._id);
    const isAdmin = user.role === 'admin';

    if (!isPatientOwner && !isDoctorAssigned && !isAdmin) {
      const err = new Error('Unauthorized: You can only cancel your own appointments.');
      err.statusCode = 403;
      throw err;
    }

    if (appointment.status === 'COMPLETED') {
      const err = new Error('Cannot cancel an appointment that has already been completed.');
      err.statusCode = 400;
      throw err;
    }

    if (appointment.status === 'CANCELLED') {
      const err = new Error('This appointment has already been cancelled.');
      err.statusCode = 400;
      throw err;
    }

    const updated = await Appointment.findByIdAndUpdate(appointmentId, {
      status: 'CANCELLED',
      cancellationReason: reason || 'Cancelled by user',
      cancelledAt: new Date().toISOString()
    });

    // Invalidate cache
    await cache.invalidatePattern('doctor');

    // Queue cancellation notification
    await queue.publish('APPOINTMENT_CANCELLED', {
      appointmentId: appointment._id,
      appointmentNumber: appointment.appointmentNumber,
      patientName: appointment.patientName,
      patientEmail: appointment.patientEmail,
      doctorName: appointment.doctorName,
      date: appointment.date,
      timeSlot: appointment.timeSlot,
      cancelledBy: user.role
    });

    return updated;
  },

  /**
   * Mark appointment as COMPLETED (Doctor or Admin only)
   */
  async completeAppointment(appointmentId, user) {
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      const err = new Error(`Appointment with ID ${appointmentId} not found`);
      err.statusCode = 404;
      throw err;
    }

    if (appointment.status === 'CANCELLED') {
      const err = new Error('Cannot complete a cancelled appointment');
      err.statusCode = 400;
      throw err;
    }

    const updated = await Appointment.findByIdAndUpdate(appointmentId, {
      status: 'COMPLETED',
      completedAt: new Date().toISOString()
    });

    return updated;
  }
};

module.exports = appointmentService;

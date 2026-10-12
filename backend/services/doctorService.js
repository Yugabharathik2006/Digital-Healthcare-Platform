/**
 * Doctor Service Module
 * Handles doctor listings, search/filtering, Redis caching, availability calculation,
 * and cache invalidation upon slot modification.
 */

const { Doctor, Appointment } = require('../models');
const cache = require('../config/redis');

const doctorService = {
  /**
   * Fetch doctors with search, filtering, and Redis caching
   */
  async getDoctors(query = {}) {
    const { search, specialization, location, page = 1, limit = 12 } = query;
    const cacheKey = `doctors:list:${search || 'all'}:${specialization || 'all'}:${location || 'all'}:p${page}:l${limit}`;

    // 1. Check Redis Cache
    const cachedData = await cache.get(cacheKey);
    if (cachedData) {
      return {
        ...cachedData,
        source: 'REDIS_CACHE (Cache Hit)',
        cacheHit: true
      };
    }

    // 2. Query Database / Store
    const filter = {};
    if (search) filter.$search = search;
    if (specialization && specialization !== 'All') filter.specialization = specialization;
    if (location && location !== 'All') filter.location = location;

    const result = await Doctor.find(filter, { page: Number(page), limit: Number(limit) });

    // 3. Store in Redis Cache with 300s TTL (5 minutes)
    await cache.set(cacheKey, result, 300);

    return {
      ...result,
      source: 'DATABASE_QUERY (Cache Miss -> Stored in Cache)',
      cacheHit: false
    };
  },

  /**
   * Get single doctor profile by ID with caching
   */
  async getDoctorById(id) {
    const cacheKey = `doctor:profile:${id}`;
    const cached = await cache.get(cacheKey);
    if (cached) {
      return { ...cached, source: 'REDIS_CACHE (Cache Hit)' };
    }

    const doctor = await Doctor.findById(id);
    if (!doctor) {
      const err = new Error(`Doctor with ID ${id} not found`);
      err.statusCode = 404;
      throw err;
    }

    await cache.set(cacheKey, doctor, 300);
    return { ...doctor, source: 'DATABASE_QUERY' };
  },

  /**
   * Calculate real-time slot availability for a doctor on a specific date
   * Compares doctor's configured master slots against booked appointments
   */
  async getDoctorAvailability(doctorId, date) {
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      const err = new Error(`Doctor with ID ${doctorId} not found`);
      err.statusCode = 404;
      throw err;
    }

    // Retrieve active booked appointments on this date for this doctor
    const bookedAppointments = await Appointment.find({
      doctorId,
      date,
      status: 'CONFIRMED'
    });

    const bookedSlotTimes = new Set(bookedAppointments.map(a => a.timeSlot));

    // Construct slot status objects
    const slotDetails = (doctor.availableSlots || []).map(slotTime => {
      const isBooked = bookedSlotTimes.has(slotTime);
      return {
        time: slotTime,
        isAvailable: !isBooked,
        status: isBooked ? 'BOOKED' : 'AVAILABLE'
      };
    });

    return {
      doctorId: doctor._id,
      doctorName: doctor.name,
      date,
      availableDays: doctor.availableDays,
      totalSlots: slotDetails.length,
      availableCount: slotDetails.filter(s => s.isAvailable).length,
      slots: slotDetails
    };
  },

  /**
   * Update doctor's availability and invalidate Redis caches
   */
  async updateAvailability(userId, data) {
    const doctor = await Doctor.findOne({ userId });
    if (!doctor) {
      const err = new Error('Doctor profile not found for this user account');
      err.statusCode = 404;
      throw err;
    }

    const updateFields = {};
    if (data.availableDays) updateFields.availableDays = data.availableDays;
    if (data.availableSlots) updateFields.availableSlots = data.availableSlots;
    if (data.consultationFee) updateFields.consultationFee = Number(data.consultationFee);
    if (data.hospital) updateFields.hospital = data.hospital;
    if (data.location) updateFields.location = data.location;
    if (data.about) updateFields.about = data.about;

    const updatedDoctor = await Doctor.findByIdAndUpdate(doctor._id, updateFields);

    // Cache Invalidation: Purge doctor list and single profile caches
    const purgedKeysCount = await cache.invalidatePattern('doctor');
    console.log(`[CACHE INVALIDATION] 🧹 Cleared ${purgedKeysCount} cached keys after doctor availability update`);

    return {
      success: true,
      doctor: updatedDoctor,
      cachePurged: true,
      purgedKeysCount
    };
  }
};

module.exports = doctorService;

/**
 * Data Models & Repository Layer
 * Implements schema structures, indexing, and CRUD methods for:
 * - Users
 * - Doctors
 * - Appointments
 * - Consultations
 * - Prescriptions
 * - Notifications
 */

const db = require('../config/db');

// Helper to generate consistent Object IDs
function generateId(prefix = 'id') {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
}

// -------------------------------------------------------------
// USER MODEL
// -------------------------------------------------------------
const UserModel = {
  async create(userData) {
    const user = {
      _id: generateId('usr'),
      name: userData.name,
      email: userData.email.toLowerCase().trim(),
      password: userData.password, // bcrypt hashed
      role: userData.role || 'patient', // 'patient' | 'doctor' | 'admin'
      phone: userData.phone || '',
      gender: userData.gender || 'Not specified',
      dateOfBirth: userData.dateOfBirth || '',
      createdAt: new Date().toISOString()
    };
    db.collections.users.push(user);
    return { ...user };
  },

  async findOne(filter) {
    const users = db.collections.users;
    const found = users.find(u => {
      for (const [key, val] of Object.entries(filter)) {
        if (key === 'email' && u.email !== val.toLowerCase().trim()) return false;
        else if (key !== 'email' && u[key] !== val) return false;
      }
      return true;
    });
    return found ? { ...found } : null;
  },

  async findById(id) {
    const user = db.collections.users.find(u => u._id === id);
    return user ? { ...user } : null;
  },

  async find(filter = {}) {
    return db.collections.users.filter(u => {
      for (const [key, val] of Object.entries(filter)) {
        if (u[key] !== val) return false;
      }
      return true;
    }).map(u => {
      const { password, ...safeUser } = u;
      return safeUser;
    });
  },

  async countDocuments(filter = {}) {
    const list = await this.find(filter);
    return list.length;
  }
};

// -------------------------------------------------------------
// DOCTOR MODEL
// -------------------------------------------------------------
const DoctorModel = {
  async create(doctorData) {
    const doctor = {
      _id: generateId('doc'),
      userId: doctorData.userId || '',
      name: doctorData.name,
      email: doctorData.email.toLowerCase().trim(),
      specialization: doctorData.specialization,
      qualifications: doctorData.qualifications || 'MBBS, MD',
      experienceYears: Number(doctorData.experienceYears) || 5,
      consultationFee: Number(doctorData.consultationFee) || 50,
      rating: Number(doctorData.rating) || 4.8,
      reviewCount: Number(doctorData.reviewCount) || 24,
      location: doctorData.location || 'Metro City',
      hospital: doctorData.hospital || 'Apollo Medical Center',
      about: doctorData.about || 'Experienced specialist dedicated to personalized patient care.',
      image: doctorData.image || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&auto=format&fit=crop&q=80',
      availableDays: doctorData.availableDays || ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      availableSlots: doctorData.availableSlots || [
        '09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM'
      ],
      createdAt: new Date().toISOString()
    };
    db.collections.doctors.push(doctor);
    return { ...doctor };
  },

  async find(filter = {}, options = {}) {
    let results = [...db.collections.doctors];

    // Search query: name, specialization, or location
    if (filter.$search) {
      const term = filter.$search.toLowerCase();
      results = results.filter(d =>
        d.name.toLowerCase().includes(term) ||
        d.specialization.toLowerCase().includes(term) ||
        d.location.toLowerCase().includes(term)
      );
    }

    if (filter.specialization) {
      results = results.filter(d => d.specialization.toLowerCase() === filter.specialization.toLowerCase());
    }

    if (filter.location) {
      results = results.filter(d => d.location.toLowerCase().includes(filter.location.toLowerCase()));
    }

    if (filter.userId) {
      results = results.filter(d => d.userId === filter.userId);
    }

    // Pagination
    const page = options.page || 1;
    const limit = options.limit || 20;
    const startIndex = (page - 1) * limit;
    const paginated = results.slice(startIndex, startIndex + limit);

    return {
      doctors: paginated,
      total: results.length,
      page,
      totalPages: Math.ceil(results.length / limit)
    };
  },

  async findById(id) {
    const doc = db.collections.doctors.find(d => d._id === id || d.userId === id);
    return doc ? { ...doc } : null;
  },

  async findOne(filter) {
    const doc = db.collections.doctors.find(d => {
      for (const [key, val] of Object.entries(filter)) {
        if (d[key] !== val) return false;
      }
      return true;
    });
    return doc ? { ...doc } : null;
  },

  async findByIdAndUpdate(id, updateData) {
    const index = db.collections.doctors.findIndex(d => d._id === id || d.userId === id);
    if (index === -1) return null;

    db.collections.doctors[index] = {
      ...db.collections.doctors[index],
      ...updateData,
      updatedAt: new Date().toISOString()
    };
    return { ...db.collections.doctors[index] };
  },

  async countDocuments() {
    return db.collections.doctors.length;
  }
};

// -------------------------------------------------------------
// APPOINTMENT MODEL
// -------------------------------------------------------------
const AppointmentModel = {
  async create(appointmentData) {
    const appointment = {
      _id: generateId('apt'),
      appointmentNumber: `APT-${Math.floor(100000 + Math.random() * 900000)}`,
      patientId: appointmentData.patientId,
      patientName: appointmentData.patientName,
      patientEmail: appointmentData.patientEmail,
      doctorId: appointmentData.doctorId,
      doctorName: appointmentData.doctorName,
      specialization: appointmentData.specialization,
      date: appointmentData.date, // e.g., '2026-10-15'
      timeSlot: appointmentData.timeSlot, // e.g., '10:00 AM'
      consultationFee: appointmentData.consultationFee || 50,
      status: 'CONFIRMED', // 'CONFIRMED' | 'CANCELLED' | 'COMPLETED'
      symptoms: appointmentData.symptoms || '',
      notes: appointmentData.notes || '',
      createdAt: new Date().toISOString(),
      cancelledAt: null,
      completedAt: null
    };

    db.collections.appointments.push(appointment);
    return { ...appointment };
  },

  async find(filter = {}) {
    let results = [...db.collections.appointments];

    if (filter.patientId) results = results.filter(a => a.patientId === filter.patientId);
    if (filter.doctorId) results = results.filter(a => a.doctorId === filter.doctorId);
    if (filter.status) results = results.filter(a => a.status === filter.status);

    // Sort descending by date/createdAt
    results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return results;
  },

  async findById(id) {
    const apt = db.collections.appointments.find(a => a._id === id);
    return apt ? { ...apt } : null;
  },

  async findByIdAndUpdate(id, updateData) {
    const index = db.collections.appointments.findIndex(a => a._id === id);
    if (index === -1) return null;

    db.collections.appointments[index] = {
      ...db.collections.appointments[index],
      ...updateData
    };
    return { ...db.collections.appointments[index] };
  },

  async countDocuments(filter = {}) {
    const list = await this.find(filter);
    return list.length;
  }
};

// -------------------------------------------------------------
// CONSULTATION MODEL
// -------------------------------------------------------------
const ConsultationModel = {
  async create(data) {
    const consultation = {
      _id: generateId('cns'),
      appointmentId: data.appointmentId,
      patientId: data.patientId,
      doctorId: data.doctorId,
      symptoms: data.symptoms || '',
      diagnosis: data.diagnosis,
      vitalSigns: data.vitalSigns || { bp: '120/80', pulse: '72 bpm', temp: '98.6 F' },
      clinicalNotes: data.clinicalNotes || '',
      completedAt: new Date().toISOString()
    };
    db.collections.consultations.push(consultation);
    return { ...consultation };
  },

  async findOne(filter) {
    return db.collections.consultations.find(c => {
      for (const [key, val] of Object.entries(filter)) {
        if (c[key] !== val) return false;
      }
      return true;
    }) || null;
  }
};

// -------------------------------------------------------------
// PRESCRIPTION MODEL
// -------------------------------------------------------------
const PrescriptionModel = {
  async create(data) {
    const prescription = {
      _id: generateId('rx'),
      prescriptionNumber: `RX-${Math.floor(100000 + Math.random() * 900000)}`,
      consultationId: data.consultationId,
      appointmentId: data.appointmentId,
      patientId: data.patientId,
      patientName: data.patientName,
      doctorId: data.doctorId,
      doctorName: data.doctorName,
      doctorSpecialization: data.doctorSpecialization || 'Physician',
      diagnosis: data.diagnosis,
      medicines: data.medicines || [], // [{ name, dosage, frequency, duration, instructions }]
      advice: data.advice || 'Take adequate rest and stay hydrated.',
      followUpDate: data.followUpDate || 'After 7 days',
      issuedAt: new Date().toISOString()
    };
    db.collections.prescriptions.push(prescription);
    return { ...prescription };
  },

  async find(filter = {}) {
    let results = [...db.collections.prescriptions];
    if (filter.patientId) results = results.filter(p => p.patientId === filter.patientId);
    if (filter.doctorId) results = results.filter(p => p.doctorId === filter.doctorId);
    results.sort((a, b) => new Date(b.issuedAt) - new Date(a.issuedAt));
    return results;
  },

  async findById(id) {
    const rx = db.collections.prescriptions.find(p => p._id === id);
    return rx ? { ...rx } : null;
  },

  async findOne(filter) {
    return db.collections.prescriptions.find(p => {
      for (const [key, val] of Object.entries(filter)) {
        if (p[key] !== val) return false;
      }
      return true;
    }) || null;
  },

  async countDocuments() {
    return db.collections.prescriptions.length;
  }
};

// -------------------------------------------------------------
// NOTIFICATION MODEL
// -------------------------------------------------------------
const NotificationModel = {
  async create(data) {
    const notification = {
      _id: generateId('ntf'),
      userId: data.userId,
      title: data.title,
      message: data.message,
      type: data.type || 'INFO', // 'APPOINTMENT' | 'PRESCRIPTION' | 'INFO'
      isRead: false,
      createdAt: new Date().toISOString()
    };
    db.collections.notifications.push(notification);
    return { ...notification };
  },

  async find(filter = {}) {
    let results = [...db.collections.notifications];
    if (filter.userId) results = results.filter(n => n.userId === filter.userId);
    results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return results;
  }
};

module.exports = {
  User: UserModel,
  Doctor: DoctorModel,
  Appointment: AppointmentModel,
  Consultation: ConsultationModel,
  Prescription: PrescriptionModel,
  Notification: NotificationModel
};

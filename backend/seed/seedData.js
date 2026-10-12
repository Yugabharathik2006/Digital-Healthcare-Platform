/**
 * Seed Script for Healthcare Platform
 * Populates realistic doctor profiles, demo accounts (Patient, Doctor, Admin),
 * appointments, and digital prescriptions.
 */

const bcrypt = require('bcryptjs');
const db = require('../config/db');
const { User, Doctor, Appointment, Prescription } = require('../models');

async function seedInitialData() {
  // If users already exist, skip re-seeding
  if (db.collections.users.length > 0) {
    return;
  }

  console.log('[SEED] 🌱 Seeding demo accounts and realistic healthcare records...');

  const defaultPassword = 'password123';
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(defaultPassword, salt);

  // 1. Create Patient User
  const patientUser = await User.create({
    name: 'Johnathan Doe',
    email: 'patient@health.com',
    password: passwordHash,
    role: 'patient',
    phone: '+1 (555) 234-5678',
    gender: 'Male',
    dateOfBirth: '1992-06-15'
  });

  // 2. Create Admin User
  await User.create({
    name: 'System Administrator',
    email: 'admin@health.com',
    password: passwordHash,
    role: 'admin',
    phone: '+1 (555) 999-0000'
  });

  // 3. Create Doctor Users & Profiles
  const doctorsData = [
    {
      name: 'Dr. Sarah Jenkins',
      email: 'doctor.sarah@health.com',
      specialization: 'Cardiology',
      qualifications: 'MBBS, MD, FACC (Cardiology)',
      experienceYears: 14,
      consultationFee: 95,
      rating: 4.9,
      reviewCount: 142,
      location: 'New York, NY',
      hospital: 'Mount Sinai Heart Institute',
      about: 'Board-certified cardiologist specializing in preventive cardiology, hypertension, arrhythmia management, and cardiovascular risk assessment.',
      image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=500&auto=format&fit=crop&q=80',
      availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      availableSlots: ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM']
    },
    {
      name: 'Dr. Marcus Vance',
      email: 'doctor.marcus@health.com',
      specialization: 'Dermatology',
      qualifications: 'MD, FAAD (Dermatology)',
      experienceYears: 9,
      consultationFee: 80,
      rating: 4.8,
      reviewCount: 98,
      location: 'San Francisco, CA',
      hospital: 'Pacific Skin & Laser Clinic',
      about: 'Expert medical and cosmetic dermatologist with deep focus on acne therapy, eczema, skin cancer screening, and chronic dermatological conditions.',
      image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=500&auto=format&fit=crop&q=80',
      availableDays: ['Monday', 'Wednesday', 'Friday', 'Saturday'],
      availableSlots: ['09:30 AM', '10:30 AM', '01:30 PM', '02:30 PM', '04:00 PM']
    },
    {
      name: 'Dr. Elena Rostova',
      email: 'doctor.elena@health.com',
      specialization: 'Neurology',
      qualifications: 'MD, PhD, FAAN (Neurology)',
      experienceYears: 18,
      consultationFee: 120,
      rating: 5.0,
      reviewCount: 210,
      location: 'Boston, MA',
      hospital: 'Massachusetts General Neuroscience Center',
      about: 'Leading neurologist specializing in migraine disorders, neuro-rehabilitation, peripheral neuropathy, and cognitive health preservation.',
      image: 'https://images.unsplash.com/photo-1594824813576-963d81084e55?w=500&auto=format&fit=crop&q=80',
      availableDays: ['Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      availableSlots: ['10:00 AM', '11:30 AM', '02:00 PM', '03:30 PM']
    },
    {
      name: 'Dr. Rajesh Kumar',
      email: 'doctor.rajesh@health.com',
      specialization: 'Pediatrics',
      qualifications: 'MBBS, DCH, MD (Pediatrics)',
      experienceYears: 12,
      consultationFee: 65,
      rating: 4.9,
      reviewCount: 167,
      location: 'Chicago, IL',
      hospital: 'Lurie Children’s Wellness Hospital',
      about: 'Compassionate pediatrician focusing on infant growth monitoring, childhood allergies, vaccination schedules, and adolescent health.',
      image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=500&auto=format&fit=crop&q=80',
      availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Saturday'],
      availableSlots: ['09:00 AM', '10:00 AM', '11:00 AM', '01:00 PM', '03:00 PM']
    },
    {
      name: 'Dr. James Wilson',
      email: 'doctor.james@health.com',
      specialization: 'Orthopedics',
      qualifications: 'MS, M.Ch (Orthopedics)',
      experienceYears: 16,
      consultationFee: 90,
      rating: 4.7,
      reviewCount: 115,
      location: 'Austin, TX',
      hospital: 'Austin Sports & Joint Institute',
      about: 'Orthopedic specialist in sports injury treatment, arthroscopic joint restoration, spine ergonomics, and arthritis management.',
      image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=500&auto=format&fit=crop&q=80',
      availableDays: ['Monday', 'Tuesday', 'Thursday', 'Friday'],
      availableSlots: ['10:00 AM', '11:00 AM', '02:00 PM', '04:00 PM']
    },
    {
      name: 'Dr. Priya Patel',
      email: 'doctor.priya@health.com',
      specialization: 'General Medicine',
      qualifications: 'MBBS, DNB (Internal Medicine)',
      experienceYears: 8,
      consultationFee: 50,
      rating: 4.8,
      reviewCount: 88,
      location: 'Seattle, WA',
      hospital: 'Cascade Primary Health Clinic',
      about: 'Comprehensive primary care physician treating infectious diseases, lifestyle disorders, metabolic management, and routine health checks.',
      image: 'https://images.unsplash.com/photo-1527613426441-4da17471b66d?w=500&auto=format&fit=crop&q=80',
      availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      availableSlots: ['08:30 AM', '09:30 AM', '11:00 AM', '02:30 PM', '04:30 PM']
    }
  ];

  const createdDoctors = [];

  for (const docInfo of doctorsData) {
    const docUser = await User.create({
      name: docInfo.name,
      email: docInfo.email,
      password: passwordHash,
      role: 'doctor',
      phone: '+1 (555) 456-7890'
    });

    const docProfile = await Doctor.create({
      userId: docUser._id,
      name: docInfo.name,
      email: docInfo.email,
      specialization: docInfo.specialization,
      qualifications: docInfo.qualifications,
      experienceYears: docInfo.experienceYears,
      consultationFee: docInfo.consultationFee,
      rating: docInfo.rating,
      reviewCount: docInfo.reviewCount,
      location: docInfo.location,
      hospital: docInfo.hospital,
      about: docInfo.about,
      image: docInfo.image,
      availableDays: docInfo.availableDays,
      availableSlots: docInfo.availableSlots
    });

    createdDoctors.push({ user: docUser, profile: docProfile });
  }

  // 4. Create Initial Sample Appointments
  const primaryDoc = createdDoctors[0].profile; // Dr. Sarah Jenkins
  const secondDoc = createdDoctors[1].profile; // Dr. Marcus Vance

  const today = new Date().toISOString().split('T')[0];
  const nextWeek = new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0];
  const pastWeek = new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0];

  // Upcoming confirmed appointment
  await Appointment.create({
    patientId: patientUser._id,
    patientName: patientUser.name,
    patientEmail: patientUser.email,
    doctorId: primaryDoc._id,
    doctorName: primaryDoc.name,
    specialization: primaryDoc.specialization,
    consultationFee: primaryDoc.consultationFee,
    date: nextWeek,
    timeSlot: '10:00 AM',
    status: 'CONFIRMED',
    symptoms: 'Mild shortness of breath during cardio exercise',
    notes: 'Follow-up consultation after routine checkup'
  });

  // Past completed appointment with Digital Prescription
  const pastAppointment = await Appointment.create({
    patientId: patientUser._id,
    patientName: patientUser.name,
    patientEmail: patientUser.email,
    doctorId: secondDoc._id,
    doctorName: secondDoc.name,
    specialization: secondDoc.specialization,
    consultationFee: secondDoc.consultationFee,
    date: pastWeek,
    timeSlot: '02:30 PM',
    status: 'COMPLETED',
    symptoms: 'Dry skin rash on right forearm',
    notes: 'Prescribed topical corticosteroid ointment'
  });

  // 5. Create Sample Digital Prescription for Past Appointment
  await Prescription.create({
    consultationId: 'cns_demo_001',
    appointmentId: pastAppointment._id,
    patientId: patientUser._id,
    patientName: patientUser.name,
    doctorId: secondDoc._id,
    doctorName: secondDoc.name,
    doctorSpecialization: secondDoc.specialization,
    diagnosis: 'Mild Contact Dermatitis',
    medicines: [
      {
        name: 'Hydrocortisone 1% Topical Cream',
        dosage: 'Apply thin layer',
        frequency: 'Twice daily',
        duration: '7 Days',
        instructions: 'Apply to affected forearm skin after washing'
      },
      {
        name: 'Cetirizine 10mg Tablets',
        dosage: '1 Tablet',
        frequency: 'Once at bedtime',
        duration: '5 Days',
        instructions: 'Take with water if itching occurs'
      }
    ],
    advice: 'Avoid scented soaps and wear breathable cotton clothing. Maintain hydration.',
    followUpDate: 'In 2 weeks if rash persists'
  });

  console.log('[SEED] ✅ Seed data initialized successfully with realistic doctors, appointments, and prescriptions.');
}

module.exports = { seedInitialData };

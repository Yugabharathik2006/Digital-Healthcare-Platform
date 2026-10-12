/**
 * Authentication Service Module
 * Handles user registration, password hashing, JWT creation, and role assignment.
 */

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, Doctor } = require('../models');
const queue = require('../config/queue');

const JWT_SECRET = process.env.JWT_SECRET || 'healthcare_jwt_secure_key_development_2026';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

const authService = {
  async register(data) {
    const { name, email, password, role = 'patient', phone, specialization, consultationFee, location } = data;

    if (!name || !email || !password) {
      const error = new Error('Name, email, and password are required');
      error.statusCode = 400;
      throw error;
    }

    // Check if email already registered
    const existing = await User.findOne({ email });
    if (existing) {
      const error = new Error('An account with this email address already exists');
      error.statusCode = 409; // Conflict
      throw error;
    }

    // Hash password with bcrypt salt
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      name,
      email,
      password: passwordHash,
      role,
      phone
    });

    let doctorProfile = null;

    // If registering as doctor, create associated Doctor entity
    if (role === 'doctor') {
      doctorProfile = await Doctor.create({
        userId: user._id,
        name: user.name,
        email: user.email,
        specialization: specialization || 'General Medicine',
        consultationFee: consultationFee || 50,
        location: location || 'Central Medical Clinic'
      });
    }

    // Queue welcome notification
    await queue.publish('USER_REGISTERED', {
      userId: user._id,
      patientName: user.name,
      patientEmail: user.email,
      role: user.role
    });

    const token = generateToken(user._id, user.role);

    return {
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone
      },
      doctorProfile
    };
  },

  async login(email, password) {
    if (!email || !password) {
      const error = new Error('Email and password must be provided');
      error.statusCode = 400;
      throw error;
    }

    const user = await User.findOne({ email });
    if (!user) {
      const error = new Error('Invalid email or password credentials');
      error.statusCode = 401;
      throw error;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      const error = new Error('Invalid email or password credentials');
      error.statusCode = 401;
      throw error;
    }

    let doctorProfile = null;
    if (user.role === 'doctor') {
      doctorProfile = await Doctor.findOne({ userId: user._id });
    }

    const token = generateToken(user._id, user.role);

    return {
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone
      },
      doctorProfile
    };
  }
};

module.exports = authService;

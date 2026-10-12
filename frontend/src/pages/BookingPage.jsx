import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';
import { CheckCircle, ShieldCheck, Calendar, Clock, AlertCircle, ArrowLeft, ArrowRight } from 'lucide-react';
import StatusBadge from '../components/StatusBadge';

export default function BookingPage({ doctor, date, timeSlot, onBack, onSuccessNavigate }) {
  const { user, isAuthenticated, loginDemo } = useAuth();
  const [symptoms, setSymptoms] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  const handleConfirmBooking = async (e) => {
    e.preventDefault();
    setError(null);

    // If user is not logged in, auto-login with patient demo for seamless experience
    if (!isAuthenticated) {
      try {
        await loginDemo('patient');
      } catch (err) {
        setError('Please log in to book an appointment.');
        return;
      }
    }

    setLoading(true);
    try {
      const payload = {
        doctorId: doctor._id,
        date,
        timeSlot,
        symptoms,
        notes
      };

      const res = await api.appointments.book(payload);
      setConfirmedBooking(res.data);
    } catch (err) {
      setError(err.message || 'Failed to book slot. It might have been taken by another patient.');
    } finally {
      setLoading(false);
    }
  };

  // SUCCESS CONFIRMATION VIEW
  if (confirmedBooking) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <div className="inline-block">
            <StatusBadge status="CONFIRMED" />
          </div>
          <h1 className="text-3xl font-extrabold font-['Outfit'] text-slate-900 dark:text-white">
            Appointment Confirmed!
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Your appointment has been atomically locked and registered in the system.
          </p>
        </div>

        {/* Booking Card Details */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 text-left space-y-4 shadow-sm transition-colors">
          <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800">
            <span className="text-xs text-slate-400 dark:text-slate-500 font-semibold uppercase">Booking Reference</span>
            <span className="font-mono font-bold text-slate-900 dark:text-white text-sm">{confirmedBooking.appointmentNumber}</span>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-slate-400 dark:text-slate-500 block">SPECIALIST</span>
              <strong className="text-slate-800 dark:text-slate-200 text-sm">{doctor.name}</strong>
              <div className="text-slate-500 dark:text-slate-400">{doctor.specialization}</div>
            </div>
            <div>
              <span className="text-slate-400 dark:text-slate-500 block">SCHEDULE</span>
              <strong className="text-slate-800 dark:text-slate-200 text-sm">{date}</strong>
              <div className="text-slate-500 dark:text-slate-400">{timeSlot}</div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs">
            <span className="text-slate-500 dark:text-slate-400">Consultation Fee</span>
            <span className="text-base font-bold text-slate-900 dark:text-white">${doctor.consultationFee}</span>
          </div>
        </div>

        {/* Asynchronous Notification Badge */}
        <div className="p-4 rounded-2xl bg-brand-50/70 dark:bg-brand-950/60 border border-brand-200/60 dark:border-brand-800/60 text-xs text-brand-800 dark:text-brand-300 flex items-center justify-center gap-2">
          <ShieldCheck className="w-4 h-4 text-brand-600 dark:text-brand-400" />
          <span>Confirmation dispatched to RabbitMQ / In-Memory Notification Queue</span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => onSuccessNavigate('patient-dashboard')}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs shadow-md transition"
          >
            Go to My Appointments
          </button>
          <button
            onClick={() => onSuccessNavigate('doctors')}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs transition"
          >
            Find Another Doctor
          </button>
        </div>
      </div>
    );
  }

  // BOOKING FORM VIEW
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Change Slot or Specialist</span>
      </button>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6 transition-colors">
        <div>
          <h1 className="text-2xl font-bold font-['Outfit'] text-slate-900 dark:text-white">
            Confirm Appointment Reservation
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Review slot details and provide clinical symptoms for the doctor before confirming.
          </p>
        </div>

        {/* Selected Slot Recap */}
        <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-700 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <span className="text-slate-400 dark:text-slate-500 font-medium block">SPECIALIST</span>
            <strong className="text-slate-900 dark:text-white text-sm block">{doctor.name}</strong>
            <span className="text-slate-500 dark:text-slate-400">{doctor.hospital}</span>
          </div>
          <div>
            <span className="text-slate-400 dark:text-slate-500 font-medium block">APPOINTMENT TIME</span>
            <div className="flex items-center gap-1 font-bold text-brand-700 dark:text-brand-300 text-sm mt-0.5">
              <Calendar className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
              <span>{date}</span>
            </div>
            <div className="flex items-center gap-1 text-slate-600 dark:text-slate-300 font-medium mt-0.5">
              <Clock className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
              <span>{timeSlot}</span>
            </div>
          </div>
          <div>
            <span className="text-slate-400 dark:text-slate-500 font-medium block">TOTAL PAYABLE</span>
            <strong className="text-slate-900 dark:text-white text-base block font-['Outfit']">${doctor.consultationFee}</strong>
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold text-[11px]">Payable at Clinic / Telehealth</span>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Patient Symptoms Form */}
        <form onSubmit={handleConfirmBooking} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Primary Symptoms / Reason for Visit <span className="text-rose-500">*</span>
            </label>
            <textarea
              required
              rows={3}
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              placeholder="E.g., Experiencing acute chest discomfort, occasional headaches, skin redness for 3 days..."
              className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 p-3 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:bg-white dark:focus:bg-slate-850 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Additional Notes or Medical History (Optional)
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any past allergies, ongoing medications, or specific requests..."
              className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 p-3 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:bg-white dark:focus:bg-slate-850 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          {/* Concurrency Guarantee Notice */}
          <div className="p-3 bg-emerald-50/50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200/50 dark:border-emerald-800/50 flex items-center gap-2 text-xs text-emerald-800 dark:text-emerald-300">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
            <span>
              <strong>Concurrency Safety:</strong> Clicking confirm initiates an atomic slot lock to prevent double booking.
            </span>
          </div>

          <div className="pt-4 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onBack}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-bold text-xs shadow-md transition flex items-center gap-2"
            >
              <span>{loading ? 'Atomically Locking Slot...' : 'Confirm & Reserve Slot'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>

      </div>

    </div>
  );
}

import React, { useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';

export default function CancelModal({ appointment, onClose, onConfirm }) {
  const [reason, setReason] = useState('Change of schedule');
  const [loading, setLoading] = useState(false);

  if (!appointment) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onConfirm(appointment._id, reason);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors">
        <div className="p-6">
          <div className="w-12 h-12 rounded-full bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-4">
            <AlertTriangle className="w-6 h-6" />
          </div>

          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Cancel Appointment?</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">
            Are you sure you want to cancel appointment <strong className="text-slate-800 dark:text-slate-200">{appointment.appointmentNumber}</strong> with <strong className="text-slate-800 dark:text-slate-200">{appointment.doctorName}</strong> on <strong className="text-slate-800 dark:text-slate-200">{appointment.date} at {appointment.timeSlot}</strong>?
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Reason for Cancellation</label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 p-2.5 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-850 focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="Change of schedule">Change of schedule</option>
                <option value="Condition resolved">Condition resolved / Feeling better</option>
                <option value="Booking error">Accidental booking slot</option>
                <option value="Emergency clash">Personal emergency</option>
                <option value="Other">Other reason</option>
              </select>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
              >
                Keep Appointment
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-sm transition disabled:opacity-50"
              >
                {loading ? 'Cancelling...' : 'Confirm Cancellation'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

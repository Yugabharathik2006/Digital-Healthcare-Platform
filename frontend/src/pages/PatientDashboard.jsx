import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';
import StatusBadge from '../components/StatusBadge';
import CancelModal from '../components/CancelModal';
import PrescriptionModal from '../components/PrescriptionModal';
import { Calendar, Clock, Stethoscope, FileText, XCircle, CheckCircle, Plus, AlertCircle, RefreshCw } from 'lucide-react';

export default function PatientDashboard({ onNavigate }) {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelTarget, setCancelTarget] = useState(null);
  const [viewPrescription, setViewPrescription] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [aptRes, rxRes] = await Promise.all([
        api.appointments.getMy(),
        api.prescriptions.getMy()
      ]);
      setAppointments(aptRes.data || []);
      setPrescriptions(rxRes.data || []);
    } catch (err) {
      console.error('Failed to load patient data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCancelAppointment = async (id, reason) => {
    try {
      await api.appointments.cancel(id, reason);
      setToastMessage('Appointment successfully cancelled.');
      setTimeout(() => setToastMessage(null), 3500);
      loadData();
    } catch (err) {
      alert(err.message || 'Failed to cancel appointment');
    }
  };

  const handleOpenRxForAppointment = (appointmentId) => {
    const rx = prescriptions.find(p => p.appointmentId === appointmentId);
    if (rx) {
      setViewPrescription(rx);
    } else {
      alert('Prescription not found or yet to be uploaded by the doctor.');
    }
  };

  const upcomingAppointments = appointments.filter(a => a.status === 'CONFIRMED');
  const pastAppointments = appointments.filter(a => a.status !== 'CONFIRMED');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-2 text-xs font-semibold animate-bounce">
          <CheckCircle className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Welcome Banner */}
      <div className="bg-gradient-to-r from-brand-600 to-primary-600 rounded-3xl p-6 sm:p-8 text-white shadow-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-xs uppercase tracking-wider font-semibold text-brand-100">Patient Dashboard</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-['Outfit'] mt-0.5">
            Welcome back, {user?.name || 'Patient'}
          </h1>
          <p className="text-xs sm:text-sm text-brand-100 mt-1">
            Manage your consultations, upcoming clinical visits, and digital prescriptions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('doctors')}
            className="px-4 py-2.5 rounded-xl bg-white text-brand-700 hover:bg-brand-50 font-bold text-xs shadow-sm transition flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Book New Visit</span>
          </button>
          <button
            onClick={loadData}
            className="p-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-white transition"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Metric Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-sm flex items-center justify-between transition-colors">
          <div>
            <span className="text-xs text-slate-400 dark:text-slate-500 font-semibold uppercase">Upcoming Visits</span>
            <div className="text-2xl font-bold font-['Outfit'] text-brand-600 dark:text-brand-400 mt-1">{upcomingAppointments.length}</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 flex items-center justify-center">
            <Calendar className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-sm flex items-center justify-between transition-colors">
          <div>
            <span className="text-xs text-slate-400 dark:text-slate-500 font-semibold uppercase">Completed Consultations</span>
            <div className="text-2xl font-bold font-['Outfit'] text-slate-800 dark:text-slate-100 mt-1">
              {appointments.filter(a => a.status === 'COMPLETED').length}
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <CheckCircle className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-sm flex items-center justify-between transition-colors">
          <div>
            <span className="text-xs text-slate-400 dark:text-slate-500 font-semibold uppercase">Digital Prescriptions</span>
            <div className="text-2xl font-bold font-['Outfit'] text-purple-600 dark:text-purple-400 mt-1">{prescriptions.length}</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
            <FileText className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* UPCOMING APPOINTMENTS SECTION */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 shadow-sm space-y-4 transition-colors">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <h2 className="text-lg font-bold font-['Outfit'] text-slate-900 dark:text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-brand-600 dark:text-brand-400" />
            Upcoming Confirmed Appointments
          </h2>
          <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">
            {upcomingAppointments.length} Scheduled
          </span>
        </div>

        {loading ? (
          <div className="py-10 text-center text-xs text-slate-400 dark:text-slate-500">Loading appointments...</div>
        ) : upcomingAppointments.length === 0 ? (
          <div className="py-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 flex items-center justify-center mx-auto">
              <Calendar className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">No upcoming appointments scheduled</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              You do not have any active appointments. Find a doctor to schedule your next visit.
            </p>
            <button
              onClick={() => onNavigate('doctors')}
              className="px-4 py-2 bg-brand-600 text-white text-xs font-semibold rounded-xl hover:bg-brand-700 transition"
            >
              Browse Specialists
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {upcomingAppointments.map((apt) => (
              <div
                key={apt._id}
                className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 hover:border-brand-300 dark:hover:border-brand-500/50 transition flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50 dark:bg-slate-850/50"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <StatusBadge status={apt.status} />
                    <span className="font-mono text-xs font-bold text-slate-500 dark:text-slate-400">{apt.appointmentNumber}</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">{apt.doctorName}</h3>
                  <div className="text-xs text-slate-500 dark:text-slate-400 flex flex-wrap gap-3">
                    <span className="text-brand-700 dark:text-brand-300 font-semibold">{apt.specialization}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                      {apt.date}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                      {apt.timeSlot}
                    </span>
                  </div>
                  {apt.symptoms && (
                    <div className="text-xs text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 p-2 rounded-lg border border-slate-100 dark:border-slate-700/60 mt-2 max-w-lg">
                      <span className="font-semibold text-slate-500 dark:text-slate-400">Symptoms: </span>
                      {apt.symptoms}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 self-end md:self-center">
                  <button
                    onClick={() => setCancelTarget(apt)}
                    className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 border border-rose-200 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                  >
                    Cancel Appointment
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* PAST APPOINTMENTS & MEDICAL HISTORY */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 shadow-sm space-y-4 transition-colors">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <h2 className="text-lg font-bold font-['Outfit'] text-slate-900 dark:text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-slate-400 dark:text-slate-500" />
            Past Appointments &amp; Prescriptions
          </h2>
          <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">
            {pastAppointments.length} Records
          </span>
        </div>

        {pastAppointments.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400 dark:text-slate-500">No past appointment history.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-500 uppercase font-semibold">
                  <th className="py-3 px-3">Ref No</th>
                  <th className="py-3 px-3">Specialist</th>
                  <th className="py-3 px-3">Date &amp; Time</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {pastAppointments.map((apt) => {
                  const hasPrescription = prescriptions.some(p => p.appointmentId === apt._id);
                  return (
                    <tr key={apt._id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition">
                      <td className="py-3.5 px-3 font-mono font-bold text-slate-700 dark:text-slate-300">{apt.appointmentNumber}</td>
                      <td className="py-3.5 px-3">
                        <div className="font-bold text-slate-900 dark:text-white">{apt.doctorName}</div>
                        <div className="text-slate-400 dark:text-slate-500 text-[11px]">{apt.specialization}</div>
                      </td>
                      <td className="py-3.5 px-3 text-slate-600 dark:text-slate-300">{apt.date} • {apt.timeSlot}</td>
                      <td className="py-3.5 px-3">
                        <StatusBadge status={apt.status} />
                      </td>
                      <td className="py-3.5 px-3 text-right">
                        {apt.status === 'COMPLETED' && hasPrescription && (
                          <button
                            onClick={() => handleOpenRxForAppointment(apt._id)}
                            className="px-3 py-1.5 rounded-lg bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-800 text-brand-700 dark:text-brand-300 hover:bg-brand-100 dark:hover:bg-brand-900/60 text-xs font-semibold inline-flex items-center gap-1 transition"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>View Rx</span>
                          </button>
                        )}
                        {apt.status === 'CANCELLED' && (
                          <span className="text-slate-400 dark:text-slate-500 italic">Cancelled</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Cancel Confirmation Dialog Modal */}
      {cancelTarget && (
        <CancelModal
          appointment={cancelTarget}
          onClose={() => setCancelTarget(null)}
          onConfirm={handleCancelAppointment}
        />
      )}

      {/* Digital Prescription View Modal */}
      {viewPrescription && (
        <PrescriptionModal
          prescription={viewPrescription}
          onClose={() => setViewPrescription(null)}
        />
      )}

    </div>
  );
}

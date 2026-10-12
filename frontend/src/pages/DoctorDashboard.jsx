import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';
import StatusBadge from '../components/StatusBadge';
import { 
  Stethoscope, Calendar, Clock, CheckCircle, FilePlus, User, Plus, Trash2, 
  Settings, Zap, AlertCircle, RefreshCw, X 
} from 'lucide-react';

export default function DoctorDashboard({ onNavigate }) {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState(null);

  // Active Appointment for Prescription Issuance
  const [activeAptForRx, setActiveAptForRx] = useState(null);

  // Prescription Form State
  const [diagnosis, setDiagnosis] = useState('');
  const [advice, setAdvice] = useState('Maintain proper hydration, balanced diet, and adequate rest.');
  const [followUpDate, setFollowUpDate] = useState('After 7 days');
  const [medicines, setMedicines] = useState([
    { name: '', dosage: '1 Tablet', frequency: 'Twice daily after meals', duration: '5 Days', instructions: 'Take with warm water' }
  ]);
  const [issuingRx, setIssuingRx] = useState(false);

  // Availability Settings Drawer State
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [consultationFee, setConsultationFee] = useState(85);
  const [availableDays, setAvailableDays] = useState(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']);
  const [savingSettings, setSavingSettings] = useState(false);

  const loadDoctorData = async () => {
    setLoading(true);
    try {
      const [aptRes, rxRes] = await Promise.all([
        api.appointments.getMy(),
        api.prescriptions.getMy()
      ]);
      setAppointments(aptRes.data || []);
      setPrescriptions(rxRes.data || []);
    } catch (err) {
      console.error('Failed to load doctor dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDoctorData();
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Medicine Builder Helpers
  const handleAddMedicine = () => {
    setMedicines([
      ...medicines,
      { name: '', dosage: '1 Tablet', frequency: 'Once daily', duration: '5 Days', instructions: 'Take after meals' }
    ]);
  };

  const handleRemoveMedicine = (index) => {
    setMedicines(medicines.filter((_, i) => i !== index));
  };

  const handleMedicineChange = (index, field, val) => {
    const updated = [...medicines];
    updated[index][field] = val;
    setMedicines(updated);
  };

  // Submit Digital Prescription
  const handlePublishPrescription = async (e) => {
    e.preventDefault();
    if (!diagnosis.trim()) {
      alert('Diagnosis is required');
      return;
    }
    if (medicines.some(m => !m.name.trim())) {
      alert('Please specify medicine names for all rows');
      return;
    }

    setIssuingRx(true);
    try {
      await api.prescriptions.create({
        appointmentId: activeAptForRx._id,
        diagnosis,
        medicines,
        advice,
        followUpDate
      });

      showToast(`Digital Prescription published for ${activeAptForRx.patientName}!`);
      setActiveAptForRx(null);
      // Reset form
      setDiagnosis('');
      setMedicines([{ name: '', dosage: '1 Tablet', frequency: 'Twice daily', duration: '5 Days', instructions: 'Take after meals' }]);
      loadDoctorData();
    } catch (err) {
      alert(err.message || 'Failed to issue prescription');
    } finally {
      setIssuingRx(false);
    }
  };

  // Mark appointment as COMPLETED directly
  const handleMarkComplete = async (aptId) => {
    try {
      await api.appointments.complete(aptId);
      showToast('Appointment status updated to COMPLETED.');
      loadDoctorData();
    } catch (err) {
      alert(err.message || 'Failed to complete appointment');
    }
  };

  // Save Doctor Availability & Trigger Cache Invalidation
  const handleSaveAvailability = async (e) => {
    e.preventDefault();
    setSavingSettings(true);
    try {
      const res = await api.doctors.updateAvailability({
        consultationFee: Number(consultationFee),
        availableDays
      });
      setShowSettingsModal(false);
      showToast(`Schedule updated! Redis cache invalidated (${res.data?.purgedKeysCount || 1} keys cleared).`);
    } catch (err) {
      alert(err.message || 'Failed to update schedule');
    } finally {
      setSavingSettings(false);
    }
  };

  const upcomingPatients = appointments.filter(a => a.status === 'CONFIRMED');
  const completedVisits = appointments.filter(a => a.status === 'COMPLETED');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-2 text-xs font-semibold animate-bounce">
          <CheckCircle className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Doctor Header */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-colors">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-brand-700 dark:text-brand-300 bg-brand-50 dark:bg-brand-950/60 px-2.5 py-1 rounded-full w-fit mb-1 border border-brand-200 dark:border-brand-800">
            <Stethoscope className="w-3.5 h-3.5" />
            <span>Doctor Clinical Console</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-['Outfit'] text-slate-900 dark:text-white">
            {user?.name || 'Physician Portal'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            View patient queue, conduct consultations, and issue official digital prescriptions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSettingsModal(true)}
            className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 font-semibold text-xs flex items-center gap-1.5 transition"
          >
            <Settings className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            <span>Schedule &amp; Fee Settings</span>
          </button>
          <button
            onClick={loadDoctorData}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-600 dark:text-slate-300 transition"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-sm flex items-center justify-between transition-colors">
          <div>
            <span className="text-xs text-slate-400 dark:text-slate-500 font-semibold uppercase">Pending Patient Visits</span>
            <div className="text-2xl font-bold font-['Outfit'] text-brand-600 dark:text-brand-400 mt-1">{upcomingPatients.length}</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 flex items-center justify-center">
            <User className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-sm flex items-center justify-between transition-colors">
          <div>
            <span className="text-xs text-slate-400 dark:text-slate-500 font-semibold uppercase">Consultations Completed</span>
            <div className="text-2xl font-bold font-['Outfit'] text-emerald-600 dark:text-emerald-400 mt-1">{completedVisits.length}</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <CheckCircle className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-sm flex items-center justify-between transition-colors">
          <div>
            <span className="text-xs text-slate-400 dark:text-slate-500 font-semibold uppercase">Prescriptions Issued</span>
            <div className="text-2xl font-bold font-['Outfit'] text-purple-600 dark:text-purple-400 mt-1">{prescriptions.length}</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
            <FilePlus className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* PATIENT APPOINTMENT QUEUE */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 shadow-sm space-y-4 transition-colors">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <h2 className="text-lg font-bold font-['Outfit'] text-slate-900 dark:text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-brand-600 dark:text-brand-400" />
            Scheduled Patient Appointments
          </h2>
          <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">
            {upcomingPatients.length} Active Patients
          </span>
        </div>

        {loading ? (
          <div className="py-8 text-center text-xs text-slate-400 dark:text-slate-500">Loading appointments...</div>
        ) : upcomingPatients.length === 0 ? (
          <div className="py-12 text-center text-slate-400 dark:text-slate-500 space-y-2">
            <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto opacity-70" />
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">All caught up!</h3>
            <p className="text-xs">No pending patient appointments awaiting consultation.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {upcomingPatients.map((apt) => (
              <div
                key={apt._id}
                className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 hover:border-brand-300 dark:hover:border-brand-500/50 transition flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50 dark:bg-slate-850/50"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <StatusBadge status={apt.status} />
                    <span className="font-mono text-xs font-bold text-slate-500 dark:text-slate-400">{apt.appointmentNumber}</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">{apt.patientName}</h3>
                  <div className="text-xs text-slate-500 dark:text-slate-400 flex flex-wrap gap-3">
                    <span className="flex items-center gap-1 text-brand-700 dark:text-brand-300 font-semibold">
                      <Calendar className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
                      {apt.date}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
                      <Clock className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                      {apt.timeSlot}
                    </span>
                  </div>
                  {apt.symptoms && (
                    <div className="text-xs text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 p-2.5 rounded-lg border border-slate-100 dark:border-slate-700/60 mt-2 max-w-xl">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">Patient Symptoms: </span>
                      {apt.symptoms}
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2 self-end md:self-center">
                  <button
                    onClick={() => handleMarkComplete(apt._id)}
                    className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-750 transition"
                  >
                    Mark Done
                  </button>
                  <button
                    onClick={() => setActiveAptForRx(apt)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold bg-brand-600 hover:bg-brand-700 text-white shadow-sm flex items-center gap-1.5 transition"
                  >
                    <FilePlus className="w-4 h-4" />
                    <span>Issue Digital Prescription</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* PRESCRIPTION BUILDER MODAL */}
      {activeAptForRx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-8 transition-colors">
            
            {/* Modal Header */}
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FilePlus className="w-5 h-5 text-brand-400" />
                <h3 className="font-bold text-sm">Issue Digital Prescription &amp; Complete Visit</h3>
              </div>
              <button
                onClick={() => setActiveAptForRx(null)}
                className="p-1 text-slate-400 hover:text-white rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handlePublishPrescription} className="p-6 sm:p-8 space-y-6">
              
              {/* Patient Banner */}
              <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 dark:text-slate-500 block font-medium">PATIENT</span>
                  <strong className="text-slate-900 dark:text-white">{activeAptForRx.patientName}</strong>
                </div>
                <div>
                  <span className="text-slate-400 dark:text-slate-500 block font-medium">APPOINTMENT REF</span>
                  <span className="font-mono font-bold text-slate-700 dark:text-slate-300">{activeAptForRx.appointmentNumber}</span>
                </div>
                <div>
                  <span className="text-slate-400 dark:text-slate-500 block font-medium">SCHEDULE</span>
                  <span className="text-slate-800 dark:text-slate-200">{activeAptForRx.date} • {activeAptForRx.timeSlot}</span>
                </div>
              </div>

              {/* Diagnosis */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Clinical Diagnosis <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  placeholder="E.g., Acute Upper Respiratory Tract Infection, Hypertension Stage 1..."
                  className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 p-2.5 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:bg-white dark:focus:bg-slate-850 focus:outline-none focus:ring-2 focus:ring-brand-500 font-semibold"
                />
              </div>

              {/* Medicines Table Builder */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Prescribed Medications (Rx)
                  </label>
                  <button
                    type="button"
                    onClick={handleAddMedicine}
                    className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Medicine Row</span>
                  </button>
                </div>

                <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold">
                      <tr>
                        <th className="p-2.5">Medicine Name</th>
                        <th className="p-2.5">Dosage</th>
                        <th className="p-2.5">Frequency</th>
                        <th className="p-2.5">Duration</th>
                        <th className="p-2.5 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {medicines.map((med, idx) => (
                        <tr key={idx} className="bg-white dark:bg-slate-850">
                          <td className="p-2">
                            <input
                              type="text"
                              required
                              placeholder="E.g., Amoxicillin 500mg"
                              value={med.name}
                              onChange={(e) => handleMedicineChange(idx, 'name', e.target.value)}
                              className="w-full p-1.5 border border-slate-200 dark:border-slate-700 rounded-lg text-xs bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100"
                            />
                          </td>
                          <td className="p-2">
                            <input
                              type="text"
                              placeholder="1 Cap / 5ml"
                              value={med.dosage}
                              onChange={(e) => handleMedicineChange(idx, 'dosage', e.target.value)}
                              className="w-full p-1.5 border border-slate-200 dark:border-slate-700 rounded-lg text-xs bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100"
                            />
                          </td>
                          <td className="p-2">
                            <input
                              type="text"
                              placeholder="Twice daily"
                              value={med.frequency}
                              onChange={(e) => handleMedicineChange(idx, 'frequency', e.target.value)}
                              className="w-full p-1.5 border border-slate-200 dark:border-slate-700 rounded-lg text-xs bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100"
                            />
                          </td>
                          <td className="p-2">
                            <input
                              type="text"
                              placeholder="7 Days"
                              value={med.duration}
                              onChange={(e) => handleMedicineChange(idx, 'duration', e.target.value)}
                              className="w-full p-1.5 border border-slate-200 dark:border-slate-700 rounded-lg text-xs bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100"
                            />
                          </td>
                          <td className="p-2 text-center">
                            {medicines.length > 1 && (
                              <button
                                type="button"
                                onClick={() => handleRemoveMedicine(idx)}
                                className="text-rose-500 hover:text-rose-700 p-1"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Lifestyle Advice & Follow Up */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Dietary &amp; Clinical Advice
                  </label>
                  <textarea
                    rows={2}
                    value={advice}
                    onChange={(e) => setAdvice(e.target.value)}
                    className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 p-2.5 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:bg-white dark:focus:bg-slate-850 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Follow-Up Review Timeline
                  </label>
                  <input
                    type="text"
                    value={followUpDate}
                    onChange={(e) => setFollowUpDate(e.target.value)}
                    placeholder="E.g., After 7 days / In 2 weeks"
                    className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 p-2.5 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:bg-white dark:focus:bg-slate-850 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setActiveAptForRx(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={issuingRx}
                  className="px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-md transition disabled:opacity-50 flex items-center gap-2"
                >
                  <FilePlus className="w-4 h-4" />
                  <span>{issuingRx ? 'Publishing Digital Rx...' : 'Publish Prescription & Complete Visit'}</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* SCHEDULE & FEE SETTINGS DRAWER */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-brand-400" />
                <h3 className="font-bold text-sm">Doctor Availability &amp; Cache Invalidation</h3>
              </div>
              <button
                onClick={() => setShowSettingsModal(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAvailability} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Consultation Fee ($ USD)
                </label>
                <input
                  type="number"
                  value={consultationFee}
                  onChange={(e) => setConsultationFee(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 p-2.5 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-bold text-sm"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Active Clinical Consultation Days
                </label>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day) => (
                    <label key={day} className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={availableDays.includes(day)}
                        onChange={(e) => {
                          if (e.target.checked) setAvailableDays([...availableDays, day]);
                          else setAvailableDays(availableDays.filter(d => d !== day));
                        }}
                        className="rounded text-brand-600 focus:ring-brand-500"
                      />
                      <span className="font-medium text-slate-700 dark:text-slate-300">{day}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Cache Invalidation Explanation Callout */}
              <div className="p-3 bg-purple-50 dark:bg-purple-950/60 rounded-xl border border-purple-200 dark:border-purple-800 text-purple-900 dark:text-purple-200 flex items-start gap-2">
                <Zap className="w-4 h-4 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-[11px]">HLD Cache Invalidation Hook:</strong>
                  Saving updates doctor availability in MongoDB and immediately flushes the Redis profile cache so patients instantly see updated slots.
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowSettingsModal(false)}
                  className="px-4 py-2 font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingSettings}
                  className="px-5 py-2 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl shadow-sm disabled:opacity-50"
                >
                  {savingSettings ? 'Flushing Cache & Saving...' : 'Save & Invalidate Cache'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

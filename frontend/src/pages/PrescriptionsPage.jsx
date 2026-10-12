import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import PrescriptionModal from '../components/PrescriptionModal';
import { FileText, Printer, Stethoscope, Calendar, Search, RefreshCw, Pill } from 'lucide-react';

export default function PrescriptionsPage() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRx, setSelectedRx] = useState(null);
  const [search, setSearch] = useState('');

  const loadPrescriptions = async () => {
    setLoading(true);
    try {
      const res = await api.prescriptions.getMy();
      setPrescriptions(res.data || []);
    } catch (err) {
      console.error('Failed to load prescriptions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPrescriptions();
  }, []);

  const filtered = prescriptions.filter(p => 
    p.doctorName.toLowerCase().includes(search.toLowerCase()) ||
    p.diagnosis.toLowerCase().includes(search.toLowerCase()) ||
    p.prescriptionNumber.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-['Outfit'] text-slate-900 dark:text-white">
            Digital Prescriptions
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Cryptographically authenticated medical prescriptions with dosage plans and instructions.
          </p>
        </div>

        <button
          onClick={loadPrescriptions}
          className="p-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 rounded-xl text-slate-600 dark:text-slate-300 transition"
          title="Refresh"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Search Filter */}
      <div className="max-w-md flex items-center gap-2 px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm transition-colors">
        <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 flex-shrink-0" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by doctor, diagnosis, or Rx reference..."
          className="w-full text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 bg-transparent focus:outline-none"
        />
      </div>

      {/* Prescriptions List */}
      {loading ? (
        <div className="py-12 text-center text-xs text-slate-400 dark:text-slate-500">Loading digital prescriptions...</div>
      ) : filtered.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-12 text-center space-y-3 transition-colors">
          <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 flex items-center justify-center mx-auto">
            <FileText className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">No Prescriptions Found</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            Prescriptions issued by doctors following completed consultations will be securely archived here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((rx) => (
            <div
              key={rx._id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-sm p-6 flex flex-col justify-between hover:shadow-md hover:border-brand-300 dark:hover:border-brand-500/50 transition group"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <span className="font-mono text-xs font-bold text-brand-700 dark:text-brand-300 bg-brand-50 dark:bg-brand-950/60 px-2.5 py-0.5 rounded-md border border-brand-200 dark:border-brand-800">
                    {rx.prescriptionNumber}
                  </span>
                  <span className="text-[11px] text-slate-400 dark:text-slate-500">
                    {new Date(rx.issuedAt).toLocaleDateString()}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition">
                    {rx.diagnosis}
                  </h3>
                  <div className="text-xs text-slate-600 dark:text-slate-300 flex items-center gap-1.5 mt-1">
                    <Stethoscope className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
                    <span>{rx.doctorName}</span>
                    <span className="text-slate-400 dark:text-slate-500">• {rx.doctorSpecialization}</span>
                  </div>
                </div>

                {/* Medicines List Preview */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1.5">
                  <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                    Prescribed Medicines ({rx.medicines?.length || 0})
                  </span>
                  <div className="space-y-1">
                    {(rx.medicines || []).slice(0, 2).map((m, idx) => (
                      <div key={idx} className="text-xs flex items-center justify-between text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 p-1.5 rounded-lg border border-slate-100 dark:border-slate-700/60">
                        <span className="font-medium truncate">{m.name}</span>
                        <span className="text-slate-500 dark:text-slate-400 text-[11px] font-mono">{m.frequency}</span>
                      </div>
                    ))}
                    {(rx.medicines?.length || 0) > 2 && (
                      <div className="text-[10px] text-slate-400 dark:text-slate-500 italic">
                        +{rx.medicines.length - 2} additional medications
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 dark:text-slate-500">CareSync Verified</span>
                <button
                  onClick={() => setSelectedRx(rx)}
                  className="px-3 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-sm transition flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>View / Print Rx</span>
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Prescription View Modal */}
      {selectedRx && (
        <PrescriptionModal
          prescription={selectedRx}
          onClose={() => setSelectedRx(null)}
        />
      )}

    </div>
  );
}

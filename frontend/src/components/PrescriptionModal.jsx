import React from 'react';
import { Printer, X, FileText, Pill, Calendar, User, Stethoscope } from 'lucide-react';

export default function PrescriptionModal({ prescription, onClose }) {
  if (!prescription) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        
        {/* Modal Top Bar (Hidden in Print) */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-brand-400" />
            <h3 className="font-semibold text-sm">Official Digital Prescription</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="px-3 py-1.5 bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Prescription</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Medical Document Body */}
        <div id="printable-prescription" className="p-8 bg-white text-slate-800">
          
          {/* Clinic / Doctor Header */}
          <div className="border-b-2 border-brand-600 pb-5 mb-6 flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 text-brand-700 font-bold text-xl font-['Outfit']">
                <Stethoscope className="w-6 h-6 text-brand-600" />
                <span>{prescription.doctorName}</span>
              </div>
              <p className="text-sm font-semibold text-slate-700">{prescription.doctorSpecialization}</p>
              <p className="text-xs text-slate-500">CareSync Digital Health Network</p>
            </div>

            <div className="text-right">
              <span className="inline-block px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-slate-100 text-slate-700 mb-1">
                {prescription.prescriptionNumber}
              </span>
              <p className="text-xs text-slate-500">
                Date: <strong>{new Date(prescription.issuedAt).toLocaleDateString()}</strong>
              </p>
            </div>
          </div>

          {/* Patient Details Bar */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 mb-6 flex flex-wrap justify-between gap-4 text-xs">
            <div>
              <span className="text-slate-400 block font-medium">PATIENT NAME</span>
              <span className="font-bold text-slate-900 text-sm">{prescription.patientName}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">DIAGNOSIS</span>
              <span className="font-bold text-brand-700 text-sm">{prescription.diagnosis}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">APPOINTMENT ID</span>
              <span className="font-mono text-slate-700">{prescription.appointmentId}</span>
            </div>
          </div>

          {/* Rx Symbol & Medication List */}
          <div className="mb-6">
            <div className="text-3xl font-serif font-black text-brand-600 mb-2">℞</div>
            
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100/80 text-slate-600 border-b border-slate-200">
                    <th className="py-2.5 px-3 font-semibold">Medicine &amp; Dosage</th>
                    <th className="py-2.5 px-3 font-semibold">Frequency</th>
                    <th className="py-2.5 px-3 font-semibold">Duration</th>
                    <th className="py-2.5 px-3 font-semibold">Instructions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {(prescription.medicines || []).map((med, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50">
                      <td className="py-3 px-3">
                        <div className="font-bold text-slate-900">{med.name}</div>
                        <div className="text-slate-500 text-[11px]">{med.dosage}</div>
                      </td>
                      <td className="py-3 px-3 font-medium text-slate-700">{med.frequency}</td>
                      <td className="py-3 px-3 text-slate-600">{med.duration}</td>
                      <td className="py-3 px-3 text-slate-600">{med.instructions}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Clinical Advice & Follow-Up */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 text-xs">
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
              <span className="font-bold text-slate-800 block mb-1">Dietary &amp; Lifestyle Advice</span>
              <p className="text-slate-600">{prescription.advice || 'Drink plenty of water and get sufficient rest.'}</p>
            </div>
            <div className="p-3.5 bg-brand-50/50 rounded-xl border border-brand-200/50">
              <span className="font-bold text-brand-900 block mb-1">Follow-Up Review</span>
              <p className="text-brand-700">{prescription.followUpDate || 'Review after 1 week if symptoms persist.'}</p>
            </div>
          </div>

          {/* Doctor Signature Block */}
          <div className="pt-6 border-t border-slate-200 flex justify-between items-end">
            <div className="text-[11px] text-slate-400">
              Generated by CareSync Verified Tele-Health System • Valid Digital Rx
            </div>
            <div className="text-right">
              <div className="font-['Outfit'] font-bold text-slate-800 text-sm italic underline decoration-brand-500">
                {prescription.doctorName}
              </div>
              <p className="text-[10px] text-slate-400">Digitally Signed &amp; Timestamped</p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

import React from 'react';
import { Star, MapPin, Building, Calendar, ArrowRight } from 'lucide-react';

export default function DoctorCard({ doctor, onSelectDoctor, onBookDirect }) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-brand-500/40 dark:hover:border-brand-500/50 transition-all duration-200 flex flex-col justify-between overflow-hidden group">
      
      {/* Top Banner / Avatar */}
      <div className="p-5 pb-4">
        <div className="flex items-start gap-4">
          <div className="relative flex-shrink-0">
            <img
              src={doctor.image || "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&auto=format&fit=crop&q=80"}
              alt={doctor.name}
              className="w-20 h-20 rounded-xl object-cover border border-slate-100 dark:border-slate-800 shadow-sm"
              loading="lazy"
            />
            <div className="absolute -bottom-1 -right-1 bg-white dark:bg-slate-800 rounded-md px-1.5 py-0.5 shadow-sm border border-slate-100 dark:border-slate-700 flex items-center gap-0.5 text-[10px] font-bold text-amber-500">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span>{doctor.rating}</span>
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 border border-brand-200/60 dark:border-brand-800/60 mb-1">
              {doctor.specialization}
            </span>
            <h3 className="text-base font-bold text-slate-900 dark:text-white truncate group-hover:text-brand-600 dark:group-hover:text-brand-400 transition">
              {doctor.name}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate mb-1">
              {doctor.qualifications} • {doctor.experienceYears} yrs exp.
            </p>
            <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 truncate">
              <Building className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 flex-shrink-0" />
              <span className="truncate">{doctor.hospital}</span>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1 truncate">
            <MapPin className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
            <span className="truncate">{doctor.location}</span>
          </div>
          <div className="flex items-center gap-1 font-medium text-slate-700 dark:text-slate-300">
            <Calendar className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
            <span>{doctor.availableSlots?.length || 6} Slots Today</span>
          </div>
        </div>
      </div>

      {/* Card Action Footer */}
      <div className="px-5 py-3.5 bg-slate-50/70 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <div>
          <span className="text-[11px] text-slate-400 dark:text-slate-500 block">Consultation Fee</span>
          <span className="text-base font-bold text-slate-900 dark:text-white">${doctor.consultationFee}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onSelectDoctor(doctor)}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-700/60 transition"
          >
            Profile
          </button>
          <button
            onClick={() => onBookDirect(doctor)}
            className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-brand-600 hover:bg-brand-700 text-white shadow-sm transition flex items-center gap-1"
          >
            <span>Book Slot</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>

    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import { Star, MapPin, Building, Calendar, Clock, ArrowLeft, ShieldCheck, CheckCircle } from 'lucide-react';

export default function DoctorProfilePage({ doctor, onBack, onBookSlot }) {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [availability, setAvailability] = useState(null);
  const [loadingSlots, setLoadingSlots] = useState(true);

  // Generate the next 7 days for the date selector
  const nextDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return {
      full: d.toISOString().split('T')[0],
      dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
      dateNum: d.getDate(),
      monthName: d.toLocaleDateString('en-US', { month: 'short' })
    };
  });

  useEffect(() => {
    let isMounted = true;
    async function loadAvailability() {
      setLoadingSlots(true);
      try {
        const res = await api.doctors.getAvailability(doctor._id, selectedDate);
        if (isMounted) {
          setAvailability(res.data);
          setSelectedSlot(null); // Reset slot on date change
        }
      } catch (err) {
        console.error('Failed to load slots:', err);
      } finally {
        if (isMounted) setLoadingSlots(false);
      }
    }

    if (doctor?._id) {
      loadAvailability();
    }
    return () => { isMounted = false; };
  }, [doctor?._id, selectedDate]);

  if (!doctor) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Back Button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Doctor Directory</span>
      </button>

      {/* Doctor Summary Header Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 shadow-sm transition-colors">
        <div className="flex flex-col sm:flex-row items-start gap-6">
          <img
            src={doctor.image}
            alt={doctor.name}
            className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl object-cover border border-slate-100 dark:border-slate-800 shadow-md"
          />

          <div className="flex-1 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800">
                {doctor.specialization}
              </span>
              <div className="flex items-center gap-1 text-xs font-bold text-amber-500 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-md border border-amber-200/60 dark:border-amber-800/60">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{doctor.rating}</span>
                <span className="text-slate-400 dark:text-slate-500 font-normal">({doctor.reviewCount} reviews)</span>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold font-['Outfit'] text-slate-900 dark:text-white">
              {doctor.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium">
              {doctor.qualifications} • {doctor.experienceYears} Years Clinical Practice
            </p>

            <div className="pt-1 flex flex-wrap gap-4 text-xs text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-1.5">
                <Building className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                <span>{doctor.hospital}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                <span>{doctor.location}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-400 dark:text-slate-500 block font-semibold uppercase">Consultation Fee</span>
                <span className="text-xl font-extrabold text-slate-900 dark:text-white">${doctor.consultationFee}</span>
                <span className="text-xs text-slate-400 dark:text-slate-500"> / session</span>
              </div>
            </div>
          </div>
        </div>

        {/* Doctor Biography */}
        <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 space-y-2">
          <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            About the Specialist
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {doctor.about}
          </p>
        </div>
      </div>

      {/* Interactive Slot Booking Section */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6 transition-colors">
        <div>
          <h2 className="text-xl font-bold font-['Outfit'] text-slate-900 dark:text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-brand-600 dark:text-brand-400" />
            Select Date &amp; Available Time Slot
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time slot availability retrieved from the Doctor Microservice. Booked slots are atomically locked.
          </p>
        </div>

        {/* Date Selector Pills */}
        <div>
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider">
            Appointment Date
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
            {nextDays.map((d) => (
              <button
                key={d.full}
                onClick={() => setSelectedDate(d.full)}
                className={`p-3 rounded-2xl border text-center transition ${
                  selectedDate === d.full
                    ? 'bg-brand-600 text-white border-brand-600 shadow-md ring-2 ring-brand-500/20'
                    : 'bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-750'
                }`}
              >
                <div className="text-[11px] uppercase font-semibold opacity-80">{d.dayName}</div>
                <div className="text-lg font-bold font-['Outfit'] my-0.5">{d.dateNum}</div>
                <div className="text-[10px] opacity-80">{d.monthName}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Time Slot Picker Grid */}
        <div>
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider">
            <span>Available Slots for {new Date(selectedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            {availability && (
              <span className="text-emerald-600 dark:text-emerald-400 font-bold capitalize">
                {availability.availableCount} of {availability.totalSlots} Slots Open
              </span>
            )}
          </div>

          {loadingSlots ? (
            <div className="py-8 text-center text-xs text-slate-400 dark:text-slate-500">Loading live slot schedule...</div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {(availability?.slots || []).map((slotObj, idx) => (
                <button
                  key={idx}
                  disabled={!slotObj.isAvailable}
                  onClick={() => setSelectedSlot(slotObj.time)}
                  className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-between transition ${
                    !slotObj.isAvailable
                      ? 'bg-slate-100 dark:bg-slate-800/40 text-slate-400 dark:text-slate-600 border-slate-200 dark:border-slate-800 cursor-not-allowed line-through'
                      : selectedSlot === slotObj.time
                      ? 'bg-brand-600 text-white border-brand-600 shadow-md'
                      : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-brand-500 dark:hover:border-brand-400 hover:bg-brand-50/50 dark:hover:bg-brand-950/30'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{slotObj.time}</span>
                  </span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                    !slotObj.isAvailable
                      ? 'bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-500'
                      : selectedSlot === slotObj.time
                      ? 'bg-white/20 text-white'
                      : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                  }`}>
                    {slotObj.isAvailable ? 'OPEN' : 'BOOKED'}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Booking CTA Bar */}
        <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-600 dark:text-slate-400">
            Selected: <strong className="text-slate-900 dark:text-white">{selectedDate}</strong> at <strong className="text-slate-900 dark:text-white">{selectedSlot || 'Select a time slot'}</strong>
          </div>

          <button
            disabled={!selectedSlot}
            onClick={() => onBookSlot(doctor, selectedDate, selectedSlot)}
            className="w-full sm:w-auto px-8 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-sm shadow-md transition"
          >
            Continue to Appointment Booking
          </button>
        </div>

      </div>

    </div>
  );
}

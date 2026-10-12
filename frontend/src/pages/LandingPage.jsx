import React, { useState } from 'react';
import { Search, Stethoscope, Shield, Clock, Calendar, ArrowRight, Star, Heart, CheckCircle2, Cpu } from 'lucide-react';
import DoctorCard from '../components/DoctorCard';

export default function LandingPage({ doctors = [], onSelectDoctor, onBookDirect, onNavigate }) {
  const [searchTerm, setSearchTerm] = useState('');

  const specialties = [
    { name: 'Cardiology', icon: '❤️', count: '14 Specialists' },
    { name: 'Dermatology', icon: '✨', count: '10 Specialists' },
    { name: 'Neurology', icon: '🧠', count: '8 Specialists' },
    { name: 'Pediatrics', icon: '👶', count: '12 Specialists' },
    { name: 'Orthopedics', icon: '🦴', count: '9 Specialists' },
    { name: 'General Medicine', icon: '🩺', count: '18 Specialists' }
  ];

  const handleHeroSearch = (e) => {
    e.preventDefault();
    onNavigate('doctors', { search: searchTerm });
  };

  return (
    <div className="space-y-20 pb-16">
      
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-10 pb-16 lg:pt-16 lg:pb-24 bg-gradient-to-b from-brand-50/50 via-white to-slate-50 dark:from-slate-900/60 dark:via-slate-950 dark:to-slate-950 border-b border-slate-200/60 dark:border-slate-800/80 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-100/70 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-800/80 text-brand-800 dark:text-brand-300 text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-brand-600 dark:bg-brand-400 animate-ping"></span>
                <span>Next-Gen Healthcare Scheduling • HLD Architecture</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-['Outfit'] text-slate-900 dark:text-white tracking-tight leading-[1.15]">
                Precision Healthcare, <br />
                <span className="bg-gradient-to-r from-brand-600 to-primary-600 dark:from-brand-400 dark:to-primary-400 bg-clip-text text-transparent">
                  Scheduled Seamlessly.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed">
                Connect with verified specialists in minutes. Book guaranteed consultation slots with atomic concurrency protection and receive verified digital prescriptions.
              </p>

              {/* Quick Hero Search Bar */}
              <form onSubmit={handleHeroSearch} className="bg-white dark:bg-slate-900 p-2 sm:p-2.5 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800 max-w-xl flex flex-col sm:flex-row gap-2 transition-colors">
                <div className="flex-1 flex items-center gap-2.5 px-3">
                  <Search className="w-5 h-5 text-slate-400 dark:text-slate-500 flex-shrink-0" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search doctor, condition, or specialty..."
                    className="w-full text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 bg-transparent focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm shadow-md shadow-brand-500/20 transition flex items-center justify-center gap-2"
                >
                  <span>Find Doctor</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* Trust Indicators */}
              <div className="pt-2 flex flex-wrap items-center gap-6 text-xs text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                  <span>Atomic Slot Reservation</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                  <span>Redis-Cached Search</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                  <span>Verified Digital Rx</span>
                </div>
              </div>

            </div>

            {/* Right Card Visual */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-100 dark:border-slate-800 transition-colors">
                
                {/* Floating Telemetry Badge */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Express Gateway Active</span>
                  </div>
                  <button
                    onClick={() => onNavigate('hld')}
                    className="text-[11px] font-semibold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
                  >
                    <Cpu className="w-3.5 h-3.5" />
                    <span>View HLD Metrics</span>
                  </button>
                </div>

                {/* Doctor Highlight in Hero */}
                {doctors[0] ? (
                  <DoctorCard
                    doctor={doctors[0]}
                    onSelectDoctor={onSelectDoctor}
                    onBookDirect={onBookDirect}
                  />
                ) : (
                  <div className="h-64 flex items-center justify-center text-slate-400">Loading specialist...</div>
                )}

                {/* Trust stats below card */}
                <div className="mt-5 grid grid-cols-3 gap-3 text-center pt-4 border-t border-slate-100 dark:border-slate-800">
                  <div>
                    <div className="text-xl font-bold font-['Outfit'] text-slate-900 dark:text-white">99.8%</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">On-Time Visits</div>
                  </div>
                  <div>
                    <div className="text-xl font-bold font-['Outfit'] text-brand-600 dark:text-brand-400">0.0%</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">Double Bookings</div>
                  </div>
                  <div>
                    <div className="text-xl font-bold font-['Outfit'] text-slate-900 dark:text-white">4.9/5</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">Doctor Rating</div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SPECIALTY CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold font-['Outfit'] text-slate-900 dark:text-white">
              Browse by Medical Specialty
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Consult top doctors across verified clinical disciplines.
            </p>
          </div>
          <button
            onClick={() => onNavigate('doctors')}
            className="mt-4 md:mt-0 text-sm font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 flex items-center gap-1"
          >
            <span>View All Specialists</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {specialties.map((spec, i) => (
            <div
              key={i}
              onClick={() => onNavigate('doctors', { specialization: spec.name })}
              className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 hover:border-brand-500/50 dark:hover:border-brand-500/50 hover:shadow-md cursor-pointer transition text-center group"
            >
              <div className="text-3xl mb-3 group-hover:scale-110 transition transform">{spec.icon}</div>
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition truncate">{spec.name}</h4>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">{spec.count}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURED SPECIALISTS GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold font-['Outfit'] text-slate-900 dark:text-white">
              Top Rated Physicians
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Verified clinical experts available for in-clinic and video consultations.
            </p>
          </div>
          <button
            onClick={() => onNavigate('doctors')}
            className="text-sm font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 flex items-center gap-1"
          >
            <span>See More</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.slice(0, 6).map((doc) => (
            <DoctorCard
              key={doc._id}
              doctor={doc}
              onSelectDoctor={onSelectDoctor}
              onBookDirect={onBookDirect}
            />
          ))}
        </div>
      </section>

      {/* HOW IT WORKS / ARCHITECTURAL PIPELINE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 dark:from-slate-900 dark:to-slate-950 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden border border-slate-800">
          <div className="relative z-10">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <span className="text-xs uppercase tracking-wider text-brand-400 font-bold">End-to-End Workflow</span>
              <h3 className="text-2xl sm:text-3xl font-bold font-['Outfit'] mt-1">How CareSync Powers Your Visit</h3>
              <p className="text-slate-400 text-xs sm:text-sm mt-2">
                From finding your doctor to receiving digital Rx documents in a unified flow.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-slate-800/60 dark:bg-slate-900/60 p-6 rounded-2xl border border-slate-700/60 dark:border-slate-800">
                <div className="w-10 h-10 rounded-xl bg-brand-500/20 text-brand-400 flex items-center justify-center font-bold text-lg mb-4">
                  1
                </div>
                <h4 className="font-bold text-base mb-1">Search &amp; Pick Slot</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Browse doctors powered by Redis-cached profiles. Select an available time slot calculated dynamically against booked schedules.
                </p>
              </div>

              <div className="bg-slate-800/60 dark:bg-slate-900/60 p-6 rounded-2xl border border-slate-700/60 dark:border-slate-800">
                <div className="w-10 h-10 rounded-xl bg-primary-500/20 text-primary-400 flex items-center justify-center font-bold text-lg mb-4">
                  2
                </div>
                <h4 className="font-bold text-base mb-1">Atomic Slot Lock</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  The API Gateway and Appointment Service atomically reserve the slot to guarantee no double bookings under high traffic.
                </p>
              </div>

              <div className="bg-slate-800/60 dark:bg-slate-900/60 p-6 rounded-2xl border border-slate-700/60 dark:border-slate-800">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-lg mb-4">
                  3
                </div>
                <h4 className="font-bold text-base mb-1">Consult &amp; Digital Rx</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Following the consultation, the doctor marks the visit complete and issues an official printable prescription with medicines and dosages.
                </p>
              </div>
            </div>

            <div className="mt-10 text-center">
              <button
                onClick={() => onNavigate('hld')}
                className="px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs sm:text-sm transition inline-flex items-center gap-2"
              >
                <Cpu className="w-4 h-4" />
                <span>Explore Interactive System Design (HLD) Dashboard</span>
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

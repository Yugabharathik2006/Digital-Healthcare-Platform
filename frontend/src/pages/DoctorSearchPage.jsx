import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import DoctorCard from '../components/DoctorCard';
import { Search, Filter, Database, Zap, RefreshCw, X } from 'lucide-react';

export default function DoctorSearchPage({ onSelectDoctor, onBookDirect, initialFilter = {} }) {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cacheSource, setCacheSource] = useState(null);
  const [isCacheHit, setIsCacheHit] = useState(false);
  
  // Filter States
  const [search, setSearch] = useState(initialFilter.search || '');
  const [specialization, setSpecialization] = useState(initialFilter.specialization || 'All');
  const [location, setLocation] = useState('All');
  const [sortBy, setSortBy] = useState('rating');

  const specialtiesList = [
    'All',
    'Cardiology',
    'Dermatology',
    'Neurology',
    'Pediatrics',
    'Orthopedics',
    'General Medicine'
  ];

  const locationsList = ['All', 'New York, NY', 'San Francisco, CA', 'Boston, MA', 'Chicago, IL', 'Austin, TX', 'Seattle, WA'];

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (specialization !== 'All') params.specialization = specialization;
      if (location !== 'All') params.location = location;

      const res = await api.doctors.getAll(params);
      const data = res.data;

      setDoctors(data.doctors || []);
      setCacheSource(data.source);
      setIsCacheHit(data.cacheHit);
    } catch (err) {
      console.error('Failed to fetch doctors:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, [specialization, location]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchDoctors();
  };

  const handleResetFilters = () => {
    setSearch('');
    setSpecialization('All');
    setLocation('All');
    setSortBy('rating');
  };

  // Sorting
  const sortedDoctors = [...doctors].sort((a, b) => {
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'fee-low') return a.consultationFee - b.consultationFee;
    if (sortBy === 'fee-high') return b.consultationFee - a.consultationFee;
    if (sortBy === 'experience') return b.experienceYears - a.experienceYears;
    return 0;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header & Redis Telemetry Badge */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-['Outfit'] text-slate-900 dark:text-white">
            Find &amp; Book Specialists
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Browse verified clinical physicians with live slot schedules.
          </p>
        </div>

        {/* Real-Time Cache Source Status */}
        {cacheSource && (
          <div className="flex items-center gap-2 self-start md:self-auto">
            <div className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-2 shadow-sm ${
              isCacheHit 
                ? 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800 ring-1 ring-purple-400/20' 
                : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 ring-1 ring-emerald-400/20'
            }`}>
              {isCacheHit ? (
                <>
                  <Zap className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 animate-pulse" />
                  <span>Redis Cache Hit (<strong className="font-mono">&lt; 1ms</strong>)</span>
                </>
              ) : (
                <>
                  <Database className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>MongoDB Query (Cached for 300s)</span>
                </>
              )}
            </div>
            <button
              onClick={fetchDoctors}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
              title="Refresh / Trigger Cache Hit"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Search & Filter Controls Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-5 shadow-sm space-y-4 transition-colors">
        
        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="flex-1 flex items-center gap-2.5 px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus-within:bg-white dark:focus-within:bg-slate-850 focus-within:ring-2 focus-within:ring-brand-500 transition">
            <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 flex-shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search doctor name, hospital, or symptoms..."
              className="w-full text-xs sm:text-sm bg-transparent focus:outline-none text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
            />
            {search && (
              <button type="button" onClick={() => setSearch('')} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-sm transition"
          >
            Search
          </button>
        </form>

        {/* Specialization Filter Pills */}
        <div>
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider">
            Filter Specialty
          </div>
          <div className="flex flex-wrap gap-1.5">
            {specialtiesList.map((spec) => (
              <button
                key={spec}
                onClick={() => setSpecialization(spec)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition ${
                  specialization === spec
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {spec}
              </button>
            ))}
          </div>
        </div>

        {/* Location & Sort Dropdowns */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-500 dark:text-slate-400">Location:</span>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 font-medium text-slate-700 dark:text-slate-200 focus:outline-none"
              >
                {locationsList.map((loc) => (
                  <option key={loc} value={loc} className="dark:bg-slate-800 dark:text-slate-200">{loc}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-500 dark:text-slate-400">Sort By:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 font-medium text-slate-700 dark:text-slate-200 focus:outline-none"
              >
                <option value="rating" className="dark:bg-slate-800 dark:text-slate-200">Highest Rated</option>
                <option value="experience" className="dark:bg-slate-800 dark:text-slate-200">Most Experienced</option>
                <option value="fee-low" className="dark:bg-slate-800 dark:text-slate-200">Fee: Low to High</option>
                <option value="fee-high" className="dark:bg-slate-800 dark:text-slate-200">Fee: High to Low</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-slate-400 dark:text-slate-500">
              Showing <strong>{sortedDoctors.length}</strong> verified doctors
            </span>
            <button
              onClick={handleResetFilters}
              className="text-brand-600 dark:text-brand-400 hover:underline font-semibold"
            >
              Reset Filters
            </button>
          </div>
        </div>

      </div>

      {/* Doctors Grid */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-8 h-8 border-3 border-brand-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs text-slate-500 dark:text-slate-400">Fetching specialist directory from API Gateway...</p>
        </div>
      ) : sortedDoctors.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 flex items-center justify-center mx-auto">
            <Filter className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">No doctors found matching criteria</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            Try broadening your search term or select 'All' for specialty and location.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 bg-brand-600 text-white text-xs font-semibold rounded-xl hover:bg-brand-700 transition"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedDoctors.map((doc) => (
            <DoctorCard
              key={doc._id}
              doctor={doc}
              onSelectDoctor={onSelectDoctor}
              onBookDirect={onBookDirect}
            />
          ))}
        </div>
      )}

    </div>
  );
}

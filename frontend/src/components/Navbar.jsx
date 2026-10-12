import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';
import { Activity, User, Shield, Stethoscope, Calendar, FileText, Cpu, LogOut, ChevronDown, CheckCircle } from 'lucide-react';

export default function Navbar({ currentTab, onNavigate }) {
  const { user, role, logout, loginDemo, isAuthenticated } = useAuth();
  const [demoMenuOpen, setDemoMenuOpen] = useState(false);

  const handleDemoSwitch = async (targetRole) => {
    try {
      await loginDemo(targetRole);
      setDemoMenuOpen(false);
      if (targetRole === 'admin') onNavigate('admin');
      else if (targetRole === 'doctor') onNavigate('doctor-dashboard');
      else onNavigate('patient-dashboard');
    } catch (err) {
      console.error('Failed to switch demo account:', err);
    }
  };

  return (
    <header className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('landing')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-primary-600 flex items-center justify-center text-white shadow-md shadow-brand-500/20">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl font-bold font-['Outfit'] tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
                Care<span className="text-brand-600 dark:text-brand-400">Sync</span>
                <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800">HLD</span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 hidden sm:block">Digital Healthcare &amp; Prescription Platform</p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              onClick={() => onNavigate('landing')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                currentTab === 'landing' 
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold' 
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => onNavigate('doctors')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition flex items-center gap-1.5 ${
                currentTab === 'doctors' 
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold' 
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60'
              }`}
            >
              <Stethoscope className="w-4 h-4 text-brand-600 dark:text-brand-400" />
              Find Doctors
            </button>

            {isAuthenticated && role === 'patient' && (
              <>
                <button
                  onClick={() => onNavigate('patient-dashboard')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition flex items-center gap-1.5 ${
                    currentTab === 'patient-dashboard' 
                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold' 
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <Calendar className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                  My Appointments
                </button>
                <button
                  onClick={() => onNavigate('prescriptions')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition flex items-center gap-1.5 ${
                    currentTab === 'prescriptions' 
                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold' 
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <FileText className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  Prescriptions
                </button>
              </>
            )}

            {isAuthenticated && role === 'doctor' && (
              <button
                onClick={() => onNavigate('doctor-dashboard')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition flex items-center gap-1.5 ${
                  currentTab === 'doctor-dashboard' 
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold' 
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60'
                }`}
              >
                <Stethoscope className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                Doctor Portal
              </button>
            )}

            {isAuthenticated && role === 'admin' && (
              <button
                onClick={() => onNavigate('admin')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition flex items-center gap-1.5 ${
                  currentTab === 'admin' 
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold' 
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60'
                }`}
              >
                <Shield className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                Admin Panel
              </button>
            )}

            <button
              onClick={() => onNavigate('hld')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition flex items-center gap-1.5 ${
                currentTab === 'hld' 
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold' 
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60'
              }`}
            >
              <Cpu className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              HLD Architecture
            </button>
          </nav>

          {/* Right Header Area: Theme Toggle, Demo Role Switcher & Auth */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Desktop & Mobile Light/Dark Theme Switcher */}
            <ThemeToggle />

            {/* Quick Demo Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setDemoMenuOpen(!demoMenuOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-medium border border-slate-200 dark:border-slate-700 transition"
                title="Instant 1-Click Role Switcher"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Demo: <strong className="capitalize">{role}</strong></span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {demoMenuOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-100 dark:border-slate-800 py-2 z-50">
                  <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    Switch Test Account
                  </div>
                  <button
                    onClick={() => handleDemoSwitch('patient')}
                    className="w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition"
                  >
                    <div className="flex items-center gap-2">
                      <User className="w-3.5 h-3.5 text-primary-600 dark:text-primary-400" />
                      <span>Patient (John Doe)</span>
                    </div>
                    {role === 'patient' && <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />}
                  </button>

                  <button
                    onClick={() => handleDemoSwitch('doctor')}
                    className="w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition"
                  >
                    <div className="flex items-center gap-2">
                      <Stethoscope className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
                      <span>Doctor (Dr. Sarah)</span>
                    </div>
                    {role === 'doctor' && <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />}
                  </button>

                  <button
                    onClick={() => handleDemoSwitch('admin')}
                    className="w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition"
                  >
                    <div className="flex items-center gap-2">
                      <Shield className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                      <span>Admin (System)</span>
                    </div>
                    {role === 'admin' && <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />}
                  </button>
                </div>
              )}
            </div>

            {/* User Profile / Auth Action */}
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <div className="hidden sm:block text-right">
                  <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">{user?.name}</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 capitalize">{user?.role}</div>
                </div>
                <button
                  onClick={logout}
                  className="p-2 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onNavigate('login')}
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition"
                >
                  Sign In
                </button>
                <button
                  onClick={() => onNavigate('register')}
                  className="px-3.5 py-1.5 text-xs font-semibold bg-brand-600 hover:bg-brand-700 text-white rounded-lg shadow-sm transition"
                >
                  Register
                </button>
              </div>
            )}

          </div>

        </div>
      </div>
    </header>
  );
}

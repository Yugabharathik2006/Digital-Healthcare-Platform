import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Activity, Lock, Mail, User, Stethoscope, Shield, ArrowRight, AlertCircle } from 'lucide-react';

export default function LoginPage({ onNavigate }) {
  const { login, loginDemo, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleStandardLogin = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const loggedUser = await login(email, password);
      if (loggedUser.role === 'admin') onNavigate('admin');
      else if (loggedUser.role === 'doctor') onNavigate('doctor-dashboard');
      else onNavigate('patient-dashboard');
    } catch (err) {
      setError(err.message || 'Login failed. Please verify email and password.');
    }
  };

  const handleDemoLogin = async (role) => {
    setError(null);
    try {
      const loggedUser = await loginDemo(role);
      if (role === 'admin') onNavigate('admin');
      else if (role === 'doctor') onNavigate('doctor-dashboard');
      else onNavigate('patient-dashboard');
    } catch (err) {
      setError(err.message || 'Demo login failed');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-6">
      
      {/* Brand Header */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-primary-600 flex items-center justify-center text-white mx-auto shadow-md shadow-brand-500/20">
          <Activity className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-bold font-['Outfit'] text-slate-900 dark:text-white">Sign In to CareSync</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">Access your healthcare portal, appointments, and prescriptions.</p>
      </div>

      {/* 1-Click Quick Demo Accounts Card */}
      <div className="bg-slate-900 text-white rounded-2xl p-4 shadow-lg space-y-2.5 border border-slate-800">
        <div className="text-[11px] uppercase tracking-wider font-bold text-brand-400 flex items-center justify-between">
          <span>Instant 1-Click Demo Evaluation</span>
          <span className="text-[9px] bg-brand-500/20 px-1.5 py-0.5 rounded text-brand-300">Quick Test</span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => handleDemoLogin('patient')}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-left transition border border-slate-700/60 flex flex-col justify-between"
          >
            <User className="w-4 h-4 text-primary-400 mb-1" />
            <span className="text-[11px] font-bold block text-white">Patient</span>
            <span className="text-[9px] text-slate-400">John Doe</span>
          </button>

          <button
            type="button"
            onClick={() => handleDemoLogin('doctor')}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-left transition border border-slate-700/60 flex flex-col justify-between"
          >
            <Stethoscope className="w-4 h-4 text-brand-400 mb-1" />
            <span className="text-[11px] font-bold block text-white">Doctor</span>
            <span className="text-[9px] text-slate-400">Dr. Sarah</span>
          </button>

          <button
            type="button"
            onClick={() => handleDemoLogin('admin')}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-left transition border border-slate-700/60 flex flex-col justify-between"
          >
            <Shield className="w-4 h-4 text-indigo-400 mb-1" />
            <span className="text-[11px] font-bold block text-white">Admin</span>
            <span className="text-[9px] text-slate-400">System Ops</span>
          </button>
        </div>
      </div>

      {/* Standard Email/Password Form */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-4 transition-colors">
        
        {error && (
          <div className="p-3 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs rounded-xl flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleStandardLogin} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
            <div className="flex items-center gap-2 px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus-within:bg-white dark:focus-within:bg-slate-850 focus-within:ring-2 focus-within:ring-brand-500">
              <Mail className="w-4 h-4 text-slate-400 dark:text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-transparent focus:outline-none text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Password</label>
            <div className="flex items-center gap-2 px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus-within:bg-white dark:focus-within:bg-slate-850 focus-within:ring-2 focus-within:ring-brand-500">
              <Lock className="w-4 h-4 text-slate-400 dark:text-slate-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-transparent focus:outline-none text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-bold rounded-xl shadow-md transition flex items-center justify-center gap-1.5"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In with Password'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-slate-500 dark:text-slate-400 pt-3 border-t border-slate-100 dark:border-slate-800">
          Don't have an account yet?{' '}
          <button
            onClick={() => onNavigate('register')}
            className="font-bold text-brand-600 dark:text-brand-400 hover:underline"
          >
            Register as Patient or Doctor
          </button>
        </div>

      </div>

    </div>
  );
}

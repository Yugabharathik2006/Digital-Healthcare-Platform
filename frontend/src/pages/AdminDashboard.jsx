import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import StatusBadge from '../components/StatusBadge';
import { 
  Shield, Users, Stethoscope, Calendar, DollarSign, Database, 
  Zap, Bell, RefreshCw, Activity, CheckCircle, Clock 
} from 'lucide-react';

export default function AdminDashboard({ onNavigate }) {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('appointments'); // 'appointments' | 'system'

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const res = await api.admin.getDashboard();
      setDashboardData(res.data);
    } catch (err) {
      console.error('Failed to load admin stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  if (loading) {
    return (
      <div className="py-24 text-center text-xs text-slate-400 dark:text-slate-500 space-y-2">
        <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p>Loading enterprise telemetry from Express API Gateway...</p>
      </div>
    );
  }

  const stats = dashboardData?.stats || {};
  const sys = dashboardData?.systemStatus || {};
  const appointments = dashboardData?.recentAppointments || [];
  const users = dashboardData?.recentUsers || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 bg-indigo-500/20 px-2.5 py-1 rounded-full w-fit mb-2">
            <Shield className="w-3.5 h-3.5" />
            <span>Administrator Control Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-['Outfit']">
            Platform Operations &amp; System Health
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time monitoring of distributed microservices, appointments, and cache efficiency.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('hld')}
            className="px-4 py-2.5 bg-brand-600 hover:bg-brand-500 rounded-xl text-xs font-bold shadow-md transition flex items-center gap-1.5"
          >
            <Activity className="w-4 h-4" />
            <span>View Architecture Topology</span>
          </button>
          <button
            onClick={fetchAdminData}
            className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition"
            title="Refresh Metrics"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-sm transition-colors">
          <span className="text-[11px] text-slate-400 dark:text-slate-500 uppercase font-semibold block">Total Patients</span>
          <div className="text-2xl font-bold font-['Outfit'] text-slate-900 dark:text-white mt-1">{stats.totalPatients || 0}</div>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">Registered Accounts</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-sm transition-colors">
          <span className="text-[11px] text-slate-400 dark:text-slate-500 uppercase font-semibold block">Active Doctors</span>
          <div className="text-2xl font-bold font-['Outfit'] text-brand-600 dark:text-brand-400 mt-1">{stats.totalDoctors || 0}</div>
          <span className="text-[10px] text-brand-600 dark:text-brand-400 font-medium">Verified Specialists</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-sm transition-colors">
          <span className="text-[11px] text-slate-400 dark:text-slate-500 uppercase font-semibold block">Appointments</span>
          <div className="text-2xl font-bold font-['Outfit'] text-slate-900 dark:text-white mt-1">{stats.totalAppointments || 0}</div>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">{stats.confirmedAppointments || 0} Active</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-sm transition-colors">
          <span className="text-[11px] text-slate-400 dark:text-slate-500 uppercase font-semibold block">Completed Visits</span>
          <div className="text-2xl font-bold font-['Outfit'] text-emerald-600 dark:text-emerald-400 mt-1">{stats.completedAppointments || 0}</div>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">Consulted</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-sm transition-colors">
          <span className="text-[11px] text-slate-400 dark:text-slate-500 uppercase font-semibold block">Prescriptions</span>
          <div className="text-2xl font-bold font-['Outfit'] text-purple-600 dark:text-purple-400 mt-1">{stats.totalPrescriptions || 0}</div>
          <span className="text-[10px] text-purple-600 dark:text-purple-400 font-medium">Issued Digital Rx</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-sm transition-colors">
          <span className="text-[11px] text-slate-400 dark:text-slate-500 uppercase font-semibold block">Revenue Volume</span>
          <div className="text-2xl font-bold font-['Outfit'] text-slate-900 dark:text-white mt-1">${stats.totalRevenue || 0}</div>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">Gross Consultations</span>
        </div>
      </div>

      {/* System Infrastructure Health Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Database Health Card */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-start gap-4 transition-colors">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
            <Database className="w-5 h-5" />
          </div>
          <div className="flex-1 text-xs">
            <div className="flex items-center justify-between">
              <strong className="text-slate-900 dark:text-white text-sm">Database Engine</strong>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300">
                {sys.database?.mode || 'CONNECTED'}
              </span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 mt-1 text-[11px]">{sys.database?.message}</p>
          </div>
        </div>

        {/* Redis Cache Health Card */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-start gap-4 transition-colors">
          <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center flex-shrink-0">
            <Zap className="w-5 h-5" />
          </div>
          <div className="flex-1 text-xs">
            <div className="flex items-center justify-between">
              <strong className="text-slate-900 dark:text-white text-sm">Redis Caching Layer</strong>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 dark:bg-purple-950/80 text-purple-800 dark:text-purple-300">
                {sys.cache?.mode || 'ACTIVE'}
              </span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 mt-1 text-[11px]">
              Hits: <strong>{sys.cache?.hits || 0}</strong> • Misses: <strong>{sys.cache?.misses || 0}</strong> • Cached Keys: <strong>{sys.cache?.cachedKeysCount || 0}</strong>
            </p>
          </div>
        </div>

        {/* Message Queue Health Card */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-start gap-4 transition-colors">
          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center flex-shrink-0">
            <Bell className="w-5 h-5" />
          </div>
          <div className="flex-1 text-xs">
            <div className="flex items-center justify-between">
              <strong className="text-slate-900 dark:text-white text-sm">Notification Queue</strong>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300">
                {sys.queue?.broker || 'WORKER_ACTIVE'}
              </span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 mt-1 text-[11px]">
              Processed: <strong>{sys.queue?.processedCount || 0}</strong> jobs • Pending: <strong>{sys.queue?.pendingCount || 0}</strong>
            </p>
          </div>
        </div>

      </div>

      {/* Tab Switcher for Monitoring */}
      <div className="flex gap-2 border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setActiveTab('appointments')}
          className={`pb-3 px-4 text-xs font-bold transition border-b-2 ${
            activeTab === 'appointments'
              ? 'border-indigo-600 dark:border-indigo-400 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          Recent Platform Appointments ({appointments.length})
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`pb-3 px-4 text-xs font-bold transition border-b-2 ${
            activeTab === 'users'
              ? 'border-indigo-600 dark:border-indigo-400 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          User Accounts Directory ({users.length})
        </button>
      </div>

      {/* APPOINTMENTS MONITORING TABLE */}
      {activeTab === 'appointments' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 uppercase font-semibold border-b border-slate-100 dark:border-slate-800">
                  <th className="py-3.5 px-4">Ref Number</th>
                  <th className="py-3.5 px-4">Patient Name</th>
                  <th className="py-3.5 px-4">Assigned Doctor</th>
                  <th className="py-3.5 px-4">Schedule</th>
                  <th className="py-3.5 px-4">Fee</th>
                  <th className="py-3.5 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {appointments.map((apt) => (
                  <tr key={apt._id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-700 dark:text-slate-300">{apt.appointmentNumber}</td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 dark:text-white">{apt.patientName}</div>
                      <div className="text-slate-400 dark:text-slate-500 text-[11px]">{apt.patientEmail}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 dark:text-white">{apt.doctorName}</div>
                      <div className="text-slate-400 dark:text-slate-500 text-[11px]">{apt.specialization}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300 font-medium">
                      {apt.date} • {apt.timeSlot}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-800 dark:text-slate-200">
                      ${apt.consultationFee || 50}
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={apt.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* USER ACCOUNTS DIRECTORY TABLE */}
      {activeTab === 'users' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 uppercase font-semibold border-b border-slate-100 dark:border-slate-800">
                  <th className="py-3.5 px-4">User ID</th>
                  <th className="py-3.5 px-4">Name</th>
                  <th className="py-3.5 px-4">Email</th>
                  <th className="py-3.5 px-4">Role</th>
                  <th className="py-3.5 px-4">Phone</th>
                  <th className="py-3.5 px-4">Created Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition">
                    <td className="py-3.5 px-4 font-mono text-slate-500 dark:text-slate-400">{u._id}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">{u.name}</td>
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">{u.email}</td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded-full font-bold uppercase text-[10px] ${
                        u.role === 'admin' ? 'bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300' :
                        u.role === 'doctor' ? 'bg-brand-100 dark:bg-brand-950/80 text-brand-700 dark:text-brand-300' :
                        'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400">{u.phone || 'N/A'}</td>
                    <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}

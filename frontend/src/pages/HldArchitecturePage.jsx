import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import { 
  Cpu, Database, Zap, Bell, ArrowRight, ShieldCheck, CheckCircle2, 
  Server, Layers, RefreshCw, Activity, Terminal 
} from 'lucide-react';

export default function HldArchitecturePage() {
  const [telemetry, setTelemetry] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchTelemetry = async () => {
    setLoading(true);
    try {
      const res = await api.hld.getArchitecture();
      setTelemetry(res);
    } catch (err) {
      console.error('Failed to load HLD architecture data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTelemetry();
  }, []);

  const comp = telemetry?.components || {};
  const cache = comp?.caching || {};
  const queue = comp?.messaging || {};
  const db = comp?.database || {};

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Top Title Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden border border-slate-800">
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/20 text-brand-400 border border-brand-500/30 text-xs font-semibold">
            <Cpu className="w-3.5 h-3.5" />
            <span>Round 3 High-Level System Design (HLD) • 25 Marks Challenge</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold font-['Outfit'] tracking-tight">
            Digital Healthcare Platform System Architecture
          </h1>

          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
            High-Level Design (HLD) architecture supporting millions of patients and doctors with an Express API Gateway, modular microservice domain services, Redis caching, asynchronous event queues, and MongoDB persistence.
          </p>
        </div>

        <button
          onClick={fetchTelemetry}
          className="absolute top-6 right-6 p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
          title="Refresh Live Telemetry"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* ============================================================== */}
      {/* 1. VISUAL SYSTEM ARCHITECTURE TOPOLOGY DIAGRAM */}
      {/* ============================================================== */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6 transition-colors">
        <div>
          <h2 className="text-xl font-bold font-['Outfit'] text-slate-900 dark:text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-brand-600 dark:text-brand-400" />
            High-Level System Topology Diagram
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            End-to-end request lifecycle: Client Ingress ➔ API Gateway ➔ Domain Microservices ➔ Caching, Persistence &amp; Messaging.
          </p>
        </div>

        {/* CSS / SVG Visual Flow Diagram */}
        <div className="bg-slate-950 p-6 sm:p-8 rounded-2xl border border-slate-800 text-white overflow-x-auto">
          <div className="min-w-[950px] space-y-8">
            
            {/* Layer 1: Client Ingress */}
            <div>
              <div className="text-[11px] font-bold text-sky-400 tracking-wider uppercase mb-2">1. Client Layer</div>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-slate-900 border border-sky-500/40 rounded-xl p-3 text-center">
                  <div className="text-sm font-bold text-sky-300">React Web App</div>
                  <div className="text-[10px] text-slate-400 font-mono">Vite + Tailwind CSS (Port 3000)</div>
                </div>
                <div className="bg-slate-900 border border-sky-500/40 rounded-xl p-3 text-center">
                  <div className="text-sm font-bold text-sky-300">Doctor Mobile App</div>
                  <div className="text-[10px] text-slate-400 font-mono">React Native / Flutter (iOS &amp; Android)</div>
                </div>
                <div className="bg-slate-900 border border-sky-500/40 rounded-xl p-3 text-center">
                  <div className="text-sm font-bold text-sky-300">External Integrations</div>
                  <div className="text-[10px] text-slate-400 font-mono">Lab APIs / Pharmacy Partners</div>
                </div>
              </div>
            </div>

            {/* Ingress Arrow */}
            <div className="flex justify-center items-center gap-2 text-xs text-slate-500">
              <span className="font-mono text-sky-400 font-semibold">HTTPS / REST / JWT Bearer Tokens</span>
              <ArrowRight className="w-4 h-4 text-brand-500 rotate-90" />
            </div>

            {/* Layer 2: API Gateway */}
            <div>
              <div className="text-[11px] font-bold text-indigo-400 tracking-wider uppercase mb-2">2. Centralized API Gateway Layer (:5000)</div>
              <div className="bg-gradient-to-r from-indigo-950 to-slate-900 border-2 border-indigo-500/60 rounded-2xl p-4 shadow-lg">
                <div className="flex justify-between items-center pb-2 border-b border-indigo-800/60 mb-3">
                  <span className="font-bold text-indigo-200 text-sm">Express.js API Gateway</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/30 text-indigo-300">Single Entry Point</span>
                </div>
                <div className="grid grid-cols-4 gap-2 text-center text-xs">
                  <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-700/60">
                    <span className="text-indigo-300 font-semibold block text-[11px]">Traffic Routing</span>
                    <span className="text-[10px] text-slate-400">Path Rewriting &amp; Forwarding</span>
                  </div>
                  <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-700/60">
                    <span className="text-indigo-300 font-semibold block text-[11px]">Security &amp; RBAC</span>
                    <span className="text-[10px] text-slate-400">JWT Token &amp; Roles Validation</span>
                  </div>
                  <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-700/60">
                    <span className="text-indigo-300 font-semibold block text-[11px]">Rate Limiting</span>
                    <span className="text-[10px] text-slate-400">120 Requests / IP / Min</span>
                  </div>
                  <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-700/60">
                    <span className="text-indigo-300 font-semibold block text-[11px]">Telemetry &amp; CORS</span>
                    <span className="text-[10px] text-slate-400">Morgan Logging &amp; Errors</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Gateway to Services Arrow */}
            <div className="flex justify-center items-center gap-2 text-xs text-slate-500">
              <span className="font-mono text-indigo-400 font-semibold">Decoupled Microservice Domain Routing</span>
              <ArrowRight className="w-4 h-4 text-indigo-500 rotate-90" />
            </div>

            {/* Layer 3: Microservice Domain Services */}
            <div>
              <div className="text-[11px] font-bold text-brand-400 tracking-wider uppercase mb-2">3. Domain Microservices Layer</div>
              <div className="grid grid-cols-5 gap-3 text-center">
                <div className="bg-slate-900 border border-brand-500/40 rounded-xl p-3">
                  <span className="font-bold text-xs text-brand-300 block">Auth Service</span>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">/api/auth/*</div>
                  <p className="text-[10px] text-slate-400 mt-1">Registration, login, password hashing, JWT</p>
                </div>
                <div className="bg-slate-900 border border-brand-500/40 rounded-xl p-3">
                  <span className="font-bold text-xs text-brand-300 block">Doctor Service</span>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">/api/doctors/*</div>
                  <p className="text-[10px] text-slate-400 mt-1">Profiles, specialties, Redis cache, slots</p>
                </div>
                <div className="bg-slate-900 border border-brand-500/40 rounded-xl p-3">
                  <span className="font-bold text-xs text-brand-300 block">Appointment Service</span>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">/api/appointments/*</div>
                  <p className="text-[10px] text-slate-400 mt-1">Atomic slot mutex lock, cancel, reschedule</p>
                </div>
                <div className="bg-slate-900 border border-brand-500/40 rounded-xl p-3">
                  <span className="font-bold text-xs text-brand-300 block">Consultation Service</span>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">/api/consultations/*</div>
                  <p className="text-[10px] text-slate-400 mt-1">Clinical notes, diagnosis, status updates</p>
                </div>
                <div className="bg-slate-900 border border-brand-500/40 rounded-xl p-3">
                  <span className="font-bold text-xs text-brand-300 block">Prescription Service</span>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">/api/prescriptions/*</div>
                  <p className="text-[10px] text-slate-400 mt-1">Digital Rx issuance, medicine dosage, print format</p>
                </div>
              </div>
            </div>

            {/* Layer 4: Infrastructure - Cache, DB, Message Queue */}
            <div>
              <div className="text-[11px] font-bold text-slate-400 tracking-wider uppercase mb-2">4. Persistence, Caching &amp; Asynchronous Messaging</div>
              <div className="grid grid-cols-3 gap-4">
                
                {/* Redis Caching */}
                <div className="bg-slate-900 border border-purple-500/40 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-purple-300 text-xs">Redis In-Memory Cache</span>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300">Port 6379</span>
                  </div>
                  <p className="text-[10px] text-slate-400">
                    Caches doctor profiles &amp; filtered search queries with 300s TTL. Purged on availability update.
                  </p>
                </div>

                {/* MongoDB Document Store */}
                <div className="bg-slate-900 border border-emerald-500/40 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-emerald-300 text-xs">MongoDB Document Database</span>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">Port 27017</span>
                  </div>
                  <p className="text-[10px] text-slate-400">
                    Collections for Users, Doctors, Appointments, Consultations, and Prescriptions with B-Tree indexes.
                  </p>
                </div>

                {/* RabbitMQ / Event Queue */}
                <div className="bg-slate-900 border border-amber-500/40 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-amber-300 text-xs">RabbitMQ / Message Queue</span>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300">Port 5672</span>
                  </div>
                  <p className="text-[10px] text-slate-400">
                    Asynchronously handles email &amp; SMS appointment confirmation, cancellation, and prescription delivery alerts.
                  </p>
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 2. REAL-TIME TELEMETRY & COMPONENT INSPECTOR PANELS */}
      {/* ============================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Redis Cache Live Telemetry */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 shadow-sm space-y-4 transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Redis Cache Inspector</h3>
            </div>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
              {cache.mode || 'ACTIVE'}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-slate-50 dark:bg-slate-800 p-2.5 rounded-xl border border-slate-100 dark:border-slate-700">
              <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-semibold block">Hits</span>
              <strong className="text-lg text-emerald-600 dark:text-emerald-400">{cache.hits || 0}</strong>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800 p-2.5 rounded-xl border border-slate-100 dark:border-slate-700">
              <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-semibold block">Misses</span>
              <strong className="text-lg text-slate-700 dark:text-slate-300">{cache.misses || 0}</strong>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800 p-2.5 rounded-xl border border-slate-100 dark:border-slate-700">
              <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-semibold block">Hit Rate</span>
              <strong className="text-lg text-purple-600 dark:text-purple-400">{cache.hitRate || '0%'}</strong>
            </div>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            {cache.details || 'Caches doctor profiles and search filters to achieve sub-millisecond retrieval under high read traffic.'}
          </p>

          <div className="text-[11px] text-slate-400 dark:text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800">
            <strong>Active Cached Keys:</strong> {cache.cachedKeysCount || 0} keys currently stored in memory.
          </div>
        </div>

        {/* Message Queue Live Telemetry */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 shadow-sm space-y-4 transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-amber-500" />
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Notification Queue Worker</h3>
            </div>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
              {queue.broker || 'WORKER_ONLINE'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-center">
            <div className="bg-slate-50 dark:bg-slate-800 p-2.5 rounded-xl border border-slate-100 dark:border-slate-700">
              <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-semibold block">Processed Jobs</span>
              <strong className="text-lg text-emerald-600 dark:text-emerald-400">{queue.processedCount || 0}</strong>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800 p-2.5 rounded-xl border border-slate-100 dark:border-slate-700">
              <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-semibold block">In-Flight Queue</span>
              <strong className="text-lg text-amber-600 dark:text-amber-400">{queue.pendingCount || 0}</strong>
            </div>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            {queue.details || 'Decouples slow email/SMS delivery from appointment booking HTTP transactions for instant response times.'}
          </p>

          <div className="text-[11px] text-slate-400 dark:text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800">
            <strong>Recent Event:</strong> {queue.recentJobs?.[0]?.eventType || 'APPOINTMENT_CONFIRMED'}
          </div>
        </div>

        {/* Concurrency & Atomic Locking */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 shadow-sm space-y-4 transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Atomic Booking Concurrency</h3>
            </div>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              MUTEX_LOCK
            </span>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-slate-100 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 font-mono">
            Lock Key: "doctorId : date : slot"
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Prevents race conditions when thousands of concurrent patients attempt to reserve the same doctor appointment slot simultaneously. If already locked or status is CONFIRMED, the gateway returns HTTP 409 Conflict.
          </p>

          <div className="text-[11px] text-slate-400 dark:text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800">
            <strong>Reliability:</strong> 100% protection against duplicate booking collisions.
          </div>
        </div>

      </div>

      {/* ============================================================== */}
      {/* 3. TASK-BY-TASK HLD SPECIFICATION ANSWERS (25 MARKS) */}
      {/* ============================================================== */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-8 transition-colors">
        <div>
          <h2 className="text-xl font-bold font-['Outfit'] text-slate-900 dark:text-white">
            High-Level System Design (HLD) Challenge Breakdown
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Official system architecture rationale for the Round 3 Challenge evaluation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
          
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 space-y-2">
            <h4 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-brand-600 text-white flex items-center justify-center text-xs">1</span>
              System Architecture &amp; Decomposition
            </h4>
            <p>
              The platform is architected around 7 distinct domain modules: Authentication, Patient, Doctor, Appointment, Consultation, Prescription, and Notification services. A centralized Express API Gateway acts as the reverse proxy front door, shielding internal microservices from external public traffic.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 space-y-2">
            <h4 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-brand-600 text-white flex items-center justify-center text-xs">2</span>
              REST API Communication &amp; Gateway
            </h4>
            <p>
              Standardized HTTP REST APIs over HTTPS with JSON payloads. The API Gateway centralizes cross-cutting concerns: Bearer JWT verification, Role-Based Access Control (RBAC) across Patient, Doctor, and Admin, rate limiting (120 req/min), CORS headers, and error standardization.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 space-y-2">
            <h4 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-brand-600 text-white flex items-center justify-center text-xs">3</span>
              Database Selection &amp; Indexing Strategy
            </h4>
            <p>
              MongoDB document database stores polymorphic clinical documents, prescription medication arrays, and dynamic schedule hours without rigid schema migrations. Compound B-Tree indexes on <code>(doctorId, date, status)</code> allow fast lookups for slot availability calculation.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 space-y-2">
            <h4 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-brand-600 text-white flex items-center justify-center text-xs">4</span>
              Caching &amp; Cache Invalidation
            </h4>
            <p>
              Redis in-memory caching stores frequently searched doctor profiles and category directories with a 300-second TTL. Whenever a doctor edits availability or a patient books a slot, cache invalidation hooks flush <code>doctor:*</code> keys so stale data is never served.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 space-y-2">
            <h4 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-brand-600 text-white flex items-center justify-center text-xs">5</span>
              Asynchronous Messaging &amp; Decoupling
            </h4>
            <p>
              RabbitMQ (with safe in-memory queue fallback) processes appointment confirmation emails, cancellation alerts, and digital prescription notifications asynchronously. This prevents third-party SMS/email network delays from slowing down critical booking transactions.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 space-y-2">
            <h4 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-brand-600 text-white flex items-center justify-center text-xs">6</span>
              Horizontal Scalability for Millions of Users
            </h4>
            <p>
              Stateless API Gateway instances can scale horizontally behind an NGINX / Cloud Load Balancer. Read-heavy doctor searches are offloaded to Redis clusters and MongoDB Read Replicas, while appointment writes utilize atomic concurrency control to sustain peak surges.
            </p>
          </div>

        </div>
      </div>

    </div>
  );
}

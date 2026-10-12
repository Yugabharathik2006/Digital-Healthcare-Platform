import React from 'react';
import { Activity, ShieldCheck, Database, Zap, Lock } from 'lucide-react';

export default function Footer({ onNavigate }) {
  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 mt-20 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-white font-['Outfit'] font-bold text-lg">
              <div className="w-7 h-7 rounded-lg bg-brand-500 text-slate-900 flex items-center justify-center">
                <Activity className="w-4 h-4" />
              </div>
              <span>Care<span className="text-brand-400">Sync</span></span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Enterprise digital healthcare appointment scheduling, telemedicine consultation, and cryptographically verified digital prescriptions.
            </p>
            <div className="flex items-center gap-2 text-emerald-400 text-[11px] font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>HIPAA Compliant Architecture</span>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-3">Healthcare Services</h4>
            <ul className="space-y-2">
              <li><button onClick={() => onNavigate('doctors')} className="hover:text-white transition">Cardiology Specialists</button></li>
              <li><button onClick={() => onNavigate('doctors')} className="hover:text-white transition">Dermatology Clinics</button></li>
              <li><button onClick={() => onNavigate('doctors')} className="hover:text-white transition">Pediatric Care</button></li>
              <li><button onClick={() => onNavigate('doctors')} className="hover:text-white transition">Neurology Consultations</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-3">System Design (HLD)</h4>
            <ul className="space-y-2">
              <li><button onClick={() => onNavigate('hld')} className="hover:text-white transition">API Gateway Topology</button></li>
              <li><button onClick={() => onNavigate('hld')} className="hover:text-white transition">Redis Cache Metrics</button></li>
              <li><button onClick={() => onNavigate('hld')} className="hover:text-white transition">Async Message Broker</button></li>
              <li><button onClick={() => onNavigate('hld')} className="hover:text-white transition">Atomic Slot Locking</button></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-white font-semibold text-sm">Architecture Stack</h4>
            <div className="flex flex-wrap gap-1.5">
              <span className="px-2 py-1 rounded bg-slate-800 text-slate-300 font-mono text-[10px]">React + Vite</span>
              <span className="px-2 py-1 rounded bg-slate-800 text-slate-300 font-mono text-[10px]">Tailwind CSS</span>
              <span className="px-2 py-1 rounded bg-slate-800 text-slate-300 font-mono text-[10px]">Express.js Gateway</span>
              <span className="px-2 py-1 rounded bg-slate-800 text-slate-300 font-mono text-[10px]">MongoDB Atlas</span>
              <span className="px-2 py-1 rounded bg-slate-800 text-slate-300 font-mono text-[10px]">Redis LRU Cache</span>
              <span className="px-2 py-1 rounded bg-slate-800 text-slate-300 font-mono text-[10px]">RabbitMQ Queue</span>
            </div>
            <p className="text-[11px] text-slate-500">
              Round 3 High-Level System Design (HLD) Challenge Implementation.
            </p>
          </div>

        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500">
          <div>© 2026 CareSync Healthcare Systems. All rights reserved.</div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-[11px] text-slate-400">
              <Lock className="w-3.5 h-3.5 text-brand-500" />
              Role-Based JWT Authorization
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

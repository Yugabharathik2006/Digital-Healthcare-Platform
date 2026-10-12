import React from 'react';

export default function StatusBadge({ status }) {
  const styles = {
    CONFIRMED: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 ring-emerald-500/10 dark:ring-emerald-500/20',
    COMPLETED: 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800 ring-blue-500/10 dark:ring-blue-500/20',
    CANCELLED: 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800 ring-rose-500/10 dark:ring-rose-500/20',
    PENDING: 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800 ring-amber-500/10 dark:ring-amber-500/20'
  };

  const dots = {
    CONFIRMED: 'bg-emerald-500 dark:bg-emerald-400',
    COMPLETED: 'bg-blue-500 dark:bg-blue-400',
    CANCELLED: 'bg-rose-500 dark:bg-rose-400',
    PENDING: 'bg-amber-500 dark:bg-amber-400'
  };

  const normalized = status ? status.toUpperCase() : 'PENDING';
  const badgeStyle = styles[normalized] || styles.PENDING;
  const dotColor = dots[normalized] || dots.PENDING;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ring-1 transition-colors ${badgeStyle}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`}></span>
      {normalized}
    </span>
  );
}

import React from 'react';

export default function WatermarkOverlay({ student, sessionId }) {
  if (!student || !sessionId) return null;

  const watermarkText = `ASSESSMENT SESSION • STUDENT ID: ${student.id || 'N/A'} • SESSION: ${sessionId.slice(0, 8)}... • ${student.email || ''}`;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-50 select-none overflow-hidden opacity-[0.035] flex flex-wrap items-center justify-around gap-16 p-8"
      style={{
        transform: 'rotate(-25deg) scale(1.15)',
      }}
    >
      {Array.from({ length: 48 }).map((_, i) => (
        <div
          key={i}
          className="text-xs font-mono font-bold tracking-widest text-slate-100 whitespace-nowrap"
        >
          {watermarkText}
        </div>
      ))}
    </div>
  );
}

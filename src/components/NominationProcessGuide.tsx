import React from 'react';
import { Send, ShieldCheck, Award, ArrowRight } from 'lucide-react';

export const NominationProcessGuide: React.FC<{ onActionClick: () => void }> = ({ onActionClick }) => {
  return (
    <section className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 shadow-xs space-y-8">
      <div className="max-w-2xl">
        <span className="text-xs font-bold text-amber-700 uppercase tracking-widest block">
          Transparent Evaluation Protocol
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-display mt-0.5">
          How Staff Recognition Works at FNSTM
        </h2>
        <p className="text-sm text-slate-600 mt-1">
          A peer-driven, merit-governed appraisal framework designed to promote clinical diligence, empathy, and professional integrity.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
        {/* Step 1 */}
        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-amber-400 font-mono font-bold flex items-center justify-center text-sm shadow-xs">
              01
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Departmental Nomination
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              When the submission window opens each month, Heads of Department select an outstanding staff member from their roster and submit two concrete achievements.
            </p>
          </div>
          <span className="text-[11px] font-semibold text-amber-800">
            Window-Enforced Submission
          </span>
        </div>

        {/* Step 2 */}
        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-amber-400 font-mono font-bold flex items-center justify-center text-sm shadow-xs">
              02
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Committee Review & Audit
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              The multidisciplinary Selection Committee audits attendance, verifies clinical or administrative impact, and shortlists top-tier candidates.
            </p>
          </div>
          <span className="text-[11px] font-semibold text-slate-700">
            Multidisciplinary Vetting
          </span>
        </div>

        {/* Step 3 */}
        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-amber-400 font-mono font-bold flex items-center justify-center text-sm shadow-xs">
              03
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Conferment & Hall of Fame
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              The ratified Staff of the Month is crowned, awarded the official printed certificate of excellence, and permanently immortalized on the portal.
            </p>
          </div>
          <span className="text-[11px] font-semibold text-amber-800">
            Institutional Legacy
          </span>
        </div>
      </div>
    </section>
  );
};

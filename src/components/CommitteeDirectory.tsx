import React from 'react';
import { usePortal } from '../context/PortalContext';
import { Users, Mail, ShieldCheck } from 'lucide-react';

export const CommitteeDirectory: React.FC = () => {
  const { committee } = usePortal();

  return (
    <section className="space-y-6">
      <div>
        <div className="flex items-center gap-2 text-xs font-bold text-amber-700 uppercase tracking-widest">
          <ShieldCheck className="w-4 h-4" />
          Institutional Governance
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-display mt-0.5">
          Selection & Honors Committee
        </h2>
        <p className="text-sm text-slate-600 mt-1 max-w-3xl">
          The multidisciplinary appraisal board responsible for evaluating peer nominations, enforcing ethical guidelines, and ratifying the monthly staff excellence awards.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {committee.map((member) => (
          <div
            key={member.id}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-shadow flex flex-col items-center text-center group"
          >
            <div className="relative mb-4">
              <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-slate-100 group-hover:border-amber-500/50 shadow-inner transition-colors bg-slate-100">
                <img
                  src={member.photoUrl}
                  alt={member.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
              </div>
              <span className="absolute bottom-0 right-0 bg-slate-900 text-amber-400 p-1 rounded-full border border-white shadow-xs">
                <ShieldCheck className="w-3.5 h-3.5" />
              </span>
            </div>

            <h3 className="text-sm font-bold text-slate-900 leading-snug">
              {member.name}
            </h3>
            
            <span className="inline-block mt-1 text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-200/60 px-2 py-0.5 rounded-md">
              {member.role}
            </span>

            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              {member.designation}
            </p>

            {member.email && (
              <a
                href={`mailto:${member.email}`}
                className="mt-4 pt-3 border-t border-slate-100 w-full flex items-center justify-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 transition-colors"
              >
                <Mail className="w-3.5 h-3.5" />
                <span className="truncate text-[11px]">{member.email}</span>
              </a>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

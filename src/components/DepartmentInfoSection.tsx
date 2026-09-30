import React from 'react';
import { usePortal } from '../context/PortalContext';
import { Compass, Target, Award, CheckCircle2 } from 'lucide-react';
import lectureHallImg from '../assets/images/conference_lecture_center_1790785345371.jpg';

export const DepartmentInfoSection: React.FC = () => {
  const { institution } = usePortal();

  return (
    <section className="space-y-6">
      <div>
        <div className="flex items-center gap-2 text-xs font-bold text-amber-700 uppercase tracking-widest">
          <Compass className="w-4 h-4" />
          Institutional Mandate
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-display mt-0.5">
          Vision, Mission & Core Objectives
        </h2>
        <p className="text-sm text-slate-600 mt-1 max-w-3xl">
          The founding principles driving psychiatric clinical excellence, postgraduate residency training, and employee merit recognition.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Vision Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200/60 flex items-center justify-center text-amber-800">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 font-display">
              Our Vision
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {institution.vision}
            </p>
          </div>
          <div className="pt-4 border-t border-slate-100 mt-4 text-[11px] text-amber-800 font-medium">
            Excellence & Global Standing
          </div>
        </div>

        {/* Mission Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-800">
              <Target className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 font-display">
              Our Mission
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {institution.mission}
            </p>
          </div>
          <div className="pt-4 border-t border-slate-100 mt-4 text-[11px] text-slate-600 font-medium">
            Compassion, Ethics & Clinical Rigor
          </div>
        </div>

        {/* Objectives Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200/60 flex items-center justify-center text-amber-800">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 font-display">
              Recognition Mandate
            </h3>
            <ul className="space-y-2 text-xs text-slate-600">
              {institution.objectives.map((obj, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                  <span className="leading-snug">{obj}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="pt-4 border-t border-slate-100 mt-4 text-[11px] text-amber-800 font-medium">
            Merit-Based Appraisal Framework
          </div>
        </div>
      </div>
    </section>
  );
};

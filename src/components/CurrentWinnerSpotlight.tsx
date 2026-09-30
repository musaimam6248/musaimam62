import React from 'react';
import { usePortal } from '../context/PortalContext';
import { Award, FileText, Sparkles, Building2, Calendar, UserCheck } from 'lucide-react';
import { Winner } from '../types';

interface CurrentWinnerSpotlightProps {
  onOpenCertificate: (winner: Winner) => void;
}

export const CurrentWinnerSpotlight: React.FC<CurrentWinnerSpotlightProps> = ({
  onOpenCertificate,
}) => {
  const { winners } = usePortal();
  const currentWinner = winners[0]; // most recent winner

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  if (!currentWinner) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center text-slate-500">
        <Award className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-slate-700">No Winner Crowned Yet</h3>
        <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
          The Staff Excellence Selection Committee is currently evaluating ongoing departmental submissions.
        </p>
      </div>
    );
  }

  const awardPeriod = `${monthNames[currentWinner.month - 1]} ${currentWinner.year}`;

  return (
    <section className="relative overflow-hidden rounded-3xl bg-linear-to-b from-slate-900 via-slate-900 to-slate-950 text-white border border-slate-800 shadow-2xl p-6 sm:p-10">
      {/* Decorative ambient background flares */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left Col: Ceremonial Framed Portrait */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="relative group">
            {/* Top gold ribbon tag */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-20 bg-linear-to-r from-amber-500 via-yellow-400 to-amber-600 text-slate-950 text-[11px] font-extrabold uppercase tracking-widest px-4 py-1 rounded-full shadow-lg border border-amber-300/60 whitespace-nowrap flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-slate-950" />
              Staff Of The Month
            </div>

            {/* Frame border with gold accents */}
            <div className="relative p-2.5 rounded-2xl bg-linear-to-b from-amber-400/40 via-slate-800 to-amber-500/40 shadow-2xl">
              {/* Corner decorative anchors */}
              <div className="absolute top-1 left-1 w-3 h-3 border-t-2 border-l-2 border-amber-400" />
              <div className="absolute top-1 right-1 w-3 h-3 border-t-2 border-r-2 border-amber-400" />
              <div className="absolute bottom-1 left-1 w-3 h-3 border-b-2 border-l-2 border-amber-400" />
              <div className="absolute bottom-1 right-1 w-3 h-3 border-b-2 border-r-2 border-amber-400" />

              <div className="w-64 h-72 sm:w-72 sm:h-80 rounded-xl overflow-hidden relative bg-slate-950">
                <img
                  src={currentWinner.winnerPhoto}
                  alt={currentWinner.staffName}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 text-left">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400">
                    Official Recognition Portrait
                  </span>
                  <p className="text-xs text-slate-300 truncate">
                    Ref: {currentWinner.certificateId}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Recipient Details, Citation & Certificate Action */}
        <div className="lg:col-span-7 space-y-5 text-left">
          {/* Metadata kicker */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-amber-400 font-medium">
            <span className="uppercase tracking-widest text-[11px] font-bold bg-amber-500/10 border border-amber-500/30 px-2.5 py-0.5 rounded-md">
              Current Spotlight
            </span>
            <span className="text-slate-600">·</span>
            <span className="flex items-center gap-1 text-slate-300">
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              {awardPeriod}
            </span>
            <span className="text-slate-600">·</span>
            <span className="flex items-center gap-1 text-slate-300">
              <Building2 className="w-3.5 h-3.5 text-amber-400" />
              {currentWinner.departmentName}
            </span>
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white font-display">
              {currentWinner.staffName}
            </h1>
            <p className="text-sm sm:text-base text-amber-300 font-semibold mt-1">
              {currentWinner.staffRank}
            </p>
          </div>

          {/* Official citation quote box */}
          <div className="relative bg-slate-800/80 border-l-4 border-amber-500 rounded-r-xl p-4 sm:p-5 shadow-inner">
            <div className="text-[11px] uppercase tracking-wider text-amber-400/90 font-bold mb-1 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              Committee Commendation & Reasons of Excellence
            </div>
            <p className="text-slate-200 text-sm sm:text-base leading-relaxed italic">
              "{currentWinner.reasons}"
            </p>
            <div className="mt-3 pt-3 border-t border-slate-700/60 flex items-center justify-between text-xs text-slate-400">
              <span>Chair: {currentWinner.committeeChairman}</span>
              <span className="font-mono text-[11px]">Awarded: {currentWinner.awardedAt}</span>
            </div>
          </div>

          {/* Action button */}
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <button
              onClick={() => onOpenCertificate(currentWinner)}
              className="px-5 py-2.5 bg-linear-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg hover:shadow-amber-500/20 transition-all flex items-center gap-2"
            >
              <FileText className="w-4 h-4 text-slate-950" />
              View & Print Official Certificate
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

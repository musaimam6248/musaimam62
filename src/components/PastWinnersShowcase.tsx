import React, { useState } from 'react';
import { usePortal } from '../context/PortalContext';
import { Winner } from '../types';
import { Award, Calendar, Building2, Search, FileText, ChevronRight } from 'lucide-react';

interface PastWinnersShowcaseProps {
  onOpenCertificate: (winner: Winner) => void;
}

export const PastWinnersShowcase: React.FC<PastWinnersShowcaseProps> = ({ onOpenCertificate }) => {
  const { winners } = usePortal();
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Distinct years available
  const availableYears = Array.from(new Set(winners.map((w) => w.year.toString()))).sort().reverse();

  // Exclude current/first winner if displaying archive, or display all
  const filteredWinners = winners.filter((w) => {
    const matchesYear = selectedYear === 'all' || w.year.toString() === selectedYear;
    const matchesSearch =
      searchQuery === '' ||
      w.staffName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.departmentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.staffRank.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesYear && matchesSearch;
  });

  return (
    <section className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-700 uppercase tracking-widest">
            <Award className="w-4 h-4" />
            Hall of Recognition
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-display mt-0.5">
            Past Honorees & Laureates
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Archived record of outstanding clinical, nursing, technical, and administrative staff recognized by FNSTM.
          </p>
        </div>

        {/* Filter Bar Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Year selector segmented buttons */}
          <div className="flex items-center p-1 bg-slate-100 rounded-lg border border-slate-200">
            <button
              onClick={() => setSelectedYear('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                selectedYear === 'all'
                  ? 'bg-white text-slate-950 font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Years
            </button>
            {availableYears.map((yr) => (
              <button
                key={yr}
                onClick={() => setSelectedYear(yr)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  selectedYear === yr
                    ? 'bg-white text-slate-950 font-semibold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {yr}
              </button>
            ))}
          </div>

          {/* Search box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search laureate..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 w-44"
            />
          </div>
        </div>
      </div>

      {/* Grid of Winners */}
      {filteredWinners.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center text-slate-500">
          <p className="text-sm">No laureates found matching your selected criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWinners.map((winner, idx) => {
            const isExpanded = expandedId === winner.id;
            const period = `${monthNames[winner.month - 1]} ${winner.year}`;

            return (
              <div
                key={winner.id}
                className="bg-white rounded-2xl border border-slate-200 hover:border-slate-300 shadow-xs hover:shadow-md transition-all flex flex-col overflow-hidden"
              >
                {/* Header image & award badge */}
                <div className="relative h-48 bg-slate-900 overflow-hidden">
                  <img
                    src={winner.winnerPhoto}
                    alt={winner.staffName}
                    className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-transparent to-transparent" />
                  
                  {/* Top award tag */}
                  <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-xs text-amber-300 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md border border-amber-500/30">
                    {period}
                  </div>

                  {idx === 0 && (
                    <div className="absolute top-3 right-3 bg-amber-500 text-slate-950 text-[10px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-sm shadow-xs">
                      Latest
                    </div>
                  )}

                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <span className="text-[11px] text-amber-300/90 font-medium block truncate">
                      {winner.departmentName}
                    </span>
                    <h3 className="text-base font-bold text-white truncate">
                      {winner.staffName}
                    </h3>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <p className="text-xs font-semibold text-slate-700">
                      {winner.staffRank}
                    </p>

                    <div className="mt-2 text-xs text-slate-600 leading-relaxed">
                      <p className={isExpanded ? '' : 'line-clamp-3'}>
                        "{winner.reasons}"
                      </p>
                      {winner.reasons.length > 140 && (
                        <button
                          onClick={() => setExpandedId(isExpanded ? null : winner.id)}
                          className="text-[11px] font-semibold text-amber-700 hover:text-amber-800 mt-1 block"
                        >
                          {isExpanded ? 'Show less' : 'Read full citation'}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Footer actions */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="font-mono text-[10px] text-slate-600">
                      Ref: {winner.certificateId.slice(-7)}
                    </span>
                    <button
                      onClick={() => onOpenCertificate(winner)}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-slate-900 hover:text-amber-700 transition-colors"
                    >
                      <FileText className="w-3.5 h-3.5 text-amber-600" />
                      View Certificate
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

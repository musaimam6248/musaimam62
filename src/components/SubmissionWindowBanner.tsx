import React, { useState, useEffect } from 'react';
import { usePortal } from '../context/PortalContext';
import { Clock, Calendar, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';

interface SubmissionWindowBannerProps {
  onNavigateToNomination: () => void;
}

export const SubmissionWindowBanner: React.FC<SubmissionWindowBannerProps> = ({
  onNavigateToNomination,
}) => {
  const { schedule, isSubmissionWindowOpen, currentUser } = usePortal();

  // State for countdown
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isPastClose: boolean;
    isBeforeOpen: boolean;
  }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isPastClose: false,
    isBeforeOpen: false,
  });

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date().getTime();
      const openTime = new Date(schedule.opensAt).getTime();
      const closeTime = new Date(schedule.closesAt).getTime();

      if (now < openTime) {
        const diff = openTime - now;
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / 1000 / 60) % 60),
          seconds: Math.floor((diff / 1000) % 60),
          isPastClose: false,
          isBeforeOpen: true,
        });
      } else if (now <= closeTime) {
        const diff = closeTime - now;
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / 1000 / 60) % 60),
          seconds: Math.floor((diff / 1000) % 60),
          isPastClose: false,
          isBeforeOpen: false,
        });
      } else {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isPastClose: true,
          isBeforeOpen: false,
        });
      }
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [schedule.opensAt, schedule.closesAt]);

  const formatDate = (isoStr: string) => {
    try {
      const d = new Date(isoStr);
      return d.toLocaleString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoStr;
    }
  };

  return (
    <div className="bg-slate-900 text-white border-y border-slate-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Status & Schedule Info */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-3">
              <span className="flex h-3 w-3 relative">
                {isSubmissionWindowOpen && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                )}
                <span
                  className={`relative inline-flex rounded-full h-3 w-3 ${
                    isSubmissionWindowOpen
                      ? 'bg-emerald-500'
                      : timeLeft.isBeforeOpen
                      ? 'bg-amber-500'
                      : 'bg-rose-500'
                  }`}
                />
              </span>
              <span className="font-display uppercase tracking-wider text-xs font-bold text-amber-400">
                {isSubmissionWindowOpen
                  ? 'Official Nomination Window Active'
                  : timeLeft.isBeforeOpen
                  ? 'Upcoming Submission Window'
                  : 'Nomination Window Closed'}
              </span>
              <span className="text-slate-400 text-xs">·</span>
              <span className="text-slate-400 text-xs font-mono">{schedule.timezone}</span>
            </div>

            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white">
              Staff of the Month Submissions
            </h2>

            <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-300">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                Opens: <strong className="text-white">{formatDate(schedule.opensAt)}</strong>
              </span>
              <span>—</span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                Closes: <strong className="text-white">{formatDate(schedule.closesAt)}</strong>
              </span>
            </div>

            {schedule.note && (
              <p className="text-xs text-slate-400 max-w-2xl pt-1 leading-relaxed">
                {schedule.note}
              </p>
            )}
          </div>

          {/* Countdown & Action */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 lg:gap-6 bg-slate-800/80 p-3.5 sm:p-4 rounded-xl border border-slate-700/60">
            {/* Live countdown block */}
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-amber-400 shrink-0 hidden sm:block" />
              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="bg-slate-900/90 px-2 py-1.5 rounded-lg border border-slate-700/50 min-w-[50px]">
                  <span className="block font-mono tabular-nums text-base font-bold text-white">
                    {String(timeLeft.days).padStart(2, '0')}
                  </span>
                  <span className="block text-[10px] text-slate-400 uppercase tracking-tighter">Days</span>
                </div>
                <div className="bg-slate-900/90 px-2 py-1.5 rounded-lg border border-slate-700/50 min-w-[50px]">
                  <span className="block font-mono tabular-nums text-base font-bold text-white">
                    {String(timeLeft.hours).padStart(2, '0')}
                  </span>
                  <span className="block text-[10px] text-slate-400 uppercase tracking-tighter">Hours</span>
                </div>
                <div className="bg-slate-900/90 px-2 py-1.5 rounded-lg border border-slate-700/50 min-w-[50px]">
                  <span className="block font-mono tabular-nums text-base font-bold text-white">
                    {String(timeLeft.minutes).padStart(2, '0')}
                  </span>
                  <span className="block text-[10px] text-slate-400 uppercase tracking-tighter">Mins</span>
                </div>
                <div className="bg-slate-900/90 px-2 py-1.5 rounded-lg border border-slate-700/50 min-w-[50px]">
                  <span className="block font-mono tabular-nums text-base font-bold text-amber-400">
                    {String(timeLeft.seconds).padStart(2, '0')}
                  </span>
                  <span className="block text-[10px] text-slate-400 uppercase tracking-tighter">Secs</span>
                </div>
              </div>
            </div>

            {/* Action button */}
            <button
              onClick={onNavigateToNomination}
              className={`w-full sm:w-auto px-4 py-2.5 rounded-lg font-medium text-xs whitespace-nowrap transition-all shadow-xs flex items-center justify-center gap-2 ${
                isSubmissionWindowOpen
                  ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold'
                  : 'bg-slate-700 hover:bg-slate-600 text-slate-200'
              }`}
            >
              <span>
                {currentUser?.role === 'admin'
                  ? 'Window Settings & Appraisals'
                  : currentUser?.role === 'department'
                  ? 'File Department Nomination'
                  : 'Department Submissions'}
              </span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

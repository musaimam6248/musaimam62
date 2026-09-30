import React from 'react';
import { Winner } from '../types';
import { usePortal } from '../context/PortalContext';
import { X, Printer, Download, Award, ShieldCheck } from 'lucide-react';

interface CertificateModalProps {
  winner: Winner;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({ winner, onClose }) => {
  const { institution } = usePortal();

  const handlePrint = () => {
    window.print();
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const awardPeriod = `${monthNames[winner.month - 1]} ${winner.year}`;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* Modal Controls (Hidden in Print) */}
        <div className="no-print bg-slate-900 text-white px-6 py-3.5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold uppercase tracking-wider">
              Official Award Certificate Viewer
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Printer className="w-3.5 h-3.5 text-slate-950" />
              Print Certificate
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-md transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Certificate Sheet */}
        <div className="p-8 sm:p-12 bg-amber-50/30 text-slate-900">
          <div className="border-8 border-double border-amber-700/60 p-8 sm:p-12 bg-white relative shadow-sm rounded-xl">
            {/* Corner heraldic ornamentation */}
            <div className="absolute top-2 left-2 w-8 h-8 border-t-4 border-l-4 border-amber-600" />
            <div className="absolute top-2 right-2 w-8 h-8 border-t-4 border-r-4 border-amber-600" />
            <div className="absolute bottom-2 left-2 w-8 h-8 border-b-4 border-l-4 border-amber-600" />
            <div className="absolute bottom-2 right-2 w-8 h-8 border-b-4 border-r-4 border-amber-600" />

            {/* Header Lockup */}
            <div className="text-center space-y-2">
              <img
                src={institution.badgeUrl}
                alt="Institutional Seal"
                className="w-20 h-20 mx-auto rounded-full object-cover border-2 border-amber-600 shadow-md"
                referrerPolicy="no-referrer"
              />
              <h2 className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-slate-700">
                {institution.schoolName}
              </h2>
              <div className="inline-block py-1 px-4 border-b-2 border-amber-600">
                <span className="text-xl sm:text-3xl font-extrabold font-display uppercase tracking-wider text-amber-800">
                  Certificate of Excellence
                </span>
              </div>
              <p className="text-xs uppercase tracking-widest text-slate-500 font-medium">
                Staff of the Month Recognition
              </p>
            </div>

            {/* Recipient Declaration */}
            <div className="my-8 text-center space-y-4">
              <p className="text-xs uppercase tracking-wider text-slate-600">
                This prestigious institutional award is proudly conferred upon
              </p>

              <div>
                <h1 className="text-2xl sm:text-4xl font-extrabold font-display text-slate-950 underline decoration-amber-500 decoration-2 underline-offset-8">
                  {winner.staffName}
                </h1>
                <p className="text-sm font-bold text-amber-800 mt-2">
                  {winner.staffRank} · {winner.departmentName}
                </p>
              </div>

              <div className="max-w-2xl mx-auto py-2">
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic border-y border-amber-200/80 py-3">
                  "{winner.reasons}"
                </p>
              </div>

              <p className="text-xs text-slate-500 font-medium">
                Conferred for the Month of <strong className="text-slate-800">{awardPeriod}</strong> in acknowledgment of exemplary commitment, clinical vigilance, and outstanding professional conduct.
              </p>
            </div>

            {/* Signatures & Seal */}
            <div className="mt-12 pt-6 grid grid-cols-2 sm:grid-cols-3 gap-6 items-end text-center">
              <div className="space-y-1">
                <div className="w-36 mx-auto border-b border-slate-700 pb-1">
                  <span className="font-serif italic text-sm text-slate-800">Jude K. Okafor</span>
                </div>
                <p className="text-[11px] font-bold text-slate-800">{winner.committeeChairman}</p>
                <p className="text-[10px] text-slate-500 uppercase">Committee Chairman</p>
              </div>

              <div className="hidden sm:flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-full border-2 border-dashed border-amber-600 flex items-center justify-center text-amber-700">
                  <ShieldCheck className="w-8 h-8" />
                </div>
                <span className="text-[9px] uppercase font-mono tracking-widest text-slate-500 mt-1">
                  Verified & Ratified
                </span>
              </div>

              <div className="space-y-1">
                <div className="w-36 mx-auto border-b border-slate-700 pb-1">
                  <span className="font-serif italic text-sm text-slate-800">Fatima B. Yahaya</span>
                </div>
                <p className="text-[11px] font-bold text-slate-800">Dr. Fatima B. Yahaya, FWACP</p>
                <p className="text-[10px] text-slate-500 uppercase">Secretary to the Board</p>
              </div>
            </div>

            {/* Certificate ID */}
            <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between text-[10px] font-mono text-slate-600">
              <span>Certificate Serial: <strong>{winner.certificateId}</strong></span>
              <span>Conferment Date: {winner.awardedAt}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

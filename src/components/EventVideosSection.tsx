import React from 'react';
import { usePortal } from '../context/PortalContext';
import { Video, Play, Calendar, Clock } from 'lucide-react';

export const EventVideosSection: React.FC = () => {
  const { videos } = usePortal();

  return (
    <section className="space-y-6">
      <div>
        <div className="flex items-center gap-2 text-xs font-bold text-amber-700 uppercase tracking-widest">
          <Video className="w-4 h-4" />
          Motion & Broadcast
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-display mt-0.5">
          Event Video Highlights
        </h2>
        <p className="text-sm text-slate-600 mt-1">
          Recorded ceremony proceedings, executive speeches, and medical grand round presentations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {videos.map((vid) => (
          <div
            key={vid.id}
            className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col"
          >
            <div className="relative aspect-16/9 bg-slate-950">
              <video
                controls
                poster={vid.thumbnailUrl}
                preload="metadata"
                className="w-full h-full object-cover"
              >
                <source src={vid.videoUrl} type="video/mp4" />
                Your browser does not support HTML5 video playback.
              </video>
              <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-xs text-white text-[10px] font-mono px-2 py-0.5 rounded-md pointer-events-none flex items-center gap-1">
                <Clock className="w-3 h-3 text-amber-400" />
                {vid.duration}
              </div>
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between space-y-2">
              <div>
                <div className="flex items-center gap-2 text-[11px] text-slate-600 mb-1">
                  <Calendar className="w-3 h-3 text-slate-400" />
                  <span>{new Date(vid.uploadedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                </div>
                <h3 className="text-base font-bold text-slate-900 leading-snug">
                  {vid.title}
                </h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {vid.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

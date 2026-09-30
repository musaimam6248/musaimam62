import React, { useState } from 'react';
import { usePortal } from '../context/PortalContext';
import { LectureResource } from '../types';
import { BookOpen, Search, Download, FileText, User, Building, Calendar, CheckCircle2 } from 'lucide-react';

export const LectureRepositorySection: React.FC = () => {
  const { lectures, incrementLectureDownload } = usePortal();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [downloadSuccessId, setDownloadSuccessId] = useState<string | null>(null);

  const categories = Array.from(new Set(lectures.map((l) => l.category)));

  const filteredLectures = lectures.filter((l) => {
    const matchesSearch =
      searchQuery === '' ||
      l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.speaker.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.department.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || l.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDownload = (lec: LectureResource) => {
    incrementLectureDownload(lec.id);
    setDownloadSuccessId(lec.id);

    // Create a mock downloadable blob for immediate real file download
    const blobContent = `Federal Neuro-Psychiatric Hospital & Training Institute (FNSTM)\nClinical & Academic Lecture Archive\n\nTitle: ${lec.title}\nDepartment: ${lec.department}\nSpeaker: ${lec.speaker}\nCategory: ${lec.category}\nArchive Ref: ${lec.fileName}\nDownloaded: ${new Date().toISOString()}\n\n[Official Educational Materials for Hospital Staff Continuous Medical Education]`;
    const blob = new Blob([blobContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = lec.fileName.endsWith('.pdf') ? lec.fileName.replace('.pdf', '.txt') : `${lec.fileName}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setTimeout(() => {
      setDownloadSuccessId(null);
    }, 3000);
  };

  return (
    <section className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-700 uppercase tracking-widest">
            <BookOpen className="w-4 h-4" />
            Continuing Medical Education (CME)
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-display mt-0.5">
            Academic & Clinical Lecture Notes
          </h2>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Peer-reviewed clinical guidelines, departmental presentations, and grand round notes available for download.
          </p>
        </div>

        {/* Search & Category Filter */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search lectures, topics, speaker..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 w-56 sm:w-64"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 font-medium focus:outline-hidden focus:ring-2 focus:ring-slate-900/10"
          >
            <option value="all">All Domains</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Lectures List Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                <th className="py-3 px-4">Lecture Title & Document</th>
                <th className="py-3 px-4">Speaker & Department</th>
                <th className="py-3 px-4">Domain</th>
                <th className="py-3 px-4 text-center">Downloads</th>
                <th className="py-3 px-4 text-right">Access</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredLectures.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-500">
                    No lectures found matching your search.
                  </td>
                </tr>
              ) : (
                filteredLectures.map((lec) => {
                  const isSuccess = downloadSuccessId === lec.id;
                  return (
                    <tr key={lec.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-slate-100 text-slate-700 rounded-lg shrink-0 mt-0.5">
                            <FileText className="w-4 h-4 text-amber-700" />
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900 leading-snug">
                              {lec.title}
                            </p>
                            <div className="flex items-center gap-2 text-[11px] text-slate-500 font-mono mt-0.5">
                              <span>{lec.fileName}</span>
                              <span>·</span>
                              <span>{lec.fileSize}</span>
                              <span>·</span>
                              <span>
                                {new Date(lec.uploadedAt).toLocaleDateString('en-GB', {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric',
                                })}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-slate-700">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1 font-medium text-slate-900">
                            <User className="w-3 h-3 text-slate-400" />
                            <span>{lec.speaker}</span>
                          </div>
                          <div className="flex items-center gap-1 text-[11px] text-slate-500">
                            <Building className="w-3 h-3 text-slate-400" />
                            <span>{lec.department}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-700">
                          {lec.category}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-center font-mono tabular-nums text-slate-600">
                        {lec.downloadCount}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => handleDownload(lec)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                            isSuccess
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-slate-900 text-white hover:bg-slate-800 shadow-xs'
                          }`}
                        >
                          {isSuccess ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                              Downloaded
                            </>
                          ) : (
                            <>
                              <Download className="w-3.5 h-3.5 text-amber-400" />
                              Download File
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

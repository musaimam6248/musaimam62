import React, { useState } from 'react';
import { usePortal } from '../context/PortalContext';
import {
  ShieldCheck,
  Calendar,
  Award,
  Users,
  Image,
  BookOpen,
  BarChart3,
  FileSpreadsheet,
  Printer,
  Bell,
  Settings,
  Search,
  CheckCircle2,
  XCircle,
  Plus,
  Trash2,
  Download,
  AlertCircle,
  Clock,
  ExternalLink,
  Crown,
} from 'lucide-react';
import { NominationSubmission, Winner } from '../types';

interface AdminDashboardProps {
  onOpenCertificate: (winner: Winner) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onOpenCertificate }) => {
  const {
    institution,
    updateInstitution,
    schedule,
    updateSchedule,
    isSubmissionWindowOpen,
    departments,
    submissions,
    updateSubmissionStatus,
    winners,
    crownWinner,
    committee,
    addCommitteeMember,
    deleteCommitteeMember,
    gallery,
    addGalleryImage,
    deleteGalleryImage,
    videos,
    addVideo,
    deleteVideo,
    lectures,
    addLecture,
    deleteLecture,
    sendNotification,
    resetAllData,
  } = usePortal();

  const [activeTab, setActiveTab] = useState<
    | 'submissions'
    | 'schedule'
    | 'crown'
    | 'committee'
    | 'media'
    | 'lectures'
    | 'analytics'
    | 'reports'
    | 'broadcast'
    | 'settings'
  >('submissions');

  // Filter states for submissions
  const [subSearch, setSubSearch] = useState('');
  const [subDeptFilter, setSubDeptFilter] = useState('all');
  const [subStatusFilter, setSubStatusFilter] = useState('all');

  // Review modal state
  const [selectedSubmission, setSelectedSubmission] = useState<NominationSubmission | null>(null);
  const [reviewNoteInput, setReviewNoteInput] = useState('');

  // Schedule editor state
  const [schedOpensAt, setSchedOpensAt] = useState(schedule.opensAt.slice(0, 16));
  const [schedClosesAt, setSchedClosesAt] = useState(schedule.closesAt.slice(0, 16));
  const [schedIsEnabled, setSchedIsEnabled] = useState(schedule.isEnabled);
  const [schedNote, setSchedNote] = useState(schedule.note);
  const [schedSaved, setSchedSaved] = useState(false);

  // Crown winner studio state
  const [crownSubId, setCrownSubId] = useState('');
  const [crownMonth, setCrownMonth] = useState(new Date().getMonth() + 1);
  const [crownYear, setCrownYear] = useState(new Date().getFullYear());
  const [crownReasons, setCrownReasons] = useState('');
  const [crownChairman, setCrownChairman] = useState('Prof. Jude K. Okafor, MD, FMCPsych');
  const [crownSuccess, setCrownSuccess] = useState<Winner | null>(null);

  // Committee form state
  const [newComName, setNewComName] = useState('');
  const [newComRole, setNewComRole] = useState('');
  const [newComDesignation, setNewComDesignation] = useState('');
  const [newComEmail, setNewComEmail] = useState('');
  const [newComPhoto, setNewComPhoto] = useState('');

  // Media upload state
  const [newImgTitle, setNewImgTitle] = useState('');
  const [newImgUrl, setNewImgUrl] = useState('');
  const [newImgCategory, setNewImgCategory] = useState<any>('Award Ceremony');
  const [newImgMonth, setNewImgMonth] = useState('September 2026');

  // Lecture upload state
  const [newLecTitle, setNewLecTitle] = useState('');
  const [newLecSpeaker, setNewLecSpeaker] = useState('');
  const [newLecDept, setNewLecDept] = useState('');
  const [newLecCategory, setNewLecCategory] = useState<any>('Clinical Guidelines');

  // Notification broadcast state
  const [notifTitle, setNotifTitle] = useState('');
  const [notifMsg, setNotifMsg] = useState('');
  const [notifPriority, setNotifPriority] = useState<'normal' | 'urgent'>('normal');
  const [notifSent, setNotifSent] = useState(false);

  // Settings state
  const [settSchoolName, setSettSchoolName] = useState(institution.schoolName);
  const [settVision, setSettVision] = useState(institution.vision);
  const [settMission, setSettMission] = useState(institution.mission);
  const [settSaved, setSettSaved] = useState(false);

  // Filtered submissions
  const filteredSubmissions = submissions.filter((s) => {
    const matchesSearch =
      subSearch === '' ||
      s.staffName.toLowerCase().includes(subSearch.toLowerCase()) ||
      s.departmentName.toLowerCase().includes(subSearch.toLowerCase());
    const matchesDept = subDeptFilter === 'all' || s.departmentId === subDeptFilter;
    const matchesStatus = subStatusFilter === 'all' || s.status === subStatusFilter;
    return matchesSearch && matchesDept && matchesStatus;
  });

  const handleSaveSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    updateSchedule({
      opensAt: new Date(schedOpensAt).toISOString(),
      closesAt: new Date(schedClosesAt).toISOString(),
      isEnabled: schedIsEnabled,
      note: schedNote,
    });
    setSchedSaved(true);
    setTimeout(() => setSchedSaved(false), 2500);
  };

  const handleCrownSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const sub = submissions.find((s) => s.id === crownSubId);
    if (!sub) return;

    const winner = crownWinner({
      staffId: sub.staffId,
      staffName: sub.staffName,
      staffRank: sub.staffRank,
      departmentName: sub.departmentName,
      month: crownMonth,
      year: crownYear,
      reasons: crownReasons || `${sub.reason1} Furthermore, ${sub.reason2}`,
      winnerPhoto: sub.staffPhoto,
      committeeChairman: crownChairman,
    });

    setCrownSuccess(winner);
    setCrownSubId('');
    setCrownReasons('');
  };

  const handleAddCommittee = (e: React.FormEvent) => {
    e.preventDefault();
    addCommitteeMember({
      name: newComName,
      role: newComRole,
      designation: newComDesignation,
      photoUrl:
        newComPhoto ||
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
      email: newComEmail,
    });
    setNewComName('');
    setNewComRole('');
    setNewComDesignation('');
    setNewComEmail('');
    setNewComPhoto('');
  };

  const handleAddMedia = (e: React.FormEvent) => {
    e.preventDefault();
    addGalleryImage({
      title: newImgTitle,
      imageUrl:
        newImgUrl ||
        'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800',
      category: newImgCategory,
      monthYear: newImgMonth,
    });
    setNewImgTitle('');
    setNewImgUrl('');
  };

  const handleAddLecture = (e: React.FormEvent) => {
    e.preventDefault();
    addLecture({
      title: newLecTitle,
      fileName: `FNSTM-EDU-${Date.now().toString().slice(-4)}.pdf`,
      fileSize: '3.4 MB',
      speaker: newLecSpeaker,
      department: newLecDept || 'Institutional Clinical Faculty',
      category: newLecCategory,
    });
    setNewLecTitle('');
    setNewLecSpeaker('');
    setNewLecDept('');
  };

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    sendNotification({
      title: notifTitle,
      message: notifMsg,
      sender: 'Board Secretariat',
      priority: notifPriority,
    });
    setNotifSent(true);
    setNotifTitle('');
    setNotifMsg('');
    setTimeout(() => setNotifSent(false), 2500);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateInstitution({
      schoolName: settSchoolName,
      vision: settVision,
      mission: settMission,
    });
    setSettSaved(true);
    setTimeout(() => setSettSaved(false), 2500);
  };

  // CSV Export utility
  const handleExportSubmissionsCSV = () => {
    const headers = ['ID', 'Candidate Name', 'Rank', 'Department', 'Month', 'Year', 'Criterion 1', 'Criterion 2', 'Status', 'Submitted At'];
    const rows = submissions.map((s) => [
      s.id,
      `"${s.staffName.replace(/"/g, '""')}"`,
      `"${s.staffRank.replace(/"/g, '""')}"`,
      `"${s.departmentName.replace(/"/g, '""')}"`,
      s.submissionMonth,
      s.submissionYear,
      `"${s.reason1.replace(/"/g, '""')}"`,
      `"${s.reason2.replace(/"/g, '""')}"`,
      s.status,
      s.submittedAt,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `FNSTM-Submissions-Report-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & KPI Stat Row */}
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white border border-slate-800 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6 mb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-widest">
              <ShieldCheck className="w-4 h-4" />
              Central Committee Console
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-display text-white mt-1">
              Admin Governance & Appraisal Suite
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Manage submission windows, evaluate candidate nominations, crown monthly laureates, and govern institutional media.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('crown')}
              className="px-4 py-2 bg-linear-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5"
            >
              <Crown className="w-4 h-4 text-slate-950" />
              Crown New Winner
            </button>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700/60">
            <span className="text-[11px] uppercase font-bold text-slate-400 block tracking-wider">
              Total Nominations
            </span>
            <span className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-white mt-1 block">
              {submissions.length}
            </span>
            <span className="text-[10px] text-amber-400 font-medium">All Cadres Logged</span>
          </div>

          <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700/60">
            <span className="text-[11px] uppercase font-bold text-slate-400 block tracking-wider">
              Participating Depts
            </span>
            <span className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-white mt-1 block">
              {departments.length}
            </span>
            <span className="text-[10px] text-emerald-400 font-medium">100% Onboarded</span>
          </div>

          <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700/60">
            <span className="text-[11px] uppercase font-bold text-slate-400 block tracking-wider">
              Laureates Crowned
            </span>
            <span className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-white mt-1 block">
              {winners.length}
            </span>
            <span className="text-[10px] text-amber-300 font-medium">Hall of Fame Entries</span>
          </div>

          <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700/60">
            <span className="text-[11px] uppercase font-bold text-slate-400 block tracking-wider">
              Submission Window
            </span>
            <span
              className={`text-lg sm:text-xl font-bold mt-1 block truncate ${
                isSubmissionWindowOpen ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {isSubmissionWindowOpen ? 'Active Now' : 'Closed'}
            </span>
            <span className="text-[10px] text-slate-400 font-mono">Africa/Lagos</span>
          </div>
        </div>
      </div>

      {/* Tab Navigation Menu */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-slate-200 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('submissions')}
          className={`px-3.5 py-2 rounded-lg whitespace-nowrap transition-colors ${
            activeTab === 'submissions'
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Submissions ({submissions.length})
        </button>

        <button
          onClick={() => setActiveTab('schedule')}
          className={`px-3.5 py-2 rounded-lg whitespace-nowrap transition-colors ${
            activeTab === 'schedule'
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Window Schedule
        </button>

        <button
          onClick={() => setActiveTab('crown')}
          className={`px-3.5 py-2 rounded-lg whitespace-nowrap transition-colors ${
            activeTab === 'crown'
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Crown Winner Studio
        </button>

        <button
          onClick={() => setActiveTab('committee')}
          className={`px-3.5 py-2 rounded-lg whitespace-nowrap transition-colors ${
            activeTab === 'committee'
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Committee ({committee.length})
        </button>

        <button
          onClick={() => setActiveTab('media')}
          className={`px-3.5 py-2 rounded-lg whitespace-nowrap transition-colors ${
            activeTab === 'media'
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Media & Gallery
        </button>

        <button
          onClick={() => setActiveTab('lectures')}
          className={`px-3.5 py-2 rounded-lg whitespace-nowrap transition-colors ${
            activeTab === 'lectures'
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Lecture Notes
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-3.5 py-2 rounded-lg whitespace-nowrap transition-colors ${
            activeTab === 'analytics'
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Analytics
        </button>

        <button
          onClick={() => setActiveTab('reports')}
          className={`px-3.5 py-2 rounded-lg whitespace-nowrap transition-colors ${
            activeTab === 'reports'
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Reports & Export
        </button>

        <button
          onClick={() => setActiveTab('broadcast')}
          className={`px-3.5 py-2 rounded-lg whitespace-nowrap transition-colors ${
            activeTab === 'broadcast'
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Bulletins
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`px-3.5 py-2 rounded-lg whitespace-nowrap transition-colors ${
            activeTab === 'settings'
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Settings
        </button>
      </div>

      {/* TAB 1: SUBMISSIONS MANAGEMENT */}
      {activeTab === 'submissions' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200">
            {/* Search */}
            <div className="relative flex-1 max-w-sm">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search nominee or department..."
                value={subSearch}
                onChange={(e) => setSubSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 border border-slate-200 rounded-lg text-xs"
              />
            </div>

            {/* Department Filter */}
            <div className="flex items-center gap-2">
              <select
                value={subDeptFilter}
                onChange={(e) => setSubDeptFilter(e.target.value)}
                className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
              >
                <option value="all">All Departments</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>

              {/* Status Filter */}
              <select
                value={subStatusFilter}
                onChange={(e) => setSubStatusFilter(e.target.value)}
                className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="shortlisted">Shortlisted</option>
                <option value="awarded">Awarded</option>
                <option value="declined">Declined</option>
              </select>
            </div>
          </div>

          {/* Submissions Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                    <th className="py-3 px-4">Candidate</th>
                    <th className="py-3 px-4">Department</th>
                    <th className="py-3 px-4">Month</th>
                    <th className="py-3 px-4">Core Criteria Stated</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Appraisal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {filteredSubmissions.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-500">
                        No submissions match the active filters.
                      </td>
                    </tr>
                  ) : (
                    filteredSubmissions.map((sub) => (
                      <tr key={sub.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={sub.staffPhoto}
                              alt={sub.staffName}
                              className="w-10 h-10 rounded-full object-cover border border-slate-200"
                              referrerPolicy="no-referrer"
                            />
                            <div>
                              <p className="font-bold text-slate-900">{sub.staffName}</p>
                              <p className="text-[11px] text-slate-500">{sub.staffRank}</p>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 text-slate-700">
                          {sub.departmentName}
                        </td>

                        <td className="py-3.5 px-4 font-mono text-[11px] text-slate-700">
                          {sub.submissionMonth}/{sub.submissionYear}
                        </td>

                        <td className="py-3.5 px-4 max-w-xs">
                          <p className="text-[11px] text-slate-700 font-medium line-clamp-1">1: {sub.reason1}</p>
                          <p className="text-[11px] text-slate-500 line-clamp-1">2: {sub.reason2}</p>
                        </td>

                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              sub.status === 'awarded'
                                ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                : sub.status === 'shortlisted'
                                ? 'bg-indigo-100 text-indigo-800'
                                : sub.status === 'declined'
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {sub.status === 'awarded' ? 'Winner' : sub.status}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => {
                              setSelectedSubmission(sub);
                              setReviewNoteInput(sub.reviewNotes || '');
                            }}
                            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-xs"
                          >
                            Evaluate
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Submission Review Modal */}
          {selectedSubmission && (
            <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
              <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 relative border border-slate-200">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-amber-700" />
                    <h3 className="text-base font-bold text-slate-900">
                      Committee Appraisal Session
                    </h3>
                  </div>
                  <button
                    onClick={() => setSelectedSubmission(null)}
                    className="text-slate-400 hover:text-slate-600 p-1"
                  >
                    ✕
                  </button>
                </div>

                <div className="flex items-center gap-3.5 p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                  <img
                    src={selectedSubmission.staffPhoto}
                    alt={selectedSubmission.staffName}
                    className="w-14 h-14 rounded-full object-cover border border-slate-300"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">
                      {selectedSubmission.staffName}
                    </h4>
                    <p className="text-xs text-slate-600">{selectedSubmission.staffRank}</p>
                    <p className="text-[11px] text-amber-800 font-medium">
                      {selectedSubmission.departmentName} · Nominated for {selectedSubmission.submissionMonth}/{selectedSubmission.submissionYear}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <strong className="block text-slate-900">Criterion 1:</strong>
                    <p className="text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100 mt-0.5">
                      {selectedSubmission.reason1}
                    </p>
                  </div>
                  <div>
                    <strong className="block text-slate-900">Criterion 2:</strong>
                    <p className="text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100 mt-0.5">
                      {selectedSubmission.reason2}
                    </p>
                  </div>
                  {selectedSubmission.detailedJustification && (
                    <div>
                      <strong className="block text-slate-900">Department Recommendation:</strong>
                      <p className="text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100 mt-0.5 italic">
                        "{selectedSubmission.detailedJustification}"
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Committee Appraisal Observations / Note
                  </label>
                  <textarea
                    rows={2}
                    value={reviewNoteInput}
                    onChange={(e) => setReviewNoteInput(e.target.value)}
                    placeholder="Enter appraisal notes..."
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                  />
                </div>

                {/* Decision Actions */}
                <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-end gap-2">
                  <button
                    onClick={() => {
                      updateSubmissionStatus(selectedSubmission.id, 'declined', reviewNoteInput);
                      setSelectedSubmission(null);
                    }}
                    className="px-3 py-1.5 border border-slate-200 hover:bg-slate-50 text-rose-700 text-xs font-semibold rounded-lg"
                  >
                    Decline
                  </button>

                  <button
                    onClick={() => {
                      updateSubmissionStatus(selectedSubmission.id, 'shortlisted', reviewNoteInput);
                      setSelectedSubmission(null);
                    }}
                    className="px-3.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-lg"
                  >
                    Shortlist
                  </button>

                  <button
                    onClick={() => {
                      // Switch to Crown Tab with prefilled data
                      setCrownSubId(selectedSubmission.id);
                      setCrownMonth(selectedSubmission.submissionMonth);
                      setCrownYear(selectedSubmission.submissionYear);
                      setCrownReasons(
                        `${selectedSubmission.reason1} In addition, ${selectedSubmission.reason2}`
                      );
                      setSelectedSubmission(null);
                      setActiveTab('crown');
                    }}
                    className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-lg shadow-xs flex items-center gap-1.5"
                  >
                    <Crown className="w-3.5 h-3.5" />
                    Crown Winner Now
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: SCHEDULE CONTROLLER */}
      {activeTab === 'schedule' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs max-w-2xl">
          <h2 className="text-lg font-bold text-slate-900 font-display mb-1 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-amber-700" />
            Nomination Window Schedule Controller
          </h2>
          <p className="text-xs text-slate-600 mb-6">
            Configure the opening and closing timestamps for departmental nominations. The portal strictly enforces these limits.
          </p>

          {schedSaved && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Submission window schedule updated successfully!</span>
            </div>
          )}

          <form onSubmit={handleSaveSchedule} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Opens At (Date & Time)
                </label>
                <input
                  type="datetime-local"
                  required
                  value={schedOpensAt}
                  onChange={(e) => setSchedOpensAt(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Closes At (Date & Time)
                </label>
                <input
                  type="datetime-local"
                  required
                  value={schedClosesAt}
                  onChange={(e) => setSchedClosesAt(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-mono"
                />
              </div>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
              <div>
                <strong className="text-xs text-slate-900 block">Enable Window Enforcement</strong>
                <span className="text-[11px] text-slate-500">
                  When enabled, nominations are restricted strictly between opens and closes.
                </span>
              </div>
              <input
                type="checkbox"
                checked={schedIsEnabled}
                onChange={(e) => setSchedIsEnabled(e.target.checked)}
                className="w-4 h-4 text-slate-900 rounded-md focus:ring-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Advisory Note to Departments (Displayed on Homepage & Dashboard)
              </label>
              <textarea
                rows={3}
                value={schedNote}
                onChange={(e) => setSchedNote(e.target.value)}
                placeholder="Enter instructions for HODs..."
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
              >
                Save Schedule Changes
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 3: CROWN WINNER STUDIO */}
      {activeTab === 'crown' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs max-w-2xl">
          <h2 className="text-lg font-bold text-slate-900 font-display mb-1 flex items-center gap-2">
            <Crown className="w-5 h-5 text-amber-500" />
            Crown Monthly Staff of the Month
          </h2>
          <p className="text-xs text-slate-600 mb-6">
            Ratify the committee's decision, compose the official commendation citation, and publish to the public hall of fame.
          </p>

          {crownSuccess && (
            <div className="mb-6 p-4 bg-amber-50 border border-amber-300 rounded-xl text-amber-900 text-xs space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-700" />
                <strong className="text-sm">Winner Crowned Successfully!</strong>
              </div>
              <p>
                <strong>{crownSuccess.staffName}</strong> has been awarded Staff of the Month for {crownSuccess.month}/{crownSuccess.year}.
              </p>
              <button
                onClick={() => onOpenCertificate(crownSuccess)}
                className="mt-2 px-3 py-1.5 bg-amber-600 text-white text-xs font-bold rounded-lg shadow-xs"
              >
                Preview Official Certificate
              </button>
            </div>
          )}

          <form onSubmit={handleCrownSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Select Department Nominee *
              </label>
              <select
                required
                value={crownSubId}
                onChange={(e) => {
                  setCrownSubId(e.target.value);
                  const sub = submissions.find((s) => s.id === e.target.value);
                  if (sub) {
                    setCrownMonth(sub.submissionMonth);
                    setCrownYear(sub.submissionYear);
                    setCrownReasons(`${sub.reason1} Furthermore, ${sub.reason2}`);
                  }
                }}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
              >
                <option value="">-- Choose from active submissions --</option>
                {submissions.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.staffName} ({sub.departmentName} · {sub.submissionMonth}/{sub.submissionYear})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Award Month (1-12)
                </label>
                <input
                  type="number"
                  min={1}
                  max={12}
                  required
                  value={crownMonth}
                  onChange={(e) => setCrownMonth(parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Award Year
                </label>
                <input
                  type="number"
                  required
                  value={crownYear}
                  onChange={(e) => setCrownYear(parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Official Citation / Reasons of Excellence *
              </label>
              <textarea
                rows={4}
                required
                value={crownReasons}
                onChange={(e) => setCrownReasons(e.target.value)}
                placeholder="Enter the formal citation that appears on the certificate and public hero banner..."
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Ratified By (Committee Chairman Name)
              </label>
              <input
                type="text"
                required
                value={crownChairman}
                onChange={(e) => setCrownChairman(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
              />
            </div>

            <button
              type="submit"
              disabled={!crownSubId}
              className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Crown className="w-4 h-4 text-slate-950" />
              Confer Honor & Publish to Portal
            </button>
          </form>
        </div>
      )}

      {/* TAB 4: COMMITTEE MANAGER */}
      {activeTab === 'committee' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <h2 className="text-base font-bold text-slate-900 font-display mb-1 flex items-center gap-2">
              <Users className="w-4 h-4 text-amber-700" />
              Add Selection Committee Member
            </h2>
            <form onSubmit={handleAddCommittee} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mt-4">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Jane Doe"
                  value={newComName}
                  onChange={(e) => setNewComName(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Board Role *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Committee Secretary"
                  value={newComRole}
                  onChange={(e) => setNewComRole(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Designation *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Head of Clinical Services"
                  value={newComDesignation}
                  onChange={(e) => setNewComDesignation(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Official Email</label>
                <input
                  type="email"
                  placeholder="name@fnstm.gov.ng"
                  value={newComEmail}
                  onChange={(e) => setNewComEmail(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-lg shadow-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5 text-amber-400" />
                  Add Member
                </button>
              </div>
            </form>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200">
              <h3 className="text-sm font-bold text-slate-900">
                Current Committee Members ({committee.length})
              </h3>
            </div>
            <div className="divide-y divide-slate-100">
              {committee.map((member) => (
                <div key={member.id} className="p-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={member.photoUrl}
                      alt={member.name}
                      className="w-10 h-10 rounded-full object-cover border border-slate-200"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <p className="font-bold text-xs text-slate-900">{member.name}</p>
                      <p className="text-[11px] text-slate-600">{member.designation} · <strong className="text-amber-700">{member.role}</strong></p>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteCommitteeMember(member.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                    title="Remove member"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: MEDIA & GALLERY */}
      {activeTab === 'media' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <h2 className="text-base font-bold text-slate-900 font-display mb-1 flex items-center gap-2">
              <Image className="w-4 h-4 text-amber-700" />
              Upload Event Photo to Gallery
            </h2>
            <form onSubmit={handleAddMedia} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Photo Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. October Grand Rounds"
                  value={newImgTitle}
                  onChange={(e) => setNewImgTitle(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Category</label>
                <select
                  value={newImgCategory}
                  onChange={(e) => setNewImgCategory(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs"
                >
                  <option value="Award Ceremony">Award Ceremony</option>
                  <option value="Training">Training</option>
                  <option value="Department">Department</option>
                  <option value="General">General</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Month / Year Label</label>
                <input
                  type="text"
                  placeholder="e.g. October 2026"
                  value={newImgMonth}
                  onChange={(e) => setNewImgMonth(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-lg shadow-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5 text-amber-400" />
                  Add Photo
                </button>
              </div>
            </form>
          </div>

          {/* Active Photos List */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-4">
              Stored Gallery Photos ({gallery.length})
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
              {gallery.map((img) => (
                <div key={img.id} className="relative group rounded-xl overflow-hidden aspect-square bg-slate-100 border border-slate-200">
                  <img
                    src={img.imageUrl}
                    alt={img.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      onClick={() => deleteGalleryImage(img.id)}
                      className="p-1.5 bg-rose-600 text-white rounded-lg shadow-xs hover:bg-rose-500"
                      title="Delete photo"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: LECTURES */}
      {activeTab === 'lectures' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <h2 className="text-base font-bold text-slate-900 font-display mb-1 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-amber-700" />
              Publish New Clinical / Educational Lecture
            </h2>
            <form onSubmit={handleAddLecture} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Lecture Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Psychopharmacology Update 2026"
                  value={newLecTitle}
                  onChange={(e) => setNewLecTitle(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Presenter / Speaker *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Tariq Mohammed"
                  value={newLecSpeaker}
                  onChange={(e) => setNewLecSpeaker(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Department</label>
                <input
                  type="text"
                  placeholder="e.g. Clinical Psychiatry"
                  value={newLecDept}
                  onChange={(e) => setNewLecDept(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-lg shadow-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5 text-amber-400" />
                  Publish File
                </button>
              </div>
            </form>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200">
              <h3 className="text-sm font-bold text-slate-900">
                Stored Documents ({lectures.length})
              </h3>
            </div>
            <div className="divide-y divide-slate-100">
              {lectures.map((lec) => (
                <div key={lec.id} className="p-4 flex items-center justify-between gap-4">
                  <div>
                    <p className="font-bold text-xs text-slate-900">{lec.title}</p>
                    <p className="text-[11px] text-slate-500">{lec.speaker} · {lec.department} · <span className="font-mono">{lec.fileSize}</span></p>
                  </div>
                  <button
                    onClick={() => deleteLecture(lec.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                    title="Delete lecture"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: ANALYTICS & VISUALIZATIONS */}
      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 font-display">
              Nominations by Department
            </h3>
            <div className="space-y-3">
              {departments.map((d) => {
                const count = submissions.filter((s) => s.departmentId === d.id).length;
                const percentage = submissions.length ? Math.round((count / submissions.length) * 100) : 0;
                return (
                  <div key={d.id} className="space-y-1">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-slate-700 truncate">{d.name}</span>
                      <span className="font-mono tabular-nums text-slate-900 font-bold">
                        {count} ({percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                      <div
                        className="bg-amber-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 font-display">
              Submissions Status Breakdown
            </h3>
            <div className="space-y-3">
              {['pending', 'shortlisted', 'awarded', 'declined'].map((st) => {
                const count = submissions.filter((s) => s.status === st).length;
                const percentage = submissions.length ? Math.round((count / submissions.length) * 100) : 0;
                return (
                  <div key={st} className="space-y-1">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="capitalize text-slate-700">{st}</span>
                      <span className="font-mono tabular-nums text-slate-900 font-bold">
                        {count} ({percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          st === 'awarded'
                            ? 'bg-amber-500'
                            : st === 'shortlisted'
                            ? 'bg-indigo-500'
                            : st === 'declined'
                            ? 'bg-rose-500'
                            : 'bg-slate-400'
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 8: REPORTS & EXPORT */}
      {activeTab === 'reports' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs max-w-2xl space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900 font-display mb-1 flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-emerald-700" />
              Institutional Audit & Excel Reporting
            </h2>
            <p className="text-xs text-slate-600">
              Generate standardized spreadsheets for management review, board presentations, and accreditation files.
            </p>
          </div>

          <div className="space-y-3">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
              <div>
                <strong className="text-xs text-slate-900 block">Submissions Log (Excel/CSV)</strong>
                <span className="text-[11px] text-slate-500">
                  Includes candidate names, departments, submitted criteria, and appraisal status.
                </span>
              </div>
              <button
                onClick={handleExportSubmissionsCSV}
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg shadow-xs flex items-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                Export CSV
              </button>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
              <div>
                <strong className="text-xs text-slate-900 block">Print Institutional Summary Report</strong>
                <span className="text-[11px] text-slate-500">
                  Prepares an official print layout with letterhead and statistics.
                </span>
              </div>
              <button
                onClick={() => window.print()}
                className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-lg shadow-xs flex items-center gap-1.5 transition-colors"
              >
                <Printer className="w-3.5 h-3.5" />
                Print View
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 9: BROADCAST BULLETINS */}
      {activeTab === 'broadcast' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs max-w-2xl">
          <h2 className="text-lg font-bold text-slate-900 font-display mb-1 flex items-center gap-2">
            <Bell className="w-5 h-5 text-amber-700" />
            Broadcast Notification Bulletin
          </h2>
          <p className="text-xs text-slate-600 mb-6">
            Dispatch announcements, deadline reminders, or commendations to all department portals.
          </p>

          {notifSent && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Broadcast dispatched successfully to all portals!</span>
            </div>
          )}

          <form onSubmit={handleBroadcast} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Bulletin Headline *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Reminder: 48 Hours Remaining for October Submissions"
                value={notifTitle}
                onChange={(e) => setNotifTitle(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Priority
              </label>
              <select
                value={notifPriority}
                onChange={(e) => setNotifPriority(e.target.value as any)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
              >
                <option value="normal">Normal Information</option>
                <option value="urgent">Urgent Attention (Pulsing)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Message Body *
              </label>
              <textarea
                rows={4}
                required
                value={notifMsg}
                onChange={(e) => setNotifMsg(e.target.value)}
                placeholder="Enter the full announcement text..."
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Bell className="w-3.5 h-3.5 text-amber-400" />
              Dispatch Bulletin
            </button>
          </form>
        </div>
      )}

      {/* TAB 10: SETTINGS & DEFAULTS */}
      {activeTab === 'settings' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs max-w-2xl space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900 font-display mb-1 flex items-center gap-2">
              <Settings className="w-5 h-5 text-slate-700" />
              Portal Institutional Settings
            </h2>
            <p className="text-xs text-slate-600">
              Customize institution naming, vision, and operational parameters.
            </p>
          </div>

          {settSaved && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Settings updated successfully!</span>
            </div>
          )}

          <form onSubmit={handleSaveSettings} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Institution Name
              </label>
              <input
                type="text"
                required
                value={settSchoolName}
                onChange={(e) => setSettSchoolName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Vision Statement
              </label>
              <textarea
                rows={3}
                value={settVision}
                onChange={(e) => setSettVision(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Mission Statement
              </label>
              <textarea
                rows={3}
                value={settMission}
                onChange={(e) => setSettMission(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs"
            >
              Save Settings
            </button>
          </form>

          <div className="pt-6 border-t border-slate-200">
            <h3 className="text-xs font-bold text-rose-700 uppercase tracking-wider mb-1">
              Reset Portal to Default Demo State
            </h3>
            <p className="text-xs text-slate-500 mb-3">
              Restores initial hospital staff, submissions, winners, and settings.
            </p>
            <button
              onClick={() => {
                if (window.confirm('Reset all portal records to initial demo state?')) {
                  resetAllData();
                }
              }}
              className="px-4 py-2 border border-rose-300 text-rose-700 hover:bg-rose-50 font-semibold text-xs rounded-xl transition-colors"
            >
              Reset Data to Defaults
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

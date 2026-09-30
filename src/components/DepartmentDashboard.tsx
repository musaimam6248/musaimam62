import React, { useState } from 'react';
import { usePortal } from '../context/PortalContext';
import {
  UserCheck,
  Send,
  Users,
  History,
  AlertCircle,
  CheckCircle2,
  Plus,
  Trash2,
  Award,
  Clock,
  Sparkles,
  Building,
} from 'lucide-react';
import { StaffMember } from '../types';

export const DepartmentDashboard: React.FC = () => {
  const {
    currentUser,
    departments,
    staff,
    addStaff,
    deleteStaff,
    submissions,
    addSubmission,
    isSubmissionWindowOpen,
    schedule,
  } = usePortal();

  const [activeTab, setActiveTab] = useState<'nominate' | 'staff' | 'history'>('nominate');

  // Find user's department
  const currentDept = departments.find(
    (d) => d.id === currentUser?.departmentId || d.username === currentUser?.username
  ) || departments[0];

  const deptStaff = staff.filter((s) => s.departmentId === currentDept.id);
  const deptSubmissions = submissions.filter((s) => s.departmentId === currentDept.id);

  // Nomination form state
  const [selectedStaffId, setSelectedStaffId] = useState('');
  const [reason1, setReason1] = useState('');
  const [reason2, setReason2] = useState('');
  const [detailedJustification, setDetailedJustification] = useState('');
  const [nominationSubmitted, setNominationSubmitted] = useState(false);

  // Add staff form state
  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffRank, setNewStaffRank] = useState('');
  const [newStaffId, setNewStaffId] = useState('');
  const [newStaffCadre, setNewStaffCadre] = useState<StaffMember['cadre']>('Clinical');
  const [newStaffPhoto, setNewStaffPhoto] = useState('');
  const [staffAddedSuccess, setStaffAddedSuccess] = useState(false);

  const selectedStaff = deptStaff.find((s) => s.id === selectedStaffId);

  const handleNominationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStaff) return;

    const now = new Date();
    addSubmission({
      departmentId: currentDept.id,
      departmentName: currentDept.name,
      staffId: selectedStaff.id,
      staffName: selectedStaff.name,
      staffRank: selectedStaff.rank,
      staffPhoto: selectedStaff.photoUrl,
      submissionMonth: now.getMonth() + 1,
      submissionYear: now.getFullYear(),
      reason1,
      reason2,
      detailedJustification,
    });

    setNominationSubmitted(true);
    setSelectedStaffId('');
    setReason1('');
    setReason2('');
    setDetailedJustification('');

    setTimeout(() => {
      setNominationSubmitted(false);
      setActiveTab('history');
    }, 2000);
  };

  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    const fallbackPhoto = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400';

    addStaff({
      departmentId: currentDept.id,
      name: newStaffName,
      rank: newStaffRank,
      staffId: newStaffId || `FNSTM/${currentDept.code}/${Math.floor(100 + Math.random() * 900)}`,
      photoUrl: newStaffPhoto || fallbackPhoto,
      joinedYear: new Date().getFullYear(),
      cadre: newStaffCadre,
    });

    setStaffAddedSuccess(true);
    setNewStaffName('');
    setNewStaffRank('');
    setNewStaffId('');
    setNewStaffPhoto('');

    setTimeout(() => setStaffAddedSuccess(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Department Title Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-700 uppercase tracking-widest">
            <Building className="w-4 h-4" />
            Departmental Management Console
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-display mt-0.5">
            {currentDept.name}
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Head of Department: <strong className="text-slate-900">{currentDept.hodName}</strong> · Code: <span className="font-mono">{currentDept.code}</span> · Roster: <strong className="text-slate-900">{deptStaff.length} Staff</strong>
          </p>
        </div>

        {/* Window state indicator badge */}
        <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-xl">
          <span className={`w-2.5 h-2.5 rounded-full ${isSubmissionWindowOpen ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
          <div className="text-left">
            <span className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider">
              Nomination Status
            </span>
            <span className={`text-xs font-bold ${isSubmissionWindowOpen ? 'text-emerald-700' : 'text-rose-700'}`}>
              {isSubmissionWindowOpen ? 'Window Active & Accepting' : 'Window Closed'}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 bg-white rounded-xl p-1 shadow-xs text-xs font-semibold">
        <button
          onClick={() => setActiveTab('nominate')}
          className={`flex-1 py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors ${
            activeTab === 'nominate'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Send className="w-3.5 h-3.5" />
          Submit Monthly Nominee
        </button>

        <button
          onClick={() => setActiveTab('staff')}
          className={`flex-1 py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors ${
            activeTab === 'staff'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          Staff Roster ({deptStaff.length})
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`flex-1 py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors ${
            activeTab === 'history'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <History className="w-3.5 h-3.5" />
          Submissions History ({deptSubmissions.length})
        </button>
      </div>

      {/* TAB 1: NOMINATE */}
      {activeTab === 'nominate' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
          {!isSubmissionWindowOpen ? (
            <div className="text-center py-10 space-y-3 max-w-md mx-auto">
              <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto border border-rose-200">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Submission Window is Currently Closed
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Staff nominations are only accepted during active evaluation periods designated by the Selection Committee Secretariat.
              </p>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-600 text-left">
                <strong>Schedule note:</strong> {schedule.note || 'Contact administrative secretariat for inquiry.'}
              </div>
            </div>
          ) : (
            <form onSubmit={handleNominationSubmit} className="space-y-6 max-w-3xl">
              <div>
                <h2 className="text-lg font-bold text-slate-900 font-display">
                  File Monthly Staff of the Month Nomination
                </h2>
                <p className="text-xs text-slate-600 mt-0.5">
                  Select a candidate from your roster and detail two verified criteria of excellence.
                </p>
              </div>

              {nominationSubmitted && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Nomination submitted successfully to the Selection Committee!</span>
                </div>
              )}

              {/* Candidate Picker */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Candidate Selection (From Department Roster) *
                </label>
                {deptStaff.length === 0 ? (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800">
                    No staff found in this department yet. Please add staff in the "Staff Roster" tab first.
                  </div>
                ) : (
                  <select
                    required
                    value={selectedStaffId}
                    onChange={(e) => setSelectedStaffId(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-medium text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-slate-900/10"
                  >
                    <option value="">-- Choose Staff Member --</option>
                    {deptStaff.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.rank} · {s.staffId})
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Preview Selected Candidate */}
              {selectedStaff && (
                <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <img
                    src={selectedStaff.photoUrl}
                    alt={selectedStaff.name}
                    className="w-12 h-12 rounded-full object-cover border border-slate-200"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{selectedStaff.name}</h4>
                    <p className="text-[11px] text-slate-600">{selectedStaff.rank} · {selectedStaff.staffId}</p>
                    <span className="text-[10px] text-amber-700 font-medium">Cadre: {selectedStaff.cadre}</span>
                  </div>
                </div>
              )}

              {/* Reason 1 */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Criterion 1: Clinical / Administrative Vigilance & Impact *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 100% on-time attendance during night shifts and proactive resolution of crisis admissions."
                  value={reason1}
                  onChange={(e) => setReason1(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs text-slate-900"
                />
              </div>

              {/* Reason 2 */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Criterion 2: Professional Ethics, Mentorship & Collaboration *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Conducted peer orientation on new documentation protocols with zero patient complaints."
                  value={reason2}
                  onChange={(e) => setReason2(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs text-slate-900"
                />
              </div>

              {/* Detailed Justification */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Detailed Recommendation & Case Summary (Optional but recommended)
                </label>
                <textarea
                  rows={4}
                  placeholder="Provide supporting context or specific anecdotes demonstrating why this staff member deserves institutional honors this month..."
                  value={detailedJustification}
                  onChange={(e) => setDetailedJustification(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs text-slate-900 leading-relaxed"
                />
              </div>

              <button
                type="submit"
                disabled={!selectedStaffId}
                className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2"
              >
                <Send className="w-3.5 h-3.5 text-amber-400" />
                Submit Formal Nomination
              </button>
            </form>
          )}
        </div>
      )}

      {/* TAB 2: STAFF ROSTER */}
      {activeTab === 'staff' && (
        <div className="space-y-6">
          {/* Add Staff Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <h2 className="text-base font-bold text-slate-900 font-display mb-1 flex items-center gap-2">
              <Plus className="w-4 h-4 text-amber-700" />
              Enroll Staff Member into Department Roster
            </h2>
            <p className="text-xs text-slate-600 mb-4">
              Add personnel so they can be selected for monthly nominations and committee appraisals.
            </p>

            {staffAddedSuccess && (
              <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Staff member added to roster successfully!</span>
              </div>
            )}

            <form onSubmit={handleAddStaff} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Amina Bello"
                  value={newStaffName}
                  onChange={(e) => setNewStaffName(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Rank / Designation *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Senior Medical Officer"
                  value={newStaffRank}
                  onChange={(e) => setNewStaffRank(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Cadre *</label>
                <select
                  value={newStaffCadre}
                  onChange={(e) => setNewStaffCadre(e.target.value as any)}
                  className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs"
                >
                  <option value="Clinical">Clinical</option>
                  <option value="Nursing">Nursing</option>
                  <option value="Administrative">Administrative</option>
                  <option value="Technical">Technical</option>
                  <option value="Allied Health">Allied Health</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-lg shadow-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5 text-amber-400" />
                  Add to Roster
                </button>
              </div>
            </form>
          </div>

          {/* Roster Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">
                Active Department Personnel ({deptStaff.length})
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                    <th className="py-3 px-4">Staff Member</th>
                    <th className="py-3 px-4">Staff ID</th>
                    <th className="py-3 px-4">Cadre</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {deptStaff.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-slate-500">
                        No staff recorded in this department yet.
                      </td>
                    </tr>
                  ) : (
                    deptStaff.map((member) => (
                      <tr key={member.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={member.photoUrl}
                              alt={member.name}
                              className="w-9 h-9 rounded-full object-cover border border-slate-200"
                              referrerPolicy="no-referrer"
                            />
                            <div>
                              <p className="font-bold text-slate-900">{member.name}</p>
                              <p className="text-[11px] text-slate-500">{member.rank}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 font-mono text-[11px] text-slate-700">
                          {member.staffId}
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-700">
                            {member.cadre}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => deleteStaff(member.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Remove from roster"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: HISTORY */}
      {activeTab === 'history' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200">
            <h3 className="text-sm font-bold text-slate-900">
              Department Nomination Submissions Log ({deptSubmissions.length})
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                  <th className="py-3 px-4">Nominee</th>
                  <th className="py-3 px-4">Submission Month</th>
                  <th className="py-3 px-4">Criteria Stated</th>
                  <th className="py-3 px-4">Appraisal Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {deptSubmissions.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-slate-500">
                      No nominations submitted by this department yet.
                    </td>
                  </tr>
                ) : (
                  deptSubmissions.map((sub) => (
                    <tr key={sub.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={sub.staffPhoto}
                            alt={sub.staffName}
                            className="w-9 h-9 rounded-full object-cover border border-slate-200"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <p className="font-bold text-slate-900">{sub.staffName}</p>
                            <p className="text-[11px] text-slate-500">{sub.staffRank}</p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 font-mono text-[11px] text-slate-700">
                        {sub.submissionMonth}/{sub.submissionYear}
                      </td>

                      <td className="py-3 px-4 max-w-xs">
                        <p className="text-[11px] text-slate-700 font-medium line-clamp-1">1: {sub.reason1}</p>
                        <p className="text-[11px] text-slate-500 line-clamp-1">2: {sub.reason2}</p>
                      </td>

                      <td className="py-3 px-4">
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
                          {sub.status === 'awarded' ? 'Awarded Winner' : sub.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { PortalProvider, usePortal } from './context/PortalContext';
import { Navbar } from './components/Navbar';
import { SubmissionWindowBanner } from './components/SubmissionWindowBanner';
import { CurrentWinnerSpotlight } from './components/CurrentWinnerSpotlight';
import { PastWinnersShowcase } from './components/PastWinnersShowcase';
import { CommitteeDirectory } from './components/CommitteeDirectory';
import { EventGallerySection } from './components/EventGallerySection';
import { EventVideosSection } from './components/EventVideosSection';
import { LectureRepositorySection } from './components/LectureRepositorySection';
import { DepartmentInfoSection } from './components/DepartmentInfoSection';
import { NominationProcessGuide } from './components/NominationProcessGuide';
import { CertificateModal } from './components/CertificateModal';
import { AuthModal } from './components/AuthModal';
import { AdminDashboard } from './components/AdminDashboard';
import { DepartmentDashboard } from './components/DepartmentDashboard';
import { Winner } from './types';
import { Shield, Award, Building, BookOpen, Lock, Sparkles, ChevronRight } from 'lucide-react';

const PortalMain: React.FC = () => {
  const {
    institution,
    currentUser,
    activeCertificateWinner,
    setActiveCertificateWinner,
  } = usePortal();

  const [currentTab, setCurrentTab] = useState<string>('home');
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const handleOpenCertificate = (winner: Winner) => {
    setActiveCertificateWinner(winner);
  };

  const handleNavigateToNomination = () => {
    if (!currentUser) {
      setAuthModalOpen(true);
    } else if (currentUser.role === 'admin') {
      setCurrentTab('admin');
    } else {
      setCurrentTab('department');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Institutional Top Navigation Bar */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onOpenAuth={() => setAuthModalOpen(true)}
      />

      {/* Institutional Identity Banner */}
      <div className="bg-white border-b border-slate-200 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center sm:items-start md:items-center gap-4 text-center sm:text-left">
          <img
            src={institution.badgeUrl}
            alt={institution.schoolName}
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-amber-500/40 shadow-sm shrink-0"
            referrerPolicy="no-referrer"
          />
          <div className="space-y-0.5">
            <h1 className="text-lg sm:text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight font-display">
              {institution.schoolName}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 font-medium">
              {institution.motto}
            </p>
          </div>
        </div>
      </div>

      {/* Live Submission Window Banner */}
      <SubmissionWindowBanner onNavigateToNomination={handleNavigateToNomination} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-12">
        {/* TAB: HOME */}
        {currentTab === 'home' && (
          <div className="space-y-12">
            {/* Featured Current Winner Spotlight */}
            <CurrentWinnerSpotlight onOpenCertificate={handleOpenCertificate} />

            {/* Step-by-step Process Guide */}
            <NominationProcessGuide onActionClick={handleNavigateToNomination} />

            {/* Past Winners Showcase */}
            <PastWinnersShowcase onOpenCertificate={handleOpenCertificate} />

            {/* Photo Gallery & Video Media */}
            <EventGallerySection />
            <EventVideosSection />

            {/* Lecture Notes Section */}
            <LectureRepositorySection />

            {/* Committee Members */}
            <CommitteeDirectory />

            {/* Vision, Mission, Objectives */}
            <DepartmentInfoSection />
          </div>
        )}

        {/* TAB: WINNERS */}
        {currentTab === 'winners' && (
          <div className="space-y-10">
            <CurrentWinnerSpotlight onOpenCertificate={handleOpenCertificate} />
            <PastWinnersShowcase onOpenCertificate={handleOpenCertificate} />
          </div>
        )}

        {/* TAB: COMMITTEE */}
        {currentTab === 'committee' && (
          <div className="space-y-10">
            <CommitteeDirectory />
            <NominationProcessGuide onActionClick={handleNavigateToNomination} />
          </div>
        )}

        {/* TAB: GALLERY */}
        {currentTab === 'gallery' && (
          <div className="space-y-10">
            <EventGallerySection />
            <EventVideosSection />
          </div>
        )}

        {/* TAB: LECTURES */}
        {currentTab === 'lectures' && (
          <div className="space-y-10">
            <LectureRepositorySection />
          </div>
        )}

        {/* TAB: ADMIN */}
        {currentTab === 'admin' && (
          <div>
            {currentUser?.role === 'admin' ? (
              <AdminDashboard onOpenCertificate={handleOpenCertificate} />
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center max-w-md mx-auto space-y-4">
                <div className="w-12 h-12 bg-amber-50 text-amber-800 rounded-full flex items-center justify-center mx-auto">
                  <Lock className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  Admin Authorization Required
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  You need administrative board credentials to view and manage candidate nominations and schedule parameters.
                </p>
                <button
                  onClick={() => setAuthModalOpen(true)}
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
                >
                  Sign In as Administrator
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB: DEPARTMENT */}
        {currentTab === 'department' && (
          <div>
            {currentUser?.role === 'department' ? (
              <DepartmentDashboard />
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center max-w-md mx-auto space-y-4">
                <div className="w-12 h-12 bg-amber-50 text-amber-800 rounded-full flex items-center justify-center mx-auto">
                  <Building className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  Department Login Required
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Please log in with your Head of Department (HOD) account to view your roster and submit monthly staff nominations.
                </p>
                <button
                  onClick={() => setAuthModalOpen(true)}
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
                >
                  Sign In as Department HOD
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Portal Footer */}
      <footer className="no-print bg-slate-950 text-slate-400 border-t border-slate-800 mt-16 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-3 md:col-span-2">
              <div className="flex items-center gap-2 text-white font-bold font-display text-base">
                <img
                  src={institution.badgeUrl}
                  alt="Seal"
                  className="w-7 h-7 rounded-full object-cover border border-amber-400"
                  referrerPolicy="no-referrer"
                />
                <span>{institution.schoolName}</span>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed max-w-md">
                Recognizing exceptional psychiatric clinicians, nursing officers, technical diagnosticians, and administrative personnel whose relentless dedication upholds health and healing.
              </p>
              <div className="text-[11px] text-slate-500 font-mono">
                Timezone: Africa/Lagos (GMT+1)
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
                Navigation
              </h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <button onClick={() => setCurrentTab('home')} className="hover:text-white transition-colors">
                    Portal Homepage
                  </button>
                </li>
                <li>
                  <button onClick={() => setCurrentTab('winners')} className="hover:text-white transition-colors">
                    Hall of Honorees
                  </button>
                </li>
                <li>
                  <button onClick={() => setCurrentTab('committee')} className="hover:text-white transition-colors">
                    Selection Committee
                  </button>
                </li>
                <li>
                  <button onClick={() => setCurrentTab('gallery')} className="hover:text-white transition-colors">
                    Ceremony Gallery
                  </button>
                </li>
                <li>
                  <button onClick={() => setCurrentTab('lectures')} className="hover:text-white transition-colors">
                    Clinical Lecture Notes
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
                Portal Access
              </h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <button
                    onClick={() => {
                      if (currentUser?.role === 'admin') setCurrentTab('admin');
                      else setAuthModalOpen(true);
                    }}
                    className="hover:text-amber-400 transition-colors flex items-center gap-1"
                  >
                    <span>Board Secretariat Login</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      if (currentUser?.role === 'department') setCurrentTab('department');
                      else setAuthModalOpen(true);
                    }}
                    className="hover:text-amber-400 transition-colors flex items-center gap-1"
                  >
                    <span>Department HOD Login</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setAuthModalOpen(true)}
                    className="hover:text-white transition-colors"
                  >
                    HOD Password Recovery
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
            <p>© {new Date().getFullYear()} {institution.schoolName}. All rights reserved.</p>
            <p>Staff Excellence Recognition & Continuous Professional Education System</p>
          </div>
        </div>
      </footer>

      {/* Verifiable Award Certificate Modal */}
      {activeCertificateWinner && (
        <CertificateModal
          winner={activeCertificateWinner}
          onClose={() => setActiveCertificateWinner(null)}
        />
      )}

      {/* Authentication & Role Switcher Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={(role) => {
          setCurrentTab(role);
        }}
      />
    </div>
  );
};

export default function App() {
  return (
    <PortalProvider>
      <PortalMain />
    </PortalProvider>
  );
}

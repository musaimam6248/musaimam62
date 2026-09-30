import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Department,
  StaffMember,
  NominationSubmission,
  Winner,
  CommitteeMember,
  GalleryImage,
  EventVideo,
  LectureResource,
  SubmissionSchedule,
  InstitutionalInfo,
  PortalNotification,
  User,
} from '../types';
import {
  INITIAL_INSTITUTION,
  INITIAL_SCHEDULE,
  INITIAL_DEPARTMENTS,
  INITIAL_STAFF,
  INITIAL_WINNERS,
  INITIAL_COMMITTEE,
  INITIAL_SUBMISSIONS,
  INITIAL_GALLERY,
  INITIAL_VIDEOS,
  INITIAL_LECTURES,
  INITIAL_NOTIFICATIONS,
  DEFAULT_USERS,
} from '../data/initialData';

interface PortalContextType {
  institution: InstitutionalInfo;
  updateInstitution: (updates: Partial<InstitutionalInfo>) => void;
  schedule: SubmissionSchedule;
  updateSchedule: (updates: Partial<SubmissionSchedule>) => void;
  isSubmissionWindowOpen: boolean;
  departments: Department[];
  addDepartment: (dept: Omit<Department, 'id' | 'staffCount'>) => void;
  staff: StaffMember[];
  addStaff: (staffMember: Omit<StaffMember, 'id'>) => void;
  deleteStaff: (id: string) => void;
  submissions: NominationSubmission[];
  addSubmission: (sub: Omit<NominationSubmission, 'id' | 'submittedAt' | 'status'>) => void;
  updateSubmissionStatus: (id: string, status: NominationSubmission['status'], reviewNotes?: string) => void;
  winners: Winner[];
  crownWinner: (winnerData: Omit<Winner, 'id' | 'awardedAt' | 'certificateId'>) => Winner;
  committee: CommitteeMember[];
  addCommitteeMember: (member: Omit<CommitteeMember, 'id'>) => void;
  deleteCommitteeMember: (id: string) => void;
  gallery: GalleryImage[];
  addGalleryImage: (image: Omit<GalleryImage, 'id' | 'uploadedAt'>) => void;
  deleteGalleryImage: (id: string) => void;
  videos: EventVideo[];
  addVideo: (video: Omit<EventVideo, 'id' | 'uploadedAt'>) => void;
  deleteVideo: (id: string) => void;
  lectures: LectureResource[];
  addLecture: (lec: Omit<LectureResource, 'id' | 'uploadedAt' | 'downloadCount'>) => void;
  deleteLecture: (id: string) => void;
  incrementLectureDownload: (id: string) => void;
  notifications: PortalNotification[];
  sendNotification: (notif: Omit<PortalNotification, 'id' | 'sentAt' | 'readBy'>) => void;
  markNotificationRead: (id: string) => void;
  currentUser: User | null;
  loginAs: (user: User) => void;
  logout: () => void;
  verifyAndResetHodPassword: (username: string, hodKey: string, newPassword?: string) => boolean;
  activeCertificateWinner: Winner | null;
  setActiveCertificateWinner: (winner: Winner | null) => void;
  resetAllData: () => void;
}

const STORAGE_KEYS = {
  INSTITUTION: 'fnstm_institution',
  SCHEDULE: 'fnstm_schedule',
  DEPARTMENTS: 'fnstm_departments',
  STAFF: 'fnstm_staff',
  SUBMISSIONS: 'fnstm_submissions',
  WINNERS: 'fnstm_winners',
  COMMITTEE: 'fnstm_committee',
  GALLERY: 'fnstm_gallery',
  VIDEOS: 'fnstm_videos',
  LECTURES: 'fnstm_lectures',
  NOTIFICATIONS: 'fnstm_notifications',
  USER: 'fnstm_user',
};

const PortalContext = createContext<PortalContextType | undefined>(undefined);

export const PortalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [institution, setInstitution] = useState<InstitutionalInfo>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.INSTITUTION);
    return saved ? JSON.parse(saved) : INITIAL_INSTITUTION;
  });

  const [schedule, setSchedule] = useState<SubmissionSchedule>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SCHEDULE);
    return saved ? JSON.parse(saved) : INITIAL_SCHEDULE;
  });

  const [departments, setDepartments] = useState<Department[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.DEPARTMENTS);
    return saved ? JSON.parse(saved) : INITIAL_DEPARTMENTS;
  });

  const [staff, setStaff] = useState<StaffMember[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.STAFF);
    return saved ? JSON.parse(saved) : INITIAL_STAFF;
  });

  const [submissions, setSubmissions] = useState<NominationSubmission[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SUBMISSIONS);
    return saved ? JSON.parse(saved) : INITIAL_SUBMISSIONS;
  });

  const [winners, setWinners] = useState<Winner[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.WINNERS);
    return saved ? JSON.parse(saved) : INITIAL_WINNERS;
  });

  const [committee, setCommittee] = useState<CommitteeMember[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.COMMITTEE);
    return saved ? JSON.parse(saved) : INITIAL_COMMITTEE;
  });

  const [gallery, setGallery] = useState<GalleryImage[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.GALLERY);
    return saved ? JSON.parse(saved) : INITIAL_GALLERY;
  });

  const [videos, setVideos] = useState<EventVideo[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.VIDEOS);
    return saved ? JSON.parse(saved) : INITIAL_VIDEOS;
  });

  const [lectures, setLectures] = useState<LectureResource[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.LECTURES);
    return saved ? JSON.parse(saved) : INITIAL_LECTURES;
  });

  const [notifications, setNotifications] = useState<PortalNotification[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USER);
    return saved ? JSON.parse(saved) : null;
  });

  const [activeCertificateWinner, setActiveCertificateWinner] = useState<Winner | null>(null);

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.INSTITUTION, JSON.stringify(institution));
  }, [institution]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SCHEDULE, JSON.stringify(schedule));
  }, [schedule]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DEPARTMENTS, JSON.stringify(departments));
  }, [departments]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.STAFF, JSON.stringify(staff));
  }, [staff]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(submissions));
  }, [submissions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.WINNERS, JSON.stringify(winners));
  }, [winners]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.COMMITTEE, JSON.stringify(committee));
  }, [committee]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.GALLERY, JSON.stringify(gallery));
  }, [gallery]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.VIDEOS, JSON.stringify(videos));
  }, [videos]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LECTURES, JSON.stringify(lectures));
  }, [lectures]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(STORAGE_KEYS.USER);
    }
  }, [currentUser]);

  // Check if current date is inside schedule window
  const isSubmissionWindowOpen = (() => {
    if (!schedule.isEnabled) return false;
    const nowTime = new Date().getTime();
    const openTime = new Date(schedule.opensAt).getTime();
    const closeTime = new Date(schedule.closesAt).getTime();
    return nowTime >= openTime && nowTime <= closeTime;
  })();

  const updateInstitution = (updates: Partial<InstitutionalInfo>) => {
    setInstitution((prev) => ({ ...prev, ...updates }));
  };

  const updateSchedule = (updates: Partial<SubmissionSchedule>) => {
    setSchedule((prev) => ({ ...prev, ...updates, updatedAt: new Date().toISOString() }));
  };

  const addDepartment = (dept: Omit<Department, 'id' | 'staffCount'>) => {
    const newDept: Department = {
      ...dept,
      id: `dept-${Date.now()}`,
      staffCount: 0,
    };
    setDepartments((prev) => [...prev, newDept]);
  };

  const addStaff = (newStaff: Omit<StaffMember, 'id'>) => {
    const created: StaffMember = {
      ...newStaff,
      id: `st-${Date.now()}`,
    };
    setStaff((prev) => [created, ...prev]);
    // increment department count
    setDepartments((prev) =>
      prev.map((d) => (d.id === newStaff.departmentId ? { ...d, staffCount: d.staffCount + 1 } : d))
    );
  };

  const deleteStaff = (id: string) => {
    const target = staff.find((s) => s.id === id);
    if (!target) return;
    setStaff((prev) => prev.filter((s) => s.id !== id));
    setDepartments((prev) =>
      prev.map((d) => (d.id === target.departmentId ? { ...d, staffCount: Math.max(0, d.staffCount - 1) } : d))
    );
  };

  const addSubmission = (sub: Omit<NominationSubmission, 'id' | 'submittedAt' | 'status'>) => {
    const created: NominationSubmission = {
      ...sub,
      id: `sub-${Date.now()}`,
      status: 'pending',
      submittedAt: new Date().toISOString(),
    };
    setSubmissions((prev) => [created, ...prev]);

    // Send a system notification
    sendNotification({
      title: `New Nomination: ${sub.staffName} (${sub.departmentName})`,
      message: `${sub.departmentName} has formally submitted ${sub.staffName} for the Month of ${sub.submissionMonth}/${sub.submissionYear}.`,
      sender: sub.departmentName,
      priority: 'normal',
    });
  };

  const updateSubmissionStatus = (id: string, status: NominationSubmission['status'], reviewNotes?: string) => {
    setSubmissions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status, reviewNotes, reviewedBy: currentUser?.name } : s))
    );
  };

  const crownWinner = (winnerData: Omit<Winner, 'id' | 'awardedAt' | 'certificateId'>): Winner => {
    const certificateId = `FNSTM-EXC-${winnerData.year}-${String(winnerData.month).padStart(2, '0')}-${Math.floor(
      100 + Math.random() * 900
    )}`;
    const newWinner: Winner = {
      ...winnerData,
      id: `win-${Date.now()}`,
      awardedAt: new Date().toISOString().split('T')[0],
      certificateId,
    };

    setWinners((prev) => [newWinner, ...prev]);

    // Also mark associated submission as awarded if exists
    setSubmissions((prev) =>
      prev.map((s) =>
        s.staffId === winnerData.staffId && s.submissionMonth === winnerData.month && s.submissionYear === winnerData.year
          ? { ...s, status: 'awarded' }
          : s
      )
    );

    // Broadcast congratulations notification
    sendNotification({
      title: `Winner Crowned: ${newWinner.staffName} (${newWinner.departmentName})`,
      message: `Hearty congratulations to ${newWinner.staffName} on being named Staff of the Month!`,
      sender: 'Board Secretariat',
      priority: 'urgent',
    });

    return newWinner;
  };

  const addCommitteeMember = (member: Omit<CommitteeMember, 'id'>) => {
    const created: CommitteeMember = {
      ...member,
      id: `com-${Date.now()}`,
    };
    setCommittee((prev) => [...prev, created]);
  };

  const deleteCommitteeMember = (id: string) => {
    setCommittee((prev) => prev.filter((m) => m.id !== id));
  };

  const addGalleryImage = (img: Omit<GalleryImage, 'id' | 'uploadedAt'>) => {
    const created: GalleryImage = {
      ...img,
      id: `gal-${Date.now()}`,
      uploadedAt: new Date().toISOString(),
    };
    setGallery((prev) => [created, ...prev]);
  };

  const deleteGalleryImage = (id: string) => {
    setGallery((prev) => prev.filter((g) => g.id !== id));
  };

  const addVideo = (vid: Omit<EventVideo, 'id' | 'uploadedAt'>) => {
    const created: EventVideo = {
      ...vid,
      id: `vid-${Date.now()}`,
      uploadedAt: new Date().toISOString(),
    };
    setVideos((prev) => [created, ...prev]);
  };

  const deleteVideo = (id: string) => {
    setVideos((prev) => prev.filter((v) => v.id !== id));
  };

  const addLecture = (lec: Omit<LectureResource, 'id' | 'uploadedAt' | 'downloadCount'>) => {
    const created: LectureResource = {
      ...lec,
      id: `lec-${Date.now()}`,
      uploadedAt: new Date().toISOString(),
      downloadCount: 0,
    };
    setLectures((prev) => [created, ...prev]);
  };

  const deleteLecture = (id: string) => {
    setLectures((prev) => prev.filter((l) => l.id !== id));
  };

  const incrementLectureDownload = (id: string) => {
    setLectures((prev) => prev.map((l) => (l.id === id ? { ...l, downloadCount: l.downloadCount + 1 } : l)));
  };

  const sendNotification = (notif: Omit<PortalNotification, 'id' | 'sentAt' | 'readBy'>) => {
    const created: PortalNotification = {
      ...notif,
      id: `notif-${Date.now()}`,
      sentAt: new Date().toISOString(),
      readBy: [],
    };
    setNotifications((prev) => [created, ...prev]);
  };

  const markNotificationRead = (id: string) => {
    if (!currentUser) return;
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, readBy: [...new Set([...n.readBy, currentUser.id])] } : n))
    );
  };

  const loginAs = (user: User) => {
    setCurrentUser(user);
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const verifyAndResetHodPassword = (username: string, hodKey: string): boolean => {
    const dept = departments.find(
      (d) =>
        d.username.toLowerCase() === username.trim().toLowerCase() &&
        d.hodKey.toLowerCase() === hodKey.trim().toLowerCase()
    );
    return !!dept;
  };

  const resetAllData = () => {
    setInstitution(INITIAL_INSTITUTION);
    setSchedule(INITIAL_SCHEDULE);
    setDepartments(INITIAL_DEPARTMENTS);
    setStaff(INITIAL_STAFF);
    setSubmissions(INITIAL_SUBMISSIONS);
    setWinners(INITIAL_WINNERS);
    setCommittee(INITIAL_COMMITTEE);
    setGallery(INITIAL_GALLERY);
    setVideos(INITIAL_VIDEOS);
    setLectures(INITIAL_LECTURES);
    setNotifications(INITIAL_NOTIFICATIONS);
    setCurrentUser(null);
    localStorage.clear();
  };

  return (
    <PortalContext.Provider
      value={{
        institution,
        updateInstitution,
        schedule,
        updateSchedule,
        isSubmissionWindowOpen,
        departments,
        addDepartment,
        staff,
        addStaff,
        deleteStaff,
        submissions,
        addSubmission,
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
        incrementLectureDownload,
        notifications,
        sendNotification,
        markNotificationRead,
        currentUser,
        loginAs,
        logout,
        verifyAndResetHodPassword,
        activeCertificateWinner,
        setActiveCertificateWinner,
        resetAllData,
      }}
    >
      {children}
    </PortalContext.Provider>
  );
};

export const usePortal = () => {
  const context = useContext(PortalContext);
  if (!context) {
    throw new Error('usePortal must be used within a PortalProvider');
  }
  return context;
};

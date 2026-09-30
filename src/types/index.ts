export type UserRole = 'public' | 'admin' | 'department';

export interface User {
  id: string;
  username: string;
  role: UserRole;
  name: string;
  departmentId?: string;
  departmentName?: string;
  email?: string;
}

export interface Department {
  id: string;
  name: string;
  code: string;
  hodName: string;
  hodKey: string; // Secret key used for password resets
  username: string;
  email?: string;
  staffCount: number;
}

export interface StaffMember {
  id: string;
  departmentId: string;
  name: string;
  rank: string;
  staffId: string;
  photoUrl: string;
  joinedYear: number;
  cadre: 'Clinical' | 'Nursing' | 'Administrative' | 'Technical' | 'Allied Health';
}

export interface NominationSubmission {
  id: string;
  departmentId: string;
  departmentName: string;
  staffId: string;
  staffName: string;
  staffRank: string;
  staffPhoto: string;
  submissionMonth: number; // 1-12
  submissionYear: number;
  reason1: string;
  reason2: string;
  detailedJustification: string;
  status: 'pending' | 'shortlisted' | 'awarded' | 'declined';
  submittedAt: string;
  reviewedBy?: string;
  reviewNotes?: string;
}

export interface Winner {
  id: string;
  staffId: string;
  staffName: string;
  staffRank: string;
  departmentName: string;
  month: number; // 1 - 12
  year: number;
  reasons: string;
  winnerPhoto: string;
  awardedAt: string;
  certificateId: string;
  committeeChairman: string;
}

export interface CommitteeMember {
  id: string;
  name: string;
  role: string;
  designation: string;
  photoUrl: string;
  email?: string;
}

export interface GalleryImage {
  id: string;
  title: string;
  imageUrl: string;
  uploadedAt: string;
  monthYear: string;
  category: 'Award Ceremony' | 'Department' | 'Training' | 'General';
}

export interface EventVideo {
  id: string;
  title: string;
  videoUrl: string;
  thumbnailUrl: string;
  duration: string;
  uploadedAt: string;
  description: string;
}

export interface LectureResource {
  id: string;
  title: string;
  fileName: string;
  fileSize: string;
  uploadedAt: string;
  speaker: string;
  department: string;
  category: 'Clinical Guidelines' | 'Psychiatry & Neurology' | 'Nursing Ethics' | 'Administration';
  downloadCount: number;
}

export interface SubmissionSchedule {
  id: number;
  opensAt: string; // ISO string
  closesAt: string; // ISO string
  isEnabled: boolean;
  timezone: string; // 'Africa/Lagos'
  note: string;
  updatedAt: string;
}

export interface InstitutionalInfo {
  schoolName: string;
  motto: string;
  badgeUrl: string;
  vision: string;
  mission: string;
  objectives: string[];
  bannerNotice: string;
  primaryColorHex: string;
}

export interface PortalNotification {
  id: string;
  title: string;
  message: string;
  sentAt: string;
  sender: string;
  targetDepartmentId?: string; // empty means all departments
  priority: 'normal' | 'urgent';
  readBy: string[]; // user IDs who marked read
}

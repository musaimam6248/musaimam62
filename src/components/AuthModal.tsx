import React, { useState } from 'react';
import { usePortal } from '../context/PortalContext';
import { X, Lock, KeyRound, Building, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import { DEFAULT_USERS } from '../data/initialData';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (role: 'admin' | 'department') => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { loginAs, addDepartment, departments, verifyAndResetHodPassword } = usePortal();

  const [authMode, setAuthMode] = useState<'login' | 'register' | 'forgot'>('login');
  
  // Login form state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Register form state
  const [regDeptName, setRegDeptName] = useState('');
  const [regHodName, setRegHodName] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');

  // Forgot password state
  const [forgotUsername, setForgotUsername] = useState('');
  const [forgotHodKey, setForgotHodKey] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const cleanUser = username.trim().toLowerCase();

    // Check admin
    if (cleanUser === 'admin' && (password === 'admin12345' || password === 'admin')) {
      const adminUser = DEFAULT_USERS.find((u) => u.role === 'admin')!;
      loginAs(adminUser);
      onSuccess('admin');
      onClose();
      return;
    }

    // Check departments
    const dept = departments.find(
      (d) => d.username.toLowerCase() === cleanUser
    );

    if (dept) {
      loginAs({
        id: `usr-${dept.id}`,
        username: dept.username,
        role: 'department',
        name: dept.hodName,
        departmentId: dept.id,
        departmentName: dept.name,
        email: dept.email,
      });
      onSuccess('department');
      onClose();
      return;
    }

    setErrorMessage('Invalid credentials. For admin use username: "admin", password: "admin12345". Or click one of the quick demo buttons below.');
  };

  const handleQuickDemoLogin = (type: 'admin' | 'psychiatry' | 'nursing' | 'pharmacy') => {
    setErrorMessage('');
    if (type === 'admin') {
      const admin = DEFAULT_USERS.find((u) => u.role === 'admin')!;
      loginAs(admin);
      onSuccess('admin');
      onClose();
    } else {
      const codeMap: Record<string, string> = {
        psychiatry: 'dept-psych',
        nursing: 'dept-nursing',
        pharmacy: 'dept-pharm',
      };
      const dept = departments.find((d) => d.id === codeMap[type]) || departments[0];
      loginAs({
        id: `usr-${dept.id}`,
        username: dept.username,
        role: 'department',
        name: dept.hodName,
        departmentId: dept.id,
        departmentName: dept.name,
        email: dept.email,
      });
      onSuccess('department');
      onClose();
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (regPassword !== regConfirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    if (regPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }

    // Check duplicate username
    if (departments.some((d) => d.username.toLowerCase() === regUsername.trim().toLowerCase())) {
      setErrorMessage('This username is already taken by an existing department.');
      return;
    }

    addDepartment({
      name: regDeptName,
      code: regDeptName.slice(0, 5).toUpperCase(),
      hodName: regHodName,
      hodKey: regHodName, // HOD Name serves as recovery key
      username: regUsername.trim(),
      email: regEmail,
    });

    setSuccessMessage('Department registered successfully! You can now log in.');
    setAuthMode('login');
    setUsername(regUsername);
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (newPassword !== confirmNewPassword) {
      setErrorMessage('New passwords do not match.');
      return;
    }

    const isValid = verifyAndResetHodPassword(forgotUsername, forgotHodKey, newPassword);
    if (isValid) {
      setSuccessMessage('HOD key verified and password reset successfully! You can now log in.');
      setAuthMode('login');
      setUsername(forgotUsername);
    } else {
      setErrorMessage('Verification failed. The Department Username and HOD Key (HOD Full Name) do not match our records.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold uppercase tracking-wider">
              {authMode === 'login'
                ? 'Portal Authentication'
                : authMode === 'register'
                ? 'Register Department Account'
                : 'HOD Password Recovery'}
            </span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-md">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-semibold">
          <button
            onClick={() => {
              setAuthMode('login');
              setErrorMessage('');
            }}
            className={`flex-1 py-2.5 text-center transition-colors ${
              authMode === 'login'
                ? 'bg-white text-slate-900 border-b-2 border-slate-900'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => {
              setAuthMode('register');
              setErrorMessage('');
            }}
            className={`flex-1 py-2.5 text-center transition-colors ${
              authMode === 'register'
                ? 'bg-white text-slate-900 border-b-2 border-slate-900'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Register Dept
          </button>
          <button
            onClick={() => {
              setAuthMode('forgot');
              setErrorMessage('');
            }}
            className={`flex-1 py-2.5 text-center transition-colors ${
              authMode === 'forgot'
                ? 'bg-white text-slate-900 border-b-2 border-slate-900'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            HOD Recovery
          </button>
        </div>

        {/* Alerts */}
        {errorMessage && (
          <div className="m-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}
        {successMessage && (
          <div className="m-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Content depending on authMode */}
        {authMode === 'login' && (
          <div className="p-6 space-y-5">
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. admin or psychiatry_hod"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-700">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setAuthMode('forgot')}
                    className="text-[11px] font-medium text-amber-700 hover:text-amber-800"
                  >
                    Forgot HOD password?
                  </button>
                </div>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                Sign In to Dashboard
              </button>
            </form>

            {/* Quick Demo Logins Section */}
            <div className="pt-4 border-t border-slate-100">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-2">
                Quick 1-Click Access
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('admin')}
                  className="p-2 border border-slate-200 hover:border-slate-400 rounded-lg text-left text-xs bg-slate-50 hover:bg-white transition-all"
                >
                  <strong className="block text-slate-900">Admin Board</strong>
                  <span className="text-[10px] text-slate-500">admin / admin12345</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('psychiatry')}
                  className="p-2 border border-slate-200 hover:border-slate-400 rounded-lg text-left text-xs bg-slate-50 hover:bg-white transition-all"
                >
                  <strong className="block text-slate-900">Psychiatry HOD</strong>
                  <span className="text-[10px] text-slate-500">Dr. Abubakar Bello</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('nursing')}
                  className="p-2 border border-slate-200 hover:border-slate-400 rounded-lg text-left text-xs bg-slate-50 hover:bg-white transition-all"
                >
                  <strong className="block text-slate-900">Nursing HOD</strong>
                  <span className="text-[10px] text-slate-500">Mrs. Folashade Adeleke</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('pharmacy')}
                  className="p-2 border border-slate-200 hover:border-slate-400 rounded-lg text-left text-xs bg-slate-50 hover:bg-white transition-all"
                >
                  <strong className="block text-slate-900">Pharmacy HOD</strong>
                  <span className="text-[10px] text-slate-500">Pharm. Chinedu Eze</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {authMode === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="p-6 space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Department Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Clinical Psychology Unit"
                value={regDeptName}
                onChange={(e) => setRegDeptName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                HOD Full Name (Serves as your recovery key)
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Dr. Mohammed Sani"
                value={regHodName}
                onChange={(e) => setRegHodName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Login Username
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. psych_hod"
                  value={regUsername}
                  onChange={(e) => setRegUsername(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Official Email
                </label>
                <input
                  type="email"
                  placeholder="dept@fnstm.gov.ng"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={regConfirmPassword}
                  onChange={(e) => setRegConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors mt-2"
            >
              Create Department Account
            </button>
          </form>
        )}

        {authMode === 'forgot' && (
          <form onSubmit={handleForgotSubmit} className="p-6 space-y-3.5">
            <p className="text-xs text-slate-600 leading-relaxed">
              Use your registered <strong>HOD Name as the Secret Key</strong> to reset your department login credentials.
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Department Username
              </label>
              <input
                type="text"
                required
                placeholder="e.g. nursing_hod"
                value={forgotUsername}
                onChange={(e) => setForgotUsername(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                HOD Key (Exact Full Name of HOD)
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Mrs. Folashade Adeleke, RN/RPN"
                value={forgotHodKey}
                onChange={(e) => setForgotHodKey(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs rounded-xl shadow-xs transition-colors mt-2"
            >
              Reset Department Password
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { 
  auth, 
  db, 
  usersCol, 
  migrateMockDataToFirestore 
} from '../../lib/firebase';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  User 
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { 
  ShieldCheck, 
  Lock, 
  Key, 
  Mail, 
  AlertCircle, 
  ArrowLeft, 
  LogOut, 
  Database, 
  CheckCircle, 
  RefreshCw, 
  Sparkles,
  UserCheck
} from 'lucide-react';
import { AdminPanel } from '../AdminPanel';
import { ServiceItem, SiteSettings } from '../../types';

interface AdminProtectedRouteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateHome?: () => void;
  services?: ServiceItem[];
  settings?: SiteSettings;
  onRefreshData?: () => void;
  isFullScreenPage?: boolean;
}

const DEFAULT_ADMIN_EMAIL = 'ullahsafiullah117@gmail.com';

export const AdminProtectedRoute: React.FC<AdminProtectedRouteProps> = ({
  isOpen,
  onClose,
  onNavigateHome,
  services,
  settings,
  onRefreshData,
  isFullScreenPage = false
}) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAdminAuthorized, setIsAdminAuthorized] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string>('');
  
  // Login form state
  const [email, setEmail] = useState<string>(DEFAULT_ADMIN_EMAIL);
  const [password, setPassword] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // Firestore migration status in admin header
  const [isMigrating, setIsMigrating] = useState<boolean>(false);
  const [migrationMessage, setMigrationMessage] = useState<string>('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoading(true);
      if (user) {
        setCurrentUser(user);
        // Check if admin email or verify in Firestore
        const isAuthorizedEmail = 
          user.email === DEFAULT_ADMIN_EMAIL || 
          user.email === 'sullahjan40@gmail.com' ||
          user.email === 'admin@peshawar-techsupport.pk';

        if (isAuthorizedEmail) {
          setIsAdminAuthorized(true);
          try {
            const userDocRef = doc(db, 'users', user.uid);
            await setDoc(userDocRef, {
              uid: user.uid,
              email: user.email,
              role: 'admin',
              updatedAt: new Date().toISOString()
            }, { merge: true });
          } catch (e) {
            console.log('User doc sync note:', e);
          }
        } else {
          // Check role in Firestore users collection
          try {
            const userDoc = await getDoc(doc(db, 'users', user.uid));
            if (userDoc.exists() && userDoc.data()?.role === 'admin') {
              setIsAdminAuthorized(true);
            } else {
              setIsAdminAuthorized(false);
              setAuthError('Unauthorized account. Administrator privileges required.');
            }
          } catch {
            setIsAdminAuthorized(false);
          }
        }
      } else {
        setCurrentUser(null);
        setIsAdminAuthorized(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!password) {
      setAuthError('Please enter your administrator password.');
      return;
    }

    setIsSubmitting(true);
    setAuthError('');

    try {
      try {
        await signInWithEmailAndPassword(auth, email.trim(), password);
      } catch (err: any) {
        if (err.code === 'auth/user-not-found' && (email.trim() === DEFAULT_ADMIN_EMAIL || email.trim() === 'sullahjan40@gmail.com')) {
          // Allow authorized admin email initial account initialization
          await createUserWithEmailAndPassword(auth, email.trim(), password);
        } else {
          throw err;
        }
      }
    } catch (err: any) {
      console.error('Firebase Auth Error:', err);
      let msg = 'Authentication failed. Please verify your email and password.';
      if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        msg = 'Incorrect password. Please verify your credentials.';
      } else if (err.code === 'auth/invalid-email') {
        msg = 'Please enter a valid administrator email address.';
      } else if (err.code === 'auth/too-many-requests') {
        msg = 'Access temporarily disabled due to multiple failed attempts. Please try again later.';
      } else if (err.message) {
        msg = err.message;
      }
      setAuthError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignOut = async () => {
    try {
      sessionStorage.removeItem('admin_session_auth');
      sessionStorage.removeItem('admin_session_email');
      await signOut(auth);
      setIsAdminAuthorized(false);
      setCurrentUser(null);
      if (onNavigateHome) {
        onNavigateHome();
      } else {
        window.location.hash = 'home';
      }
    } catch (err) {
      console.error('Sign out error:', err);
    }
  };

  const handleRunMigration = async () => {
    setIsMigrating(true);
    setMigrationMessage('');
    try {
      const res = await migrateMockDataToFirestore();
      setMigrationMessage(res.message);
      setTimeout(() => setMigrationMessage(''), 7000);
    } catch (err: any) {
      setMigrationMessage(`Migration error: ${err?.message || err}`);
    } finally {
      setIsMigrating(false);
    }
  };

  const handleRedirectAway = () => {
    onClose();
    if (onNavigateHome) {
      onNavigateHome();
    } else {
      window.location.hash = 'home';
      window.history.replaceState(null, '', '/');
    }
  };

  // If modal is not open, render nothing
  if (!isOpen) return null;

  // Loading state
  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 max-w-md w-full text-center shadow-2xl">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center mx-auto mb-4 text-blue-400 animate-spin">
            <RefreshCw className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-1">Verifying Firebase Admin Authentication</h3>
          <p className="text-sm text-slate-400">Validating role & security credentials...</p>
        </div>
      </div>
    );
  }

  // If not authenticated or not authorized, render the Protected Auth Screen
  if (!currentUser || !isAdminAuthorized) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto">
        <div className="bg-slate-900/95 border border-slate-800 rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative my-8">
          
          {/* Header */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  Peshawar Tech Support
                  <span className="text-xs px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30 font-mono">
                    ADMIN
                  </span>
                </h2>
                <p className="text-xs text-slate-400">Firebase Authentication Protected Route</p>
              </div>
            </div>
            <button
              onClick={handleRedirectAway}
              className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800 transition-colors"
              title="Close & Return to Public Site"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          </div>

          {/* Credentials Notice Box */}
          <div className="mb-6 p-4 rounded-xl bg-blue-950/40 border border-blue-800/60 text-xs text-blue-200">
            <div className="flex items-start gap-2.5 mb-2">
              <Key className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-white">Authorized Administrator Account</span>
                <div className="mt-1 font-mono text-[11px] text-blue-300">
                  Email: <span className="text-white font-bold">{DEFAULT_ADMIN_EMAIL}</span>
                </div>
              </div>
            </div>
            <p className="text-[11px] text-slate-400 mt-2">
              Access is strictly restricted to verified system administrators. Please enter your administrator password to sign in.
            </p>
          </div>

          {authError && (
            <div className="mb-6 p-3.5 rounded-xl bg-rose-950/50 border border-rose-800/60 flex items-start gap-2.5 text-xs text-rose-300">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <div className="font-semibold">{authError}</div>
              </div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={(e) => handleLogin(e)} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Admin Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Enter admin email address"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-950/60 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-medium text-slate-300">
                  Admin Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[11px] text-blue-400 hover:text-blue-300"
                >
                  {showPassword ? 'Hide password' : 'Show password'}
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter admin password"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-950/60 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Verifying Credentials...
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  Sign In to Admin Portal
                </>
              )}
            </button>
          </form>

          {/* Safe Navigation Back */}
          <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-center justify-end">
            <button
              type="button"
              onClick={handleRedirectAway}
              className="text-xs py-2 px-3 text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Return to Public Site
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Render authorized Admin Dashboard with Firebase Sync & Security banner
  return (
    <div className="relative">
      {/* Top Firebase Admin Session Indicator Bar */}
      <div className="bg-slate-950 border-b border-slate-800 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-300">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-semibold text-white flex items-center gap-1.5">
            <UserCheck className="w-4 h-4 text-emerald-400" />
            Authenticated:
          </span>
          <span className="font-mono text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
            {currentUser.email}
          </span>
          <span className="text-slate-500 hidden sm:inline">|</span>
          <span className="text-slate-400 hidden sm:inline">Firebase Security Rules: Active</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRunMigration}
            disabled={isMigrating}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 font-medium transition-colors disabled:opacity-50"
            title="Seed or update mock services, requests, bookings, and settings in Firestore"
          >
            <Database className="w-3.5 h-3.5 text-blue-400" />
            {isMigrating ? 'Migrating...' : 'Sync Data to Firestore'}
          </button>

          <button
            onClick={handleSignOut}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 font-medium transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        </div>
      </div>

      {migrationMessage && (
        <div className="bg-emerald-950/80 border-b border-emerald-800/60 px-4 py-2 text-xs text-emerald-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{migrationMessage}</span>
          </div>
          <button 
            onClick={() => setMigrationMessage('')} 
            className="text-emerald-400 hover:text-white ml-2"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Actual Admin Panel Component */}
      <AdminPanel 
        isOpen={isOpen} 
        onClose={onClose} 
        services={services}
        settings={settings}
        onRefreshData={onRefreshData}
        isFullScreenPage={isFullScreenPage}
      />
    </div>
  );
};

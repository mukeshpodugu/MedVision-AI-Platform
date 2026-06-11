import React, { useState } from 'react';
import { Mail, Lock, User, ShieldCheck, Activity, AlertCircle, ArrowLeft } from 'lucide-react';
import { authService } from '../api';

export default function AuthPages({ mode = 'login', setView, onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('doctor'); // doctor, admin, patient
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'login') {
        const user = await authService.login(email, password);
        if (user) {
          onLoginSuccess(user);
        } else {
          setError('Authentication failed. Please check credentials.');
        }
      } else {
        await authService.register(fullName, email, password, role);
        // Automatically login after register
        const user = await authService.login(email, password);
        if (user) {
          onLoginSuccess(user);
        }
      }
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.detail || 
        'Connection error. Make sure the FastAPI backend is running.'
      );
    } finally {
      setLoading(false);
    }
  };

  const loadDemoUser = (userType) => {
    if (userType === 'doctor') {
      setEmail('mukesh@medvision.ai');
      setPassword('MukeshPassword123');
    } else {
      setEmail('admin@medvision.ai');
      setPassword('AdminPassword123');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-dark-950 p-6 transition-colors duration-200">
      <div className="w-full max-w-md">
        
        {/* Back Button */}
        <button 
          onClick={() => setView('landing')}
          className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-4.5 h-4.5" /> Back to Landing Page
        </button>

        {/* Card Frame */}
        <div className="bg-white dark:bg-dark-900 rounded-3xl border border-slate-200/60 dark:border-slate-800/40 p-8 shadow-xl shadow-slate-100/50 dark:shadow-none">
          
          {/* Logo Area */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-secondary-600 to-secondary-500 text-white shadow-md shadow-secondary-500/20 mb-3">
              <Activity className="w-6 h-6 animate-pulse" />
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
              {mode === 'login' ? 'Welcome back to MedVision' : 'Create Clinician Profile'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {mode === 'login' ? 'Secure Clinical Authenticator' : 'Fill details below to construct clinical account'}
            </p>
          </div>

          {error && (
            <div className="flex gap-2.5 items-start p-4 mb-5 rounded-2xl bg-red-50 dark:bg-red-950/20 border border-red-200/50 dark:border-red-800/30 text-red-600 dark:text-red-400 text-xs">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <div>
                <span className="font-bold">Access Denied:</span> {error}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <>
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-3 w-4.5 h-4.5 text-slate-400" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Dr. Mukesh Podugu"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:border-secondary-500 focus:ring-1 focus:ring-secondary-500 outline-none transition-all dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                    Role Category
                  </label>
                  <div className="relative">
                    <ShieldCheck className="absolute left-3.5 top-3 w-4.5 h-4.5 text-slate-400" />
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-dark-900 text-sm focus:border-secondary-500 outline-none transition-all dark:text-white"
                    >
                      <option value="doctor">Medical Doctor / Clinician</option>
                      <option value="admin">System Administrator</option>
                      <option value="patient">Patient Profile</option>
                    </select>
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                Clinical Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 w-4.5 h-4.5 text-slate-400" />
                <input
                  type="email"
                  required
                  placeholder="name@medvision.ai"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:border-secondary-500 focus:ring-1 focus:ring-secondary-500 outline-none transition-all dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                Secure Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 w-4.5 h-4.5 text-slate-400" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:border-secondary-500 focus:ring-1 focus:ring-secondary-500 outline-none transition-all dark:text-white"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 mt-2 text-sm font-semibold text-white bg-secondary-600 hover:bg-secondary-500 active:bg-secondary-700 disabled:opacity-50 rounded-xl shadow-lg shadow-secondary-500/15 hover:scale-[1.01] active:scale-[0.99] transition-all"
            >
              {loading ? 'Authenticating Gateway...' : mode === 'login' ? 'Authorize Session' : 'Register Clinical Account'}
            </button>
          </form>

          {/* Quick Demo Login Seeds */}
          {mode === 'login' && (
            <div className="mt-6 pt-5 border-t border-slate-200/60 dark:border-slate-800/40">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-2">
                Quick Demo Credentials (Pre-seeded)
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => loadDemoUser('doctor')}
                  className="flex-1 py-1.5 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-dark-800 text-[11px] font-semibold text-slate-700 dark:text-slate-300 rounded-lg transition-colors"
                >
                  Doctor Profile
                </button>
                <button
                  onClick={() => loadDemoUser('admin')}
                  className="flex-1 py-1.5 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-dark-800 text-[11px] font-semibold text-slate-700 dark:text-slate-300 rounded-lg transition-colors"
                >
                  System Admin
                </button>
              </div>
            </div>
          )}

          <div className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
            {mode === 'login' ? (
              <>
                New clinician?{' '}
                <button 
                  onClick={() => setView('register')}
                  className="text-secondary-500 font-bold hover:underline"
                >
                  Register Account
                </button>
              </>
            ) : (
              <>
                Existing clinician?{' '}
                <button 
                  onClick={() => setView('login')}
                  className="text-secondary-500 font-bold hover:underline"
                >
                  Sign In
                </button>
              </>
            )}
          </div>
        </div>

        {/* Footer info in Card */}
        <p className="mt-6 text-center text-[10px] text-slate-400 dark:text-slate-500">
          MedVision AI Security Shield &middot; Developed by PODUGU MUKESH
        </p>
      </div>
    </div>
  );
}

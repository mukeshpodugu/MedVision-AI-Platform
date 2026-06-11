import React, { useState, useEffect } from 'react';
import { authService } from './api';
import Sidebar from './components/Sidebar';
import LandingPage from './components/LandingPage';
import AuthPages from './components/AuthPages';
import Dashboard from './components/Dashboard';
import DiseaseDetection from './components/DiseaseDetection';
import Reports from './components/Reports';
import Profile from './components/Profile';
import AdminDashboard from './components/AdminDashboard';
import { AboutUs, ContactSupport } from './components/SupportPages';
import { Activity, Menu, X } from 'lucide-react';

export default function App() {
  const [currentView, setView] = useState('landing');
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Authenticate session on load
  useEffect(() => {
    const authStatus = authService.isAuthenticated();
    setIsAuthenticated(authStatus);
    if (authStatus) {
      const activeUser = authService.getUser();
      setUser(activeUser);
      // Default logged in view
      setView('dashboard');
    }
  }, []);

  // Sync theme mode on toggle
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
  }, [darkMode]);

  const handleLoginSuccess = (loggedInUser) => {
    setUser(loggedInUser);
    setIsAuthenticated(true);
    setView('dashboard');
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
    setView('landing');
  };

  // Determine if we need to render the Sidebar layout wrapper
  const isWorkspaceView = ['dashboard', 'detection', 'reports', 'profile', 'admin'].includes(currentView);
  const showSidebar = isWorkspaceView && isAuthenticated;

  // View Router Dispatcher
  const renderViewContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard setView={setView} />;
      case 'detection':
        return <DiseaseDetection />;
      case 'reports':
        return <Reports />;
      case 'profile':
        return <Profile user={user} />;
      case 'admin':
        return <AdminDashboard />;
      case 'about':
        return <AboutUs />;
      case 'support':
        return <ContactSupport />;
      default:
        return <Dashboard setView={setView} />;
    }
  };

  if (currentView === 'landing') {
    return <LandingPage setView={setView} isAuthenticated={isAuthenticated} />;
  }

  if (currentView === 'login' || currentView === 'register') {
    return (
      <AuthPages 
        mode={currentView} 
        setView={setView} 
        onLoginSuccess={handleLoginSuccess} 
      />
    );
  }

  // General Layout (Workspace with Sidebar or Simple Informative Layout)
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-dark-950 dark:text-slate-100 transition-colors duration-200">
      
      {showSidebar ? (
        /* PERSISTENT WORKSPACE LAYOUT */
        <div className="flex">
          {/* Sidebar */}
          <Sidebar 
            currentView={currentView} 
            setView={setView} 
            user={user} 
            onLogout={handleLogout}
            darkMode={darkMode}
            setDarkMode={setDarkMode}
          />
          
          {/* Main Workspace Frame */}
          <main className="flex-1 min-h-screen pl-64 transition-all duration-200">
            <div className="max-w-7xl mx-auto px-6 py-8">
              {renderViewContent()}
            </div>
          </main>
        </div>
      ) : (
        /* SIMPLE INFORMATIVE LAYOUT (For About / Support when logged out) */
        <div className="flex flex-col min-h-screen">
          {/* Top navigation for simple pages */}
          <header className="bg-white/80 dark:bg-dark-900/80 backdrop-blur border-b border-slate-200/50 dark:border-slate-800/50 h-16 flex items-center justify-between px-6 sticky top-0 z-30">
            <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setView(isAuthenticated ? 'dashboard' : 'landing')}>
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-tr from-secondary-600 to-secondary-500 text-white">
                <Activity className="w-5 h-5" />
              </div>
              <span className="text-md font-bold tracking-tight text-slate-900 dark:text-white">
                MedVision <span className="text-secondary-500">AI</span>
              </span>
            </div>

            <div className="flex items-center gap-4 text-xs font-semibold">
              <button 
                onClick={() => setView(isAuthenticated ? 'dashboard' : 'landing')}
                className="text-slate-600 dark:text-slate-400 hover:text-secondary-500"
              >
                Back to {isAuthenticated ? 'Workspace' : 'Home'}
              </button>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 border border-slate-200 dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-dark-800 rounded-xl"
              >
                {darkMode ? '☀️' : '🌙'}
              </button>
            </div>
          </header>

          <main className="flex-1 max-w-5xl w-full mx-auto px-6 py-10">
            {renderViewContent()}
          </main>

          <footer className="border-t border-slate-200/50 dark:border-slate-800/50 bg-white dark:bg-dark-900/40 py-8 text-center text-xs text-slate-500">
            Designed & Developed by <b>PODUGU MUKESH</b> &middot; MedVision AI &copy; 2026
          </footer>
        </div>
      )}
    </div>
  );
}

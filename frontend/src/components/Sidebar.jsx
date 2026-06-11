import React from 'react';
import { 
  Activity, 
  ScanLine, 
  FileText, 
  User, 
  ShieldAlert, 
  Info, 
  LifeBuoy, 
  LogOut, 
  Sun, 
  Moon,
  ChevronRight
} from 'lucide-react';

export default function Sidebar({ currentView, setView, user, onLogout, darkMode, setDarkMode }) {
  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: Activity, roles: ['doctor', 'admin'] },
    { id: 'detection', name: 'Disease Detection', icon: ScanLine, roles: ['doctor', 'admin'] },
    { id: 'reports', name: 'Medical Reports', icon: FileText, roles: ['doctor', 'admin'] },
    { id: 'profile', name: 'My Profile', icon: User, roles: ['doctor', 'admin', 'patient'] },
    { id: 'admin', name: 'Admin Control', icon: ShieldAlert, roles: ['admin'] },
  ];

  const infoItems = [
    { id: 'about', name: 'About Us', icon: Info },
    { id: 'support', name: 'Contact Support', icon: LifeBuoy },
  ];

  return (
    <aside className="fixed inset-y-0 left-0 z-20 flex flex-col w-64 bg-white border-r border-slate-200 dark:bg-dark-900 dark:border-slate-800 transition-colors duration-200">
      {/* Brand Header */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-secondary-600 to-secondary-500 text-white shadow-md shadow-secondary-500/20">
          <Activity className="w-6 h-6 animate-pulse" />
        </div>
        <div>
          <h1 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
            MedVision <span className="text-secondary-500">AI</span>
          </h1>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">
            Clinical Companion
          </p>
        </div>
      </div>

      {/* User Card */}
      {user && (
        <div className="px-6 py-4 mx-3 my-4 rounded-xl bg-slate-50 dark:bg-dark-800/50 border border-slate-100 dark:border-slate-800/30">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-full bg-secondary-100 dark:bg-secondary-900/50 text-secondary-600 dark:text-secondary-400 font-bold">
              {user.full_name.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                {user.full_name}
              </h4>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">
                {user.role}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Navigation */}
      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
        <p className="px-2 mb-2 text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
          Workspace
        </p>
        {menuItems
          .filter(item => !item.roles || (user && item.roles.includes(user.role)))
          .map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setView(item.id)}
                className={`flex items-center justify-between w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-secondary-500 text-white shadow-lg shadow-secondary-500/20'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-dark-800 dark:hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400 dark:text-slate-500'}`} />
                  <span>{item.name}</span>
                </div>
                {isActive && <ChevronRight className="w-4 h-4 text-white" />}
              </button>
            );
          })}

        <div className="pt-6 my-4 border-t border-slate-200 dark:border-slate-800">
          <p className="px-2 mb-2 text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            Resources
          </p>
          {infoItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setView(item.id)}
                className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-secondary-500 text-white shadow-lg shadow-secondary-500/20'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-dark-800 dark:hover:text-white'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400 dark:text-slate-500'}`} />
                <span>{item.name}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Footer controls (Theme toggle & Logout) */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-dark-950/20">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="flex items-center justify-between w-full px-3 py-2 mb-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-dark-800 transition-colors"
        >
          <div className="flex items-center gap-2">
            {darkMode ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-secondary-600" />}
            <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
          </div>
          <span className="text-[10px] bg-slate-200 dark:bg-dark-800 px-2 py-0.5 rounded-md text-slate-500 dark:text-slate-400">
            Theme
          </span>
        </button>

        <button
          onClick={onLogout}
          className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-xs font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout Session</span>
        </button>
      </div>
    </aside>
  );
}

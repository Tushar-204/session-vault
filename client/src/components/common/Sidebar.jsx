import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Star, Folder, Share2, BarChart3, Trash2, Settings, Search, Download, Bookmark } from 'lucide-react';

export const Sidebar = () => {
  const navItems = [
    { label: 'Dashboard', path: '/', icon: LayoutDashboard },
    { label: 'Favorites', path: '/favorites', icon: Star },
    { label: 'Folders', path: '/folders', icon: Folder },
    { label: 'Search', path: '/search', icon: Search },
    { label: 'Shared Links', path: '/shared', icon: Share2 },
    { label: 'Import / Export', path: '/import-export', icon: Download },
    { label: 'Analytics', path: '/analytics', icon: BarChart3 },
    { label: 'Trash', path: '/trash', icon: Trash2 },
    { label: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 h-[calc(100vh-4rem)] glass-panel border-r border-slate-800 p-4 hidden md:flex flex-col justify-between">
      <div className="space-y-6">
        <div>
          <p className="px-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
            Navigation
          </p>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/'}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30 shadow-sm'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
                    }`
                  }
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Chrome Extension Status Card */}
      <div className="p-3.5 rounded-2xl bg-gradient-to-br from-blue-900/30 via-slate-900 to-indigo-900/20 border border-blue-500/20">
        <div className="flex items-center gap-2 mb-1.5">
          <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-semibold text-slate-200">Extension Active</span>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          Capture and sync open browser windows directly into SessionVault.
        </p>
      </div>
    </aside>
  );
};

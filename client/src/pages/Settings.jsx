import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { Settings as SettingsIcon, User, Shield, Bell, Loader2 } from 'lucide-react';

export const Settings = () => {
  const { user, setUser } = useAuth();

  const [fullName, setFullName] = useState(user?.fullName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [savingProfile, setSavingProfile] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const res = await api.patch('/auth/profile', { fullName, email });
      setUser(res.data.data.user);
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setSavingPassword(true);
    try {
      await api.patch('/auth/password', { currentPassword, newPassword });
      setCurrentPassword('');
      setNewPassword('');
      toast.success('Password updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update password.');
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="pb-2 border-b border-slate-800/80">
        <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <SettingsIcon className="h-5 w-5 text-slate-400" />
          <span>Settings</span>
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">Manage your account preferences and security</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Section */}
        <div className="lg:col-span-2 glass-panel border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <User className="h-4 w-4 text-blue-400" />
            <h3 className="text-sm font-bold text-slate-200">Profile Information</h3>
          </div>

          <div className="flex items-center gap-4">
            <img
              src={user?.avatar}
              alt={user?.fullName}
              className="h-16 w-16 rounded-2xl object-cover ring-2 ring-blue-500/30"
            />
            <div>
              <p className="text-sm font-bold text-slate-100">{user?.fullName}</p>
              <p className="text-xs text-slate-400">{user?.email}</p>
              <div className="flex items-center gap-1.5 mt-1">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span className="text-[11px] text-emerald-400 font-medium">
                  {user?.isEmailVerified ? 'Email Verified' : 'Email Not Verified'}
                </span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-3 pt-2">
            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                minLength={2}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>
            <button
              type="submit"
              disabled={savingProfile}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-blue-600/25 transition-all cursor-pointer disabled:opacity-60"
            >
              {savingProfile ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>

        {/* Security Section */}
        <div className="space-y-4">
          <div className="glass-panel border border-slate-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
              <Shield className="h-4 w-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-slate-200">Security</h3>
            </div>
            <form onSubmit={handleUpdatePassword} className="space-y-2">
              <div>
                <label className="text-xs font-semibold text-slate-400 block">Current Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-400 block">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={6}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>
              <button
                type="submit"
                disabled={savingPassword}
                className="w-full px-4 py-2.5 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 text-emerald-300 text-xs font-bold rounded-xl transition-all cursor-pointer disabled:opacity-60"
              >
                {savingPassword ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          </div>

          <div className="glass-panel border border-slate-800 rounded-2xl p-5">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-800 mb-3">
              <Bell className="h-4 w-4 text-purple-400" />
              <h3 className="text-sm font-bold text-slate-200">Preferences</h3>
            </div>
            <div className="space-y-3">
              {[
                { label: 'Auto-save sessions', desc: 'Capture open tabs periodically' },
                { label: 'Email notifications', desc: 'Alerts for shared session activity' },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-slate-300">{item.label}</p>
                    <p className="text-[11px] text-slate-500">{item.desc}</p>
                  </div>
                  <div className="relative inline-flex h-5 w-9 cursor-pointer rounded-full bg-slate-700 transition-colors">
                    <span className="absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-slate-400 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

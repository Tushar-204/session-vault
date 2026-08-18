import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { BarChart3, Layers, Star, Trash2, Link2, Globe } from 'lucide-react';
import api from '../utils/api';

const StatCard = ({ icon: Icon, label, value, colorClass }) => (
  <div className="glass-card border border-slate-800 rounded-2xl p-5">
    <div className="flex items-center justify-between mb-3">
      <p className="text-xs font-semibold text-slate-400">{label}</p>
      <div className={`h-8 w-8 rounded-xl flex items-center justify-center ${colorClass}`}>
        <Icon className="h-4 w-4" />
      </div>
    </div>
    <p className="text-3xl font-extrabold text-slate-100">{value}</p>
  </div>
);

export const Analytics = () => {
  const { data: statsData, isLoading } = useQuery({
    queryKey: ['analytics'],
    queryFn: async () => {
      const res = await api.get('/workspaces/analytics');
      return res.data.data;
    },
  });

  const { data: workspacesData } = useQuery({
    queryKey: ['workspaces', {}],
    queryFn: async () => {
      const res = await api.get('/workspaces', { params: { limit: 5, sortBy: 'tabCount', sortOrder: 'desc' } });
      return res.data;
    },
  });

  const stats = statsData || {};
  const topWorkspaces = workspacesData?.data || [];

  return (
    <div className="space-y-6">
      <div className="pb-2 border-b border-slate-800/80">
        <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-purple-400" />
          <span>Analytics</span>
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">Insights about your browser session usage</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 bg-slate-900/60 border border-slate-800 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard icon={Layers} label="Total Workspaces" value={stats.totalWorkspaces ?? 0} colorClass="bg-blue-600/20 text-blue-400 border border-blue-500/30" />
          <StatCard icon={Star} label="Favorites" value={stats.favoriteCount ?? 0} colorClass="bg-amber-600/20 text-amber-400 border border-amber-500/30" />
          <StatCard icon={Trash2} label="In Trash" value={stats.trashCount ?? 0} colorClass="bg-rose-600/20 text-rose-400 border border-rose-500/30" />
        </div>
      )}

      {/* Top workspaces by tab count */}
      {topWorkspaces.length > 0 && (
        <div className="glass-panel border border-slate-800 rounded-2xl p-5 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Top Sessions by Tab Count</h3>
          <div className="space-y-2.5">
            {topWorkspaces.map((ws, idx) => (
              <div key={ws._id} className="flex items-center gap-3">
                <span className="text-[11px] font-bold text-slate-500 w-4 shrink-0">#{idx + 1}</span>
                <div
                  className="h-2.5 rounded-full flex-shrink-0"
                  style={{ width: `${Math.min((ws.tabCount / (topWorkspaces[0]?.tabCount || 1)) * 100, 100)}%`, backgroundColor: ws.color || '#3b82f6' }}
                />
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-xs font-semibold text-slate-300 truncate max-w-[150px]">{ws.title}</span>
                  <span className="text-[11px] text-slate-500 shrink-0 flex items-center gap-1">
                    <Globe className="h-3 w-3" />
                    {ws.tabCount} tabs
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

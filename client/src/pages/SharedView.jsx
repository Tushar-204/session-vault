import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Globe, Layers, Tag, ExternalLink, User } from 'lucide-react';
import api from '../utils/api';

export const SharedView = () => {
  const { code } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchShared = async () => {
      try {
        const res = await api.get(`/shared/${code}`);
        setData(res.data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'This share link is invalid or has expired.');
      } finally {
        setLoading(false);
      }
    };
    fetchShared();
  }, [code]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-xs text-slate-400">Loading shared session...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="text-center glass-panel border border-slate-800 rounded-3xl p-8 max-w-md">
          <Layers className="h-10 w-10 text-rose-400 mx-auto mb-3" />
          <h2 className="text-base font-bold text-slate-100 mb-1">Link Unavailable</h2>
          <p className="text-xs text-slate-400">{error}</p>
        </div>
      </div>
    );
  }

  const { sharedInfo, workspace } = data || {};

  return (
    <div className="min-h-screen bg-slate-950 p-4 md:p-8">
      {/* Brand header */}
      <div className="flex items-center gap-2.5 mb-8">
        <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center">
          <Layers className="h-5 w-5 text-white" />
        </div>
        <span className="font-extrabold text-lg bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          SessionVault
        </span>
      </div>

      <div className="max-w-2xl mx-auto space-y-5">
        {/* Workspace Info */}
        <div className="glass-panel border border-slate-800 rounded-3xl p-6">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h1 className="text-xl font-extrabold text-slate-100">{workspace?.title}</h1>
              <p className="text-xs text-slate-400 mt-0.5">{workspace?.description}</p>
            </div>
            <span
              className="h-4 w-4 rounded-full shrink-0"
              style={{ backgroundColor: workspace?.color || '#3b82f6' }}
            />
          </div>

          <div className="flex flex-wrap gap-3 text-[11px] text-slate-400">
            <span className="flex items-center gap-1">
              <Globe className="h-3 w-3" /> {workspace?.tabCount} Tabs
            </span>
            <span className="flex items-center gap-1">
              <User className="h-3 w-3" /> Shared by {sharedInfo?.createdBy}
            </span>
          </div>

          {workspace?.tags?.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {workspace.tags.map((tag, idx) => (
                <span key={idx} className="px-2 py-0.5 rounded-md bg-slate-800 text-[10px] text-slate-300 flex items-center gap-1">
                  <Tag className="h-2.5 w-2.5" /> {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Tabs list */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Session Tabs ({workspace?.tabs?.length})
          </h3>
          {workspace?.tabs?.map((tab, idx) => (
            <a
              key={idx}
              href={tab.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between p-3.5 glass-card border border-slate-800 hover:border-blue-500/40 rounded-xl transition-all"
            >
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={tab.favIconUrl || 'https://www.google.com/s2/favicons?domain=google.com&sz=64'}
                  alt=""
                  className="h-4 w-4 rounded shrink-0"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-slate-200 group-hover:text-blue-400 truncate">
                    {tab.title}
                  </p>
                  <p className="text-[11px] text-slate-500 truncate">{tab.url}</p>
                </div>
              </div>
              <ExternalLink className="h-3.5 w-3.5 text-slate-500 group-hover:text-blue-400 shrink-0 ml-2" />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

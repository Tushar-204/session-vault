import React from 'react';
import { ExternalLink, Copy, Trash2, Globe } from 'lucide-react';
import toast from 'react-hot-toast';

export const TabList = ({ tabs = [], onDeleteTab }) => {
  const copyToClipboard = (url) => {
    navigator.clipboard.writeText(url);
    toast.success('URL copied to clipboard');
  };

  if (!tabs || tabs.length === 0) {
    return (
      <div className="p-8 text-center bg-slate-900/40 rounded-2xl border border-slate-800">
        <p className="text-xs text-slate-400">No tabs saved in this workspace yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2.5">
      {tabs.map((tab) => (
        <div
          key={tab._id || tab.url}
          className="group flex items-center justify-between p-3.5 bg-slate-900/80 hover:bg-slate-800/60 border border-slate-800 hover:border-blue-500/30 rounded-xl transition-all"
        >
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <img
              src={tab.favIconUrl || 'https://www.google.com/s2/favicons?domain=google.com&sz=64'}
              alt=""
              className="h-4 w-4 rounded shrink-0"
              onError={(e) => {
                e.target.src = 'https://www.google.com/s2/favicons?domain=google.com&sz=64';
              }}
            />
            <div className="min-w-0 flex-1">
              <h5 className="text-xs font-semibold text-slate-200 truncate group-hover:text-blue-400 transition-colors">
                {tab.title || tab.url}
              </h5>
              <p className="text-[11px] text-slate-400 truncate">{tab.url}</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => window.open(tab.url, '_blank')}
              className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              title="Open Tab"
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => copyToClipboard(tab.url)}
              className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              title="Copy URL"
            >
              <Copy className="h-3.5 w-3.5" />
            </button>
            {onDeleteTab && (
              <button
                onClick={() => onDeleteTab(tab._id)}
                className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                title="Remove Tab"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

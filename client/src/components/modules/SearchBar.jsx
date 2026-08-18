import React, { useState, useEffect } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../../utils/api';
import toast from 'react-hot-toast';

export const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ['searchSuggestions', query],
    queryFn: async () => {
      const res = await api.get(`/search/suggestions?q=${encodeURIComponent(query)}`);
      return res.data.data;
    },
    enabled: query.length >= 2,
    staleTime: 5000,
  });

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      setIsOpen(true);
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      if (onSearch) onSearch(query.trim());
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-start justify-center pt-24 p-4">
      <div className="w-full max-w-2xl glass-panel border border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <form onSubmit={handleSearch} className="flex items-center gap-3 px-5 py-4 border-b border-slate-800">
          <Search className="h-5 w-5 text-slate-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search sessions, tabs, folders... (Ctrl+K)"
            autoFocus
            className="flex-1 bg-transparent text-sm text-slate-200 placeholder-slate-500 outline-none"
          />
          {isLoading && <Loader2 className="h-4 w-4 animate-spin text-slate-400" />}
          <button type="button" onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-200 cursor-pointer">
            <X className="h-4 w-4" />
          </button>
        </form>

        {query.length >= 2 && (
          <div className="max-h-80 overflow-y-auto p-4 space-y-2">
            {isLoading ? (
              <div className="text-center py-4 text-xs text-slate-400">Searching...</div>
            ) : (
              <>
                {data?.workspaces?.length > 0 && (
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">Workspaces</p>
                    {data.workspaces.map((ws) => (
                      <button
                        key={ws._id}
                        onClick={() => { setIsOpen(false); navigate(`/workspace/${ws._id}`); }}
                        className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-800/50 transition-colors text-left cursor-pointer"
                      >
                        <div className="h-8 w-8 rounded-lg flex items-center justify-center text-white font-bold text-xs" style={{ backgroundColor: ws.color || '#3b82f6' }}>
                          {ws.title.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-slate-200 truncate">{ws.title}</p>
                          <p className="text-[11px] text-slate-500">{ws.tabCount} tabs</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
                {data?.tabs?.length > 0 && (
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">Tabs</p>
                    {data.tabs.map((tab) => (
                      <a
                        key={tab._id}
                        href={tab.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-800/50 transition-colors cursor-pointer"
                      >
                        <img src={tab.favIconUrl} alt="" className="h-4 w-4 rounded shrink-0" onError={(e) => { e.target.style.display = 'none'; }} />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-slate-200 truncate">{tab.title}</p>
                          <p className="text-[11px] text-slate-500 truncate">{tab.url}</p>
                        </div>
                      </a>
                    ))}
                  </div>
                )}
                {data?.folders?.length > 0 && (
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">Folders</p>
                    {data.folders.map((folder) => (
                      <div key={folder._id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-800/50 transition-colors cursor-pointer">
                        <div className="h-8 w-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: folder.color + '25', border: `1px solid ${folder.color}40` }}>
                          <span className="text-xs font-bold" style={{ color: folder.color }}>F</span>
                        </div>
                        <p className="text-xs font-semibold text-slate-200">{folder.name}</p>
                      </div>
                    ))}
                  </div>
                )}
                {!data?.workspaces?.length && !data?.tabs?.length && !data?.folders?.length && (
                  <div className="text-center py-4 text-xs text-slate-400">No results found</div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
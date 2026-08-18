import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Search, Globe, FolderOpen, Tag, Loader2, ArrowLeft } from 'lucide-react';
import { WorkspaceCard } from '../components/modules/WorkspaceCard';
import { TabList } from '../components/modules/TabList';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { EmptyState } from '../components/common/EmptyState';
import { ShareModal } from '../components/modules/ShareModal';
import api from '../utils/api';
import toast from 'react-hot-toast';

const SearchPage = () => {
  const location = useLocation();
  const [query, setQuery] = useState(() => {
    const params = new URLSearchParams(location.search);
    return params.get('q') || '';
  });
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [shareWorkspace, setShareWorkspace] = useState(null);

  const handleSearch = async (searchQuery) => {
    if (!searchQuery) return;
    setLoading(true);
    try {
      const res = await api.get(`/search?q=${encodeURIComponent(searchQuery)}&scope=${activeTab === 'all' ? 'all' : activeTab}`);
      setResults(res.data.data);
    } catch (err) {
      toast.error('Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (query.trim()) {
      handleSearch(query);
    }
  };

  const onInputKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch(query);
  };

  // Auto-search when landing on /search?q=... directly
  useEffect(() => {
    if (query.trim()) {
      handleSearch(query);
    }
  }, []);

  const resultCount = results
    ? activeTab === 'all'
      ? (results.workspaces?.length || 0) + (results.tabs?.length || 0) + (results.folders?.length || 0)
      : results[activeTab]?.length || 0
    : 0;

  const isEmptyResults = results && resultCount === 0;

  const tabs = [
    { key: 'all', label: 'All', icon: Globe },
    { key: 'workspaces', label: 'Sessions', icon: FolderOpen },
    { key: 'tabs', label: 'Tabs', icon: Globe },
    { key: 'folders', label: 'Folders', icon: FolderOpen },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 pb-2 border-b border-slate-800/80">
        <button onClick={() => window.history.back()} className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-xl transition-colors cursor-pointer">
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onInputKeyDown}
            placeholder="Search sessions, tabs, or folders..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900/80 border border-slate-800 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-all"
          />
        </div>
      </div>

      {!query ? (
        <EmptyState
          title="Nothing to search yet"
          description="Type at least 2 characters in the search bar above to find your sessions, tabs, and folders."
        />
      ) : (
        <>
          <div className="flex items-center gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => handleTabChange(tab.key)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === tab.key
                      ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {loading ? (
            <LoadingSkeleton count={4} />
          ) : results ? (
            <div className="space-y-6">
              {activeTab === 'all' || activeTab === 'workspaces' ? (
                <>
                  {results.workspaces?.length > 0 && (
                    <>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                        <FolderOpen className="h-3.5 w-3.5" /> Workspaces
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {results.workspaces.map((ws) => (
                          <WorkspaceCard
                            key={ws._id}
                            workspace={ws}
                            onShare={(w) => setShareWorkspace(w)}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </>
              ) : null}

              {activeTab === 'all' || activeTab === 'tabs' ? (
                <>
                  {results.tabs?.length > 0 && (
                    <>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                        <Globe className="h-3.5 w-3.5" /> Tabs
                      </h3>
                      <div className="glass-panel border border-slate-800 rounded-2xl p-4">
                        <TabList tabs={results.tabs} />
                      </div>
                    </>
                  )}
                </>
              ) : null}

              {activeTab === 'all' || activeTab === 'folders' ? (
                <>
                  {results.folders?.length > 0 && (
                    <>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                        <FolderOpen className="h-3.5 w-3.5" /> Folders
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {results.folders.map((folder) => (
                          <div key={folder._id} className="glass-card border border-slate-800 rounded-xl p-4 flex items-center gap-3">
                            <div className="h-9 w-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: folder.color + '25', border: `1px solid ${folder.color}40` }}>
                              <span className="text-xs font-bold" style={{ color: folder.color }}>F</span>
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-slate-200">{folder.name}</p>
                              <p className="text-[11px] text-slate-500">Created {new Date(folder.createdAt).toLocaleDateString()}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </>
              ) : null}

              {isEmptyResults && (
                <EmptyState title="No results found" description="Try a different search term or browse from the dashboard." />
              )}
            </div>
          ) : (
            <EmptyState title="Start searching" description="Type at least 2 characters in the search bar above to find your sessions." />
          )}
        </>
      )}

      <ShareModal
        isOpen={!!shareWorkspace}
        onClose={() => setShareWorkspace(null)}
        workspaceId={shareWorkspace?._id}
        workspaceTitle={shareWorkspace?.title}
        tabs={shareWorkspace?.tabs}
      />
    </div>
  );
};

export default SearchPage;
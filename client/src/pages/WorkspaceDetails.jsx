import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Globe, Download, Share2, Trash2, Tag, Star } from 'lucide-react';
import api from '../utils/api';
import { TabList } from '../components/modules/TabList';
import { ShareModal } from '../components/modules/ShareModal';
import { restoreTabs } from '../utils/restoreTabs';
import toast from 'react-hot-toast';

export const WorkspaceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [workspace, setWorkspace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [shareOpen, setShareOpen] = useState(false);

  const fetchDetails = async () => {
    try {
      const res = await api.get(`/workspaces/${id}`);
      setWorkspace(res.data.data);
    } catch (err) {
      toast.error('Failed to load workspace details.');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [id]);

  const handleRestoreAll = () => {
    restoreTabs(workspace?.tabs);
  };

  const handleExportJSON = async () => {
    try {
      const res = await api.get(`/workspaces/${id}/export`);
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(res.data.data, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `${workspace.title.replace(/\s+/g, '_')}_session.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      toast.success('Session exported to JSON');
    } catch (err) {
      toast.error('Export failed');
    }
  };

  const handleDeleteTab = async (tabId) => {
    try {
      await api.delete(`/tabs/${tabId}`);
      setWorkspace((prev) => ({
        ...prev,
        tabs: prev.tabs.filter((t) => t._id !== tabId),
        tabCount: prev.tabCount - 1,
      }));
      toast.success('Tab removed');
    } catch (err) {
      toast.error('Failed to delete tab');
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-400 text-xs">Loading workspace details...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Top Navigation */}
      <button
        onClick={() => navigate('/')}
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Workspaces</span>
      </button>

      {/* Header Card */}
      <div className="glass-panel border border-slate-800 rounded-3xl p-6 relative overflow-hidden">
        <div
          className="absolute top-0 left-0 bottom-0 w-2"
          style={{ backgroundColor: workspace?.color || '#3b82f6' }}
        />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pl-3">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-xl font-extrabold text-slate-100">{workspace?.title}</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-blue-600/20 text-blue-400 border border-blue-500/30 text-[10px] font-bold">
                {workspace?.tabCount || 0} Tabs
              </span>
            </div>
            <p className="text-xs text-slate-400">{workspace?.description || 'No description provided.'}</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleRestoreAll}
              className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-blue-600/25 transition-all cursor-pointer"
            >
              <Globe className="h-4 w-4" />
              <span>Restore All Tabs</span>
            </button>

            <button
              onClick={handleExportJSON}
              className="flex items-center gap-2 px-3.5 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-semibold rounded-xl transition-all cursor-pointer"
            >
              <Download className="h-4 w-4" />
              <span>Export JSON</span>
            </button>

            <button
              onClick={() => setShareOpen(true)}
              className="flex items-center gap-2 px-3.5 py-2.5 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 text-purple-300 text-xs font-semibold rounded-xl transition-all cursor-pointer"
            >
              <Share2 className="h-4 w-4" />
              <span>Share</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs Collection */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Saved Tabs ({workspace?.tabs?.length || 0})
        </h3>
        <TabList tabs={workspace?.tabs} onDeleteTab={handleDeleteTab} />
      </div>

      <ShareModal isOpen={shareOpen} onClose={() => setShareOpen(false)} workspaceId={id} workspaceTitle={workspace?.title} tabs={workspace?.tabs} />
    </div>
  );
};

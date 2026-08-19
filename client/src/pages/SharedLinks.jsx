import React, { useEffect, useState } from 'react';
import { Share2, Copy, Check, ExternalLink, Layers, Eye } from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';

export const SharedLinks = () => {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const res = await api.get('/shared');
        setLinks(res.data.data || []);
      } catch (err) {
        toast.error('Failed to load shared links.');
      } finally {
        setLoading(false);
      }
    };
    fetchLinks();
  }, []);

  const copy = async (code) => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/share/${code}`);
      toast.success('Link copied!');
    } catch {
      toast.error('Copy failed.');
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-400 text-xs">Loading shared links...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-extrabold text-slate-100 flex items-center gap-2">
          <Share2 className="h-5 w-5 text-purple-400" /> Shared Links
        </h1>
        <p className="text-xs text-slate-400 mt-1">Public links you've created to share sessions.</p>
      </div>

      {links.length === 0 ? (
        <div className="glass-panel border border-slate-800 rounded-3xl p-10 text-center">
          <Layers className="h-10 w-10 text-slate-600 mx-auto mb-3" />
          <p className="text-sm text-slate-300 font-semibold">No shared links yet</p>
          <p className="text-xs text-slate-500 mt-1">
            Open any workspace and click <span className="text-purple-300">Share</span> to create one.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {links.map((link) => (
            <div
              key={link._id}
              className="glass-panel border border-slate-800 rounded-2xl p-4 flex items-center justify-between gap-4"
            >
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-100 truncate">
                  {link.workspaceId?.title || 'Untitled Workspace'}
                </p>
                <div className="flex items-center gap-3 mt-1 text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <Eye className="h-3 w-3" /> {link.viewCount || 0} views
                  </span>
                  <span className="capitalize">{link.accessLevel}</span>
                  <span>{new Date(link.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={`/share/${link.shareCode}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                  title="Open"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
                <button
                  onClick={() => copy(link.shareCode)}
                  className="p-2 rounded-lg bg-purple-600/20 hover:bg-purple-600/30 text-purple-300"
                  title="Copy link"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

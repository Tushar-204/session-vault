import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Star, ExternalLink, Share2, Trash2, Globe, Tag, Pin, RotateCcw } from 'lucide-react';
import { restoreTabs } from '../../utils/restoreTabs';
import api from '../../utils/api';
import toast from 'react-hot-toast';

export const WorkspaceCard = ({ workspace, onToggleFavorite, onTrash, onRestore, onShare, onDelete, isTrashView = false }) => {
  const navigate = useNavigate();

  const handleRestoreTabs = async (e) => {
    e.stopPropagation();
    let tabs = workspace.tabs;
    // The list endpoint omits the tabs array; fetch details to get the URLs.
    if (!tabs || tabs.length === 0) {
      try {
        const res = await api.get(`/workspaces/${workspace._id}`);
        tabs = res.data?.data?.tabs || [];
      } catch {
        toast.error('Failed to load tabs for restore.');
        return;
      }
    }
    restoreTabs(tabs);
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      onClick={() => !isTrashView && navigate(`/workspace/${workspace._id}`)}
      className="group glass-card rounded-2xl p-5 border border-slate-800 hover:border-blue-500/40 transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden"
    >
      {/* Top Accent Color Bar */}
      <div
        className="absolute top-0 left-0 right-0 h-1.5"
        style={{ backgroundColor: workspace.color || '#3b82f6' }}
      />

      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 pt-1">
          <div className="flex items-center gap-2.5">
            <div
              className="h-9 w-9 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-md"
              style={{ backgroundColor: workspace.color || '#3b82f6' }}
            >
              {workspace.title.charAt(0).toUpperCase()}
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-100 group-hover:text-blue-400 transition-colors line-clamp-1">
                {workspace.title}
              </h4>
              <p className="text-[11px] text-slate-400">
                {workspace.tabCount || 0} Tabs • {new Date(workspace.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          {!isTrashView && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite && onToggleFavorite(workspace._id);
              }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-slate-800/80 transition-all cursor-pointer"
            >
              <Star
                className={`h-4 w-4 ${
                  workspace.isFavorite ? 'fill-amber-400 text-amber-400' : ''
                }`}
              />
            </button>
          )}
        </div>

        {/* Description */}
        {workspace.description && (
          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
            {workspace.description}
          </p>
        )}

        {/* Tags */}
        {workspace.tags && workspace.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {workspace.tags.slice(0, 3).map((tag, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-800/80 text-[10px] font-medium text-slate-300 border border-slate-700/50"
              >
                <Tag className="h-2.5 w-2.5 text-slate-400" />
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-800/80 text-xs">
        {!isTrashView ? (
          <>
            <button
              onClick={handleRestoreTabs}
              className="flex items-center gap-1.5 font-semibold text-blue-400 hover:text-blue-300 transition-colors cursor-pointer"
            >
              <Globe className="h-3.5 w-3.5" />
              <span>Restore Tabs</span>
            </button>

            <div className="flex items-center gap-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onShare && onShare(workspace);
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-all cursor-pointer"
                title="Share Workspace"
              >
                <Share2 className="h-3.5 w-3.5" />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onTrash && onTrash(workspace._id);
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all cursor-pointer"
                title="Move to Trash"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-between w-full">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRestore && onRestore(workspace._id);
              }}
              className="flex items-center gap-1.5 font-semibold text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Restore Session</span>
            </button>

            {onDelete && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (window.confirm(`Permanently delete "${workspace.title}"? This cannot be undone.`)) {
                    onDelete(workspace._id);
                  }
                }}
                className="flex items-center gap-1.5 font-semibold text-rose-400 hover:text-rose-300 transition-colors cursor-pointer"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Delete Permanently</span>
              </button>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

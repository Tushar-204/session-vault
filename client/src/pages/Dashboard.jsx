import React, { useState } from 'react';
import { useWorkspaces } from '../hooks/useWorkspaces';
import { WorkspaceCard } from '../components/modules/WorkspaceCard';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { EmptyState } from '../components/common/EmptyState';
import { CreateWorkspaceModal } from '../components/modules/CreateWorkspaceModal';
import { ShareModal } from '../components/modules/ShareModal';
import { Sparkles, Grid, Filter } from 'lucide-react';

export const Dashboard = ({ searchFilter = '' }) => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [shareWorkspace, setShareWorkspace] = useState(null);

  const {
    workspaces,
    isLoading,
    createWorkspace,
    toggleFavorite,
    trashWorkspace,
  } = useWorkspaces({ search: searchFilter, isTrash: false });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800/80">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <span>Workspace Overview</span>
            <Sparkles className="h-4 w-4 text-amber-400" />
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage, restore, and organize your browser sessions
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-400 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl">
            {workspaces.length} Sessions Saved
          </span>
        </div>
      </div>

      {/* Grid Content */}
      {isLoading ? (
        <LoadingSkeleton count={6} />
      ) : workspaces.length === 0 ? (
        <EmptyState
          title="No Sessions Saved Yet"
          description="Click below or use the SessionVault Chrome Extension to save your open browser tabs instantly."
          onAction={() => setIsCreateOpen(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {workspaces.map((workspace) => (
            <WorkspaceCard
              key={workspace._id}
              workspace={workspace}
              onToggleFavorite={toggleFavorite}
              onTrash={trashWorkspace}
              onShare={(ws) => setShareWorkspace(ws)}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <CreateWorkspaceModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCreate={createWorkspace}
      />

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

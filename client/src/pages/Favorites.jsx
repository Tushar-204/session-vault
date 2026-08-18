import React, { useState } from 'react';
import { useWorkspaces } from '../hooks/useWorkspaces';
import { WorkspaceCard } from '../components/modules/WorkspaceCard';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { EmptyState } from '../components/common/EmptyState';
import { ShareModal } from '../components/modules/ShareModal';
import { Star } from 'lucide-react';

export const Favorites = () => {
  const { workspaces, isLoading, toggleFavorite, trashWorkspace } = useWorkspaces({
    favorite: 'true',
    isTrash: false,
  });
  const [shareWorkspace, setShareWorkspace] = useState(null);

  return (
    <div className="space-y-6">
      <div className="pb-2 border-b border-slate-800/80">
        <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
          <span>Favorite Sessions</span>
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">Your starred browser workspace sessions</p>
      </div>

      {isLoading ? (
        <LoadingSkeleton count={6} />
      ) : workspaces.length === 0 ? (
        <EmptyState
          title="No Favorites Yet"
          description="Star a workspace from the dashboard to see it here for quick access."
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

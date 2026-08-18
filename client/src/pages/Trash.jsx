import React from 'react';
import { useWorkspaces } from '../hooks/useWorkspaces';
import { WorkspaceCard } from '../components/modules/WorkspaceCard';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { EmptyState } from '../components/common/EmptyState';
import { Trash2 } from 'lucide-react';

export const Trash = () => {
  const { workspaces, isLoading, restoreWorkspace, deleteWorkspace } = useWorkspaces({ trash: 'true' });

  return (
    <div className="space-y-6">
      <div className="pb-2 border-b border-slate-800/80">
        <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <Trash2 className="h-5 w-5 text-rose-400" />
          <span>Trash</span>
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Deleted sessions are stored here. Restore them before they are permanently removed.
        </p>
      </div>

      {isLoading ? (
        <LoadingSkeleton count={3} />
      ) : workspaces.length === 0 ? (
        <EmptyState
          title="Trash is Empty"
          description="Workspaces you delete will appear here for recovery."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {workspaces.map((workspace) => (
            <WorkspaceCard
              key={workspace._id}
              workspace={workspace}
              isTrashView
              onRestore={restoreWorkspace}
              onDelete={deleteWorkspace}
            />
          ))}
        </div>
      )}
    </div>
  );
};

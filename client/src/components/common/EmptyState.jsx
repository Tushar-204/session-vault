import React from 'react';
import { Layers, Plus } from 'lucide-react';

export const EmptyState = ({ title = 'No Workspaces Found', description = 'Save your current browser tabs or create a new session workspace to get started.', onAction }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 glass-panel border border-slate-800 rounded-3xl text-center max-w-md mx-auto my-12">
      <div className="h-16 w-16 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center mb-4">
        <Layers className="h-8 w-8 text-blue-400" />
      </div>
      <h3 className="text-lg font-bold text-slate-100 mb-1.5">{title}</h3>
      <p className="text-xs text-slate-400 leading-relaxed mb-6">{description}</p>
      {onAction && (
        <button
          onClick={onAction}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-lg shadow-blue-600/25 transition-all cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Create Workspace</span>
        </button>
      )}
    </div>
  );
};

import React from 'react';

export const LoadingSkeleton = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="h-48 rounded-2xl bg-slate-900/60 border border-slate-800 p-5 flex flex-col justify-between animate-pulse"
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="h-5 w-32 bg-slate-800 rounded-md" />
              <div className="h-5 w-5 bg-slate-800 rounded-full" />
            </div>
            <div className="h-4 w-3/4 bg-slate-800/60 rounded-md" />
            <div className="h-4 w-1/2 bg-slate-800/40 rounded-md" />
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-800/60">
            <div className="h-4 w-20 bg-slate-800 rounded-md" />
            <div className="h-6 w-16 bg-slate-800 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
};

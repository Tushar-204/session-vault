import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Plus, Trash2, FolderPlus } from 'lucide-react';

const workspaceSchema = z.object({
  title: z.string().min(1, 'Workspace title is required').max(100),
  description: z.string().max(500).optional(),
  color: z.string().default('#3b82f6'),
  tags: z.string().optional(),
});

export const CreateWorkspaceModal = ({ isOpen, onClose, onCreate }) => {
  const [urls, setUrls] = useState(['https://']);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(workspaceSchema),
    defaultValues: {
      color: '#3b82f6',
    },
  });

  if (!isOpen) return null;

  const handleAddUrl = () => {
    setUrls([...urls, 'https://']);
  };

  const handleRemoveUrl = (idx) => {
    setUrls(urls.filter((_, i) => i !== idx));
  };

  const handleUrlChange = (idx, value) => {
    const updated = [...urls];
    updated[idx] = value;
    setUrls(updated);
  };

  const onSubmit = async (data) => {
    const formattedTags = data.tags
      ? data.tags.split(',').map((t) => t.trim()).filter((t) => t.length > 0)
      : [];

    const tabsPayload = urls
      .filter((u) => u.trim() !== '' && u.trim() !== 'https://')
      .map((u, index) => ({
        title: u.replace(/^https?:\/\//, '').split('/')[0] || 'Web Page',
        url: u.trim(),
        index,
      }));

    await onCreate({
      title: data.title,
      description: data.description,
      color: data.color,
      tags: formattedTags,
      tabs: tabsPayload,
    });

    reset();
    setUrls(['https://']);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-lg glass-panel border border-slate-800 rounded-3xl p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <FolderPlus className="h-4 w-4" />
            </div>
            <h3 className="text-base font-bold text-slate-100">Create New Workspace</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-all cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Workspace Title *
            </label>
            <input
              type="text"
              {...register('title')}
              placeholder="e.g. React 19 Upgrade & Docs"
              className="w-full px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-blue-500"
            />
            {errors.title && <p className="text-[11px] text-rose-400 mt-1">{errors.title.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
            <textarea
              {...register('description')}
              rows={2}
              placeholder="Optional notes or context about this session..."
              className="w-full px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Badge Color</label>
              <input
                type="color"
                {...register('color')}
                className="h-9 w-full bg-slate-900 border border-slate-800 rounded-xl p-1 cursor-pointer"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Tags (Comma Separated)</label>
              <input
                type="text"
                {...register('tags')}
                placeholder="dev, react, work"
                className="w-full px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Initial URLs list */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-300">Session URLs</label>
              <button
                type="button"
                onClick={handleAddUrl}
                className="text-[11px] text-blue-400 hover:text-blue-300 flex items-center gap-1 font-semibold cursor-pointer"
              >
                <Plus className="h-3 w-3" />
                <span>Add URL</span>
              </button>
            </div>

            <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
              {urls.map((url, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => handleUrlChange(idx, e.target.value)}
                    placeholder="https://example.com"
                    className="flex-1 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                  />
                  {urls.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveUrl(idx)}
                      className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-5 py-2 rounded-xl shadow-lg shadow-blue-600/25 transition-all"
            >
              {isSubmitting ? 'Creating...' : 'Save Workspace'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

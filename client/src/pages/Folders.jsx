import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Folder, Plus, X, Trash2, Edit3, Check } from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';

const folderSchema = z.object({
  name: z.string().min(1, 'Folder name is required').max(60),
  color: z.string().default('#10b981'),
});

export const Folders = () => {
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');

  const { data: foldersData, isLoading } = useQuery({
    queryKey: ['folders'],
    queryFn: async () => {
      const res = await api.get('/folders');
      return res.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data) => {
      const res = await api.post('/folders', data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['folders'] });
      toast.success('Folder created');
      reset();
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to create folder'),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const res = await api.delete(`/folders/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['folders'] });
      toast.success('Folder deleted');
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, name }) => {
      const res = await api.patch(`/folders/${id}`, { name });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['folders'] });
      setEditingId(null);
      toast.success('Folder renamed');
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(folderSchema),
    defaultValues: { color: '#10b981' },
  });

  const onSubmit = (data) => createMutation.mutate(data);

  const folders = foldersData?.data || [];

  return (
    <div className="space-y-6">
      <div className="pb-2 border-b border-slate-800/80">
        <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <Folder className="h-5 w-5 text-emerald-400" />
          <span>Folders</span>
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">Organize your session workspaces into folders</p>
      </div>

      {/* Create Folder */}
      <form onSubmit={handleSubmit(onSubmit)} className="glass-panel border border-slate-800 rounded-2xl p-5">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">New Folder</h3>
        <div className="flex items-end gap-3">
          <div className="flex-1">
            <input
              type="text"
              {...register('name')}
              placeholder="e.g. Work Projects, Research, Personal"
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-emerald-500 transition-all"
            />
            {errors.name && <p className="text-[11px] text-rose-400 mt-1">{errors.name.message}</p>}
          </div>
          <input
            type="color"
            {...register('color')}
            className="h-10 w-12 bg-slate-900 border border-slate-800 rounded-xl p-1 cursor-pointer"
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-600/25 transition-all cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Create</span>
          </button>
        </div>
      </form>

      {/* Folders Grid */}
      {isLoading ? (
        <div className="text-xs text-slate-400 text-center py-8">Loading folders...</div>
      ) : folders.length === 0 ? (
        <div className="p-10 text-center glass-panel border border-slate-800 rounded-2xl">
          <Folder className="h-10 w-10 text-slate-600 mx-auto mb-3" />
          <p className="text-xs text-slate-400">No folders yet. Create your first one above.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {folders.map((folder) => (
            <div
              key={folder._id}
              className="group glass-card border border-slate-800 hover:border-slate-700 rounded-2xl p-4 flex items-center justify-between transition-all"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className="h-9 w-9 rounded-xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: folder.color + '25', border: `1px solid ${folder.color}40` }}
                >
                  <Folder className="h-4 w-4" style={{ color: folder.color }} />
                </div>

                {editingId === folder._id ? (
                  <input
                    autoFocus
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="flex-1 bg-transparent text-xs font-semibold text-slate-200 border-b border-blue-500 outline-none"
                  />
                ) : (
                  <span className="text-xs font-semibold text-slate-200 truncate">{folder.name}</span>
                )}
              </div>

              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {editingId === folder._id ? (
                  <button
                    onClick={() => updateMutation.mutate({ id: folder._id, name: editName })}
                    className="p-1.5 text-emerald-400 hover:bg-slate-800 rounded-lg cursor-pointer"
                  >
                    <Check className="h-3.5 w-3.5" />
                  </button>
                ) : (
                  <button
                    onClick={() => { setEditingId(folder._id); setEditName(folder.name); }}
                    className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-slate-800 rounded-lg cursor-pointer"
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                  </button>
                )}

                <button
                  onClick={() => deleteMutation.mutate(folder._id)}
                  className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg cursor-pointer"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

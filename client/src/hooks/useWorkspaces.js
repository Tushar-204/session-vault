import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../utils/api';
import toast from 'react-hot-toast';

export const useWorkspaces = (params = {}) => {
  const queryClient = useQueryClient();

  const workspacesQuery = useQuery({
    queryKey: ['workspaces', params],
    queryFn: async () => {
      const res = await api.get('/workspaces', { params });
      return res.data;
    },
  });

  const createWorkspaceMutation = useMutation({
    mutationFn: async (workspaceData) => {
      const res = await api.post('/workspaces', workspaceData);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspaces'] });
      toast.success('Workspace saved successfully!');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to create workspace.');
    },
  });

  const toggleFavoriteMutation = useMutation({
    mutationFn: async (workspaceId) => {
      const res = await api.post(`/workspaces/${workspaceId}/favorite`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspaces'] });
      toast.success('Favorite status updated!');
    },
  });

  const trashWorkspaceMutation = useMutation({
    mutationFn: async (workspaceId) => {
      const res = await api.post(`/workspaces/${workspaceId}/trash`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspaces'] });
      toast.success('Moved to trash');
    },
  });

  const restoreWorkspaceMutation = useMutation({
    mutationFn: async (workspaceId) => {
      const res = await api.post(`/workspaces/${workspaceId}/restore`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspaces'] });
      toast.success('Workspace restored');
    },
  });

  const deleteWorkspaceMutation = useMutation({
    mutationFn: async (workspaceId) => {
      const res = await api.delete(`/workspaces/${workspaceId}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspaces'] });
      toast.success('Workspace permanently deleted');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to delete workspace.');
    },
  });

  return {
    workspaces: workspacesQuery.data?.data || [],
    meta: workspacesQuery.data?.meta,
    isLoading: workspacesQuery.isLoading,
    isError: workspacesQuery.isError,
    refetch: workspacesQuery.refetch,
    createWorkspace: createWorkspaceMutation.mutateAsync,
    toggleFavorite: toggleFavoriteMutation.mutate,
    trashWorkspace: trashWorkspaceMutation.mutate,
    restoreWorkspace: restoreWorkspaceMutation.mutate,
    deleteWorkspace: deleteWorkspaceMutation.mutate,
  };
};

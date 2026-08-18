import { z } from 'zod';

const tabSchema = z.object({
  title: z.string().min(1, 'Tab title is required'),
  url: z.string().url('Invalid tab URL'),
  favIconUrl: z.string().optional(),
  pinned: z.boolean().optional(),
  windowId: z.string().optional(),
});

export const createWorkspaceSchema = z.object({
  title: z.string().min(1, 'Workspace title is required').max(100),
  description: z.string().max(500).optional(),
  color: z.string().optional(),
  icon: z.string().optional(),
  tags: z.array(z.string()).optional(),
  folderId: z.string().nullable().optional(),
  tabs: z.array(tabSchema).optional(),
});

export const updateWorkspaceSchema = createWorkspaceSchema.partial();

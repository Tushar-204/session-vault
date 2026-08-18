import { z } from 'zod';

export const searchSchema = z.object({
  q: z.string().min(1, 'Search query is required').max(200),
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
  scope: z.enum(['all', 'workspaces', 'tabs', 'folders']).optional(),
});

export const importSchema = z.object({
  sessions: z.array(
    z.object({
      title: z.string().min(1, 'Session title is required'),
      description: z.string().optional(),
      color: z.string().optional(),
      tags: z.array(z.string()).optional(),
      tabs: z.array(
        z.object({
          title: z.string().min(1, 'Tab title is required'),
          url: z.string().url('Invalid tab URL'),
          favIconUrl: z.string().optional(),
          pinned: z.boolean().optional(),
        })
      ),
    })
  ),
});
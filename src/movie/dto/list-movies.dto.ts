import { z } from 'zod';

export const listMoviesQuerySchema = z.object({
    sort: z.enum(['id', 'title', 'year']).default('id'),
    order: z.enum(['ASC', 'DESC']).default('ASC'),
    limit: z.coerce.number().int().min(1).default(20),
    offset: z.coerce.number().int().min(0).default(0),
    title: z.string().optional(),
    actor: z.string().optional(),
    search: z.string().optional(),
});

export type ListMoviesQuery = z.infer<typeof listMoviesQuerySchema>;

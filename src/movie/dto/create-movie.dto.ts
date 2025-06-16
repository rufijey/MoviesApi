import { z } from 'zod';

export const createMovieSchema = z.object({
    title: z.string().trim().min(1, 'Title is required'),
    year: z.number().int().gte(1800).lte(new Date().getFullYear()),
    format: z.enum(['VHS', 'DVD', 'Blu-ray']),
    actors: z
        .array(
            z.string()
                .trim()
                .min(1, 'Actor name is required')
                .regex(/^[\p{L}\s\-,.]+$/u, 'Invalid actor name'),
        )
        .nonempty('Actors list cannot be empty'),
});


export type CreateMovieDTO = z.infer<typeof createMovieSchema>;


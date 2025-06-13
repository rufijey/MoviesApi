import { z } from 'zod';
import {createMovieSchema} from "./create-movie.dto";

export const updateMovieSchema = createMovieSchema.partial();

export type UpdateMovieDTO = z.infer<typeof updateMovieSchema>;

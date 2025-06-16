import {Request, Response} from 'express';
import movieService from "./movie.service";
import {updateMovieSchema} from "./dto/update-movie.dto";
import {createMovieSchema} from "./dto/create-movie.dto";
import {listMoviesQuerySchema} from "./dto/list-movies.dto";
import HttpError from "../shared/errors/HttpError";

class MovieController {
    async create(req: Request, res: Response) {
        const validatedData = createMovieSchema.parse(req.body);

        const movie = await movieService.createMovie(validatedData);
        res.status(201).json({data: movie, status: 1});

    }

    async update(req: Request, res: Response) {

        const id = Number(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({message: 'Invalid ID', status: 0});
            return;
        }

        const validatedData = updateMovieSchema.parse(req.body);
        const updated = await movieService.updateMovie(id, validatedData);

        res.json({data: updated, status: 1});

    }

    async getById(req: Request, res: Response) {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({message: 'Invalid ID', status: 0});
            return;
        }

        const movie = await movieService.getMovieById(id);
        if (!movie) {
            res.status(404).json({message: 'MovieModel not found'});
            return;
        }
        res.json({data: movie, status: 1});
    }

    async remove(req: Request, res: Response) {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({message: 'Invalid ID', status: 0});
            return;
        }

        await movieService.deleteMovie(id);
        res.status(204).send();
    }

    async list(req: Request, res: Response) {
        const result = listMoviesQuerySchema.safeParse(req.query);

        if (!result.success) {
            res.status(400).json({error: result.error.format()});
            return;
        }

        const {data, total} = await movieService.listMovies(result.data);

        res.json({
            data,
            meta: {
                total,
                offset: result.data.offset,
                limit: result.data.limit,
            },
            status: 1,
        });
    }

    async importFromFile(req: Request, res: Response) {
        const file = req.file;
        if (!file) {
            res.status(400).json({message: 'No file uploaded'});
            return;
        }
        if (file.mimetype !== 'text/plain') {
            res.status(400).json({message: 'Unsupported file format. Only .txt files are allowed.'});
            return;
        }

        const content = file.buffer.toString('utf-8');

        if (content.length === 0) {
            res.status(400).json({message: 'Uploaded file is empty.'});
            return;
        }

        const importedMovies = await movieService.importFromText(content);
        res.status(201).json({
            data: importedMovies,
            imported: importedMovies.length,
            status: 1,
        });

    }
}

export default new MovieController();
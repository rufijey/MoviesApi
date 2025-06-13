import {Actor, Movie, sequelize} from "../shared/database/sequelize";
import HttpError from '../shared/errors/HttpError'
import {UpdateMovieDTO} from "./dto/update-movie.dto";
import {CreateMovieDTO} from "./dto/create-movie.dto";
import {ListMoviesQuery} from "./dto/list-movies.dto";
import {Op, WhereOptions, Includeable, Sequelize} from 'sequelize';

class MovieService {
    async createMovie(createData: CreateMovieDTO) {
        const t = await sequelize.transaction();

        try {
            const existingMovie = await Movie.findOne({
                where: {title: createData.title, year: createData.year},
                transaction: t
            });
            if (existingMovie) {
                await t.rollback();
                throw new HttpError(`Movie with title "${createData.title}" and year ${createData.year} already exists.`, 409)
            }

            const movie = await Movie.create(
                {
                    title: createData.title,
                    year: createData.year,
                    format: createData.format,
                },
                {transaction: t}
            );

            const actors = await Promise.all(
                createData.actors.map(async (name) => {
                    const [actor] = await Actor.findOrCreate({where: {name}, transaction: t});
                    return actor;
                })
            );

            await (movie as any).setActors(actors, {transaction: t});

            await t.commit();

            return await Movie.findByPk(movie.id, {
                include: [{model: Actor, as: 'actors'}],
            });
        } catch (err) {
            await t.rollback();
            throw err;
        }
    }

    async updateMovie(id: number, updateData: UpdateMovieDTO) {
        const movie = await Movie.findByPk(id);
        if (!movie) {
            throw new HttpError(`Movie with id ${id} not found.`, 404);
        }

        if (updateData.title && updateData.year) {
            const conflict = await Movie.findOne({
                where: {
                    title: updateData.title,
                    year: updateData.year,
                    id: {$ne: id}
                }
            });
            if (conflict) {
                throw new HttpError(`Another movie with title "${updateData.title}" and year ${updateData.year} already exists.`, 409);
            }
        }

        await movie.update(updateData);

        if (updateData.actors && updateData.actors.length > 0) {
            const actors = await Promise.all(
                [...new Set(updateData.actors)].map(async (name) => {
                    const [actor] = await Actor.findOrCreate({where: {name}});
                    return actor;
                })
            );
            await movie.setActors(actors);
        }

        return Movie.findByPk(movie.id, {
            include: [{model: Actor, as: 'actors'}],
        });
    }

    async getMovieById(id: number) {
        return Movie.findByPk(id, {
            include: [{model: Actor, as: 'actors'}],
        });
    }

    async deleteMovie(id: number) {
        return Movie.destroy({where: {id}});
    }

    async listMovies(query: ListMoviesQuery) {
        const {
            sort = 'id',
            order = 'ASC',
            limit = 20,
            offset = 0,
            title,
            actor,
            search,
        } = query;

        const where: WhereOptions = {};

        if (title) {
            where.title = {[Op.like]: `%${title}%`};
        }

        const include: Includeable[] = [];

        if (actor) {
            include.push({
                model: Actor,
                as: 'actors',
                attributes: [],
                through: {attributes: []},
                where: {name: {[Op.like]: `%${actor}%`}},
                required: true,
            });
        }


        if (search && !title && !actor) {
            const safeSearch = search.replace(/'/g, "''");

            (where as any)[Op.or] = [
                {title: {[Op.like]: `%${search}%`}},
                Sequelize.literal(`
            EXISTS (
                SELECT 1 FROM "MovieActors" AS "ma"
                INNER JOIN "Actors" AS "a" ON "ma"."actorId" = "a"."id"
                WHERE "ma"."movieId" = "Movie"."id"
                AND "a"."name" LIKE '%${safeSearch}%'
            )`),
            ];
        }

        const movies = await Movie.findAndCountAll({
            where,
            include,
            order: [[sort, order]],
            limit,
            offset,
            distinct: true,
            attributes: {exclude: []},
        });

        return {
            data: movies.rows,
            total: movies.count,
        };
    }


    async importFromText(text: string) {
        const t = await sequelize.transaction();

        try {
            const entries = text.split(/\n\s*\n/).filter(Boolean);
            const movies: any[] = [];

            for (const entry of entries) {
                const title = entry.match(/Title:\s*(.+)/)?.[1]?.trim();
                const year = parseInt(entry.match(/Release Year:\s*(\d+)/)?.[1] || '');
                const format = entry.match(/Format:\s*(\w[\w-]*)/)?.[1]?.trim() as 'VHS' | 'DVD' | 'Blu-ray';
                const starsLine = entry.match(/Stars:\s*(.+)/)?.[1];
                const actors = starsLine?.split(',').map(s => s.trim()) ?? [];

                if (!title || !year || !format || actors.length === 0) continue;

                const existingMovie = await Movie.findOne({where: {title, year}, transaction: t});
                if (existingMovie) {
                    continue;
                }

                const movie = await Movie.create({title, year, format}, {transaction: t});

                const actorInstances = await Promise.all(
                    [...new Set(actors.map((name) => name.trim()))]
                        .filter((name) => name.length > 0)
                        .map(async (name) => {
                            const [actor] = await Actor.findOrCreate({where: {name}, transaction: t});
                            return actor;
                        })
                );

                await (movie as any).setActors(actorInstances, {transaction: t});
                movies.push(movie);
            }

            await t.commit();
            return movies;
        } catch (err) {
            await t.rollback();
            throw err;
        }
    }

}

export default new MovieService();

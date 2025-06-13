import { DataTypes, Sequelize, Model, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import {Movie} from './movie.model';

export class Actor extends Model<
    InferAttributes<Actor, { omit: 'movies' }>,
    InferCreationAttributes<Actor, { omit: 'movies' }>
> {
    declare id: CreationOptional<number>;
    declare name: string;

    declare getMovies: () => Promise<Movie[]>;
    declare setMovies: (movies: Movie[]) => Promise<void>;
    declare addMovie: (movie: Movie) => Promise<void>;
    declare movies?: Movie[];
}

export const defineActor = (sequelize: Sequelize) => {
    Actor.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
        },
        {
            sequelize,
            tableName: 'actors',
            timestamps: true,
        }
    );

    return Actor;
};

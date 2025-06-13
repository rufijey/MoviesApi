import { DataTypes, Sequelize, Model, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import {Actor} from "./actor.model";

export class Movie extends Model<
    InferAttributes<Movie, { omit: 'actors' }>,
    InferCreationAttributes<Movie, { omit: 'actors' }>
> {
    declare id: CreationOptional<number>;
    declare title: string;
    declare year: number;
    declare format: 'VHS' | 'DVD' | 'Blu-ray';

    declare getActors: () => Promise<Actor[]>;
    declare setActors: (actors: Actor[]) => Promise<void>;
    declare addActor: (actor: Actor) => Promise<void>;
    declare actors?: Actor[];
}

export const defineMovie = (sequelize: Sequelize) => {
    Movie.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            title: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            year: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            format: {
                type: DataTypes.ENUM('VHS', 'DVD', 'Blu-ray'),
                allowNull: false,
            },
        },
        {
            sequelize,
            tableName: 'movies',
            timestamps: true,
        }
    );

    Actor.belongsToMany(Movie, {
        through: 'MovieActors',
        as: 'movies',
        timestamps: false,
    });

    Movie.belongsToMany(Actor, {
        through: 'MovieActors',
        as: 'actors',
        timestamps: false,
    });

    return Movie;
};

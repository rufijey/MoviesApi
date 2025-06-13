import { Sequelize } from 'sequelize';
import {defineActor} from "../../movie/actor.model";
import {defineMovie} from "../../movie/movie.model";
import {defineUser} from "../../user/user.model";

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: process.env.DB_STORAGE,
    logging: false,
});

const Actor = defineActor(sequelize);
const Movie = defineMovie(sequelize);
const User = defineUser(sequelize);

export { sequelize, Actor, Movie, User };

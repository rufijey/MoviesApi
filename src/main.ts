import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import 'reflect-metadata';
import {sequelize} from "./shared/database/sequelize";
import movieRoutes from "./movie/movie.routes";
import userRoutes from "./user/user.routes";
import {errorHandlerMiddleware} from "./shared/middlewares/error-handler.middleware";
import {tr} from "zod/dist/types/v4/locales";

async function bootstrap() {
    const app = express();

    app.use(cors());
    app.use(express.json());

    app.use('/api/v1/movies', movieRoutes);
    app.use('/api/v1', userRoutes);

    app.use(errorHandlerMiddleware);

    await sequelize.sync()

    console.log('Database synced');

    const PORT = process.env.PORT ?? 8000;

    app.listen(PORT);
}

bootstrap()
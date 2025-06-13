import { Router } from 'express';
import movieController from "./movie.controller";
import upload from "../shared/middlewares/upload.middleware";
import {authMiddleware} from "../shared/middlewares/auth.middleware";

export const movieRouter = Router();

movieRouter.use(authMiddleware);

movieRouter.post('/', movieController.create);
movieRouter.patch('/:id', movieController.update);
movieRouter.get('/', movieController.list);
movieRouter.get('/:id', movieController.getById);
movieRouter.delete('/:id', movieController.remove);
movieRouter.post('/import', upload.single('movies'), movieController.importFromFile);


export default movieRouter;
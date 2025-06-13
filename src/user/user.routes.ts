import { Router } from 'express';
import userController from "./user.controller";

const userRouter = Router();

userRouter.post('/users', userController.register);
userRouter.post('/sessions', userController.login);

export default userRouter;

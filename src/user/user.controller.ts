// user.controller.ts
import {Request, Response} from 'express';
import userService from './user.service';
import {RegisterDto, RegisterSchema} from "./dto/register.dto";
import {LoginDto, LoginSchema} from "./dto/login.dto";

class UserController {
    async register(req: Request, res: Response) {
        const data: RegisterDto = RegisterSchema.parse(req.body);
        const result = await userService.register(data);
        res.status(200).json(result);

    }

    async login(req: Request, res: Response) {
        const data: LoginDto = LoginSchema.parse(req.body);
        const result = await userService.login(data);
        res.status(200).json(result);

    }
}

export default new UserController();

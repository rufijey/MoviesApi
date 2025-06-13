import { User } from '../shared/database/sequelize';
import jwt from 'jsonwebtoken';
import HttpError from '../shared/errors/HttpError';
import bcrypt from 'bcrypt';
import {RegisterDto} from "./dto/register.dto";
import {LoginDto} from "./dto/login.dto";

class UserService {
    private generateToken(userId: number): string {
        return jwt.sign({ userId }, process.env.JWT_SECRET || 'secret', {
            expiresIn: process.env.JWT_EXPIRES_IN as any || '1h',
        });
    }

    async register(data: RegisterDto) {
        const { email, name, password } = data;

        const existing = await User.findOne({ where: { email } });
        if (existing) {
            throw new HttpError('User with this email already exists', 409);
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({ email, name, password: hashedPassword });
        const token = this.generateToken(user.id);
        return { token, status: 1 };
    }

    async login(data: LoginDto) {
        const { email, password } = data;

        const user = await User.findOne({ where: { email } });
        if (!user) {
            throw new HttpError('Invalid email or password', 401);
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new HttpError('Invalid email or password', 401);
        }

        const token = this.generateToken(user.id);
        return { token, status: 1 };
    }
}

export default new UserService();

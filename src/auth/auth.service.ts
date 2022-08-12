import { Inject, Injectable } from "@nestjs/common";
import { AuthRepository } from "./auth.repository";
import { User } from "../entities/User";
import { CreateUserDto } from "./dto/create-user.dto";
import { InvalidUsername, UserAlreadyExists, UserDoesNotExist } from "./auth.errors";
import * as jwt from "jsonwebtoken";
import {Role} from "../../types";

@Injectable()
export class AuthService {
    constructor(private authRepository: AuthRepository) {}

    generateAccessToken(id: number, role: Role) {
        const payload = { id, role };
        return jwt.sign(payload, process.env.SECRET, { expiresIn: "2h" });
    }

    async register(dto: CreateUserDto): Promise<number> {
        const { username, phone_number } = dto;

        // check if user already exists:
        const user: User = await this.authRepository.getByNumber(phone_number);
        if (user) {
            throw new UserAlreadyExists();
        }

        // create user:
        return this.authRepository.register(dto);
    }

    async login(dto: CreateUserDto): Promise<number> {
        const { username, phone_number } = dto;

        // checking whether the auth exist by phone number:
        const user: User = await this.authRepository.getByNumber(phone_number);
        if (!user) {
            throw new UserDoesNotExist();
        }

        // check for correct username:
        if (username !== user.username) {
            throw new InvalidUsername();
        }

        return user.id;
    }

    async getUsers(): Promise<User[]> {
        const users: User[] = await this.authRepository.getUsers();
        return users;
    }

    async getRoleById(userId): Promise<Role>{
        return this.authRepository.getRoleById(userId)
    }
}

import { Controller, Get, Inject, Post, Req, Res } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { Request, Response } from "express";
import { CreateUserDto } from "./dto/create-user.dto";
import { InvalidUsername, UserAlreadyExists, UserDoesNotExist } from "./auth.errors";

@Controller("/users")
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post("/register")
    async register(@Req() req: Request, @Res() res: Response) {
        // todo: create validation using class-validator
        // const errors = validationResult(req)
        // if (!errors.isEmpty()){
        //     const message = errors.array()[0].msg
        //     return res.status(400).send(`Ошибка регистрации: ${message}`)
        // }

        const dto: CreateUserDto = req.body;

        try {
            const id = await this.authService.register(dto);
            const token = this.authService.generateAccessToken(id);

            return res.status(201).send({ id, token });
        } catch (e) {
            console.log(e);
            if (e instanceof UserAlreadyExists) {
                return res.status(e.statusCode).send(e.message);
            }

            return res.status(400).send("bad request!!");
        }
    }

    @Post("/login")
    async login(@Req() req: Request, @Res() res: Response) {
        const dto: CreateUserDto = req.body;

        try {
            const id = await this.authService.login(dto);
            const token = this.authService.generateAccessToken(id);

            return res.status(200).send({ id, token });
        } catch (e) {
            console.log(e);
            if (e instanceof UserDoesNotExist) {
                return res.status(e.statusCode).send(e.message);
            }
            if (e instanceof InvalidUsername) {
                return res.status(e.statusCode).send(e.message);
            }

            return res.status(500).end();
        }
    }

    @Get("/getUsers")
    async getUsers(@Res() res: Response) {
        const users = await this.authService.getUsers();
        return res.status(200).json(users);
    }
}

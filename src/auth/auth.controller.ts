import { Controller, Get, Inject, Post, Req, Res } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { Request, Response } from "express";
import { AuthRepository } from "./auth.repository";
import { CreateUserDto } from "./dto/create-user.dto";
import {
    InvalidUsername,
    UserAlreadyExists,
    UserDoesNotExist
} from "./auth.errors";
import { CartService } from "../cart/cart.service";

@Controller("/users")
export class AuthController {
    constructor(
        private authService: AuthService,
        private cartService: CartService
    ) {}

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
            const cartId = await this.cartService.createCart(id);
            const token = this.authService.generateAccessToken(id, cartId);

            return res.status(201).send({ id, cartId, token });
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
            const cartId = await this.cartService.getCart(id);
            const token = this.authService.generateAccessToken(id, cartId);

            return res.status(200).send({ id, cartId, token });
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

import {Controller, Get, Post, Req, Res, UseGuards} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { Request, Response } from "express";
import { CreateUserDto } from "./dto/create-user.dto";
import { InvalidUsername, UserAlreadyExists, UserDoesNotExist } from "./auth.errors";
import {Roles} from "./roles-auth.decorator";
import {RolesGuard} from "./quards/roles.quard";
import {AssignRoleDto} from "./dto/assign-role.dto";

@Controller("/users")
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post("/register")
    async register(@Req() req: Request, @Res() res: Response) {

        const dto: CreateUserDto = req.body;

        try {
            const id = await this.authService.register(dto);
            const role = await this.authService.getRoleById(id)

            const token = this.authService.generateAccessToken(id, role);

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
            const role = await this.authService.getRoleById(id)
            const token = this.authService.generateAccessToken(id, role);

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

    @Roles("admin")
    @UseGuards(RolesGuard)
    @Get("/getUsers")
    async getUsers(@Res() res: Response) {
        const users = await this.authService.getUsers();
        return res.status(200).json(users);
    }

    @Roles("admin")
    @UseGuards(RolesGuard)
    @Post("/assignRole")
    async assignRole(@Req() req: Request, @Res() res: Response){

        const dto: AssignRoleDto = req.body
        try{
            const user = await this.authService.assignRole(dto)
            return res.status(200).json(user)
        } catch (e) {
            console.log(e)
            return res.status(400).send("bad request!!");
        }

    }
}

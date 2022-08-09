import { Request, Response } from "express";
import { Injectable, NestMiddleware, Req, Res } from "@nestjs/common";
import * as jwt from "jsonwebtoken";

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    async use(req: Request, res: Response, next: (error?: any) => void) {
        const header = req.headers?.authorization;
        if (!header) {
            return res.status(401).send("provide header!!");
        }

        const token = header.toString().split(" ")[1];

        try {
            const data: any = jwt.verify(token, process.env.SECRET);

            req.userData = {
                userId: data.id,
                cartId: data.cartId
            };

            next();
        } catch (e) {
            res.status(401).send("invalid token!!");
        }
    }
}

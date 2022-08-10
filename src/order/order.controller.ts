import { Controller, Post, Req, Res } from "@nestjs/common";
import { OrderService } from "./order.service";
import { Order } from "../entities/Order";
import { Request, Response } from "express";
import { SpamOrders } from "./order.errors";

@Controller("/order")
export class OrderController {
    constructor(private orderService: OrderService) {}

    @Post("/createOrder")
    async createOrder(@Req() req: Request, @Res() res: Response) {
        const dto = req.body;

        try {
            const order: Order = await this.orderService.createOrder(dto);
            return res.status(200).send({ order });
        } catch (e) {
            console.log(e);
            if (e instanceof SpamOrders) {
                return res.status(e.statusCode).send(e.message);
            }
            return res.status(400).send("error creating order!!");
        }
    }
}

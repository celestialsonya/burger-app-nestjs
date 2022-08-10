import { Body, Controller, Post, Req, Res } from "@nestjs/common";
import { OrderService } from "./order.service";
import { Order } from "../entities/Order";
import { Request, Response } from "express";
import { SpamOrders } from "./order.errors";
import { CreateOrderDto } from "./dto/create-order.dto";
import { User } from "../entities/User";
import { getCurrentData } from "../helpers/getCurrentData";
import { AuthRepository } from "../auth/auth.repository";
import { CreateOrderInputDto } from "./dto/create-order-input.dto";
import { ProductQuantity } from "../../types";
import { DeliveryDetails } from "../entities/DeliveryDetails";

@Controller("/order")
export class OrderController {
    constructor(private orderService: OrderService, private authRepository: AuthRepository) {}

    @Post("/createOrder")
    async createOrder(@Req() req: Request, @Res() res: Response, @Body() inp: CreateOrderInputDto) {
        try {
            const { cart, username, phone_number, delivery, delivery_details } = inp;

            // checking whether the user exists:
            const user: User = await this.authRepository.getByNumber(inp.phone_number);

            // from localStorage we get all products and put body =>
            // example cart = cart = [ {"product_id": 1, "quantity": 2}, {"product_id": 2, "quantity": 5} ]

            const cartProducts = inp.cart.map((p: any) => {
                return JSON.stringify(p);
            });

            // checking whether delivery is needed:

            let deliveryDetails = null;
            if (inp.delivery_details) {
                deliveryDetails = JSON.stringify(inp.delivery_details);
            }

            // getting current data:
            const data = getCurrentData();

            if (!user) {
                // create new user:
                const userId: number = await this.authRepository.register(inp);

                // calculate amount:
                const amount = await this.orderService.calculateAmount(cart);

                // getting current data:
                const data: string = getCurrentData();

                const dto: CreateOrderDto = {
                    username: inp.username,
                    phone_number: inp.phone_number,
                    delivery: inp.delivery,
                    userId: userId,
                    cartProducts: cartProducts,
                    amount: amount,
                    deliveryDetails: deliveryDetails,
                    data: data
                };

                // create order
                const order: Order = await this.orderService.createOrder(dto);

                return res.status(201).json(order);
            }

            if (user) {
                // getting userId and cartId:
                const userId = user.id;

                // checking the time interval between orders:

                const lastOrder = await this.orderService.getLastOrderById(userId);

                if (lastOrder) {
                    const lastData = lastOrder.data.slice(24, 29);
                    const nowData = data.slice(24, 29);

                    if (
                        parseInt(nowData.slice(0, 3)) === parseInt(lastData.slice(0, 3)) &&
                        parseInt(nowData.slice(3, 5)) < parseInt(lastData.slice(3, 5)) + 3
                    ) {
                        throw new SpamOrders();
                    }
                }

                // calculate amount:
                const amount = await this.orderService.calculateAmount(inp.cart);

                const dto: CreateOrderDto = {
                    username: inp.username,
                    phone_number: inp.phone_number,
                    delivery: inp.delivery,
                    userId: userId,
                    cartProducts: cartProducts,
                    amount: amount,
                    deliveryDetails: delivery_details,
                    data: data
                };

                // create order:
                const order: Order = await this.orderService.createOrder(dto);

                return res.status(201).json(order);
            }
        } catch (e) {
            console.log(e);
            if (e instanceof SpamOrders) {
                return res.status(e.statusCode).send(e.message);
            }
            return res.status(400).send("error creating order!!");
        }
    }
}

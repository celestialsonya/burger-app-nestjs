import { Body, Controller, Post, Req, Res } from "@nestjs/common";
import { OrderService } from "./order.service";
import { Order } from "../entities/Order";
import { Request, Response } from "express";
import { SpamOrders } from "./order.errors";
import { CreateOrderDto } from "./dto/create-order.dto";
import { User } from "../entities/User";
import { getCurrentDate} from "../helpers/getCurrentDate";
import { AuthRepository } from "../auth/auth.repository";
import { CreateOrderInputDto } from "./dto/create-order-input.dto";

@Controller("/order")
export class OrderController {
    constructor(private orderService: OrderService, private authRepository: AuthRepository) {}

    @Post("/createOrder")
    async createOrder(@Req() req: Request, @Res() res: Response, @Body() inp: CreateOrderInputDto) {
        try {
            const { cart, username, phone_number, delivery, delivery_details } = inp;

            // checking whether the user exists:
            const user: User = await this.authRepository.getByNumber(phone_number);

            // from localStorage we get all products and put body =>
            // example cart = cart = [ {"product_id": 1, "quantity": 2}, ...]
            const cartProducts = inp.cart.map((p: any) => {
                return JSON.stringify(p);
            });

            // calculate amount:
            const amount = await this.orderService.calculateAmount(cart);

            // check whether delivery is needed:
            let deliveryDetails = null;
            if (delivery_details) {
                deliveryDetails = JSON.stringify(inp.delivery_details);
            }

            // get current date:
            const date: string = getCurrentDate()

            let userId: number

            if (!user) {
                // create new user:
                userId = await this.authRepository.register(inp);
            }

            if (user) {
                // getting userId:
                userId = user.id;

                // checking the time interval between orders:
                const lastOrder = await this.orderService.getLastOrderById(userId);
                if (lastOrder) {
                    const lastData = lastOrder.data.slice(24, 29);
                    const nowData = date.slice(24, 29);

                    if (
                        parseInt(nowData.slice(0, 3)) === parseInt(lastData.slice(0, 3)) &&
                        parseInt(nowData.slice(3, 5)) < parseInt(lastData.slice(3, 5)) + 3
                    ) {
                        throw new SpamOrders();
                    }
                }

            }

            const dto: CreateOrderDto = {
                username,
                phone_number,
                delivery,
                userId,
                cartProducts,
                amount,
                deliveryDetails,
                date
            };

            // create order:
            const order: Order = await this.orderService.createOrder(dto);

            return res.status(201).json(order);

        } catch (e) {
            console.log(e);
            if (e instanceof SpamOrders) {
                return res.status(e.statusCode).send(e.message);
            }
            return res.status(400).send("error creating order!!");
        }
    }
}

import { Injectable } from "@nestjs/common";
import { OrderRepository } from "./order.repository";
import { CreateOrderDto } from "./dto/create-order.dto";
import { Order } from "../entities/Order";
import { DeliveryDetails } from "../entities/DeliveryDetails";
import { AuthRepository } from "../auth/auth.repository";
import { User } from "../entities/User";
import { CartRepository } from "../cart/cart.repository";
import { SpamOrders } from "./order.errors";
import { getCurrentData } from "../helpers/getCurrentData";
import { ProductQuantity } from "../../types";

@Injectable()
export class OrderService {
    constructor(private orderRepository: OrderRepository, private authRepository: AuthRepository, private cartRepository: CartRepository) {}

    async createOrder(dto: CreateOrderDto): Promise<Order> {
        const order: Order = await this.orderRepository.createOrder(dto);
        return order;
    }

    async calculateAmount(cart: ProductQuantity[]): Promise<number> {
        const countableProducts = await this.orderRepository.getCountableProducts(cart);

        // we get: [ { price: 210, quantity: 2 }, { price: 270, quantity: 5 } ]
        const amount = countableProducts.reduce((acc, curr) => {
            const sum = curr.price * curr.quantity;
            return acc + sum;
        }, 0);

        return amount;
    }

    async getLastOrderById(userId: number): Promise<Order> {
        return this.orderRepository.getLastOrderById(userId);
    }
}

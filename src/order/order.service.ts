import { Injectable } from "@nestjs/common";
import { OrderRepository } from "./order.repository";
import { CreateOrderDto } from "./dto/create-order.dto";
import { Order } from "../entities/Order";
import { DeliveryDetails } from "../entities/DeliveryDetails";
import { AuthRepository } from "../auth/auth.repository";
import { User } from "../entities/User";
import { CartRepository } from "../cart/cart.repository";
import { SpamOrders } from "./order.errors";
import { calculateAmount } from "../helpers/calculateAmount";
import { getCurrentData } from "../helpers/getCurrentData";

@Injectable()
export class OrderService {
    constructor(private orderRepository: OrderRepository, private authRepository: AuthRepository, private cartRepository: CartRepository) {}

    async createOrder(dto: CreateOrderDto): Promise<Order> {
        const { cart, username, phone_number, delivery } = dto;
        let delivery_details: DeliveryDetails = dto.delivery_details;

        // checking whether the user exists:
        const user: User = await this.authRepository.getByNumber(phone_number);

        // from localStorage we get all products and put body =>
        // example cart = cart = [ {"product_id": 1, "quantity": 2}, {"product_id": 2, "quantity": 5} ]

        const cartProducts = cart.map((p: any) => {
            return JSON.stringify(p);
        });

        // checking whether delivery is needed:

        let deliveryDetails = null;
        if (delivery) {
            deliveryDetails = JSON.stringify(delivery_details);
        }

        // getting current data:
        const data = getCurrentData();

        if (!user) {
            // create new user and cart:
            const userId: number = await this.authRepository.register(dto);
            const cartId: number = await this.cartRepository.createCart(userId);

            // added products by cart:
            await this.orderRepository.addedProductsByCart(dto, cartId);

            // calculate amount:
            const price = await this.orderRepository.calculateAmount(cartId);

            // we get: [ { price: 210, quantity: 2 }, { price: 270, quantity: 5 } ]
            const amount = calculateAmount(price);

            // getting current data:
            const data: string = getCurrentData();

            // create order:
            const order: Order = await this.orderRepository.createOrder(
                dto,
                user,
                cartId,
                userId,
                cartProducts,
                amount,
                delivery,
                deliveryDetails,
                data
            );

            // clearing cart_product tables:
            const clear = await this.cartRepository.clearCart(cartId);

            return order;
        }

        if (user) {
            // getting userId and cartId:
            const userId = user.id;
            const cartId = await this.cartRepository.getCart(userId);

            // checking the time interval between orders:

            const lastOrder = await this.orderRepository.getLastOrderById(userId);

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

            // added products by cart:
            await this.orderRepository.addedProductsByCart(dto, cartId);

            // calculate amount:
            const price = await this.orderRepository.calculateAmount(cartId);

            // we get: [ { price: 210, quantity: 2 }, { price: 270, quantity: 5 } ]
            const amount = calculateAmount(price);

            // create order:
            const order: Order = await this.orderRepository.createOrder(
                dto,
                user,
                cartId,
                userId,
                cartProducts,
                amount,
                delivery,
                deliveryDetails,
                data
            );

            // clearing cart_product tables:
            const clear = await this.cartRepository.clearCart(cartId);

            return order;
        }
    }
}

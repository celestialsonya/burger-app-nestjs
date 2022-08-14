import { Inject, Injectable } from "@nestjs/common";
import { pg_conn } from "../packages/database/db.module";
import { PoolClient } from "pg";
import { CreateOrderDto } from "./dto/create-order.dto";
import { User } from "../entities/User";
import { Order } from "../entities/Order";
import { CountableProduct, ProductQuantity } from "../../types";

@Injectable()
export class OrderRepository {
    constructor(@Inject(pg_conn) private db: PoolClient) {}

    async createOrder(dto: CreateOrderDto): Promise<Order> {
        // create order:
        const sqlCreateOrder = `insert into orders (user_id, cart, username,
                phone_number, amount, delivery, delivery_details, status, data) values ($1, $2, $3, 
                $4, $5, $6, $7, $8, $9) returning *`;

        const valuesCreateOrder = [
            dto.userId,
            dto.cartProducts,
            dto.username,
            dto.phone_number,
            dto.amount,
            dto.delivery,
            dto.deliveryDetails,
            "not confirmed",
            dto.date
        ];
        const orderData = await this.db.query(sqlCreateOrder, valuesCreateOrder);
        const order = orderData.rows[0];

        return order;
    }

    async getLastOrderById(userId: number): Promise<Order> {
        const sql = "select * from orders where user_id = $1";
        const values = [userId];
        const { rows } = await this.db.query(sql, values);
        const orders: Order = rows[rows.length - 1];

        return orders;
    }

    async getCountableProducts(cart: ProductQuantity[]): Promise<CountableProduct[]> {
        // we have: [{"product_id": 1, "quantity": 2}, {"product_id": 2, "quantity": 1}]

        return Promise.all(
            cart.map(async (p) => {
                const values = [p.product_id];
                const sql = "select price from product where id = $1";
                const { rows } = await this.db.query(sql, values);
                const price = rows[0].price;

                return { price: price, quantity: p.quantity };
            })
        );
    }
}

import { Module } from "@nestjs/common";
import { DbModule } from "../packages/database/db.module";
import { OrderController } from "./order.controller";
import { OrderService } from "./order.service";
import { OrderRepository } from "./order.repository";
import { AuthRepository } from "../auth/auth.repository";
import { CartRepository } from "../cart/cart.repository";

@Module({
    imports: [DbModule],
    controllers: [OrderController],
    providers: [OrderService, OrderRepository, AuthRepository, CartRepository]
})
export class OrderModule {}

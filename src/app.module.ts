import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { CartModule } from "./cart/cart.module";
import { ProductModule } from "./product/product.module";
import { OrderModule } from "./order/order.module";

@Module({
    imports: [AuthModule, CartModule, ProductModule, OrderModule],
    controllers: [],
    providers: []
})
export class AppModule {}

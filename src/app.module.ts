import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { CartModule } from "./cart/cart.module";
import { ProductModule } from "./product/product.module";

@Module({
    imports: [AuthModule, CartModule, ProductModule],
    controllers: [],
    providers: []
})
export class AppModule {}

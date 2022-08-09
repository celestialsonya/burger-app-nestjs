import { Module } from "@nestjs/common";
import { CartController } from "./cart.controller";
import { CartService } from "./cart.service";
import { CartRepository } from "./cart.repository";
import { DbModule } from "../packages/database/db.module";

@Module({
    imports: [DbModule],
    controllers: [CartController],
    providers: [CartService, CartRepository]
})
export class CartModule {}

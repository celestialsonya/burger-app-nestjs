import {
    MiddlewareConsumer,
    Module,
    NestModule,
    RequestMethod
} from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { AuthRepository } from "./auth.repository";
import { DbModule } from "../packages/database/db.module";
import { AuthMiddleware } from "./middleware/auth.middleware";
import { CartService } from "../cart/cart.service";
import { CartRepository } from "../cart/cart.repository";

@Module({
    imports: [DbModule],
    controllers: [AuthController],
    providers: [AuthService, AuthRepository, CartService, CartRepository]
})
export class AuthModule implements NestModule {
    public configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(AuthMiddleware)
            .exclude("users/register", "users/login")
            .forRoutes(AuthController);
    }
}

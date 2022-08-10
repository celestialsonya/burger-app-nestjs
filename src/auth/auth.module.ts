import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { AuthRepository } from "./auth.repository";
import { DbModule } from "../packages/database/db.module";
import { AuthMiddleware } from "./middleware/auth.middleware";

@Module({
    imports: [DbModule],
    controllers: [AuthController],
    providers: [AuthService, AuthRepository]
})
export class AuthModule implements NestModule {
    public configure(consumer: MiddlewareConsumer) {
        consumer.apply(AuthMiddleware).exclude("users/register", "users/login").forRoutes(AuthController);
    }
}

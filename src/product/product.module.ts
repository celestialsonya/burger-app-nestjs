import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { DbModule } from "../packages/database/db.module";
import { ProductController } from "./product.controller";
import { ProductService } from "./product.service";
import { ProductRepository } from "./product.repository";
import { AuthMiddleware } from "../auth/middleware/auth.middleware";

@Module({
    imports: [DbModule],
    controllers: [ProductController],
    providers: [ProductService, ProductRepository]
})
export class ProductModule implements NestModule {
    public configure(consumer: MiddlewareConsumer) {
        consumer.apply(AuthMiddleware).exclude("product/addNewProduct").forRoutes(ProductController);
    }
}

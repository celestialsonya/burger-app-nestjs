import { ProductRepository } from "./product.repository";
import { Injectable } from "@nestjs/common";
import { CreateProductDto } from "./dto/create-product.dto";
import { Product } from "../entities/Product";
import { CartProduct } from "../entities/CartProduct";
import { ProductNotFound } from "./product.errors";

@Injectable()
export class ProductService {
    constructor(private productRepository: ProductRepository) {}

    async addNewProduct(dto: CreateProductDto): Promise<Product> {
        return this.productRepository.addNewProduct(dto);
    }

    async addProductByCart(cartId: number, productId: number): Promise<CartProduct> {
        // checking whether the product exists:
        const product = await this.productRepository.getProductById(productId);
        if (!product) {
            throw new ProductNotFound();
        }

        return this.productRepository.addProductByCart(cartId, productId);
    }

    async deleteProductByCart(cartId: number, productId: number): Promise<CartProduct> {
        const ok = await this.productRepository.deleteProductByCart(cartId, productId);
        if (!ok) {
            throw new ProductNotFound();
        }

        return ok;
    }
}

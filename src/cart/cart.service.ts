import { Inject, Injectable } from "@nestjs/common";
import { CartRepository } from "./cart.repository";
import { CartProduct } from "../entities/CartProduct";
import { Product } from "../entities/Product";

@Injectable()
export class CartService {
    constructor(private cartRepository: CartRepository) {}

    async createCart(userId: number) {
        return this.cartRepository.createCart(userId);
    }

    async getCart(userId: number) {
        return this.cartRepository.getCart(userId);
    }

    async clearCart(cartId: number): Promise<CartProduct[]> {
        return this.cartRepository.clearCart(cartId);
    }

    async getProductsByCart(cartId: number): Promise<Product[]> {
        return this.cartRepository.getProductsByCart(cartId);
    }
}

import { Controller, Delete, Get, Post, Req, Res } from "@nestjs/common";
import { CartService } from "./cart.service";
import { Request, Response } from "express";

@Controller("/cart")
export class CartController {
    constructor(private cartService: CartService) {}

    @Post("/getCart")
    async getCart(@Req() req: Request, @Res() res: Response) {
        const { userId } = req.body;
        try {
            return await this.cartService.getCart(userId);
        } catch (e) {
            console.log(e);
            return res.status(404).send("Error getting cart!!");
        }
    }

    @Delete("/clearCart")
    async clearCart(@Req() req: Request, @Res() res: Response) {
        const { cartId } = req.userData;

        try {
            const deletedProductsId = await this.cartService.clearCart(cartId);
            return res.status(200).send({ deletedProductsId });
        } catch (e) {
            console.log(e);
            return res.status(404).send("Error clearing cart!!");
        }
    }

    @Get("/getProductsByCart")
    async getProductsByCart(@Req() req: Request, @Res() res: Response) {
        const { cartId } = req.userData;

        try {
            const products = await this.cartService.getProductsByCart(cartId);
            return res.status(200).send({ products });
        } catch (e) {
            console.log(e);
            return res.status(404).send("Error getting products!!");
        }
    }
}

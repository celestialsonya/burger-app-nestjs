import { Controller, Post, Req, Res } from "@nestjs/common";
import { ProductService } from "./product.service";
import { CreateProductDto } from "./dto/create-product.dto";
import { Request, Response } from "express";
import { ProductNotFound } from "./product.errors";

@Controller("/product")
export class ProductController {
    constructor(private productService: ProductService) {}

    @Post("/addNewProduct")
    async addNewProduct(@Req() req: Request, @Res() res: Response) {
        const dto: CreateProductDto = req.body;
        try {
            const product = await this.productService.addNewProduct(dto);
            return res.status(200).json(product);
        } catch (e) {
            console.log(e);
            return res.status(404).send("Error adding cart!!");
        }
    }

    @Post("/addProductByCart")
    async addProductByCart(@Req() req: Request, @Res() res: Response) {
        const { cartId } = req.userData;
        const { productId } = req.body;

        try {
            const product = await this.productService.addProductByCart(cartId, productId);
            res.status(200).json(product);
        } catch (e) {
            console.log(e);
            if (e instanceof ProductNotFound) {
                return res.status(e.statusCode).send(e.message);
            }

            return res.status(404).send("Error adding cart!!");
        }
    }

    @Post("/deleteProductByCart")
    async deleteProductByCart(@Req() req: Request, @Res() res: Response) {
        const { cartId } = req.userData;
        const { productId } = req.body;

        try {
            const deletedProduct = await this.productService.deleteProductByCart(cartId, productId);
            return res.status(200).json(deletedProduct);
        } catch (e) {
            console.log(e);
            if (e instanceof ProductNotFound) {
                return res.status(e.statusCode).send(e.message);
            }

            return res.status(404).send("Error deleting product!!");
        }
    }
}

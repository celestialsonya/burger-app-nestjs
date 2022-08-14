import { ProductRepository } from "./product.repository";
import { Injectable } from "@nestjs/common";
import { CreateProductDto } from "./dto/create-product.dto";
import { Product } from "../entities/Product";

@Injectable()
export class ProductService {
    constructor(private productRepository: ProductRepository) {}

    async addNewProduct(dto: CreateProductDto): Promise<Product> {
        return this.productRepository.addNewProduct(dto);
    }
}

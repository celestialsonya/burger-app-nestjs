import { Inject, Injectable } from "@nestjs/common";
import { pg_conn } from "../packages/database/db.module";
import { PoolClient } from "pg";
import { CreateProductDto } from "./dto/create-product.dto";
import { Product } from "../entities/Product";

@Injectable()
export class ProductRepository {
    constructor(@Inject(pg_conn) private db: PoolClient) {}

    async addNewProduct(body: CreateProductDto): Promise<Product> {
        const { name, description, price, category } = body;
        const sql = "insert into product (name, description, price, category) values ($1, $2, $3, $4) returning *";
        const values = [name, description, price, category];
        const { rows } = await this.db.query(sql, values);

        return rows[0];
    }
}

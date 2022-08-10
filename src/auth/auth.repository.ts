import { Inject, Injectable } from "@nestjs/common";
import { pg_conn } from "../packages/database/db.module";
import { PoolClient } from "pg";
import { User } from "../entities/User";
import { CreateUserDto } from "./dto/create-user.dto";

@Injectable()
export class AuthRepository {
    constructor(@Inject(pg_conn) private db: PoolClient) {}

    async register(dto: CreateUserDto): Promise<number> {
        // create auth and adding to database:
        const sql =
            "insert into users (username, phone_number) values ($1, $2) returning id";
        const values = [dto.username, dto.phone_number];

        const { rows } = await this.db.query(sql, values);
        const { id } = rows[0];

        return id;
    }

    async getByNumber(phoneNumber: string): Promise<User | null> {
        const sql = "select * from users where phone_number = $1";
        const values = [phoneNumber];
        const { rows } = await this.db.query(sql, values);

        if (rows.length > 0) {
            return rows[0];
        }

        return null;
    }

    async getUsers(): Promise<User[]> {
        const sql = "select * from users";
        const { rows } = await this.db.query(sql);

        return rows;
    }
}

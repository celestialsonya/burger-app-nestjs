import { Inject, Injectable } from "@nestjs/common";
import { pg_conn } from "../packages/database/db.module";
import { PoolClient } from "pg";
import { User } from "../entities/User";
import { CreateUserDto } from "./dto/create-user.dto";
import {Role} from "../../types";
import {AssignRoleDto} from "./dto/assign-role.dto";

@Injectable()
export class AuthRepository {
    constructor(@Inject(pg_conn) private db: PoolClient) {}

    async register(dto: CreateUserDto): Promise<number> {
        // create auth and adding to database:
        const sql =
            "insert into users (username, phone_number, role) values ($1, $2, $3) returning id";

        const values = [dto.username, dto.phone_number, Role.USER];

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

    async getRoleById(userId: number): Promise<Role>{
        const sql = "select role from users where id = $1"
        const values = [userId]
        const {rows} = await this.db.query(sql, values)

        return rows[0]
    }

    async assignRole(dto: AssignRoleDto): Promise<User>{

        const sql = "update users set role = $1 where id = $2 returning *"
        const values = [dto.role, dto.userId]
        const {rows} = await this.db.query(sql, values)

        return rows[0]
    }

}

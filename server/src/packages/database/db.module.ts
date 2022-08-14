import { GetConfig } from "../../config/config";
import { Module, Provider } from "@nestjs/common";
import { Pool } from "pg";

require("dotenv").config();

const config = GetConfig();
export const pg_conn = "eioeio";

export const dbProvider: Provider = {
    provide: pg_conn,
    useValue: new Pool({
        user: config.db.user,
        host: config.db.host,
        database: config.db.database,
        port: config.db.port,
        password: config.db.password
    }).connect()
};

@Module({
    imports: [],
    providers: [dbProvider],
    exports: [dbProvider, pg_conn]
})
export class DbModule {}

require("dotenv").config();

type AppConfig = {
    env: {
        port: number;
    };
    db: {
        user: string
        host: string
        database: string
        port: number
        password: string
    }
}

export function GetConfig(): AppConfig{

    const port = parseInt(process.env.APP_PORT)
    if (Number.isNaN(port)){
        throw new Error("Invalid app port")
    }

    const dbUser = process.env.DB_USER
    const dbHost = process.env.DB_HOST
    const dbName = process.env.DB_NAME
    const dbPort = parseInt(process.env.DB_PORT)
    const dbPassword = process.env.DB_PASSWORD

    return {
        env: {
            port: port
        },
        db: {
            user: dbUser,
            host: dbHost,
            database: dbName,
            port: dbPort,
            password: dbPassword
        }
    }
}

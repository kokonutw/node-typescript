import dotenv from 'dotenv'

dotenv.config({path: '.env'})

export const envs = {
    PORT: Number(process.env.PORT),
    MONGO_URL: String(process.env.MONGO_URL),
    MONGO_DB_NAME: String(process.env.MONGO_DB_NAME),
    SECRET_KEY: String(process.env.JWT_KEY)
}
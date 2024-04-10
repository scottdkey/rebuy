import { configDotenv } from "dotenv";
import { CookieOptions } from "express";
import { PoolConfig } from "pg";


configDotenv()

const { POSTGRES_PASSWORD, POSTGRES_USER, POSTGRES_DATABASE, POSTGRES_PORT, POSTGRES_HOST, SECRET_KEY, FRONTEND_URL } = process.env

interface IConfig {
  jwtKey: string
  postgres: PoolConfig
  cookieName: string
  cookieOptions: CookieOptions
  frontendUrl: string
}

export const config: IConfig = {
  frontendUrl: FRONTEND_URL || 'valueNotSetCorrectly',
  cookieName: "rebuy",
  jwtKey: SECRET_KEY || "",
  postgres: {
    host: POSTGRES_HOST,
    port: POSTGRES_PORT ? parseInt(POSTGRES_PORT) : undefined,
    database: POSTGRES_DATABASE,
    user: POSTGRES_USER,
    password: POSTGRES_PASSWORD
  },
  cookieOptions: {
    maxAge: 24 * 60 * 60 * 1000, // 1 day
    httpOnly: true,
    secure: true,
    sameSite: "none" // will be strict for production, not setup for this exercise
  },

}

import { config } from 'dotenv'

config()

export const {
  APP_PORT = 4000,
  NODE_ENV = 'development',
  DB_USER,
  DB_PASS
} = process.env

export const MONGO_URI = `mongodb+srv://${DB_USER}:${DB_PASS}@cluster0-yoe1c.mongodb.net/test?retryWrites=true&w=majority`

export const IN_PROD = NODE_ENV === 'production'

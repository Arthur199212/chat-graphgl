import dotenv from 'dotenv'

dotenv.config()

export const {
  APP_PORT = 4000,
  NODE_ENV = 'development',
  DB_USER,
  DB_PASS,
  SESS_NAME,
  SESS_SECRET,
  SESS_LIFETIME = 1000 * 60 * 60 * 2,
  REDIS_HOST,
  REDIS_PORT,
  REDIS_PASSWORD
} = process.env

export const MONGO_URI = `mongodb+srv://${DB_USER}:${DB_PASS}@cluster0-yoe1c.mongodb.net/test?retryWrites=true&w=majority`

export const IN_PROD = NODE_ENV === 'production'

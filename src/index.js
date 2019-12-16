import express from 'express'
import session from 'express-session'
import redis from 'redis'
import connectRedis from 'connect-redis'
import mongoose from 'mongoose'
import { ApolloServer } from 'apollo-server-express'
import typeDefs from './typeDef'
import resolvers from './resolvers'
import schemaDirectives from './directives'
import {
  APP_PORT, MONGO_URI, IN_PROD, SESS_NAME, SESS_SECRET, SESS_LIFETIME,
  REDIS_HOST, REDIS_PORT, REDIS_PASSWORD
} from './config'

// MongoDB
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('\x1b[36m%s\x1b[0m', 'DB Connected!'))
.catch(err => console.log('\x1b[31m%s\x1b[0m', `DB Connection Error: ${err.message}`))

const app = express()

app.disable('x-powered-by')

// Redis
const RedisStore = connectRedis(session)

const client = redis.createClient({
  host: REDIS_HOST,
  port: REDIS_PORT,
  password: REDIS_PASSWORD
})

const store = new RedisStore({ client })

client.on('connect', () => {   
  global.console.log('Redis connected!');
})

client.on('error', err => {       
  global.console.log(`Redis failed: ${err.message}`)
})

app.use(session({
  store,
  name: SESS_NAME,
  secret: SESS_SECRET,
  resave: true,
  rolling: true,
  saveUninitialized: false,
  cookie: {
    maxAge: parseInt(SESS_LIFETIME),
    sameSite: true,
    secure: IN_PROD
  }
}))

// Apollo GraphQL
const server = new ApolloServer({
  typeDefs,
  resolvers,
  schemaDirectives,
  playground: IN_PROD ? false : {
    settings: {
      'request.credentials': 'include'
    }
  },
  context: ({ req, res }) => ({ req, res })
})

server.applyMiddleware({ app, cors: false })

app.listen({ port: APP_PORT }, () =>
  console.log(`Server ready at http://localhost:${APP_PORT}${server.graphqlPath}`)
)

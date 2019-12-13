import express from 'express'
import { ApolloServer } from 'apollo-server-express'
import mongoose from 'mongoose'
import typeDefs from './typeDef'
import resolvers from './resolvers'
import { APP_PORT, MONGO_URI, IN_PROD } from './config'

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('\x1b[36m%s\x1b[0m', 'DB Connected!'))
.catch(err => console.log('\x1b[31m%s\x1b[0m', `DB Connection Error: ${err.message}`))

const app = express()

app.disable('x-powered-by')

const server = new ApolloServer({
  typeDefs,
  resolvers,
  playground: !IN_PROD
})

server.applyMiddleware({ app })

app.listen({ port: APP_PORT }, () =>
  console.log(`Server ready at http://localhost:${APP_PORT}${server.graphqlPath}`)
)

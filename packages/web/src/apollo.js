import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { createHttpLink } from 'apollo-link-http'
import { onError } from 'apollo-link-error'
import { ApolloLink } from 'apollo-link'

const { API_URL = '/graphql' } = process.env

const client = new ApolloClient({
  link: ApolloLink.from(
      [
        onError(({ graphQLErrors, networkError }) => {
          if (graphQLErrors) {
            graphQLErrors.map(({ message, locations, path }) =>
              console.log(
                `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
              )
            )
          }
          if (networkError) console.log(`[Network error]: ${networkError}`)
        }),
        createHttpLink({
          uri: API_URL
        })
      ]
  ),
  cache: new InMemoryCache()
})

export default client

import React from 'react'
import gql from 'graphql-tag'
import {
  HashRouter as Router,
  Switch,
  Route,
  Link
} from 'react-router-dom'
import { ApolloProvider, useQuery } from 'react-apollo-hooks'
import client from '../apollo'
import CssBaseline from '@material-ui/core/CssBaseline'

import AuthPage from './AuthPage'
import Layer from './Layer'

const GET_USERS = gql`
  {
    users {
      id
      email
      name
    }
  }
`

const Users = props => {
  const { data, error, loading } = useQuery(GET_USERS)

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error :-(</p>

  return (
    <ul>
      {data.users.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  )
}

const App = props => (
  <ApolloProvider client={client}>
    <Router>
      <Layer>
        <Switch>
          <Route exact path='/'>
            <Users />
          </Route>
          <Route path='/auth'>
            <AuthPage />
          </Route>
        </Switch>
      </Layer>
    </Router>
  </ApolloProvider>
)

export default App

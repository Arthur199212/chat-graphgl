import mongoose from 'mongoose'
import { UserInputError } from 'apollo-server-express'
import Joi from 'joi'
import { signUp, signIn } from '../schemas'
import { User } from '../models'
import * as Auth from '../auth'

export default {
  Query: {
    me: (parent, arg, { req }, info) => {
      // TODO projection

      Auth.checkSignedIn(req)

      return User.findById(req.session.userId)
    },
    users: (parent, arg, { req }, info) => {
      // TODO projection, pagination

      Auth.checkSignedIn(req)

      return User.find()
    },
    user: (parent, { id }, { req }, info) => {
      // TODO projection, sanitization

      Auth.checkSignedIn(req)

      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new UserInputError('Provided ID is not valid')
      }

      return User.findById(id)
    }
  },
  Mutation: {
    signUp: async (parent, arg, { req }, info) => {
      Auth.checkSignedOut(req)

      await Joi.validate(arg, signUp, { abortEarly: false })

      const user = await User.create(arg)

      req.session.userId = user.id

      return user
    },
    signIn: async (parent, arg, { req }, info) => {
      const { userId } = req.session

      if (userId) {
        return User.findById(userId)
      }

      await Joi.validate(arg, signIn, { abortEarly: false })

      const user = await Auth.attemptSignIn(arg.email, arg.password)

      req.session.userId = user.id
      
      return user
    },
    signOut: async (parent, arg, { req, res }, info) => {
      Auth.checkSignedIn(req)

      return Auth.signOut(req, res)
    }
  }
}

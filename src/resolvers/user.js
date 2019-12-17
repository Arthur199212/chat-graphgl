import mongoose from 'mongoose'
import { UserInputError } from 'apollo-server-express'
import Joi from 'joi'
import { signUp, signIn } from '../schemas'
import { User } from '../models'
import { attemptSignIn, signOut } from '../auth'

export default {
  Query: {
    me: (parent, args, { req }, info) => {
      // TODO projection

      return User.findById(req.session.userId)
    },
    users: (parent, args, contex, info) => {
      // TODO projection, pagination

      return User.find()
    },
    user: async (parent, args, { req }, info) => {
      // TODO projection, sanitization

      if (!mongoose.Types.ObjectId.isValid(args.id)) {
        throw new UserInputError('Provided ID is not valid Object ID')
      }

      return User.findById(args.id)
    }
  },
  Mutation: {
    signUp: async (parent, args, { req }, info) => {
      await Joi.validate(args, signUp, { abortEarly: false })

      const user = await User.create(args)

      req.session.userId = user.id

      return user
    },
    signIn: async (parent, args, { req }, info) => {
      await Joi.validate(args, signIn, { abortEarly: false })

      const user = await attemptSignIn(args.email, args.password)

      req.session.userId = user.id
      
      return user
    },
    signOut: async (parent, args, { req, res }, info) => signOut(req, res)
  },
  User: {
    chats: async (user, args, contex, info) => {
      return (await user.populate('chats').execPopulate()).chats
    }
  }
}

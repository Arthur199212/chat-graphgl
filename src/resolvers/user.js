import mongoose from 'mongoose'
import { UserInputError } from 'apollo-server-express'
import Joi from 'joi'
import { SignUp } from '../schemas' 
import { User } from '../models'

export default {
  Query: {
    users: (parent, arg, context, info) => {
      // TODO auth, projection, pagination
      console.log(User.find())
      return User.find()
    },
    user: (parent, { id }, context, info) => {
      // TODO auth, projection, sanitization

      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new UserInputError('Provided ID is not valid')
      }

      return User.findById(id)
    }
  },
  Mutation: {
    singUp: async (parent, arg, context, info) => {
      // TODO auth

      await Joi.validate(arg, SignUp, { abortEarly: false })

      return User.create(arg)
    }
  }
}

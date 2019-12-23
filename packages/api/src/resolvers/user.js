import { signUp, signIn, validId } from '../validators'
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

      return User.find().select('-__v')
    },
    user: async (parent, args, { req }, info) => {
      // TODO projection, sanitization

      await validId.validateAsync(args, { abortEarly: false })

      return User.findById(args.id)
    }
  },
  Mutation: {
    signUp: async (parent, args, { req }, info) => {
      await signUp.validateAsync(args, { abortEarly: false })

      const user = await User.create(args)

      req.session.userId = user.id

      return user
    },
    signIn: async (parent, args, { req }, info) => {
      await signIn.validate(args, { abortEarly: false })

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

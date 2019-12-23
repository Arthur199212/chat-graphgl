import { signUp, signIn, validId } from '../validators'
import { User } from '../models'
import { attemptSignIn, signOut } from '../auth'
import { fields } from '../utils'

export default {
  Query: {
    me: (parent, args, { req }, info) => {
      return User.findById(req.session.userId, fields(info)).exec()
    },
    users: (parent, args, contex, info) => {
      return User.find({}, fields(info)).exec()
    },
    user: async (parent, args, { req }, info) => {
      await validId.validateAsync(args, { abortEarly: false })

      return User.findById(args.id, fields(info))
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
    chats: async (user, args, { req }, info) => {
      return (await user.populate({
        path: 'chats',
        match: {
          users: {
            $in: req.session.userId
          }
        },
        select: fields(info)
      }).execPopulate()).chats
    }
  }
}

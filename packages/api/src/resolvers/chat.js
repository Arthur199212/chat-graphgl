import { UserInputError } from 'apollo-server-express'
import { startChat } from '../validators'
import { User, Chat, Message } from '../models'
import { fields } from '../utils'

export default {
  Mutation : {
    startChat: async (parent, args, { req }, info) => {
      const { userId } = req.session
      const { title, userIds } = args

      await startChat(userId).validate(args, { abortEarly: false })

      const idsFound = await User.where('_id').in(userIds).countDocuments()

      if (idsFound !== userIds.length) throw new UserInputError('One or more user IDs are invalid.')

      userIds.push(userId)

      // TODO should not be able to create a chat if already exists

      const chat = await Chat.create({ title, users: userIds })

      await User.updateMany({ _id: { '$in': userIds } }, {
        $push: {
          chats: chat
        }
      })

      return chat
    }
  },
  Chat: {
    messages: (chat, args, context, info) => {
      // TODO pagination

      return Message.find({ chat: chat.id }, fields(info)).exec()
    },
    users: async (chat, args, context, info) => {
      return (await chat.populate('users', fields(info)).execPopulate()).users
    },
    lastMessage: async (chat, args, context, info) => {
      return (await chat.populate('lastMessage', fields(info)).execPopulate()).lastMessage
    }
  }
}

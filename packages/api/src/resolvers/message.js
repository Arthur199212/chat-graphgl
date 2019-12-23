import { fields } from '../utils'
import { Chat, Message } from '../models'
import { sendMessage } from '../validators'

export default {
  Mutation: {
    sendMessage: async (parent, args, { req }, info) => {
      await sendMessage.validate(args, { abortEarly: false })

      const { userId } = req.session
      const { chatId, body } = args

      const chat = await Chat.findById(chatId).select('users')

      if (!chat) {
        throw new UserInputError('Chat was not found.')
      } else if (!chat.users.some(id => id.equals(userId))) {
        throw new ForbiddenError(
          'Cannot join the chat. Please ask for an invite.'
        )
      }

      const message = await Message.create({
        body,
        sender: userId,
        chat: chatId
      })

      chat.lastMessage = message
      await chat.save()

      return message
    }
  },
  Message: {
    sender: async (message, args, ctx, info) => {
      return (await message.populate('sender', fields(info)).execPopulate()).sender
    },
    chat: async (message, args, ctx, info) => {
      return (await message.populate('chat', fields(info)).execPopulate()).chat
    }
  }
}

import { fields } from '../utils'

export default {
  Message: {
    sender: async (message, args, ctx, info) => {
      return (await message.populate('sender', fields(info)).execPopulate()).sender
    }
  }
}

import { User } from '../models'

export default {
  Query: {
    users: (parent, args, ctx, info) => {
      return User.find({}).select('-__v')
    }
  }
}

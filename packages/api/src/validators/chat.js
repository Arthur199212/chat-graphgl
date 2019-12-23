import Joi from '@hapi/joi'
import objectId from 'joi-objectid'

Joi.objectId = objectId(Joi)

export const startChat = userId => Joi.object().keys({
  title: Joi.string()
    .min(6)
    .max(50)
    .label('Title'),
  userIds: Joi.array()
    .min(1)
    .max(100)
    .unique()
    .items(
      Joi.objectId(Joi).not(userId).label('User ID')
    )
    .label('User IDs')
})

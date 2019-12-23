import Joi from '@hapi/joi'
import objectId from 'joi-objectid'

Joi.objectId = objectId(Joi)

export const sendMessage = Joi.object().keys({
  chatId: Joi.objectId(Joi)
    .label('Chat ID'),
  body: Joi.string()
    .required()
    // TODO .max(xxx)
    .label('Body')
})

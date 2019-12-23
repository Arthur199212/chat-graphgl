import Joi from '@hapi/joi'
import objectId from 'joi-objectid'

Joi.objectId = objectId(Joi)

const email = Joi.string()
  .email()
  .required()
  .label('Email')

const username = Joi.string()
  .alphanum()
  .min(2)
  .max(30)
  .required()
  .label('Username')

const name = Joi.string()
  .max(254)
  .required()
  .label('Name')

const password = Joi.string()
  .min(8)
  .max(30)
  .regex(/^(?=\S*[a-z])(?=\S*[A-Z])(?=\S*\d).*$/)
  .messages({
    "string.pattern.base": `Password must have at least one upper case, one lower case, and one digit`,
    "string.min": `Password should have a minimum length of {#limit}`,
    "string.max": `Password should have a maximum length of {#limit}`
  })
  .label('Password')

export const signUp = Joi.object().keys({
  email,
  username,
  name,
  password
})

export const signIn = Joi.object().keys({
  email,
  password
})

export const validId = Joi.object().keys({
  id: Joi.objectId(Joi).label('User ID')
})

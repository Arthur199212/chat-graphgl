import Joi from 'joi'

const email = Joi.string().email().required().label('Email')

const username = Joi.string().alphanum().min(2).max(30).required().label('Username')

const name = Joi.string().max(254).required().label('Name')

const password = Joi.string().regex(/^(?=\S*[a-z])(?=\S*[A-Z])(?=\S*\d).*$/).label('Password').options({
  language: {
    string: {
      regex: {
        base: 'Must have at least one upper case, one lower case, and one digit.'
      }
    }
  }
})

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

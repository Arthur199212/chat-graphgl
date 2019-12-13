import Joi from 'joi'

export default Joi.object().keys({
  email: Joi.string().email().required().label('Email'),
  username: Joi.string().alphanum().min(4).max(30).required().label('Username'),
  name: Joi.string().max(254).required().label('Name'),
  password: Joi.string().regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,30}$/).label('Password').options({
    language: {
      string: {
        regex: {
          base: 'Must have at least one upper case, at least one lower case, at least one digit, at least one special character. Length must be min 8 and max 30 characters.'
        }
      }
    }
  }
  )
})

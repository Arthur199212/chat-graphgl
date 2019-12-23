import { SchemaDirectiveVisitor } from 'apollo-server-express'
import { defaultFieldResolver } from 'graphql'
import { ensureSignedOut } from '../auth'

class GuestDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition (field) {
    const { resolve = defaultFieldResolver } = field

    field.resolve = function (...arg) {
      const [ , , contex ] = arg

      ensureSignedOut(contex.req)

      return resolve.apply(this, arg)
    }
  }
}

export default GuestDirective

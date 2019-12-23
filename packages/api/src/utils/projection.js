import graphqlFields from 'graphql-fields'

export const fields = info => {
  const fields = graphqlFields(info, {}, { excludedFields: ['__typename'] })
  console.log('fields', fields)
  return Object.keys(fields).join(' ')
}

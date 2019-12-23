import graphqlFields from 'graphql-fields'

export const fields = info => {
  const fields = graphqlFields(info, {}, { excludedFields: ['__typename'] })
  return Object.keys(fields).join(' ')
}

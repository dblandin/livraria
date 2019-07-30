const { ApolloServer, gql } = require('apollo-server-micro')
const { buildFederatedSchema } = require('@apollo/federation')


const typeDefs = gql`
  type Query {
    hello: String
  }
`

const resolvers = {
  Query: {
    hello: (root, args, context) => {
      return "Hello world!"
    }
  }
}

const server = new ApolloServer({
  schema: buildFederatedSchema([{ typeDefs, resolvers }]),
  introspection: true,
  playground: true
})

module.exports = server.createHandler()

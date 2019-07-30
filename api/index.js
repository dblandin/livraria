const { ApolloServer, gql } = require('apollo-server-micro')
const { buildFederatedSchema } = require('@apollo/federation')
const github = require('@octokit/graphql')

const typeDefs = gql`
  type TodayILearnedPost {
    body: String
    url: String
  }

  type Query {
    hello: String
    TodayILearned: [TodayILearnedPost]
  }
`

async function fetchIssues() {
  const query = `{
    repository(owner:"dblandin", name:"til") {
      issues(last:3) {
        edges {
          node {
            bodyHTML
          }
        }
      }
    }
  }`

  const { repository } = await github(query, {
    headers: {
      authorization: `token ${process.env.GITHUB_API_TOKEN}`
    }
  })

  return repository.issues.edges
}

const resolvers = {
  Query: {
    hello: (root, args, context) => {
      return "Hello world!"
    },
    TodayILearned: (root, args, context) => {
      return fetchIssues()
    }
  }
}

const server = new ApolloServer({
  schema: buildFederatedSchema([{ typeDefs, resolvers }]),
  introspection: true,
  playground: true
})

module.exports = server.createHandler()

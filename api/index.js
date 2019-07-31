const { ApolloServer, gql } = require('apollo-server-micro')
const { buildFederatedSchema } = require('@apollo/federation')
const github = require('@octokit/graphql')

const typeDefs = gql`
  type Reference {
    name: String
    reference: String
  }

  type Interest {
    name: String
    keywords: [String]
  }

  type Language {
    language: String
    fluency: String
  }

  type Skill {
    name: String
    level: String
    keywords: [String]
  }

  type Publication {
    name: String
    publisher: String
    releaseDate: String
    website: String
    summary: String
  }

  type Award {
    title: String
    date: String
    awarder: String
    summary: String
  }

  type Education {
    institution: String
    area: String
    studyType: String
    startDate: String
    endDate: String
    gpa: String
    courses: [String]
  }

  type Volunteer {
    organization: String
    position: String
    website: String
    startDate: String
    endDate: String
    summary: String
    highlights: [String]
  }

  type Work {
    company: String
    position: String
    website: String
    startDate: String
    endDate: String
    summary: String
    highlights: [String]
  }

  type Profiles {
    network: String
    username: String
    url: String
  }

  type Location {
    address: String
    postalCode: String
    city: String
    countryCode: String
    region: String
  }

  type Basics {
    name: String
    label: String
    picture: String
    email: String
    phone: String
    website: String
    summary: String
    profiles: [Profiles]
    location: Location
  }

  type Resume {
    references: [Reference]
    interests: [Interest]
    languages: [Language]
    skills: [Skill]
    publications: [Publication]
    awards: [Award]
    education: [Education]
    volunteer: [Volunteer]
    work: [Work]
    basics: Basics
  }

  type TodayILearnedPost {
    body: String
    url: String
  }

  type Query {
    hello: String
    resume: Resume
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
    },
    resume: (root, args, context) => {
      const resume = require('./resume');
      return resume
    }
  }
}

const server = new ApolloServer({
  schema: buildFederatedSchema([{ typeDefs, resolvers }]),
  introspection: true,
  playground: true
})

module.exports = server.createHandler()

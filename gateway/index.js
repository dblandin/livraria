const { ApolloServer } = require('apollo-server');
const { ApolloGateway } = require("@apollo/gateway");

const gateway = new ApolloGateway({
  serviceList: [
    { name: 'livaria', url: 'https://livraria.dblandin.now.sh/graphql' },
  ],
});

const server = new ApolloServer({
  gateway,
  subscriptions: false,
  introspection: true,
  playground: true
});

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});

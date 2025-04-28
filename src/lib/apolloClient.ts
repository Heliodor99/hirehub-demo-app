import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

const client = new ApolloClient({
  link: new HttpLink({
    uri: 'https://fitting-lionfish-10.hasura.app/v1/graphql',
    headers: {
      'x-hasura-admin-secret': 'DiI3W1IbjXTPg0coBZ3onSlVh7FQl0AzvR7YmmYn84CPve02hhoWHSAYeAEpsBtr',
    },
  }),
  cache: new InMemoryCache(),
});

export default client; 
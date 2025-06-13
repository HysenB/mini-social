import { ApolloClient, InMemoryCache, split, HttpLink } from "@apollo/client";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { getMainDefinition } from "@apollo/client/utilities";
import { createClient } from "graphql-ws";

const httpLink = new HttpLink({
  uri: "http://localhost:4000/graphql",
});

const wsLink = new GraphQLWsLink(
  createClient({
    url: "ws://localhost:4000/graphql",
    connectionParams: {
      // Add any connection parameters here if needed
    },
    retryAttempts: 5,
  })
);

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  httpLink
);

export const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: "cache-and-network",
    },
  },
});

/**
 * 
 * 
 * import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";

const httpLink = createHttpLink({
  uri: "http://localhost:4000/graphql",
});

// Define custom cache policies
const cache = new InMemoryCache({
  typePolicies: {
    User: {
      // Merge function for User type
      merge: true,
      // Define which fields uniquely identify a User
      keyFields: ["id"],
      fields: {
        // Custom field policies
        posts: {
          // Merge arrays instead of replacing them
          merge(existing = [], incoming) {
            return [...existing, ...incoming];
          },
        },
      },
    },
    Post: {
      // Merge function for Post type
      merge: true,
      // Define which fields uniquely identify a Post
      keyFields: ["id"],
      fields: {
        // Custom field policies
        author: {
          // Always merge author data
          merge: true,
        },
      },
    },
    Query: {
      fields: {
        // Cache policy for the users query
        users: {
          // Merge arrays instead of replacing them
          merge(existing = [], incoming) {
            return [...existing, ...incoming];
          },
        },
        // Cache policy for the posts query
        posts: {
          // Merge arrays instead of replacing them
          merge(existing = [], incoming) {
            return [...existing, ...incoming];
          },
        },
      },
    },
  },
});

export const client = new ApolloClient({
  link: httpLink,
  cache,
  // Enable cache persistence
  defaultOptions: {
    watchQuery: {
      // How long to keep data in cache
      fetchPolicy: "cache-and-network",
      // How long to consider data fresh
      nextFetchPolicy: "cache-first",
    },
    query: {
      fetchPolicy: "cache-first",
      errorPolicy: "all",
    },
    mutate: {
      errorPolicy: "all",
    },
  },
});

 * 
 */

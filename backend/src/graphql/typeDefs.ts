export const typeDefs = `#graphql
  type User {
    id: ID!
    email: String!
    username: String!
    name: String
    bio: String
    posts: [Post!]!
    createdAt: String!
    updatedAt: String!
    postCount: Int!
    fullName: String
    recentPosts: [Post!]!
    postTitles: [String!]!
    postWithLongestTitle: Post
    postsByMonth: [PostsByMonth!]!
  }

  type Post {
    id: ID!
    title: String!
    content: String!
    published: Boolean!
    author: User!
    createdAt: String!
    updatedAt: String!
    excerpt: String!
    authorName: String!
    isRecent: Boolean!
    wordCount: Int!
    readingTime: Int!
    authorDetails: AuthorDetails!
  }

  type PostsByMonth {
    month: String!
    count: Int!
    posts: [Post!]!
  }

  type AuthorDetails {
    name: String!
    username: String!
    postCount: Int!
    isActive: Boolean!
  }

  type Query {
    users: [User!]!
    user(id: ID!): User
    posts: [Post!]!
    post(id: ID!): Post
  }

  type Mutation {
    createUser(
      email: String!
      username: String!
      password: String!
      name: String
      bio: String
    ): User!
    
    createPost(
      title: String!
      content: String!
      authorId: ID!
    ): Post!
    
    updatePost(
      id: ID!
      title: String
      content: String
      published: Boolean
    ): Post!
    
    deletePost(id: ID!): Post!
    
    deleteUser(id: ID!): User!
  }

  type Subscription {
    postCreated: Post!
  }
`;

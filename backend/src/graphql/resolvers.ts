import { PrismaClient } from "@prisma/client";
import { PubSub } from "graphql-subscriptions";

const prisma = new PrismaClient();
const pubsub = new PubSub();

export const resolvers = {
  // User type resolvers
  User: {
    // Basic field resolvers
    postCount: (parent: any) => {
      return parent.posts?.length || 0;
    },

    fullName: (parent: any) => {
      return parent.name
        ? `${parent.name} (${parent.username})`
        : parent.username;
    },

    // Nested resolvers for User
    postTitles: (parent: any) => {
      // Returns array of post titles
      return parent.posts?.map((post: any) => post.title) || [];
    },

    postWithLongestTitle: (parent: any) => {
      // Returns the post with the longest title
      if (!parent.posts?.length) return null;
      return parent.posts.reduce((longest: any, current: any) =>
        current.title.length > longest.title.length ? current : longest
      );
    },

    postsByMonth: (parent: any) => {
      // Groups posts by month
      const postsByMonth = parent.posts?.reduce((acc: any, post: any) => {
        const month = new Date(post.createdAt).toLocaleString("default", {
          month: "long",
        });
        if (!acc[month]) {
          acc[month] = {
            month,
            count: 0,
            posts: [],
          };
        }
        acc[month].count++;
        acc[month].posts.push(post);
        return acc;
      }, {});

      return Object.values(postsByMonth || {});
    },
  },

  // Post type resolvers
  Post: {
    // Basic field resolvers
    excerpt: (parent: any) => {
      return parent.content.substring(0, 100) + "...";
    },

    authorName: (parent: any) => {
      return parent.author?.name || parent.author?.username;
    },

    // Nested resolvers for Post
    wordCount: (parent: any) => {
      return parent.content.split(/\s+/).length;
    },

    readingTime: (parent: any) => {
      const words = parent.content.split(/\s+/).length;
      return Math.ceil(words / 200); // Assuming 200 words per minute reading speed
    },

    authorDetails: (parent: any) => {
      // Returns a new object with author details
      return {
        name: parent.author?.name || "",
        username: parent.author?.username,
        postCount: parent.author?.posts?.length || 0,
        isActive:
          parent.author?.posts?.some(
            (post: any) =>
              new Date(post.createdAt) >
              new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
          ) || false,
      };
    },
  },

  // Query resolvers
  Query: {
    users: async () => {
      return prisma.user.findMany({
        include: {
          posts: true,
        },
      });
    },
    user: async (_: any, { id }: { id: string }) => {
      return prisma.user.findUnique({
        where: { id },
        include: {
          posts: true,
        },
      });
    },
    posts: async () => {
      return prisma.post.findMany({
        include: {
          author: {
            include: {
              posts: true,
            },
          },
        },
      });
    },
    post: async (_: any, { id }: { id: string }) => {
      return prisma.post.findUnique({
        where: { id },
        include: {
          author: {
            include: {
              posts: true,
            },
          },
        },
      });
    },
  },

  // Mutation resolvers
  Mutation: {
    createUser: async (
      _: any,
      {
        email,
        username,
        password,
        name,
        bio,
      }: {
        email: string;
        username: string;
        password: string;
        name?: string;
        bio?: string;
      }
    ) => {
      return prisma.user.create({
        data: {
          email,
          username,
          password,
          name,
          bio,
        },
        include: {
          posts: true,
        },
      });
    },
    createPost: async (
      _: any,
      {
        title,
        content,
        authorId,
      }: {
        title: string;
        content: string;
        authorId: string;
      }
    ) => {
      const newPost = await prisma.post.create({
        data: {
          title,
          content,
          authorId,
        },
        include: {
          author: {
            include: {
              posts: true,
            },
          },
        },
      });

      // Publish the post creation event
      await pubsub.publish("POST_CREATED", { postCreated: newPost });

      return newPost;
    },
    updatePost: async (
      _: any,
      {
        id,
        title,
        content,
        published,
      }: {
        id: string;
        title?: string;
        content?: string;
        published?: boolean;
      }
    ) => {
      return prisma.post.update({
        where: { id },
        data: {
          title,
          content,
          published,
        },
        include: {
          author: {
            include: {
              posts: true,
            },
          },
        },
      });
    },
    deletePost: async (_: any, { id }: { id: string }) => {
      return prisma.post.delete({
        where: { id },
        include: {
          author: {
            include: {
              posts: true,
            },
          },
        },
      });
    },
    deleteUser: async (_: any, { id }: { id: string }) => {
      // First delete all posts by the user
      await prisma.post.deleteMany({
        where: { authorId: id },
      });

      // Then delete the user
      return prisma.user.delete({
        where: { id },
      });
    },
  },

  // Subscription resolvers
  Subscription: {
    postCreated: {
      subscribe: () => {
        const iterator = pubsub.asyncIterator(["POST_CREATED"]);
        return iterator;
      },
    },
  },
};

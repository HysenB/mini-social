import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Create dummy users
  const user1 = await prisma.user.create({
    data: {
      email: "user1@example.com",
      username: "user1",
      password: "password1",
      name: "User One",
      bio: "This is user one",
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: "user2@example.com",
      username: "user2",
      password: "password2",
      name: "User Two",
      bio: "This is user two",
    },
  });

  // Create dummy posts
  await prisma.post.create({
    data: {
      title: "First Post",
      content: "This is the first post by user one",
      authorId: user1.id,
      published: true,
    },
  });

  await prisma.post.create({
    data: {
      title: "Second Post",
      content: "This is the second post by user one",
      authorId: user1.id,
      published: true,
    },
  });

  await prisma.post.create({
    data: {
      title: "Third Post",
      content: "This is a post by user two",
      authorId: user2.id,
      published: true,
    },
  });

  console.log("Seed data created successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

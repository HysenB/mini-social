import { useQuery, useMutation, gql } from "@apollo/client";
import {
  Box,
  VStack,
  Heading,
  Text,
  Spinner,
  Button,
  HStack,
  useToast,
} from "@chakra-ui/react";
import { CreatePost } from "./CreatePost";
import { useEffect } from "react";

const GET_POSTS = gql`
  query GetPosts {
    posts {
      id
      title
      content
      readingTime
      author {
        name
        postCount
        fullName
      }
      createdAt
    }
  }
`;

const POST_SUBSCRIPTION = gql`
  subscription OnPostCreated {
    postCreated {
      id
      title
      content
      readingTime
      author {
        name
        postCount
        fullName
      }
      createdAt
    }
  }
`;

const DELETE_POST = gql`
  mutation DeletePost($id: ID!) {
    deletePost(id: $id) {
      id
    }
  }
`;

export function PostList() {
  const toast = useToast();
  const { loading, error, data, subscribeToMore } = useQuery(GET_POSTS);

  useEffect(() => {
    const unsubscribe = subscribeToMore({
      document: POST_SUBSCRIPTION,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        const newPost = subscriptionData.data.postCreated;

        // Show a toast notification
        toast({
          title: "New Post Created!",
          description: newPost.title,
          status: "success",
          duration: 3000,
          isClosable: true,
        });

        return {
          ...prev,
          posts: [newPost, ...prev.posts],
        };
      },
      onError: (error) => {
        console.error("Subscription error:", error);
        toast({
          title: "Subscription Error",
          description: "Failed to receive real-time updates",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      },
    });

    return () => unsubscribe();
  }, [subscribeToMore, toast]);

  const [deletePost] = useMutation(DELETE_POST, {
    refetchQueries: ["GetPosts"],
    onCompleted: () => {
      toast({
        title: "Post deleted successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    },
    onError: (error) => {
      toast({
        title: "Error deleting post",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    },
  });

  const handleDelete = async (postId: string) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await deletePost({
          variables: { id: postId },
        });
      } catch (error) {
        console.error("Error deleting post:", error);
      }
    }
  };

  if (loading) {
    return (
      <Box textAlign="center" py={8}>
        <Spinner size="xl" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={4} bg="red.100" color="red.700" borderRadius="md">
        Error loading posts: {error.message}
      </Box>
    );
  }

  return (
    <Box>
      <CreatePost />
      <VStack spacing={4} align="stretch">
        {data.posts.map((post: any) => (
          <Box
            key={post.id}
            p={5}
            shadow="md"
            borderWidth="1px"
            borderRadius="md"
          >
            <VStack align="stretch" spacing={3}>
              <Heading size="md">{post.title}</Heading>
              <Text>{post.content}</Text>
              <HStack justify="space-between">
                <Text fontSize="sm" color="gray.500">
                  By {post.author.name || post.author.fullName} •{" "}
                  {new Date(post.createdAt).toLocaleDateString()} •{" "}
                  {post.readingTime} min read
                </Text>
                <Button
                  size="sm"
                  colorScheme="red"
                  onClick={() => handleDelete(post.id)}
                >
                  Delete
                </Button>
              </HStack>
            </VStack>
          </Box>
        ))}
      </VStack>
    </Box>
  );
}

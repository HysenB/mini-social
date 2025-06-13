import { useState } from "react";
import { useMutation, useQuery, gql } from "@apollo/client";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  VStack,
  useToast,
  Select,
  Spinner,
} from "@chakra-ui/react";

const CREATE_POST = gql`
  mutation CreatePost($title: String!, $content: String!, $authorId: ID!) {
    createPost(title: $title, content: $content, authorId: $authorId) {
      id
      title
      content
      author {
        name
      }
      createdAt
    }
  }
`;

const GET_USERS = gql`
  query GetUsers {
    users {
      id
      name
      username
    }
  }
`;

export function CreatePost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [authorId, setAuthorId] = useState("");
  const toast = useToast();

  const {
    loading: usersLoading,
    error: usersError,
    data: usersData,
  } = useQuery(GET_USERS);

  const [createPost, { loading: createLoading }] = useMutation(CREATE_POST, {
    refetchQueries: ["GetPosts", "GetUsers"],
    onCompleted: () => {
      setTitle("");
      setContent("");
      setAuthorId("");
      toast({
        title: "Post created!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    },
    onError: (error) => {
      toast({
        title: "Error creating post",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorId) {
      toast({
        title: "Error creating post",
        description: "Please select an author",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    createPost({
      variables: {
        title,
        content,
        authorId,
      },
    });
  };

  if (usersLoading) {
    return (
      <Box textAlign="center" py={8}>
        <Spinner size="xl" />
      </Box>
    );
  }

  if (usersError) {
    return (
      <Box p={4} bg="red.100" color="red.700" borderRadius="md">
        Error loading users: {usersError.message}
      </Box>
    );
  }

  return (
    <Box
      as="form"
      onSubmit={handleSubmit}
      p={5}
      shadow="md"
      borderWidth="1px"
      borderRadius="md"
      mb={4}
    >
      <VStack spacing={4}>
        <FormControl isRequired>
          <FormLabel>Author</FormLabel>
          <Select
            placeholder="Select author"
            value={authorId}
            onChange={(e) => setAuthorId(e.target.value)}
          >
            {usersData.users.map((user: any) => (
              <option key={user.id} value={user.id}>
                {user.name || user.username}
              </option>
            ))}
          </Select>
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Title</FormLabel>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What's on your mind?"
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Content</FormLabel>
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your post content here..."
            rows={4}
          />
        </FormControl>

        <Button
          type="submit"
          colorScheme="blue"
          isLoading={createLoading}
          loadingText="Creating..."
          width="full"
        >
          Post
        </Button>
      </VStack>
    </Box>
  );
}

import { useState } from "react";
import { useMutation, gql } from "@apollo/client";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  useToast,
} from "@chakra-ui/react";

const CREATE_USER = gql`
  mutation CreateUser(
    $username: String!
    $name: String!
    $email: String!
    $password: String!
  ) {
    createUser(
      username: $username
      name: $name
      email: $email
      password: $password
    ) {
      id
      name
      email
      username
    }
  }
`;

const GET_USERS = gql`
  query GetUsers {
    users {
      id
      name
      email
      postCount
      createdAt
    }
  }
`;

export function CreateUser() {
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const toast = useToast();

  const [createUser, { loading }] = useMutation(CREATE_USER, {
    onCompleted: (data) => {
      console.log("createuser", data);
      toast({
        title: "User created successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setUsername("");
      setName("");
      setEmail("");
      setPassword("");
    },
    onError: (error) => {
      toast({
        title: "Error creating user",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    },
    refetchQueries: ["GetUsers"],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createUser({
      variables: {
        username,
        name,
        email,
        password,
      },
    });
  };

  return (
    <Box p={5} shadow="md" borderWidth="1px" borderRadius="md">
      <form onSubmit={handleSubmit}>
        <VStack spacing={4} align="stretch">
          <FormControl isRequired>
            <FormLabel>Username</FormLabel>
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Name</FormLabel>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
          </FormControl>

          <Button
            type="submit"
            colorScheme="blue"
            isLoading={loading}
            loadingText="Creating..."
          >
            Create Account
          </Button>
        </VStack>
      </form>
    </Box>
  );
}

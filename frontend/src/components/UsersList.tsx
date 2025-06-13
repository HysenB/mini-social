import { useQuery, useMutation, gql } from "@apollo/client";
import {
  Box,
  Spinner,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  useToast,
} from "@chakra-ui/react";

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

const DELETE_USER = gql`
  mutation DeleteUser($id: ID!) {
    deleteUser(id: $id) {
      id
    }
  }
`;

export function UsersList() {
  const toast = useToast();
  const { loading, error, data } = useQuery(GET_USERS);

  const [deleteUser] = useMutation(DELETE_USER, {
    refetchQueries: ["GetUsers", "GetPosts"],
    onCompleted: () => {
      toast({
        title: "User deleted successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    },
    onError: (error) => {
      toast({
        title: "Error deleting user",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    },
  });

  const handleDelete = async (userId: string) => {
    if (
      window.confirm(
        "Are you sure you want to delete this user? This will also delete all their posts."
      )
    ) {
      try {
        await deleteUser({
          variables: { id: userId },
        });
      } catch (error) {
        console.error("Error deleting user:", error);
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
        Error loading users: {error.message}
      </Box>
    );
  }

  return (
    <Box overflowX="auto">
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Email</Th>
            <Th>Posts</Th>
            <Th>Joined</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {data.users.map((user: any) => (
            <Tr key={user.id}>
              <Td>{user.name}</Td>
              <Td>{user.email}</Td>
              <Td>{user.postCount}</Td>
              <Td>{new Date(parseInt(user.createdAt)).toLocaleDateString()}</Td>
              <Td>
                <Button
                  colorScheme="red"
                  size="sm"
                  onClick={() => handleDelete(user.id)}
                >
                  Delete
                </Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
}

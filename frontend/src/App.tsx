import { ChakraProvider } from "@chakra-ui/react";
import { ApolloProvider } from "@apollo/client";
import { client } from "./lib/apollo";
import {
  Box,
  Container,
  Heading,
  Text,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Center,
  Flex,
} from "@chakra-ui/react";
import { PostList } from "./components/PostList";
import { CreateUser } from "./components/CreateUser";
import { UsersList } from "./components/UsersList";
import theme from "./theme";

function App() {
  return (
    <ApolloProvider client={client}>
      <ChakraProvider theme={theme}>
        <Box
          minH="100vh"
          bg="gray.50"
          alignItems="center"
          justifyContent="center"
        >
          <Flex minH="100vh">
            <Box w="full" minW="container.xl" p={8}>
              <Box textAlign="center" mb={8}>
                <Heading as="h1" size="2xl" mb={4}>
                  Mini Social
                </Heading>
                <Text fontSize="xl" color="gray.600">
                  A GraphQL-powered social platform
                </Text>
              </Box>

              <Tabs isFitted variant="enclosed">
                <TabList mb="1em">
                  <Tab>Posts</Tab>
                  <Tab>Users</Tab>
                  <Tab>Create Account</Tab>
                </TabList>
                <TabPanels>
                  <TabPanel>
                    <PostList />
                  </TabPanel>
                  <TabPanel>
                    <UsersList />
                  </TabPanel>
                  <TabPanel>
                    <CreateUser />
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </Box>
          </Flex>
        </Box>
      </ChakraProvider>
    </ApolloProvider>
  );
}

export default App;

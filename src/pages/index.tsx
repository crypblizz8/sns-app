import type { NextPage } from "next";
import { useState } from "react";
import {
  Box,
  Button,
  Center,
  Container,
  Flex,
  Heading,
  Input,
  Spacer,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import Navbar from "~/components/Navbar";
import RegisterModal from "~/components/RegisterModal";
import EditModal from "~/components/EditModal";
import { decodeNameAsFelt, encodeNameAsFelt, hashName } from 'src/utils/felts';
import { useSNSContract } from '~/hooks/sns';
import { useStarknetCall, useStarknetInvoke } from '@starknet-react/core';

const Home: NextPage = () => {
  const {
    isOpen: registerOpen,
    onOpen: registerOnOpen,
    onClose: registerOnClose,
  } = useDisclosure();
  const {
    isOpen: editOpen,
    onOpen: editOnOpen,
    onClose: editOnClose,
  } = useDisclosure();

  const [search, setSearch] = useState("")
  const [result, setResult] = useState("")
  
  const {contract} = useSNSContract()

  const {invoke, reset, ...status} = useStarknetInvoke({ contract, method: "sns_register" })

  const handleSearch = () => {
    console.log("search:")
    console.log(search)
    const encodedName = encodeNameAsFelt(search)
    console.log("encoded search:")
    console.log(encodedName)
    (async () => {
      // @ts-ignore
      const res = await invoke({args: {name: encodedName}})
      setResult(JSON.stringify(res));
    })()
  }

  console.log(status)

  return (
    <>
      <RegisterModal
        isOpen={registerOpen}
        onClose={registerOnClose}
        address="afe"
      />
      <EditModal
        isOpen={editOpen}
        onClose={editOnClose}
        domain="caelin.stark"
      />
      <Navbar />
      <Container textAlign="center" maxW={800}>
        <Heading color="white">Starknet Name Service</Heading>
        <Text my={4} color="white">
          Enter any valid address
        </Text>
        <Box maxW={400} mx="auto">
          <Input color="black" onChange={(e) => setSearch(e.target.value)} size="lg" placeholder="test.stark" mt={4} bg="white" />
        </Box>

        <Button colorScheme="orange" size="lg" mt={4} mx="auto" onClick={() => handleSearch()}>
          Search
        </Button>
        <Flex
          w="100%"
          bg="white"
          borderRadius={10}
          mt={4}
          px={4}
          py={2}
          textAlign="left"
          background="rgba(255, 255, 255, 0.85)"
          backdropFilter="blur(20px)"
        >
          <Box>
            <Text fontSize="md" color="gray.400">
              Domain
            </Text>
            <Text fontSize="xl" fontWeight="bold" mt={4}>
              caelin.eth
            </Text>
          </Box>
          <Box ml={4}>
            <Text fontSize="md" color="gray.400">
              Address
            </Text>
            <Text fontSize="xl" fontWeight="bold" mt={4}>
              0xAF...FE
            </Text>
          </Box>
          <Spacer />
          <Box>
            <Text fontSize="md" color="gray.400">
              Status
            </Text>
            <Button
              colorScheme="orange"
              size="lg"
              mt={2}
              onClick={registerOnOpen}
            >
              Register
            </Button>
            <Button colorScheme="red" isDisabled size="lg" mt={2}>
              Registered for 8 Days
            </Button>
            <Button colorScheme="orange" size="lg" mt={2} onClick={editOnOpen}>
              Edit
            </Button>
          </Box>
        </Flex>
      </Container>
    </>
  );
};

export default Home;

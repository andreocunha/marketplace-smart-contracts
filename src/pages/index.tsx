import { useRouter } from 'next/router'

import {
  Container,
  Flex,
  Card,
  Image,
  Text
} from '@chakra-ui/react'
import { Header } from './components/Header'

export default function Home() {
  const router = useRouter()

  return (
    <Container maxW="full" margin={0} padding={0}>
      <Header />
      <Flex
        align="center"
        justify="center"
        wrap="wrap"
        marginTop="3rem"
      >
        {/* Produtos */}
        {Array.from({ length: 8 }, (_, i) => (
          <Card
            key={i}
            p="1rem"
            borderWidth="1px"
            rounded="lg"
            boxShadow="md"
            maxW="sm"
            overflow="hidden"
            margin="1rem"
            onClick={() => router.push('/product/[id]', `/product/${i}`)}
          >
            <Image src="https://via.placeholder.com/200" alt="Produto" />
            <Text fontWeight="medium" marginTop="0.5rem">
              Título do Produto
            </Text>
            <Text color="gray.600" marginTop="0.5rem">
              Descrição do Produto
            </Text>
            <Text fontWeight="medium" color="teal.500" marginTop="0.5rem">
              R$50,00
            </Text>
          </Card>
        ))}
      </Flex>
    </Container>
  )
}
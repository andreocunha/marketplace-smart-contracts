import {
  Container,
  Button,
  Flex
} from '@chakra-ui/react'
import { useRouter } from 'next/router'

export default function Home() {
  const router = useRouter();

  return (
    <Container display="flex" alignItems="center" justifyContent="center"  maxW="full" height="100vh" margin={0} padding={0} style={{
      backgroundImage: `url(/images/background.jpg)`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }}>
      <Flex display="flex" flexDirection="column" align="center" justify="flex-start" width="250px" height="550px">
      <h1 className='text-4xl text-yellow-500 font-bold text-center mb-5'>
      ChainMarket
      </h1>
      <h3 className='text-md text-white font-bold text-justify mb-8'>
      Bem-vindo ao ChainMarket - o marketplace de segurança e tecnologia. Com a blockchain, oferecemos compras e vendas seguras e eficientes. Junte-se a nós para experimentar a revolução da tecnologia.
      </h3>
      <Button colorScheme="yellow" size="lg" marginTop="1rem" paddingRight="2rem" paddingLeft="2rem"
      onClick={() => router.push('/products')}
      >
        Veja os produtos
      </Button>
      </Flex>
    </Container>
  )
}
import { useRouter } from 'next/router'

import {
  Container,
  Flex,
  Card,
  Image,
  Text
} from '@chakra-ui/react'
import { Header } from './components/Header'
import { MetaMaskContext } from '@/context/MetaMaskContext';
import { useContext, useEffect, useState } from 'react';
import { getMetaMaskInfo, isMetaMaskConnected } from './services/metamask';

export default function Home() {
  const router = useRouter()
  const [products, setProducts] = useState<any>([]);

  const { 
    contractInstance,
    setConnectedAddress,
    setContractInstance
  } = useContext(MetaMaskContext);

  useEffect(() => {
    async function verifyMetaMask() {
      const status = await isMetaMaskConnected();
      if (status) {
        const result = await getMetaMaskInfo();
        console.log(result);
        setConnectedAddress(result.account);
        setContractInstance(result.contract);
      }
    }
    verifyMetaMask();
  }, [])

  useEffect(() => {
    if (contractInstance) {
      console.log(contractInstance);
      contractInstance.getAllProducts().then((allProducts: any) => {
        // console.log(products);
        allProducts.forEach((productAddress: any) => {
          contractInstance.getProduct(productAddress).then((product: any) => {
            // console.log(product);
            // verify if product is not in the array
            if (!products.find((p: any) => p.id === product.id)) {
              setProducts([...products, {
                name: product[0],
                description: product[1],
                price: product[2],
                image: product[3],
                seller_address: product[4],
                buyer_address: product[5],
                status: product[6],
                address: productAddress
              }]);
            }
          })
        })
      })
    }
  }, [contractInstance])

  return (
    <Container maxW="full" margin={0} padding={0}>
      <Header />
      <Flex
        align="center"
        justify="center"
        wrap="wrap"
        marginTop="3rem"
      >
        {console.log(products)}
        {/* Produtos */}
        {products.map((product: any, i: number) => (
          <Card
            key={i}
            p="1rem"
            borderWidth="1px"
            rounded="lg"
            boxShadow="md"
            maxW="sm"
            overflow="hidden"
            margin="1rem"
            onClick={() => router.push('/product/[id]', `/product/${product.address}`)}
          >
            <Image src={product.image} alt={product.name} />
            <Text fontWeight="medium" marginTop="0.5rem">
              {product.name}
            </Text>
            <Text color="gray.600" marginTop="0.5rem">
              {product.description}
            </Text>
            <Text fontWeight="medium" color="teal.500" marginTop="0.5rem">
              R$ {product.price}
            </Text>
          </Card>
        ))}
      </Flex>
    </Container>
  )
}
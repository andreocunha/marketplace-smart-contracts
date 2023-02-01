import {
  Container,
  Flex,
  Card,
  Image,
  Text
} from '@chakra-ui/react'
import { Header } from '../components/Header'
import { useEffect, useState } from 'react';
import { getMetaMaskInfo, isMetaMaskConnected } from '../services/metamask';
import { BigNumber } from 'ethers';

export default function Products() {
  const [products, setProducts] = useState<any>([]);
  const [contractInstance, setContractInstance] = useState<any>(null);

  useEffect(() => {
    async function verifyMetaMask() {
      const status = await isMetaMaskConnected();
      if (status) {
        const result = await getMetaMaskInfo();
        console.log(result);
        setContractInstance(result.contract);
      }
    }
    verifyMetaMask();
  }, [])

  useEffect(() => {
    if (contractInstance) {
      console.log(contractInstance);
      contractInstance.getProductAddresses().then((allProducts: any) => {
        console.log(allProducts);
        allProducts.forEach((productAddress: any) => {
          contractInstance.getProduct(productAddress).then((product: any) => {
            console.log(product);
            setProducts((prev: any) => {
              let exists = prev.find((p: { address: any; }) => p.address === productAddress);
              if (!exists) {
                return [...prev, {
                  name: product[0],
                  description: product[1],
                  price: BigNumber.from(product[2]).toString(),
                  image: product[3],
                  seller_address: product[4],
                  buyer_address: product[5],
                  status: product[6],
                  address: productAddress
                }]
              }
              return prev;
            })
          })
        })
      }).catch((error: any) => {
        console.log(error?.message);
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

        {products.length === 0 && (
          <Text>Nenhum produto encontrado</Text>
        )}

        {/* Produtos */}
        {products?.map((product: any, i: number) => (
          <a href={`/product/${product.address}`} key={i} target="_blank" rel="noreferrer">
          <Card
            p="1rem"
            borderWidth="1px"
            rounded="lg"
            boxShadow="md"
            maxW="sm"
            overflow="hidden"
            margin="1rem"
            cursor="pointer"
            width="400px"
            height="400px"
          >
            <Image src={product.image} alt={product.name} width="350px" height="250px" />
            <Text fontWeight="medium" marginTop="0.5rem">
              {product.name}
            </Text>
            <Text color="gray.600" marginTop="0.5rem">
              {product.description}
            </Text>
            <Text fontWeight="medium" color="teal.500" marginTop="0.5rem">
              {product.price} Goerli
            </Text>
          </Card>
          </a>
        ))}
      </Flex>
    </Container>
  )
}
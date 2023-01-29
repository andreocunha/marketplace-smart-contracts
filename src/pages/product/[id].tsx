import React, { useEffect, useState } from 'react';
import { Box, Heading, Image, Text, Button, Container, Flex } from '@chakra-ui/react';
import { getMetaMaskInfo } from '../services/metamask';

export default function Product({ id }: any) {
  const [product, setProduct] = useState<any>(null);
  useEffect(() => {
    async function getProduct() {
      const result = await getMetaMaskInfo();
      const contract = result.contract;
      contract.getProduct(id).then((product: any) => {
        setProduct({
          name: product[0],
          description: product[1],
          price: product[2],
          image: product[3],
          seller_address: product[4],
          buyer_address: product[5],
          status: product[6],
          address: id
        });
      })
    }
    getProduct();
  }, [])

  if (!product) {
    return (
      <Box p={8}>
        <Text>Carregando...</Text>
      </Box>
    )
  }

  return (
    <Container maxW="container.full" height="100vh" backgroundColor="gray.300">
      <Flex align="center" justify="center" maxW="container.full" height="100vh">
        <Box p={8} backgroundColor="white" borderRadius="md" boxShadow="md" align="center" justify="center">
          <Heading>{product.name}</Heading>
          <Image src={product.image} alt={product.name} />
          <Text>Descrição: {product.description}</Text>
          <Text>Preço: {product.price}</Text>
          <Text>Vendedor: {product.seller_address}</Text>
          <Button color="green" m={4}>Comprar</Button>
        </Box>
      </Flex>
    </Container>
  )
}

export const getServerSideProps = async (context: { query: { id: any; }; }) => {
  const id = context.query.id;

  return {
    props: {
      id
    }
  }
}
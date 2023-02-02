import React, { useEffect, useState } from 'react';
import { Box, Heading, Image, Text, Button, Container, Flex } from '@chakra-ui/react';
import { getContractProductFactoryInstance, getContractProductInstance, getMetaMaskAccount, getProductInfoByAddress } from '../../services/metamask';
import { emitAlert } from '@/utils/alerts';
import { useRouter } from 'next/router';

export default function Product({ id }: any) {
  const [product, setProduct] = useState<any>(null);
  const [buyerAddress, setBuyerAddress] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const router = useRouter();

  async function sellProduct() {
    setIsLoading(true);

    const productInstance = await getContractProductInstance(id)
    await productInstance.functions.buyProduct(buyerAddress, {value: String(product.price)})
     .then((result: any) => {
        emitAlert({
          title: 'Aguarde a confirmação da transação...',
          icon: 'info',
        })
        productInstance.on('Paid', (result: any) => {
          emitAlert({
            title: 'Produto comprado com sucesso!',
            icon: 'success',
          })
          setIsLoading(false);
          window.location.reload();
        })
      })
      .catch((error: any) => {
        console.log('ERRO: ', error);
        emitAlert({
          title: 'Compra não realizada!',
          icon: 'error',
        })
        setIsLoading(false);
      })
  }

  async function deleteProduct() {
    setIsDeleting(true);
    const productFactory = await getContractProductFactoryInstance();
    await productFactory.functions.deleteProduct(id)
      .then((result: any) => {
        emitAlert({
          title: 'Aguarde a confirmação da exclusão...',
          icon: 'info',
        })
        productFactory.on('Deleted', (result: any) => {
          console.log('Deletado! ',result)
          emitAlert({
            title: 'Produto deletado com sucesso!',
            icon: 'success',
          })
          setIsDeleting(false);
          router.push('/products');
        })
      })
      .catch((error: any) => {
        console.log('ERRO: ', error);
        emitAlert({
          title: 'Exclusão não realizada!',
          icon: 'error',
        })
        setIsDeleting(false);
      })
  }

    

  useEffect(() => {
    async function getProduct() {
      const productLoad = await getProductInfoByAddress(id);
      setProduct(productLoad);
      const buyer = await getMetaMaskAccount();
      setBuyerAddress(buyer);
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
    <Container maxW="container.full" height="100%" minHeight="100vh" backgroundColor="gray.300">
      <Flex align="center" justify="center" maxW="container.full" height="100vh">
        <Flex p={8} direction="column" backgroundColor="white" borderRadius="md" boxShadow="md" align="center" justify="center">
          <Heading>{product.name}</Heading>
          <Image src={product.imageUrl} alt={product.name} width="350px" />
          <Text>Descrição: {product.description}</Text>
          <Text fontWeight="bold">
            Preço: {product.price} Wei = {Number(product.price) / 10**18} GöETH
          </Text>
          <Text>Vendedor: {product.seller_address}</Text>
          {product.isSold && <Text>Comprador: {product.buyer_address}</Text>}
          <Flex direction="row">
            {product.isSold ? 
              <Text color="red.500" fontWeight="bold">Produto vendido!</Text> : 
              <Button color="green" m={4} onClick={sellProduct} isLoading={isLoading} disabled={isDeleting}>
                Comprar
              </Button>
            }
            {/* // if (buyerAddress === product.seller_address) allow delete product */}
            { (buyerAddress === product.seller_address && !product.isSold) && !product.isSold && (
              <Button color="red" m={4} onClick={() => deleteProduct()} isLoading={isDeleting} disabled={isLoading}>
                Deletar
              </Button>
            )}
          </Flex>
        </Flex>
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
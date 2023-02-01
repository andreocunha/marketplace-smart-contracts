import React, { useEffect, useState } from 'react';
import { Box, Heading, Image, Text, Button, Container, Flex } from '@chakra-ui/react';
import { getMetaMaskInfo } from '../../services/metamask';
import { BigNumber, Contract, providers } from 'ethers'
import { Product_Contract_ABI } from '../../config/productKeys';
import { emitAlert } from '@/utils/alerts';

export default function Product({ id }: any) {
  const [contractInstance, setContractInstance] = useState<any>(null);
  const [buyerAddress, setBuyerAddress] = useState<any>(null);
  const [product, setProduct] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  async function sellProduct() {
    setIsLoading(true);

    const provider = new providers.Web3Provider(window?.ethereum, "goerli");
    const signer = provider.getSigner(buyerAddress);
    console.log(signer);

    const productInstance = new Contract(id, Product_Contract_ABI, signer);
    console.log(productInstance);
    await productInstance.functions.buyProduct(buyerAddress, {value: String(product.price)})
     .then((result: any) => {
        console.log(result);
        emitAlert({
          title: 'Aguarde a confirmação da transação...',
          icon: 'info',
        })
        productInstance.on('Paid', (result: any) => {
          console.log('Comprado! ',result)
          emitAlert({
            title: 'Produto comprado com sucesso!',
            icon: 'success',
          })
          setIsLoading(false);
        })
      })
      .catch((error: any) => {
        console.log('ERROOO: ', error);
        emitAlert({
          title: error?.error?.message,
          icon: 'error',
        })
        setIsLoading(false);
      })
  }
    

  useEffect(() => {
    async function getProduct() {
      const result = await getMetaMaskInfo();
      const contract = result.contract;
      setContractInstance(contract);
      setBuyerAddress(result.account);
      contract.getProduct(id).then((product: any) => {
        console.log(product);
        setProduct({
          name: product[0],
          description: product[1],
          price: BigNumber.from(product[2]).toString(),
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
        <Flex p={8} direction="column" backgroundColor="white" borderRadius="md" boxShadow="md" align="center" justify="center">
          <Heading>{product.name}</Heading>
          <Image src={product.image} alt={product.name} width="350px" />
          <Text>Descrição: {product.description}</Text>
          <Text>Preço: {product.price}</Text>
          <Text>Vendedor: {product.seller_address}</Text>
          <Button color="green" m={4} onClick={sellProduct} isLoading={isLoading}>
            Comprar
          </Button>
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
import React, { useEffect, useState } from 'react';
import { Box, Heading, Image, Text, Button, Container, Flex } from '@chakra-ui/react';
import { getMetaMaskInfo, getMetaMaskProductContract } from '../services/metamask';
import { BigNumber, Contract, providers, Wallet } from 'ethers'
import { Product_Contract_Factory_ABI, Product_Contract_Factory_Address } from '../config/productFactoryKeys'
import { Product_Contract_ABI } from '../config/productKeys';

export default function Product({ id }: any) {
  const [contractInstance, setContractInstance] = useState<any>(null);
  const [buyerAddress, setBuyerAddress] = useState<any>(null);
  const [product, setProduct] = useState<any>(null);

  async function sellProduct() {
    // console.log(contractInstance)

    const provider = new providers.Web3Provider(window?.ethereum, "goerli");
    const signer = provider.getSigner(buyerAddress);
    console.log(signer);

    const product = new Contract(id, Product_Contract_ABI, signer);
    console.log(product);
    const tx = await product.functions.buyProduct(buyerAddress, {value: String(1)});
    await tx.wait();

    // const value = (1000);

    // const amount = BigNumber.from(value);
    // console.log(amount);

    // const gasLimit = 200000;
    // const result = await contractInstance.buy(id, {
    //   gasLimit
    // });


    // const contract = await getMetaMaskProductContract(buyerAddress);
    // console.log(contract);

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
          <Image src={product.image} alt={product.name} />
          <Text>Descrição: {product.description}</Text>
          <Text>Preço: {product.price}</Text>
          <Text>Vendedor: {product.seller_address}</Text>
          <Button color="green" m={4} onClick={sellProduct}>
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
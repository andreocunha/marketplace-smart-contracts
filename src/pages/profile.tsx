import { useRouter } from 'next/router'
import {
  Container,
  Flex,
  Heading,
  Image,
  Box,
  List,
  ListItem,
} from '@chakra-ui/react'
import { useEffect, useState, Key } from 'react'
import { ProductProps } from '@/interfaces/product'
import { getContractProductFactoryInstance, getProductInfoByAddress, isMetaMaskConnected } from '@/services/metamask'
import { BigNumber } from 'ethers'
import { MiniCardProduct } from '@/components/MiniCardProduct'

export default function Bought() {
  const router = useRouter()
  const [productsCreated, setProductsCreated] = useState<ProductProps[]>([])
  const [productsBought, setProductsBought] = useState<ProductProps[]>([])

  async function getProductsInfo(prodCreated: any, prodBought: any) {
    const productsCreated = await Promise.all(prodCreated.map(async (product: any) => {
      return product ? await getProductInfoByAddress(product) : null;
    }))

    const productsBought = await Promise.all(prodBought.map(async (product: any) => {
      return product ? await getProductInfoByAddress(product) : null;
    }))
    setProductsCreated(productsCreated)
    setProductsBought(productsBought)
  }

  useEffect(() => {
    async function verifyMetaMask() {
      const status = await isMetaMaskConnected()
      if (status) {
        const contract = await getContractProductFactoryInstance();
        const address = await contract.signer.getAddress();
        const productsCreated = await contract.functions.getProductsBySeller(address);
        const productsBought = await contract.functions.getProductsByBuyer(address);
        getProductsInfo(productsCreated[0], productsBought[0]);
      }
      else {
        router.push('/')
      }
    }
    verifyMetaMask()
  }, [])

  return (
    <Container
      maxW="container.full"
      height="100vh"
      backgroundColor="#fff"
      padding="2rem"
      display="flex"
      flexDirection="column"
    >
      <Box display="flex" flexDirection="column" height="100%" width="100%" textAlign="center" alignItems="center" justifyContent="flex-start" gap={10}>
        <Heading>Produtos criados por você</Heading>
        <List styleType="none" maxWidth={600}>
        {productsCreated?.map((product: ProductProps, index: Key | null | undefined) => (
          <MiniCardProduct key={index} product={product} />
        ))}
        </List>
      </Box>

      <Box display="flex" flexDirection="column" height="100%" width="100%" textAlign="center" alignItems="center" justifyContent="flex-start" gap={10}>
        <Heading>Produtos comprados</Heading>
        <List styleType="none" maxWidth={600}>
        {productsBought?.map((product: ProductProps, index: Key | null | undefined) => (
          <MiniCardProduct key={index} product={product} />
        ))}
        </List>
      </Box>
    </Container>
  )
}
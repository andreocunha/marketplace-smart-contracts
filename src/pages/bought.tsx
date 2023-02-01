import { useRouter } from 'next/router'
import {
  Container,
  Flex,
  Heading,
  Input,
  Textarea,
  Button,
  FormControl,
  FormLabel,
  Image,
  FormHelperText,
  Box,
  List,
  ListItem,
  ListIcon,
  Icon,
} from '@chakra-ui/react'
import { JSXElementConstructor, Key, ReactElement, ReactFragment, ReactPortal, useEffect, useState } from 'react'
import { ProductProps } from '@/interfaces/product'
import { getMetaMaskInfo, isMetaMaskConnected } from '@/services/metamask'
import { Contract } from 'ethers'
import { Product_Contract_ABI, Product_Contract_Address } from '@/config/productKeys'

export default function Bought() {
  const router = useRouter()
  const [products, setProducts] = useState<any>([
    {
      name: 'Laptop',
      description: 'Dell laptop with 8GB RAM and 256GB storage',
      price: '$799.99',
      imageUrl: 'https://via.placeholder.com/100x100',
    },
    {
      name: 'Tablet',
      description: 'iPad with 10.5-inch display and 128GB storage',
      price: '$499.99',
      imageUrl: 'https://via.placeholder.com/100x100',
    },
    {
      name: 'Smartphone',
      description: 'iPhone 11 with 64GB storage and 6.1-inch display',
      price: '$699.99',
      imageUrl: 'https://via.placeholder.com/100x100',
    },
  ])

  useEffect(() => {
    // verificando se o usuário está logado se não volta para a pagina principal
    async function verifyMetaMask() {
      const status = await isMetaMaskConnected();
      if (!status) {
        router.push('/')
      }
      else {
        const result = await getMetaMaskInfo();
        const productInstance = new Contract('0xaC7C041365d793BC722044fCcC9b9bb535636860', Product_Contract_ABI, result.contract.signer);
        console.log(productInstance);
        const products = await productInstance.functions.getUserBoughtProducts(result.account);
        console.log(products);
        // console.log(result.contract);
        // setContractInstance(result.contract);
        // setSellerAddress(result.account);
      }
    }
    verifyMetaMask();
  },[])

  return (
    <Container
      maxW="container.full"
      height="100vh"
      backgroundColor="#fff"
      padding="0"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Box display="flex" flexDirection="column" height="100%" width="100%" textAlign="center" alignItems="center" justifyContent="center" gap={10}>
        <Heading>Produtos comprados</Heading>
        <List styleType="none" maxWidth={600}>
        {products.map((product: ProductProps, index: Key | null | undefined) => (
          <ListItem key={index}>
            <Flex
              alignItems="center"
              backgroundColor="gray.600"
              padding="1rem"
              borderRadius="5px"
              boxShadow="0px 4px 8px rgba(0, 0, 0, 0.1)"
              marginBottom={5}
            >
              <Image src={product.imageUrl} height={100}/>
              <Box ml={2}>
                <Heading size="sm" color="#fff">
                  {product.name}
                </Heading>
                <p style={{ color: "#fff" }}>{product.description}</p>
                <p style={{ color: "#fff" }}>{product.price}</p>
              </Box>
            </Flex>
          </ListItem>
        ))}
        </List>
      </Box>
    </Container>
  )
}
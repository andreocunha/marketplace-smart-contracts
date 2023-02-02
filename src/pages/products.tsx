import {
  Container,
  Flex,
  Card,
  Image,
  Text
} from '@chakra-ui/react'
import { Header } from '../components/Header'
import { useEffect, useState } from 'react';
import { getContractProductFactoryInstance, getProductInfoByAddress, isMetaMaskConnected, loginMetaMask } from '../services/metamask';
import { CardProduct } from '@/components/CardProduct';

export default function Products() {
  const [products, setProducts] = useState<any>([]);
  const [filteredProducts, setFilteredProducts] = useState<any>([]);
  const [contractInstance, setContractInstance] = useState<any>(null);

  useEffect(() => {
    async function verifyMetaMask() {
      const status = await isMetaMaskConnected();
      if (status) {
        const result = await getContractProductFactoryInstance();
        setContractInstance(result);
      }
      else {
        loginMetaMask();
      }
    }
    verifyMetaMask();
  }, [])

  useEffect(() => {
    if (contractInstance) {
      contractInstance.getProductAddresses().then((allProducts: any) => {
        allProducts.forEach((productAddress: any) => {
          contractInstance.getProduct(productAddress).then(async(product: any) => {
            const newProduct = await getProductInfoByAddress(productAddress);
            setProducts((prev: any) => {
              let exists = prev.find((p: { address: any; }) => p.address === productAddress);
              if (!exists) {
                return [...prev, newProduct]
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
  
  useEffect(() => {
    setFilteredProducts(products);
  },[products])

  return (
    <Container color="#fff" maxW="full" height="100%" minHeight="100vh" margin={0} padding={0} backgroundImage="linear-gradient(to bottom, #1D2833, #1F4F59, #1E2D37)"
    >
      <Header 
        setFilteredProducts={setFilteredProducts}
        products={products}
        isLogged={contractInstance !== null}
      />
      <Flex
        align="center"
        justify="center"
        wrap="wrap"
      >

        {products.length === 0 && (
          <Image src="/images/empty.gif" alt="Nenhum produto encontrado" width="400px" alignSelf="center" position="absolute" top="30vh" />
        )}

        {filteredProducts?.map((product: any, i: number) => (
          <a href={`/product/${product.address}`} key={i} target="_blank" rel="noreferrer">
            <CardProduct product={product} />
          </a>
        ))}
      </Flex>
    </Container>
  )
}
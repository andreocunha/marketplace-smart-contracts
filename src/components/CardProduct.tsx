import {
  Container,
  Flex,
  Card,
  Image,
  Text
} from '@chakra-ui/react'
import { ProductProps } from '../interfaces/product'

export function CardProduct({ product }: { product: ProductProps }) {
  return (
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
      height="430px"
      shadow="md"
      transition="all 0.3s cubic-bezier(.25,.8,.25,1)"
      _hover={{
        transform: "translateY(-5px)",
      }}
      // cor opaca filter="brightness(0.8)"
      filter={product.isSold ? "brightness(0.5)" : "none"}
    >
      <Image 
        src={product.imageUrl} 
        alt={product.name} 
        width="350px" 
        height="250px" 
        backgroundColor="gray.400"
      />
      <Text fontWeight="medium" marginTop="0.5rem">
        {product.name}
      </Text>
      <Text color="gray.600" marginTop="0.5rem">
        {product.description}
      </Text>
      <Text fontWeight="medium" color="teal.500" marginTop="0.5rem">
        {product.price} Wei = {Number(product.price) / 10**18} GöETH
      </Text>
      {
        product.isSold ?
          <Text color="red.500" fontWeight="bold" marginTop="0.5rem">
            Produto vendido!
          </Text> :
          <Text color="green.500" fontWeight="bold" marginTop="0.5rem">
            Produto disponível!
          </Text>
      }
    </Card>
  )
}
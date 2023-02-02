import {
  Container,
  Flex,
  Heading,
  Image,
  Box,
  List,
  ListItem,
} from '@chakra-ui/react'

export function MiniCardProduct({ product }: any) {
  return (
    <ListItem>
      <Flex
        alignItems="center"
        backgroundColor="gray.600"
        padding="1rem"
        borderRadius="5px"
        boxShadow="0px 4px 8px rgba(0, 0, 0, 0.1)"
        marginBottom={5}
      >
        <Image src={product.imageUrl} height={100} />
        <Box ml={2}>
          <Heading size="sm" color="#fff">
            {product.name}
          </Heading>
          <p style={{ color: "#fff" }}>{product.description}</p>
          <p style={{ color: "#fff" }}>{product.price}</p>
        </Box>
      </Flex>
    </ListItem>
  )

}
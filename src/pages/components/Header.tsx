import {
  Flex,
  Heading,
  Input,
  Button,
  IconButton,
} from '@chakra-ui/react'
import { useState } from 'react'
import { useRouter } from 'next/router'
import { ChatIcon } from '@chakra-ui/icons'

export function Header(){
  const [search, setSearch] = useState('')
  const router = useRouter()

  const handleSearch = (e: any) => {
    e.preventDefault()
    router.push({
      pathname: '/search',
      query: { q: search }
    })
  }
  return (
    <Flex
        as="nav"
        align="center"
        justify="space-between"
        wrap="wrap"
        padding="1.5rem"
        bg="teal.500"
        color="white"
      >
        <Flex align="center" mr={5}>
          <Heading as="h1" size="lg" letterSpacing={'-.1rem'}>
            Marketplace
          </Heading>
        </Flex>

        <Flex align="center" mr={5}>
          <Input
            type="search"
            placeholder="Pesquisar produtos"
            onChange={e => setSearch(e.target.value)}
            value={search}
            _focus={{
              bg: "white",
              color: "black"
            }}
          />
          <Button
            type="submit"
            onClick={handleSearch}
            // variantColor="teal"
            marginLeft="1rem"
          >
            Procurar
          </Button>
        </Flex>

        <Flex align="center">
          <IconButton
            aria-label="Carrinho de compras"
            icon={<ChatIcon />}
            color="white"
            variant="outline"
            onClick={() => router.push('/cart')}
            marginRight="1rem"
          />
          <Button
            variant="outline"
            onClick={() => router.push('/login')}
          >
            Entrar
          </Button>
        </Flex>
      </Flex>
  )
}
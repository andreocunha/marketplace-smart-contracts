import {
  Flex,
  Heading,
  Input,
  Button,
  IconButton,
} from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { PlusSquareIcon } from '@chakra-ui/icons'
import { loginMetaMask } from '../services/metamask'
import { ProductProps } from '../interfaces/product'

interface HeaderProps {
  products?: ProductProps[];
  setFilteredProducts: React.Dispatch<React.SetStateAction<ProductProps[]>>;
  isLogged?: boolean;
}

export function Header({ products, setFilteredProducts, isLogged }: HeaderProps) {
  const [search, setSearch] = useState('')
  const router = useRouter()

  useEffect(() => {
    if (products) {
      const filtered = products.filter(product => {
        return product.name.toLowerCase().includes(search.toLowerCase())
      })
      setFilteredProducts(filtered)
    }
  }, [search])
  
  if(!isLogged) return null;

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
      <Flex align="center">
        <Heading as="h1" size="lg" letterSpacing={'-.1rem'} cursor="pointer" onClick={() => router.push('/')}>
          ChainMarket
        </Heading>
      </Flex>

      <Flex align="center">
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
      </Flex>

      <Flex align="center">
        <Button
          variant="outline"
          onClick={() => router.push('/newProduct')}
          marginRight="1rem"
          gap={2}
        >
          Cadastrar produto 
          <PlusSquareIcon height="1.2rem" width="1.2rem" />
        </Button>
        <Button
          variant="outline"
          onClick={() => router.push('/profile')}
        >
          Perfil
        </Button>
      </Flex>
    </Flex>
  )
}
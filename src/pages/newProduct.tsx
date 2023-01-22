import Head from 'next/head'
import { useState } from 'react'
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
  useToast
} from '@chakra-ui/react'

export default function NewProduct(){
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [image, setImage] = useState(null)
  const [imageUrl, setImageUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const toast = useToast()
  const router = useRouter()

  const handleSubmit = async e => {
    e.preventDefault()
    setIsLoading(true)

    // Faz o upload da imagem para o servidor
    const data = new FormData()
    data.append('file', image!)
    data.append('upload_preset', 'marketplace')
    data.append('cloud_name', 'your_cloud_name')
    let res = await fetch(
      'https://api.cloudinary.com/v1_1/your_cloud_name/image/upload',
      {
        method: 'POST',
        body: data
      }
    )
    const imageUrl = await res.json()

    // Envia os dados do produto para o backend
    res = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        description,
        price: parseFloat(price),
        imageUrl: imageUrl.secure_url
      })
    })

    if (res.ok) {
      toast({
        title: "Produto criado com sucesso!",
        status: "success",
        duration: 3000,
        isClosable: true,
      })
      router.push('/')
    } else {
      const error = await res.json()
      toast({
        title: "Erro ao criar o produto.",
        description: error.message,
        status: "error",
        duration: 9000,
        isClosable: true,
      })
    }

    setIsLoading(false)
  }

  return (
    <Container>
      <Head>
        <title>Criar Produto</title>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/tailwindcss/dist/tailwind.min.css"></link>
      </Head>
      <Flex
        align="center"
        justify="center"
        direction="column"
        padding="1.5rem"
        marginTop="3rem"
      >
        <Heading as="h1" size="lg" marginBottom="1rem">
          Criar Produto
       
          </Heading>
    <form onSubmit={handleSubmit}>
      <FormControl marginBottom="1rem">
        <FormLabel>Nome</FormLabel>
        <Input
          type="text"
          placeholder="Nome do produto"
          value={name}
          onChange={e => setName(e.target.value)}
        />
      </FormControl>
      <FormControl marginBottom="1rem">
        <FormLabel>Descrição</FormLabel>
        <Textarea
          placeholder="Descrição do produto"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
      </FormControl>
      <FormControl marginBottom="1rem">
        <FormLabel>Preço</FormLabel>
        <Input
          type="number"
          placeholder="Preço do produto"
          value={price}
          onChange={e => setPrice(e.target.value)}
        />
      </FormControl>
      <FormControl marginBottom="1rem">
        <FormLabel>Imagem</FormLabel>
        <Input
          type="file"
          onChange={e => setImage(e.target.files[0])}
        />
        {imageUrl && <Image src={imageUrl} alt="Preview" marginTop="1rem" />}
        <FormHelperText>Tamanho máximo: 2mb</FormHelperText>
      </FormControl>
      <Button
        type="submit"
        isLoading={isLoading}
        // variantColor="teal"
        variant="outline"
        marginTop="1rem"
      >
        Criar Produto
      </Button>
    </form>
  </Flex>
</Container>
  )
}
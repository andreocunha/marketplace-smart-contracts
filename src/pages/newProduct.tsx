import Head from 'next/head'
import { useEffect, useState } from 'react'
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
} from '@chakra-ui/react'
import { createClient } from '@supabase/supabase-js';
import { getMetaMaskInfo, isMetaMaskConnected, listenToEvent } from './services/metamask';

// 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

// 8jf45SKsR60f0r79 (senha supabase)

const supabase = createClient(
  'https://bqcbdsdhihlzxgaswdgy.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJxY2Jkc2RoaWhsenhnYXN3ZGd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzQ3NDI3NDYsImV4cCI6MTk5MDMxODc0Nn0.dGr53CXasqZ3wRtOwTYKIquPp1-A0AQVtO5NTPDBWjE'
);


export default function NewProduct() {
  const [image, setImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [contractInstance, setContractInstance] = useState<any>(null);
  const [sellerAddress, setSellerAddress] = useState<any>(null);
  const router = useRouter()

  useEffect(() => {
    // verificando se o usuário está logado se não volta para a pagina principal
    async function verifyMetaMask() {
      const status = await isMetaMaskConnected();
      if (!status) {
        router.push('/')
      }
      else {
        const result = await getMetaMaskInfo();
        console.log(result.contract);
        setContractInstance(result.contract);
        setSellerAddress(result.account);
      }
    }
    verifyMetaMask();
  },[])

  async function uploadImage(){
    if(!image) return
    // fazendo upload da imagem para o supabase
    setIsLoading(true)
    const { data, error } = await supabase.storage
      .from('images')
      .upload(`image-${Date.now()}.jpg`, image, {
        cacheControl: '3600',
        upsert: false
      })
    setIsLoading(false)
    if(error) {
      console.log(error)
      return
    }
    if(data) {
      const url = `https://bqcbdsdhihlzxgaswdgy.supabase.co/storage/v1/object/public/images/${data?.path}`
      console.log(url)
      return url
    }
    return 'https://via.placeholder.com/200'
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append('name', e.target[0].value)
    formData.append('description', e.target[1].value)
    formData.append('price', e.target[2].value)
    const url = await uploadImage() || 'https://via.placeholder.com/200'
    formData.append('image', url)
    
    setIsLoading(true)
    // fazendo a chamada para o smart contract para criar o produto
    const result = await contractInstance?.createProductContract(
      formData.get('name') as string,
      formData.get('description') as string,
      formData.get('price') as string,
      formData.get('image') as string,
      sellerAddress
    )
    console.log(result)
    
    contractInstance.on('ProductCreated', (result: any) => {
      console.log(result)
      setIsLoading(false)
      router.push('/')
    })
    
  }

  return (
    // o container deve ocupar a tela toda e alinhar o conteúdo ao centro
    <Container 
      maxW="container.full" 
      height="100vh" 
      backgroundColor="#333232" 
      padding="0"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Head>
        <title>Criar Produto</title>
      </Head>
      <Flex
        align="center"
        justify="center"
        direction="column"
        padding="1.5rem"
        width="500px"
        borderRadius="0.5rem"
        backgroundColor="#fff"
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
              required
            />
          </FormControl>
          <FormControl marginBottom="1rem">
            <FormLabel>Descrição</FormLabel>
            <Textarea
              placeholder="Descrição do produto"
              required
            />
          </FormControl>
          <FormControl marginBottom="1rem">
            <FormLabel>Preço</FormLabel>
            <Input
              type="number"
              placeholder="Preço do produto"
              min="0"
              required
            />
          </FormControl>
          <FormControl marginBottom="1rem">
            <FormLabel>Imagem</FormLabel>
            <Input
              type="file"
              onChange={
                e => {
                  if(e.target.files) {
                    setImage(e?.target?.files[0]);
                    setImageUrl(URL.createObjectURL(e.target.files[0]));
                  }
                }
              }
              required
            />
            <FormHelperText>
              Tamanho máximo: 2mb
            </FormHelperText>
            {imageUrl && <Image src={imageUrl} alt="Preview" marginTop="1rem" width={100} />}
            {imageUrl && (
              <FormHelperText>
                Tamanho da imagem escolhida: {image && (image?.size / 1024 / 1024).toFixed(3)} mb
              </FormHelperText>
            )}
          </FormControl>
          <Button
            type="submit"
            isLoading={isLoading}
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
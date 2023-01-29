import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { ChakraProvider } from '@chakra-ui/react'
import { MetaMaskProvider } from '@/context/MetaMaskContext'


export default function App({ Component, pageProps }: AppProps) {
  return (
    <MetaMaskProvider>
      <ChakraProvider>
        <Head>
          <title>Marketplace</title>
          <meta name="description" content="Feito por André Cunha" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Component {...pageProps} />
      </ChakraProvider>
    </MetaMaskProvider>
  )
}

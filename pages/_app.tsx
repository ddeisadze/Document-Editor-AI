
import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import type { AppProps } from 'next/app'
import '../styles/global.css'

export default function App({ Component, pageProps }: AppProps) {

    const theme = extendTheme({
        styles: {
            global: {
                "&::-webkit-scrollbar": {
                    width: "6px",
                },
                "&::-webkit-scrollbar-track": {
                    bg: "gray.100",
                },
                "&::-webkit-scrollbar-thumb": {
                    bg: "gray.500",
                    borderRadius: "20px",
                },
            },
        },
    });

    return (
        <ChakraProvider theme={theme}>
            <Component {...pageProps} />
        </ChakraProvider>
    )
}

import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import type { AppProps } from 'next/app';
import { useState } from 'react';
import '../styles/global.css';
import { MyUserContextProvider } from '../utils/useUser';

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

    const [supabase] = useState(() => createBrowserSupabaseClient())

    return (
        <SessionContextProvider supabaseClient={supabase} initialSession={pageProps.initialSession}>
            <MyUserContextProvider>
                <ChakraProvider theme={theme}>
                    <Component {...pageProps} />
                </ChakraProvider>
            </MyUserContextProvider>
        </SessionContextProvider>
    )
}
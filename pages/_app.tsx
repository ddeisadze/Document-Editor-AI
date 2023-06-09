
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { Analytics } from '@vercel/analytics/react';
import type { AppProps } from 'next/app';
import { useState, useEffect } from 'react';
import 'node_modules/react-quill/dist/quill.snow.css';

import '../styles/global.css';
import { MyUserContextProvider } from '../utils/useUser';
import "public/quill.css"


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
        colors: {
            violet: {
              100: "#f7fafc",
              // ...
              900: "#1a202c",
            },
          },
        fonts: {
        heading: `'system-ui','-apple-system','Segoe UI','Open Sans', 'sans-serif'`,
        quill: `'Inter var', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'Noto Sans', sans-serif`,
        body: `'-apple-system', 'system-ui','Segoe UI','Open Sans', sans-serif`,
        },
    });

    useEffect(() => {
        // Check if you are on the specific page where you want to modify the __next id
        const isSpecificPage = window.location.pathname === '/files';
        console.log("yooooo");
        
      
        if (isSpecificPage) {
          const nextDiv = document.getElementById('__next');
          // Modify the id attribute
          nextDiv?.setAttribute('id', 'custom__next');
        }
      }, []);

    const [supabase] = useState(() => createBrowserSupabaseClient())


    return <>
        <SessionContextProvider supabaseClient={supabase} initialSession={pageProps.initialSession}>
            <MyUserContextProvider>
                <ChakraProvider theme={theme} >
                    <Component {...pageProps} />
                </ChakraProvider>
            </MyUserContextProvider>
        </SessionContextProvider>
        <Analytics />
    </>

}
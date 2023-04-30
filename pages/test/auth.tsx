
import dynamic from 'next/dynamic'
import { Auth } from '@supabase/auth-ui-react'
import { Typography, Button } from "@supabase/ui";

import { ThemeSupa } from '@supabase/auth-ui-shared'
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react'
import { Box, Center } from '@chakra-ui/react'

const Container = (props: any) => {
    const { user } = Auth.useUser();
    if (user)
        return (
            <>
                <Typography>Signed in: {user.email}</Typography>
                <Button block onClick={() => props.supabaseClient.auth.signOut()}>
                    Sign out
                </Button>
            </>
        );
    return props.children;
};

const Home = () => {
    const session = useSession()
    const supabase = useSupabaseClient()

    return (
        <Box w='100%'>
            <Center>
                <Container supabaseClient={supabase}>
                    <Auth
                        supabaseClient={supabase}
                        providers={['google', 'linkedin']}
                        //   redirectTo={getURL()}
                        magicLink={true}
                        appearance={{
                            theme: ThemeSupa,
                            variables: {
                                default: {
                                    colors: {
                                        brand: '#404040',
                                        brandAccent: '#52525b'
                                    }
                                },
                            }
                        }}
                        theme="dark"
                    />
                </Container>
            </Center>
        </Box>

    )
}

const DocumentEditor = dynamic(() => import('../../src/components/documents/editor/DocumentEditor').then(module => module.DocumentEditor), {
    ssr: false,
})

export default function App() {
    return (
        <Home />
    );
}
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

import { Box, Flex, Text, useColorModeValue } from '@chakra-ui/react';
import { getURL, getURLWithPath } from '../../utils/helpers';
import { useUser } from '../../utils/useUser';

const SignIn = () => {
  const router = useRouter();
  const user = useUser();
  const supabaseClient = useSupabaseClient();

  const greyColor = useColorModeValue('gray.50', 'gray.800');
  const whiteColor = useColorModeValue('white', 'gray.700');

  useEffect(() => {
    if (user.user) {
      router.replace('/');
    }
  }, [user]);

  if (!user.user)
    return (
      <Flex
        minH={'100vh'}
        align={'center'}
        justify={'center'}
        bg={greyColor}>
        <Box
          rounded={'lg'}
          bg={whiteColor}
          boxShadow={'lg'}
          maxW='lg' minW='md'
          p={8}>
          <Text>Aidox Sign-in</Text>
          <Auth
            supabaseClient={supabaseClient}
            providers={['google']}
            redirectTo={router?.query?.callback ? getURLWithPath(router?.query?.callback as string) : getURL()}
            magicLink={true}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#404040',
                    brandAccent: '#52525b'
                  }
                }
              }
            }}
          />
        </Box>
      </Flex >
    );

  return (
    <div className="m-6">
    </div>
  );
};

export default SignIn;

import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure } from "@chakra-ui/react"
import { ReactNode } from "react"
import { Auth } from '@supabase/auth-ui-react'

import { ThemeSupa } from '@supabase/auth-ui-shared'
import { Session, useSession, useSupabaseClient } from '@supabase/auth-helpers-react'
import { useRouter } from 'next/router'

interface AuthLoginProps {
    children: ReactNode,
    session: Session,
    show: boolean
}
export default function AuthLogin(props: AuthLoginProps) {

    const { isOpen, onOpen, onClose } = useDisclosure({
        isOpen: props.show
    });

    const router = useRouter()

    const supabase = useSupabaseClient();

    return <>
        {!props.session ? (<Modal isOpen={isOpen} onClose={onClose} >
            <ModalOverlay bg='blackAlpha.300'
                backdropFilter='blur(8px) hue-rotate(90deg)'
            />
            <ModalContent>
                <ModalHeader>AiDox Sign-in</ModalHeader>
                <ModalBody>
                    <Auth
                        supabaseClient={supabase}
                        providers={['google', 'linkedin']}
                        redirectTo={router.asPath}
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
                    />
                </ModalBody>
                <ModalFooter>
                </ModalFooter>
            </ModalContent>
        </Modal >)
            : props.children
        }
    </>
}
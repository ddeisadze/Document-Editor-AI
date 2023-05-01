import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure } from "@chakra-ui/react"
import { Auth } from '@supabase/auth-ui-react'
import { ReactNode } from "react"

import { Session, useSupabaseClient } from '@supabase/auth-helpers-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { useRouter } from 'next/router'
import { Url } from "url"

interface AuthLoginProps {
    children: ReactNode,
    session: Session,
    show?: boolean,
    redirectUrl?: Url
}

export default function AuthLogin({ show = true, ...props }: AuthLoginProps) {

    const { isOpen, onOpen, onClose } = useDisclosure({
        isOpen: show
    });

    const router = useRouter()

    const supabase = useSupabaseClient();

    const origin =
        typeof window !== 'undefined' && window.location.origin
            ? window.location.origin
            : '';

    const currentHref = `${origin}${router.asPath}`;

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
                        providers={['google']}
                        redirectTo={props.redirectUrl?.href ?? currentHref}
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
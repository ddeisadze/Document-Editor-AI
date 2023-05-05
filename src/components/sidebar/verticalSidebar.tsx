import {
    Box,
    BoxProps,
    CloseButton,
    Drawer,
    DrawerContent,
    Flex,
    FlexProps,
    Icon,
    IconButton,
    Link,
    Text,
    useColorModeValue,
    useDisclosure,
    useToast,
} from '@chakra-ui/react';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/router';
import { ReactNode, ReactText } from 'react';
import { IconType } from 'react-icons';
import {
    FiFilePlus,
    FiHardDrive,
    FiLogOut,
    FiMenu
} from 'react-icons/fi';
import {
    GiArrowScope
} from 'react-icons/gi';
import {
    GrDocumentPdf
} from 'react-icons/gr';
import { VscAccount } from 'react-icons/vsc';
import { postData } from '../../../utils/helpers';

interface LinkItemProps {
    name: string;
    icon: IconType;
    onClick?: () => void
}

interface simpleSidebarProps {
    children: ReactNode;
    pdfExportOnClick?: () => void;
    newDocumentOnClick?: () => void
    showExport?: boolean
}


export default function NavigationBar({ children, showExport = true, ...rest }: simpleSidebarProps) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const session = useSession()
    const supabase = useSupabaseClient()

    const toast = useToast();
    const router = useRouter();

    let LinkItems: Array<LinkItemProps> = [
        {
            name: 'New', icon: FiFilePlus, onClick: () => router.push("/")
        },
        {
            name: 'My Files', icon: FiHardDrive, onClick: () => router.push("/files")
        }
    ];

    if (showExport) {
        LinkItems.push({
            name: 'Export', icon: GrDocumentPdf, onClick: rest.pdfExportOnClick
        })
    }

    if (session) {
        LinkItems.push(
            {
                name: 'Automated Application', icon: GiArrowScope, onClick: () => router.push("/automation"),
            },
            {
                name: 'Logout', icon: FiLogOut, onClick: async () => {
                    const { error } = await supabase.auth.signOut();

                    if (error) {
                        toast({
                            title: 'Could not logout, try again!',
                            status: 'error',
                            duration: 3000,
                            isClosable: true,
                        })
                    } else {
                        toast({
                            title: 'Logout successful!',
                            status: 'success',
                            duration: 3000,
                            isClosable: true,
                        })
                    }
                }
            },
            {
                name: 'My Account', icon: VscAccount, onClick: async () => {
                    try {
                        const { url, error } = await postData({
                            url: '/api/create-portal-link'
                        });
                        window.location.assign(url);
                    } catch (error) {
                        if (error) return alert();
                    }
                }
            })
    }

    return (
        <Box minH="100vh" bg={useColorModeValue('gray.100', 'gray.900')}>
            <SidebarContent
                onClose={() => onClose}
                linkItems={LinkItems}
                display={{ base: 'none', md: 'block' }}
            />
            <Drawer
                autoFocus={false}
                isOpen={isOpen}
                placement="left"
                onClose={onClose}
                returnFocusOnClose={false}
                onOverlayClick={onClose}
                size="full">
                <DrawerContent>
                    <SidebarContent linkItems={LinkItems} onClose={onClose} />
                </DrawerContent>
            </Drawer>
            {/* mobilenav */}
            <MobileNav display={{ base: 'flex', md: 'none' }} onOpen={onOpen} />
            <Box ml={{ base: 0, md: 40 }}>
                {children}
            </Box>
        </Box>
    );
}

interface SidebarProps extends BoxProps {
    onClose: () => void;
    linkItems: Array<LinkItemProps>
}

const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {

    return (
        <Box
            bg={useColorModeValue('white', 'gray.900')}
            borderRight="1px"
            borderRightColor={useColorModeValue('gray.200', 'gray.700')}
            w={{ base: 'full', md: 40 }}
            pos="fixed"
            h="full"
            {...rest}>
            <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
                <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold">
                    AiDox
                </Text>
                <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
            </Flex>
            {rest.linkItems.map((link) => (
                <NavItem key={link.name} icon={link.icon} onClick={link.onClick}>
                    {link.name}
                </NavItem>
            ))}
        </Box>
    );
};

interface NavItemProps extends FlexProps {
    icon: IconType;
    children: ReactText;
}
const NavItem = ({ icon, children, ...rest }: NavItemProps) => {
    return (
        <Link href="#" style={{ textDecoration: 'none' }} _focus={{ boxShadow: 'none' }}>
            <Flex
                align="center"
                p="4"
                mx="4"
                borderRadius="lg"
                role="group"
                cursor="pointer"
                _hover={{
                    bg: 'cyan.400',
                    color: 'white',
                }}
                {...rest}>
                {icon && (
                    <Icon
                        mr="4"
                        fontSize="16"
                        _groupHover={{
                            color: 'white',
                        }}
                        as={icon}
                    />
                )}
                {children}
            </Flex>
        </Link>
    );
};

interface MobileProps extends FlexProps {
    onOpen: () => void;
}
const MobileNav = ({ onOpen, ...rest }: MobileProps) => {
    return (
        <Flex
            ml={{ base: 0, md: 60 }}
            px={{ base: 4, md: 24 }}
            height="20"
            alignItems="center"
            bg={useColorModeValue('white', 'gray.900')}
            borderBottomWidth="1px"
            borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
            justifyContent="flex-start"
            {...rest}>
            <IconButton
                variant="outline"
                onClick={onOpen}
                aria-label="open menu"
                icon={<FiMenu />}
            />

            <Text fontSize="2xl" ml="8" fontFamily="monospace" fontWeight="bold">
                AiDox
            </Text>
        </Flex>
    );
};
import { Box, Button, Flex, Heading, Text, useColorModeValue } from '@chakra-ui/react';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { Batch, BatchesDisplay } from '../../src/components/automation/batchesDisplay';
import NavigationBar from '../../src/components/sidebar/verticalSidebar';
import { getBatches, setBatchesLocalStorage } from '../../src/utility/storageHelpers';
import { useUser } from '../../utils/useUser';

const Stepper = dynamic(() => import('../../src/components/automation/stepper').then(mod => mod.Stepper), {
    ssr: false,
})

export default function AutomationPage() {
    const greyColor = useColorModeValue('gray.50', 'gray.800');
    const whiteColor = useColorModeValue('white', 'gray.700');

    const { user, subscription } = useUser()

    const [batches, setBatches] = useState<Batch[]>([])
    const [showNewForm, setShowNewForm] = useState<boolean>(false);

    useEffect(() => {
        setBatches(getBatches())
    }, [])

    const doesUserHaveAccess = () => {
        return (!process.env.PUBLIC_URL) || (subscription?.status == 'active' && subscription.prices?.products?.name?.includes("pro"));
    }

    console.log(batches)

    return <>
        <NavigationBar showExport={false}>
            <Flex
                h='100%'
                w={'100%'}
                align={'center'}
                justify={'center'}
                bg={greyColor}>
                {doesUserHaveAccess() ? <Box
                    rounded={'lg'}
                    bg={whiteColor}
                    boxShadow={'lg'}
                    h={'4xl'}
                    w='4xl'
                    minW='md'
                    p={8}>
                    <Heading>New Job submisison</Heading>

                    {showNewForm ? <Stepper submitBatch={(batch) => {
                        const newBatches = [...batches ?? [], batch]
                        setBatches(newBatches);
                        setShowNewForm(false);
                        setBatchesLocalStorage(newBatches)
                    }} /> : <>
                        <BatchesDisplay batches={batches ?? []} />
                        <Button onClick={() => setShowNewForm(true)}>Add new batch of jobs to automate</Button>
                    </>}

                </Box> : <Text>You do not have the correct subscription. Please sign up for pro plan by clicking "My Account"</Text>}
            </Flex>
        </NavigationBar>
    </>
}
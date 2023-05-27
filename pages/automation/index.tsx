import { Box, Button, Flex, Heading, Text, useColorModeValue, useToast } from '@chakra-ui/react';
import dynamic from 'next/dynamic';
import { QuillDeltaToHtmlConverter } from 'quill-delta-to-html';
import { useEffect, useState } from 'react';
import utf8 from "utf8";
import { Batch, BatchesDisplay } from '../../src/components/automation/batchesDisplay';
import NavigationBar from '../../src/components/sidebar/verticalSidebar';
import { getPdfFileFromHtml } from '../../src/utility/helpers';
import { getBatches, getDocument } from '../../src/utility/storageHelpers';
import { postDataToNewJobSubmission } from '../../utils/helpers';
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

    const toast = useToast();

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

                    {showNewForm ? <Stepper addNewJobs={async (batch) => {

                        // write me code to retrieve a resume object from resume id
                        const quillDocument = getDocument(batch.userInfo.resumeDocumentId);

                        const html: string = new QuillDeltaToHtmlConverter(quillDocument?.content?.ops ?? [], {
                            inlineStyles: true
                        }).convert();

                        const html_encoded = utf8.encode(html)

                        const pdfFileBlob = await getPdfFileFromHtml(html_encoded);

                        // write me a for loop to submit each job in the batch
                        batch.jobs.map(async job => {
                            console.log(job, "job")
                            await postDataToNewJobSubmission({
                                name: batch.userInfo.firstName + ' ' + batch.userInfo.lastName,
                                email: batch.userInfo.email,
                                additionalNotes: job.notes,
                                jobLink: job.url,
                                resumefileName: quillDocument?.documentName ?? 'resume',
                                resumePdfFile: pdfFileBlob,
                            })

                            return true;
                        })

                        // const newBatches = [...batches ?? [], batch]
                        // setBatches(newBatches);
                        // setShowNewForm(false);
                        // setBatchesLocalStorage(newBatches)

                        return toast({
                            title: 'Automation request submitted!',
                            description: 'Our systems will auto apply to these set of jobs, custom matching your resume to the job description.',
                            status: 'success',
                            duration: 5000,
                            isClosable: true,
                        })
                    }} /> : <>
                        <BatchesDisplay batches={batches ?? []} />
                        <Button onClick={() => setShowNewForm(true)}>Add new batch of jobs to automate</Button>
                    </>}

                </Box> : <Text>You do not have the correct subscription. Please sign up for pro plan by clicking "My Account"</Text>}
            </Flex>
        </NavigationBar>
    </>
}
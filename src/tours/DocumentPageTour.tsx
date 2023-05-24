
import { Box, Button, ButtonGroup } from '@chakra-ui/react';
import { StepType, TourProvider, useTour } from '@reactour/tour';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { aiComments, documentDelta } from '../../pages/test/demoFrontpage';
import { ReadonlyContext } from '../contexts';
import DocumentPage from '../pages/DocumentPage';
import { setIsNewUser } from '../utility/storageHelpers';

export default function App() {
    const { isOpen, currentStep, setIsOpen, setCurrentStep } = useTour()

    const [showNextAndPrevious, setShowNextAndPrevious] = useState<boolean>(false);
    const router = useRouter();

    const handleCreateNewDocument = () => {
        router.push('/');
    };

    const steps: StepType[] = [
        {
            selector: '.ql-editor',
            position: 'center',
            content: 'Select text in the first bullet point to launch toolbar.',
            actionAfter: () => {
                setShowNextAndPrevious(false)
            }
        },
        {
            selector: '.inlineToolbar',
            position: 'top',
            content: 'Click on toolbar button to launch AI Wizard.',
            highlightedSelectors: [".inlineToolbar"],
            // in action check if element exists, if not go back to last step 
            action: () => {
                setShowNextAndPrevious(false)
            }
        },
        {
            // write me the next step to focus on the chat window
            selector: '.ai-chat',
            position: 'top',
            content: 'Interact with our AI wizard on the selected text. For example, ask it to "Rewrite sentence for tech lead role." ',
            action: () => {
                setShowNextAndPrevious(true)
            }
        },
        {
            // write me the next step to focus on the chat window
            selector: '.collab-mode-button',
            position: 'top',
            content: 'You can also launch the chat in full screen mode which shows you the difference between old text and generated text." ',
            action: () => {
                setShowNextAndPrevious(true)
            },
        },
        {
            selector: 'body',
            position: 'center',
            content: (props) => (
                <Box>
                    <p>Congratulations, you've completed the tour!</p>
                    <ButtonGroup>
                        <Button onClick={() => {
                            handleCreateNewDocument()
                            setIsNewUser(false)
                        }}>New Document</Button>
                        <Button onClick={() => {
                            props.setIsOpen(false)
                            setIsNewUser(false)
                        }}>Back to Demo</Button>
                    </ButtonGroup>
                </Box>
            )
        }

    ];

    return (
        <TourProvider
            steps={steps}
            startAt={0}
            onClickClose={(props) => {
                props.setIsOpen(false);
                setIsNewUser(false);
            }}
            showPrevNextButtons={showNextAndPrevious}>
            <ReadonlyContext.Provider value={{ readonly: false, showComments: true, joyride: true }}>
                <DocumentPage
                    documentId='test'
                    documentName={"John Smith Product Manager Resume"}
                    aiComments={aiComments}
                    documentContent={documentDelta} />

            </ReadonlyContext.Provider>

        </TourProvider>

    );
}
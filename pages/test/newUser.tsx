
import { StepType, TourProvider } from '@reactour/tour';
import { useState } from 'react';
import ReactQuill from 'react-quill';
import { ReadonlyContext } from '../../src/contexts';
import { aiComments, documentDelta } from './demoFrontpage';
import dynamic from 'next/dynamic';

const DocumentPage = dynamic(() => import('../../src/pages/DocumentPage'), {
    ssr: false,
})

export default function App() {

    const [startJoyride, setStartJoyride] = useState(false);

    function handleEditorUpdate(quillEditor: ReactQuill) {

        if (quillEditor?.editor) {
            quillEditor.editor.setSelection(222, 148);

            setStartJoyride(true)
        }
    }
    const handleJoyrideCallback = (data: any) => {
        const { action, index, status, type } = data;

        console.groupCollapsed(type);
        console.log(data); //eslint-disable-line no-console
        console.groupEnd();
    };

    const joyRideSteps = [
        {
            target: '.inlineToolbar',
            title: "Select text to launch this toolbar",
            content: 'Click me to launch AI Wizard.',
            spotlightClicks: true,
            disableBeacon: true,
            showSkipButton: true,
            hideCloseButton: true,
            showProgress: true
        },

        // {
        //   target: '.ql-toolbar',
        //   content: 'This is my awesome feature!',
        //   spotlightClicks: true,
        // },
    ];

    const steps: StepType[] = [
        {
            selector: '.inlineToolbar',
            // title: "Select text to launch this toolbar",
            content: 'Click me to launch AI Wizard.',
            highlightedSelectors: [".ql-editor"],
        },

        // {
        //   target: '.ql-toolbar',
        //   content: 'This is my awesome feature!',
        //   spotlightClicks: true,
        // },
    ];

    return (
        <TourProvider steps={steps}>
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
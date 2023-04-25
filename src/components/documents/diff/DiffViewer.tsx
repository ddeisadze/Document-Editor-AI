import React, { useState, ReactDOM, useRef, useEffect } from 'react';
import ReactQuill, { Range, Quill } from "react-quill";

import { DeltaStatic, Sources, Delta as DeltaType } from 'quill';

import { diffLines, diffSentences, diffWords } from 'diff';
import { Box, Button, Grid, GridItem, HStack, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Radio, RadioGroup, Stack } from '@chakra-ui/react';
import CommentDialog, { Message } from '../aicomment/CommentDialog';
import { AiChat, MessageModel } from '../aicomment/AiComment';

interface DiffViewerProps {
    oldText: string;
    newText: string;
    AiMessages: MessageModel[];
    isOpen: boolean,
    onClose: (aiMessages: MessageModel[]) => void,
    onAcceptChanges: (updatedText: string) => void
}

const Delta = Quill.import("delta") as typeof DeltaType;

class DiffBlot extends Quill.import('blots/inline') {
    static blotName = "commentLink";
    static tagName = "comment-link";
    static className = "comment-link"

    static create(value?: {
        id: string,
        color: string
    }) {
        let node: HTMLElement = super.create();

        if (!value) {
            return node;
        }

        // Sanitize url value if desired
        node.setAttribute('commentId', value.id);
        // @ts-ignore
        node.style = `border-bottom: ${value.color} solid 4px`
        // Okay to set other non-format related attributes
        // These are invisible to Parchment so must be static
        return node;
    }

    static formats(node: any) {
        return node.getAttribute('commentId');
    }
}

Quill.register(DiffBlot, true);

const DiffViewer: React.FC<DiffViewerProps> = ({ oldText, newText, ...props }) => {

    const [diffVal, setDiffVal] = useState<DeltaStatic>()
    const [outputVal, setOutputVal] = useState<DeltaStatic>()
    const [diffType, setDiffType] = React.useState('sentence')
    const [aiMessages, setAiMessages] = useState<MessageModel[]>([])

    const newQuill = useRef<ReactQuill>(null)
    const diffQuill = useRef<ReactQuill>(null)

    useEffect(() => {
        const newDelta = new Delta([]);
        const outputDelta = new Delta([]);
        outputDelta.insert(newText);

        console.log(newText)

        const newDeltaOps = newDelta.ops ?? [];

        if (!newText) {
            newText = oldText;
            newDelta.insert(oldText);
            outputDelta.insert(oldText);
        } else {
            const diffSentencesVar = diffSentences(oldText, newText);
            const diffWordsVar = diffWords(oldText, newText);
            const diffLineVar = diffLines(oldText, newText);

            let diffChangeLog;

            if (diffType == "word") {
                diffChangeLog = diffWordsVar;
            } else if (diffType == "sentence") {
                diffChangeLog = diffSentencesVar;
            } else {
                diffChangeLog = diffLineVar;
            }

            diffChangeLog.forEach((change) => {
                if (change.added) {
                    newDeltaOps.push({
                        insert: change.value,
                        attributes: {
                            background: '#cce8cc',
                            color: '#003700',
                        },
                    });
                } else if (change.removed) {
                    newDeltaOps.push({
                        insert: change.value,
                        attributes: {
                            background: '#e8cccc',
                            color: '#370000',
                            strike: true,
                        },
                    });
                } else {
                    newDeltaOps.push({
                        insert: change.value
                    });
                }
            });
        }

        setDiffVal(newDelta)
        setOutputVal(outputDelta)

    }, [diffType])


    return (
        <Modal isOpen={props.isOpen} onClose={() => { }} isCentered size={"5xl"}>
            <ModalOverlay bg='blackAlpha.300'
                backdropFilter='blur(3px) hue-rotate(90deg)'
            />
            <ModalContent>
                <ModalHeader>Work with AI</ModalHeader>
                <ModalBody>
                    <Grid alignItems={"stretch"}
                        templateAreas={`"chat chat"
                                        "diff output"`}
                        gridTemplateRows={'1fr 1fr'}
                        gridTemplateColumns={'1fr 1fr'}
                    >
                        <GridItem pl='2' area={'chat'} >
                            <AiChat onNewMessage={(msg) => setAiMessages(msg)} messages={props.AiMessages} width={"100%"} selectedText={oldText} />
                        </GridItem>
                        <GridItem pl='2' area={'diff'}>
                            <p>Diff (original vs ai recomendation)</p>
                            <RadioGroup onChange={setDiffType} value={diffType}>
                                <Stack spacing={5} direction='row'>
                                    <Radio colorScheme='red' value='word'>
                                        Word
                                    </Radio>
                                    <Radio colorScheme='green' value='sentence'>
                                        Sentence
                                    </Radio>
                                    <Radio colorScheme='green' value='line'>
                                        Line
                                    </Radio>
                                </Stack>
                            </RadioGroup>
                            <ReactQuill readOnly theme="bubble" ref={diffQuill} id='diff' value={diffVal} />
                        </GridItem>
                        <GridItem pl='2' area={'output'}>
                            <p>Output</p>
                            <ReactQuill ref={newQuill} id='new' value={outputVal} />
                        </GridItem>

                    </Grid>
                </ModalBody>
                <ModalFooter>
                    <Button onClick={() => {
                        props.onAcceptChanges(newQuill.current?.editor?.getText() ?? "");
                        setOutputVal(new Delta().insert(newQuill.current?.editor?.getText() ?? ""))
                    }} colorScheme='green' mr={3}>
                        Accept Changes
                    </Button>
                    <Button onClick={() => props.onClose(aiMessages)} variant='outline' colorScheme={'red'}>Close & Cancel</Button>
                </ModalFooter>

            </ModalContent>
        </Modal>
    );
};

export default DiffViewer;
import React, { useEffect, useRef, useState } from "react";
import { NewAIConversation } from "./NewAIConversation";
import ReactQuill, { Range, UnprivilegedEditor, Quill } from "react-quill";
import { Box, Button, Flex, Grid, GridItem, Spacer, Text, useBoolean, useDimensions, useOutsideClick } from "@chakra-ui/react";
import InlineToolbar from "./inlineToolbar";
import DocumentTitle from "./LoginTitle";
import { getHtml, getPdfFileFromHtml } from "./utility/helpers";
import { saveAs } from 'file-saver';
import { pdfExporter } from 'quill-to-pdf';
import { QuillDeltaToHtmlConverter } from 'quill-delta-to-html';
import { jsPDF } from "jspdf"
import html2canvas from "html2canvas"
import { DeltaStatic } from "quill";
// import htmlPdf from "html-pdf"

export interface aiConvoComponents {
    key: string,
    componenet: JSX.Element,
    range: Range
}

export function MyEditor() {
    const [showInlineToolbar, setShowInlineToolbar] = useState<JSX.Element | null>(null);
    const [aiConversationsChildren, setAiConversationsChildren] = useState<aiConvoComponents[]>([]);
    const [lastModified, setLastModified] = useState<Date>();

    // const gridElementRef = useRef()
    const quillRef = React.useRef<ReactQuill | null>(null);

    const commentWidth = "300px";

    const toolbarDivRef = React.useRef(null)
    useOutsideClick({
        ref: toolbarDivRef,
        handler: () => {
            setShowInlineToolbar(null);
        }
    })

    useEffect(() => {
        getHtml().then((html) => {
            handlePasteHTML(html);
        });

        // remove toolbar on any click
        // document.addEventListener('mousedown', hideToolBar);
    }, []);

    const handleChange = (): void => {
        setLastModified(new Date());
    };

    const handlePasteHTML = (html: any) => {
        if (quillRef.current) {
            quillRef.current.getEditor().clipboard.dangerouslyPasteHTML(0, html);
        }
    };

    const removeAiConvo = (key: string) => {
        setAiConversationsChildren((prev) => {
            const componentToRemove = prev.filter(i => i.key == key)[0];
            quillRef.current?.editor?.removeFormat(componentToRemove.range?.index ?? 0, componentToRemove.range?.length ?? 0);

            return prev.filter(i => i.key != key);
        });
    };

    const handleOnAiUpdatedPrompt = (editedText: string) => {
        if (!editedText) {
            return;
        }

        console.log(editedText);

    };

    const onLaunchAiClicked = (range: Range, selectedAttrs: {
        text: string;
        top: Number;
        bottom: Number;
        left: Number;
        right: Number;

    }) => {

        const key = new Date().getTime().toString();

        const format = {
            background: "rgb(124, 114, 227)" // set background color to yellow
        };

        if (range) {
            quillRef?.current?.editor?.formatText(range, format); // apply new background color format
        }

        setAiConversationsChildren([
            ...aiConversationsChildren,
            {
                range: range,
                key: key,
                componenet: <NewAIConversation
                    key={key}
                    width={commentWidth}
                    handleUpdatePrompt={handleOnAiUpdatedPrompt}
                    onRemoveComponent={() => removeAiConvo(key)}
                    selectedText={selectedAttrs.text}
                    top={selectedAttrs.top}
                    bottom={selectedAttrs.bottom}
                    left={selectedAttrs.left}
                    right={selectedAttrs.right} />
            }
        ]);

        setShowInlineToolbar(null);
    };

    return (
        <>
            <Grid
                marginLeft={"5%"}
                marginRight={"5%"}
                templateAreas={`"header header"
                  "main comments"
                  "footer comments"`}
                gridTemplateRows={'50px 1fr 40px'}
                gridTemplateColumns={`1fr ${commentWidth}`}
                gap='1'
            >
                <GridItem pl='2' area={'header'}>
                    <DocumentTitle />
                    {lastModified && (
                        <Text
                            fontSize="sm"
                            color="gray"
                            fontStyle="italic"
                            marginBottom="0.5rem">
                            Last modified: {lastModified.toLocaleString()}
                        </Text>)}
                </GridItem>
                <GridItem pl='2' area={'comments'} maxHeight="100%" overflowY="auto">
                    {aiConversationsChildren.map(i => i.componenet)}
                </GridItem>
                <GridItem pl='2' area={'main'} marginTop="1rem">
                    <ReactQuill ref={quillRef}
                        onChange={handleChange}
                        onChangeSelection={(range) => {
                            if (range?.length ?? 0 > 0) {
                                var text = quillRef.current?.editor?.getText(range?.index, range?.length);
                                const bounds = quillRef.current?.editor?.getBounds(range?.index ?? 0);

                                const editingArea = quillRef.current?.getEditingArea().getBoundingClientRect();

                                const scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft;
                                const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;

                                const windowSelection = window.getSelection();
                                const windowRange = windowSelection?.getRangeAt(0);
                                const boundingRect = windowRange?.getBoundingClientRect();

                                const container = windowRange?.commonAncestorContainer;
                                const selectedElement = container?.parentElement as Element;
                                const elementStyles = window.getComputedStyle(selectedElement);
                                const elementLineHeight = parseFloat(elementStyles?.lineHeight);

                                const selectedAttrs = {
                                    text: text ?? "",
                                    top: (boundingRect?.top ?? 0) + scrollTop,
                                    bottom: boundingRect?.bottom ?? 0,
                                    right: boundingRect?.right ?? 0,
                                    left: (boundingRect?.left ?? 0) + scrollLeft,
                                };

                                const rects = windowRange?.getClientRects();
                                if (rects && rects.length > 0) {
                                    const rect = rects[0];
                                    const x = rect.left + window.pageXOffset;

                                    const toolbarComponenet = <InlineToolbar
                                        top={selectedAttrs.top}
                                        bottom={selectedAttrs.bottom}
                                        left={x}
                                        right={selectedAttrs.right}
                                        lineHeight={elementLineHeight}
                                        onClick={() => onLaunchAiClicked(range, selectedAttrs)} />;

                                    setShowInlineToolbar(toolbarComponenet);
                                }
                            }
                        }} />
                </GridItem>
                <GridItem pl="2" area="footer" position="sticky" bottom={0}>
                    <EditorFooter contents={quillRef.current?.editor?.getContents()} />
                </GridItem>
            </Grid>
            <div ref={toolbarDivRef}>
                {showInlineToolbar}
            </div>
        </>
    );
}

function EditorFooter(props: {
    contents?: DeltaStatic
}) {
    const [loading, setLoading] = useBoolean(false);

    return (
        <Flex bg="white">
            <Box>
                <Button isLoading={loading} onClick={() => {
                    setLoading.on();
                    const html = new QuillDeltaToHtmlConverter(props.contents?.ops ?? [], {}).convert();

                    getPdfFileFromHtml(html)
                        .then(blob => {
                            saveAs(blob, 'pdf-export.pdf')
                            setLoading.off();
                        });
                }}
                >Export to PDF</Button>
            </Box>
        </Flex>
    );
}


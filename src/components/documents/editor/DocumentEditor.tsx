import React, { useEffect, useRef, useState } from "react";
import { AIComment } from "../aicomment/AIComment";
import { Range } from "react-quill";
import { Grid, GridItem, Spacer, Text } from "@chakra-ui/react";
import DocumentTitle from "./DocumentTitle";
import Quill, { Delta as DeltaType, DeltaStatic } from 'quill'
import { QuillEditor } from "./QuillEditor";
import { DocumentFooter } from "./DocumentFooter";
import { getHtml } from "../../../utility/helpers";

const Delta = Quill.import("delta") as typeof DeltaType;

export interface aiConvoComponents {
    componentKey: string;
    component: JSX.Element;
    range: Range;
}

export function DocumentEditor() {
    const commentWidth = "300px";

    const [documentName, setDocumentName] = useState<string>();
    const [aiConversationsChildren, setAiConversationsChildren] = useState<aiConvoComponents[]>([]);
    const [lastModified, setLastModified] = useState<Date>();
    const [openConvoKey, setOpenConvoKey] = useState<string>();
    const [content, setContent] = useState<DeltaStatic>();
    const [loadedDocumentHtml, setLoadedDocumentHtml] = useState<string | null>(null)

    useEffect(() => {

        getHtml().then((html) => {
            setLoadedDocumentHtml(html);
        });

    }, []);

    useEffect(() => {
        setAiConversationsChildren((prevChildren) => {
            return prevChildren.map((child) => {
                return {
                    ...child,
                    component: React.cloneElement(child.component, {
                        openConvoKey: openConvoKey,
                    }),
                };
            });
        });
    }, [openConvoKey]);

    const removeAiConvo = (key: string, range: Range) => {
        setAiConversationsChildren((prev) => {
            return prev.filter((i) => i.componentKey != key);
        });

        if (!range) {
            return;
        }

        const updateDelta = content?.compose(
            new Delta()
                .retain(range.index)
                .retain(range.length, { 'background': {} }))

        setContent(updateDelta);
    };

    const handleContentChange = (value: DeltaStatic) => {
        setContent(value);

        setLastModified(new Date());
    }

    const handleOnAiUpdatedPrompt = (editedText: string, range: Range) => {
        if (!editedText || !range || !content) {
            return;
        }

        //#todo: we need to update range here also when there are changes made to range from editor
        const updateDelta = content.compose(
            new Delta()
                .retain(range.index)
                .delete(range.length)
                .insert(editedText, {
                    "background": "rgb(124, 114, 227)"
                }));

        setContent(updateDelta);
    };

    const addAiConvo = (range: Range, selectedAttrs: SelectedText) => {
        const key = new Date().getTime().toString();
        setOpenConvoKey(key);

        setAiConversationsChildren([
            ...aiConversationsChildren,
            {
                range: range,
                componentKey: key,
                component: (
                    <AIComment
                        componentKey={key}
                        width={commentWidth}
                        range={range}
                        handleUpdatePrompt={handleOnAiUpdatedPrompt}
                        onRemoveComponent={() => removeAiConvo(key, range)}
                        selectedText={selectedAttrs.text}
                        top={selectedAttrs.top}
                        bottom={selectedAttrs.bottom}
                        left={selectedAttrs.left}
                        right={selectedAttrs.right}
                        openConvoKey={openConvoKey}
                        setOpenConvoKey={setOpenConvoKey}
                    />
                ),
            },
        ]);
    }

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
                    <DocumentTitle documentName={documentName} onDocumentNameChange={(newName) => setDocumentName(newName)} />
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
                    {aiConversationsChildren.map(i => i.component)}
                </GridItem>
                <GridItem pl='2' area={'main'} marginTop="1rem">
                    <QuillEditor
                        initialHtmlData={loadedDocumentHtml}
                        onContentChange={handleContentChange}
                        onAddComment={addAiConvo}
                        content={content}
                    />
                </GridItem>
                <GridItem pl="2" area="footer" position="sticky" bottom={0}>
                    <DocumentFooter contents={content} documentName={documentName ?? "resume"} />
                </GridItem>
            </Grid>
        </>
    );


}



export interface SelectedText {
    text: string;
    top: Number;
    bottom: Number;
    left: Number;
    right: Number;
}
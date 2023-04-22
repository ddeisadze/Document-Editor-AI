import React, { useEffect, useRef, useState } from "react";
import { AIComment } from "../aicomment/AIComment";
import { Range } from "react-quill";
import { Grid, GridItem, Spacer, Text } from "@chakra-ui/react";
import DocumentTitle from "./DocumentTitle";
import Quill, { Delta as DeltaType, DeltaStatic } from 'quill'
import { QuillEditor } from "./QuillEditor";
import { DocumentFooter } from "./DocumentFooter";


const Delta = Quill.import("delta") as typeof DeltaType;

export interface aiConvoComponents {
    id: string;
    component: JSX.Element;
    range: Range
}

export interface DocumentEditorProps {
    documentHtml: string,
    documentName: string | undefined,
    isDemoView?: boolean
}

export function DocumentEditor(props: DocumentEditorProps) {
    const commentWidth = "300px";

    const [documentName, setDocumentName] = useState<string | undefined>(props.documentName);
    const [aiConversationsChildren, setAiConversationsChildren] = useState<aiConvoComponents[]>([]);
    const [lastModified, setLastModified] = useState<Date>();
    const [openConvoKey, setOpenConvoKey] = useState<string>();
    const [content, setContent] = useState<DeltaStatic>();
    const [loadedDocumentHtml, setLoadedDocumentHtml] = useState<string | undefined>(props.documentHtml)

    useEffect(() => {

        window.addEventListener("click", (e) => {
            const target = e.target as HTMLElement;
            const commentId = target.getAttribute("commentId");

            if (target.tagName.toLowerCase() === "comment-link" && commentId) {
                setOpenConvoKey(commentId)
            }
        });

        if (props.isDemoView) {

        }

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
            return prev.filter((i) => i.id != key);
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
        console.log(value, "value");
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
                .insert(editedText));

        setContent(updateDelta);
    };

    const addAiConvo = (commentId: string, range: Range, selectedAttrs: SelectedText) => {
        setOpenConvoKey(commentId);

        setAiConversationsChildren([
            ...aiConversationsChildren,
            {
                id: commentId,
                range: range,
                component: (
                    <AIComment
                        componentKey={commentId}
                        width={commentWidth}
                        range={range}
                        handleUpdatePrompt={handleOnAiUpdatedPrompt}
                        onRemoveComponent={() => removeAiConvo(commentId, range)}
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
                        documentName={documentName}
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
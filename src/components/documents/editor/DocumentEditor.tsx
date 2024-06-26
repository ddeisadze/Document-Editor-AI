import { Grid, GridItem, Text } from "@chakra-ui/react";
import debounce from 'lodash/debounce';
import Quill, { DeltaStatic, Delta as DeltaType } from "quill";
import { useCallback, useEffect, useState } from "react";
import { Range } from "react-quill";
import { useReadonly } from "../../../contexts";
import { updateSpecificDocumentWithComments } from "../../../utility/storageHelpers";
import { MessageModel } from "../aicomment/AiChat";
import { AiCommentManager } from "../aicomment/AiCommentManager";
import DocumentTitle from "./DocumentTitle";
import { QuillEditor } from "./QuillEditor";


const Delta = Quill.import("delta") as typeof DeltaType;

const DEFAULT_MESSAGE_ON_NEW_CHAT: MessageModel = {
    direction: "incoming",
    message: "How can I help you?",
    position: "first",
    sender: "Aidox",
    sentTime: "just now",
}

export interface aiCommentState {
    id: string;
    isOpen: boolean;
    range: Range;

    selectedText: string;

    top?: Number | undefined;
    bottom?: Number | undefined;
    left?: Number | undefined;
    right?: Number | undefined;
    width: string;

    messageHistory: MessageModel[]
}

interface DocumentEditorProps {
    documentHtml?: string;
    documentName: string | undefined;
    documentId: string,
    aiComments?: aiCommentState[],
    isDemoView?: boolean;
    initialDeltaStaticContent?: DeltaStatic | undefined;

}

export function DocumentEditor(props: DocumentEditorProps) {
    const commentWidth = "300px";

    const [documentName, setDocumentName] = useState<string | undefined>(
        props.documentName
    );
    const [aiComments, setAiComments] = useState<aiCommentState[]>(props.aiComments ?? []);
    const [lastModified, setLastModified] = useState<Date>();
    const [content, setContent] = useState<DeltaStatic>();

    const readonlyContext = useReadonly();

    useEffect(() => {
        updateSpecificDocumentWithComments(props.documentId, aiComments);
    }, [aiComments])

    useEffect(() => {
        if (props.initialDeltaStaticContent) {
            setContent(props.initialDeltaStaticContent)
        }
    }, [props.initialDeltaStaticContent])

    useEffect(() => {
        window.addEventListener("click", (e) => {
            const target = e.target as HTMLElement;
            const commentId = target.getAttribute("commentId");

            if (target.tagName.toLowerCase() === "comment-link" && commentId) {
                setAiComments(prevState => prevState.map(p => {
                    if (p.id === commentId.trim()) {
                        p.isOpen = true
                    } else {
                        p.isOpen = false;
                    }

                    return p;
                })
                );
            }
        });

        if (readonlyContext.showComments) {
            setAiComments(prevState => prevState.map((p, i) => {
                if (i == 0) {
                    p.isOpen = true
                } else {
                    p.isOpen = false;
                }

                return p;
            })
            );
        }

    }, []);

    const removeAiConvo = (key: string, range: Range) => {
        setAiComments((prev) => {
            return prev.filter((i) => i.id != key);
        });

        if (!range) {
            return;
        }

        const updateDelta = content?.compose(
            new Delta().retain(range.index).retain(range.length, { background: {} })
        );

        setContent(updateDelta);
    };

    const handleContentChangeDelayed =
        useCallback(
            debounce((value) => {
                setContent(value);
                setLastModified(new Date());
                console.log('User stopped typing. Value:', value);
                // Perform any other actions you want to take when the user stops typing
            }, 500),
            []
        );

    const handleContentChangeImmediate =
        (value: DeltaStatic) => {
            setContent(value);
            setLastModified(new Date());
        }

    const handleOnAiUpdatedPrompt = useCallback(
        (editedText: string, range?: Range) => {
            console.log("attrs", editedText, range, content);

            if (!editedText || !range || !content) {
                return;
            }

            const start = range.index; // The start index of the range
            const end = start + range.length;

            const rangeDelta = content.slice(start, end);

            // Get the attributes for the range
            const attributes = rangeDelta?.ops?.at(0)?.attributes ?? {};

            //#todo: we need to update range here also when there are changes made to range from editor
            const updateDelta = content.compose(
                new Delta()
                    .retain(range.index)
                    .delete(range.length)
                    .insert(editedText, attributes)
            );

            setContent(updateDelta);
        },
        [content]
    );

    const addAiConvo = (
        commentId: string,
        range: Range,
        selectedAttrs: SelectedText
    ) => {
        setAiComments((prevState) => {
            const oldVals = prevState.map((c) => ({
                ...c,
                isOpen: false,
            }));

            const newList = [
                ...oldVals,
                {
                    id: commentId,
                    range: range,
                    top: selectedAttrs.top,
                    bottom: selectedAttrs.bottom,
                    left: selectedAttrs.left,
                    right: selectedAttrs.right,
                    selectedText: selectedAttrs.text,
                    width: commentWidth,
                    isOpen: true,
                    messageHistory: [DEFAULT_MESSAGE_ON_NEW_CHAT]
                },
            ];

            return newList;
        });
    };

    const chatComponents = aiComments.map((aiComment) => (
        <AiCommentManager
            commentId={aiComment.id}
            width={commentWidth}
            range={aiComment.range}
            handleUpdatePrompt={handleOnAiUpdatedPrompt}
            onRemoveComponent={() => removeAiConvo(aiComment.id, aiComment.range)}

            messageHistory={aiComment.messageHistory}
            onNewMessage={(msgs) => setAiComments(prevState => {
                const newState = prevState.map(c => {
                    if (c.id === aiComment.id) {
                        c.messageHistory = msgs;
                    }

                    return c;
                });

                return newState;
            })}

            onOpenConvo={() =>
                setAiComments((prevState) =>
                    prevState.map((p) => {
                        if (p.id === aiComment.id) {
                            p.isOpen = true;
                        } else {
                            p.isOpen = false;
                        }

                        return p;
                    })
                )
            }
            onCloseConvo={() =>
                setAiComments((prevState) =>
                    prevState.map((p) => {
                        p.isOpen = false;
                        return p;
                    })
                )
            }
            selectedText={aiComment.selectedText}
            top={aiComment.top}
            bottom={aiComment.bottom}
            left={aiComment.left}
            right={aiComment.right}
            isOpen={aiComment.isOpen}
        />
    ));

    return (
        <>
            <Grid
                marginLeft={"5%"}
                templateAreas={`"header header"
                  "main comments"
                  "footer comments"`}
                gridTemplateRows={"50px 1fr 40px"}
                gridTemplateColumns={`1fr ${commentWidth}`}
                gap="1"
            >
                <GridItem pl="2" area={"header"}>
                    <DocumentTitle
                        documentName={documentName}
                        onDocumentNameChange={(newName) => setDocumentName(newName)}
                    />
                    {lastModified && (
                        <Text
                            fontSize="sm"
                            color="gray"
                            fontStyle="italic"
                            marginBottom="0.5rem"
                        >
                            Last modified: {lastModified.toLocaleString()}
                        </Text>
                    )}
                </GridItem>
                <GridItem pl="2" area={"comments"} maxHeight="100%" overflowY="auto">
                    {chatComponents}
                </GridItem>
                <GridItem pl="2" area={"main"} marginTop="1rem">
                    <QuillEditor
                        documentId={props.documentId}
                        initialHtmlData={props.documentHtml}
                        onContentChangeDelayed={handleContentChangeDelayed}
                        onAddComment={addAiConvo}
                        content={content}
                        documentName={documentName}
                    />
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

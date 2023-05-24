import { useOutsideClick } from "@chakra-ui/react";
import { useTour } from "@reactour/tour";
import html2canvas from "html2canvas";
import { DeltaStatic, Delta as DeltaType } from "quill";
import React, { useEffect, useState } from "react";
import ReactQuill, { Quill, Range } from "react-quill";
import { useReadonly } from "../../../contexts";
import openai from "../../../utility/openai";
import { documentStored, getIsNewUser, updateDocuments } from "../../../utility/storageHelpers";
import { SelectedText } from "./DocumentEditor";
import styles from "./QuillEditor.module.css";
import InlineToolbar from "./inlineToolbar/InlineToolbar";


const Delta = Quill.import("delta") as typeof DeltaType;

function getRandomHighlightColor() {
    const highlightColors = [
        "#ffff00", // Yellow
        "#00ff00", // Green
        "#0000ff", // Blue
        "#ff00ff", // Pink
        "#ffA500", // Orange
        "#ff0000", // Red
        "#00ffff", // Cyan
        "#800080", // Purple
        "#008080", // Teal
        "#a52a2a", // Brown
        "#e6e6fa", // Lavender
        "#90ee90", // Light Green
        "#add8e6", // Light Blue
        "#ffb6c1", // Light Pink
        "#ffffe0", // Light Yellow
        "#d3d3d3", // Light Gray
        "#e0ffff", // Light Cyan
        "#b19cd9", // Light Purple
        "#cd853f", // Light Brown
    ];

    let randomColor;

    // Keep track of colors that have been generated
    const generatedColors = new Set();

    // Loop until a unique color is generated
    do {
        // Generate a random index
        const randomIndex = Math.floor(Math.random() * highlightColors.length);

        // Get the color at the random index
        randomColor = highlightColors[randomIndex];

        // Check if the generated color is unique
        if (!generatedColors.has(randomColor)) {
            // Add the generated color to the set of generated colors
            generatedColors.add(randomColor);

            // Exit the loop since a unique color has been generated
            break;
        }
    } while (true);

    // Return the unique random color
    return randomColor;
}

class CommentLinkBlot extends Quill.import("blots/inline") {
    static blotName = "commentLink";
    static tagName = "comment-link";
    static className = styles.commentLink;

    static create(value?: { id: string; color: string }) {
        let node: HTMLElement = super.create();

        if (!value) {
            return node;
        }

        node.setAttribute("commentId", value.id);
        node.setAttribute("color", value.color);

        // @ts-ignore
        node.style = `border-bottom: ${value.color} solid 4px`;
        // Okay to set other non-format related attributes
        // These are invisible to Parchment so must be static
        return node;
    }

    static formats(node: any) {
        return {
            id: node.getAttribute("commentId"),
            color: node.getAttribute("color"),
        };
    }
}

Quill.register(CommentLinkBlot);

interface quillEditorProps {
    onContentChangeDelayed?: (value: DeltaStatic) => void;

    onAddComment?: (
        commentId: string,
        range: Range,
        selectedAttrs: SelectedText
    ) => void;
    initialHtmlData?: string | null;
    content?: DeltaStatic;
    documentName?: string | undefined;
    documentId: string
}
const modules = {
    toolbar: [
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        ["bold", "italic", "underline"],
        [{ align: [] }],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link"],
    ],
};

const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "background",
    "align",
    "list",
    "bullet",
    "link",
    "image",
    "video",
    "commentLink",
];

export function QuillEditor(props: quillEditorProps) {
    const [showInlineToolbar, setShowInlineToolbar] =
        useState<JSX.Element | null>(null);
    const quillRef = React.useRef<ReactQuill>(null);

    const toolbarDivRef = React.useRef(null);

    const documentAnalyzers = [];

    useOutsideClick({
        ref: toolbarDivRef,
        handler: () => {
            setShowInlineToolbar(null);
        },
    });

    const readonlyContext = useReadonly();

    const handleChange = (values: any): void => {
        if (quillRef.current?.editor && props.onContentChangeDelayed) {
            const changedContent = quillRef.current.editor.getContents();
            console.log("content changed", changedContent)
            props.onContentChangeDelayed(changedContent);
        }
    };

    const onLaunchAiClicked = (range: Range, selectedAttrs: SelectedText) => {
        console.log("clicl")
        const commentId = new Date().getTime();

        if (range) {
            console.log(range, "is range detected")
            const ops = new Delta().retain(range.index).retain(range.length, {
                commentLink: {
                    id: commentId.toString(),
                    color: getRandomHighlightColor(),
                },
            });

            // quillRef?.current?.editor?.updateContents(ops);
            console.log("new contents", quillRef?.current?.editor?.getContents().compose(ops))
            if (quillRef.current?.editor && props.onContentChangeDelayed) {
                props.onContentChangeDelayed(quillRef?.current?.editor?.getContents().compose(ops))

            }
        }

        props?.onAddComment?.call({}, commentId.toString(), range, selectedAttrs);

        setShowInlineToolbar(null);
    };

    const onEditSpellingAndGrammer = async () => {
        const text = quillRef.current?.editor?.getText();

        const editOpenAiPrompt = `
        You are a resume writing assistant. 
        I will pass you text and it is your job to suggest all spelling mistakes.

        Provide the list of suggestions in the desired format below.

        Desired format (in json):
        {
        "suggestion_type": "<spelling_or_grammer>"
        "suggested_fix": "<what_is_the_suggested_fix>"
        "starting_index": "<starting_index_of_where_to_apply_suggestion>"
        "length": "<length_of_location_in_text_for_suggestion>"
        }
        
        Text: """
            ${text}
            """
        `;

        const response = openai
            .createCompletion({
                prompt: editOpenAiPrompt,
                model: "text-davinci-003",
                max_tokens: 2048,
            })
            .then((a) => console.log(a));
    };

    useEffect(() => {
        console.log("rerendering for document name");

        if (quillRef.current) {

            const editorNode = quillRef.current.getEditor().root;
            const width = editorNode.clientWidth;
            const height = editorNode.clientHeight / 2;
            html2canvas(editorNode, { width, height }).then((canvas) => {
                const dataUrl = canvas.toDataURL();
                const documentName = props.documentName;

                updateDocuments((document: documentStored) => {
                    // console.log(document, 'yoooo');

                    if (document && document.id === props.documentId) {
                        document.thumbnail = dataUrl;
                        if (document.documentName && props.documentName && document.documentName != props.documentName) {
                            document.documentName = props.documentName;

                        }

                        document.content = quillRef?.current?.editor?.getContents();
                    }


                    // }
                    // console.log( document.documentName, "hey there", props.documentName);

                    return document;
                })
            });
        }
    }, [props.content, props.documentName]);

    const { isOpen, currentStep, steps, setIsOpen, setCurrentStep } = useTour()


    useEffect(() => {
        if (quillRef.current && getIsNewUser() && !isOpen) {
            // quillRef?.current?.editor?.setSelection(222, 148);
            setIsOpen(true)
        }

    }, [quillRef.current]);

    const isNewUser = getIsNewUser();

    return (
        <>
            <ReactQuill
                style={{
                    backgroundColor: "white",
                }}
                placeholder="Copy paste resume from Google Drive or any file here...."
                className={"container"}
                ref={quillRef}
                value={props.content ?? props.initialHtmlData ?? ""}
                onChange={(content, delta, source, editor) => {
                    console.log(content, delta, source, "from editor")
                    handleChange(delta)
                }}
                modules={modules}
                formats={formats}
                onChangeSelection={readonlyContext?.readonly ? () => { } : (range: Range) => {
                    const rangeToAllowSelection = isNewUser ? 10 : 0;
                    if ((range?.length ?? 0) > rangeToAllowSelection) {
                        var text = quillRef.current?.editor?.getText(
                            range?.index,
                            range?.length
                        );

                        const scrollLeft =
                            document.documentElement.scrollLeft || document.body.scrollLeft;
                        const scrollTop =
                            document.documentElement.scrollTop || document.body.scrollTop;

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

                            const toolbarComponenet = (
                                <InlineToolbar
                                    top={selectedAttrs.top}
                                    bottom={selectedAttrs.bottom}
                                    left={x}
                                    right={selectedAttrs.right}
                                    lineHeight={elementLineHeight}
                                    onClickLaunchChat={() =>
                                        onLaunchAiClicked(range, selectedAttrs)
                                    }
                                    onClickCheckGrammer={() => onEditSpellingAndGrammer()}
                                />
                            );

                            setShowInlineToolbar(toolbarComponenet);
                        }
                    }
                }}
            />

            <div ref={toolbarDivRef}>{showInlineToolbar}</div>
        </>
    );
}

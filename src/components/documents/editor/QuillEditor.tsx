import React, { useState, useEffect } from "react";
import ReactQuill, { Range } from "react-quill";
import { useOutsideClick } from "@chakra-ui/react";
import { DeltaStatic, Sources } from 'quill';
import { SelectedText } from "./DocumentEditor";
import InlineToolbar from "./InlineToolbar";
import html2canvas from 'html2canvas';


interface quillEditorProps {
    onContentChange: (value: DeltaStatic) => void,
    onAddComment: (range: Range, selectedAttrs: SelectedText) => void
    initialHtmlData: string | null,
    content?: DeltaStatic,
}

export function QuillEditor(props: quillEditorProps) {
    const [showInlineToolbar, setShowInlineToolbar] = useState<JSX.Element | null>(null);
    const quillRef = React.useRef<ReactQuill | null>(null);

    const toolbarDivRef = React.useRef(null);

    useOutsideClick({
        ref: toolbarDivRef,
        handler: () => {
            setShowInlineToolbar(null);
        }
    });

    const handleChange = (value: string, delta: DeltaStatic, source: Sources): void => {
        if (quillRef.current?.editor) {
            props.onContentChange(quillRef.current.editor.getContents());
        }
    };

    const onLaunchAiClicked = (range: Range, selectedAttrs: SelectedText) => {
        const format = {
            background: "rgb(124, 114, 227)" // set background color to yellow
        };

        if (range) {
            quillRef?.current?.editor?.formatText(range, format); // apply new background color format
        }

        props.onAddComment(range, selectedAttrs);

        setShowInlineToolbar(null);
    };

    useEffect(() => {
        if (quillRef.current) {
          const editorNode = quillRef.current.getEditor().root;
          const width = editorNode.clientWidth;
        const height = editorNode.clientHeight / 2;
        html2canvas(editorNode, { width, height }).then(canvas => {
            const dataUrl = canvas.toDataURL();
            localStorage.setItem('thumbnail', dataUrl);
            console.log(dataUrl);
            
          });
        }
      }, [props.content]);

    return <>
        <ReactQuill
            ref={quillRef}
            value={props.content ?? props.initialHtmlData ?? ""}
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

        <div ref={toolbarDivRef}>
            {showInlineToolbar}
        </div>
    </>;
}

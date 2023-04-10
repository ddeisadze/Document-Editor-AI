import React, { useState } from "react";
import ReactQuill, { Range, Quill } from "react-quill";
import { useOutsideClick } from "@chakra-ui/react";
import { DeltaStatic, Sources } from 'quill';
import { SelectedText } from "./DocumentEditor";
import InlineToolbar from "./toolbar/InlineToolbar";
import "./QuillEditor.css"

interface quillEditorProps {
    onContentChange?: (value: DeltaStatic) => void,
    onAddComment?: (range: Range, selectedAttrs: SelectedText) => void
    initialHtmlData?: string | null,
    content?: DeltaStatic,
}
const modules = {
    toolbar: [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        ['bold', 'italic', 'underline'],
        [{ 'align': [] }],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        ['link']
    ]
};

const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'background',
    'align',
    'list', 'bullet',
    'link', 'image', 'video'
];

export function QuillEditor(props: quillEditorProps) {
    const [showInlineToolbar, setShowInlineToolbar] = useState<JSX.Element | null>(null);
    const quillRef = React.useRef<ReactQuill>(null);

    const toolbarDivRef = React.useRef(null);

    useOutsideClick({
        ref: toolbarDivRef,
        handler: () => {
            setShowInlineToolbar(null);
        }
    });

    const handleChange = (value: string, delta: DeltaStatic, source: Sources): void => {
        if (quillRef.current?.editor && props.onContentChange) {
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

        props?.onAddComment?.call({}, range, selectedAttrs);

        setShowInlineToolbar(null);
    };
    // console.log(Quill.imports);
    // const allowClassNames = Quill.import('attributors/class/attributor');
    // allowClassNames.whitelist = ['center'];
    // Quill.register(allowClassNames, true);

    const Parchment = Quill.import('parchment');
    const PrefixClass = new Parchment.Attributor.Class('prefix', 'prefix', {
        scope: Parchment.Scope.INLINE,
        whitelist: ['align-center', 'another-class']
    });
    Quill.register(PrefixClass, true);

    return <>
        <ReactQuill
            className="container"
            ref={quillRef}
            value={props.content ?? props.initialHtmlData ?? ""}
            onChange={handleChange}
            modules={modules}
            formats={formats}
            onChangeSelection={(range: Range) => {
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

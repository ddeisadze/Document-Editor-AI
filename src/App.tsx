import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  EditorState,
  ContentState,
  convertFromHTML,
  EditorBlock,
  Modifier,
  SelectionState,
} from "draft-js";
import Editor from "@draft-js-plugins/editor";
import "draft-js/dist/Draft.css";
import mammoth from "mammoth";
import { NewAIConversation } from "./NewAIConversation";
import createInlineToolbarPlugin from "@draft-js-plugins/inline-toolbar";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import { ChakraProvider, Grid, GridItem } from "@chakra-ui/react"

import {
  ItalicButton,
  BoldButton,
  UnderlineButton,
  CodeButton,
  HeadlineOneButton,
  HeadlineTwoButton,
  HeadlineThreeButton,
  UnorderedListButton,
  OrderedListButton,
  BlockquoteButton,
  CodeBlockButton,
} from "@draft-js-plugins/buttons";

const resumeFileName = `http://localhost:3000/resume.docx`;

async function getHtml() {
  const arrBuffer = await fetch(resumeFileName)
    .then((res) => res.blob())
    .then((blob) => blob.arrayBuffer());

  const html = await mammoth
    .convertToHtml({ arrayBuffer: arrBuffer })
    .then(function (result) {
      var html = result.value;
      // var messages = result.messages;

      return html;
    })
    .catch((err) => console.log("error", err));

  return html;
}

function EditorBlockWrapper(props: any) {
  return (
    <div>
      <EditorBlock {...props} />
    </div>
  );
}

function blockRender(contentBlock: any) {
  return {
    component: EditorBlockWrapper,
    editable: true,
    props: {
      foo: "bar",
    },
  };
}

const inlineToolbarPlugin = createInlineToolbarPlugin();

const { InlineToolbar } = inlineToolbarPlugin;

function MyEditor() {
  const [editorState, setEditorState] = useState<EditorState>(() =>
    EditorState.createEmpty()
  );

  const [selectedTextState, setSelectedTextState] = useState(
    {
      text: "",
      top: 0,
      bottom: 0,
      right: 0,
      left: 0
    }
  )
  const [selectionStateGlobal, setSelectionState] = useState<SelectionState>();

  const [toolbarStyle, setToolbarStyle] = useState({ display: 'none' });

  // const [aiConversationsChildren, setAiConversationsChildren] = useState<FC<NewAIConversation>[]>


  // const [plugins, InlineToolbar] = useMemo(() => {
  //   const inlineToolbarPlugin = createInlineToolbarPlugin();
  //   return [[inlineToolbarPlugin], inlineToolbarPlugin.InlineToolbar];
  // }, []);

  const quillRef = React.useRef<ReactQuill>(null);

  let quill = quillRef?.current?.getEditor();

  useEffect(() => {
    const html = getHtml().then((html) => {
      // const blocksFromHTML = convertFromHTML(html || "");

      // const state = ContentState.createFromBlockArray(
      //   blocksFromHTML.contentBlocks,
      //   blocksFromHTML.entityMap
      // );

      handlePasteHTML(html);

      const quill = quillRef?.current?.getEditor();

      if (!quill) {
        return false;
      }
      // const toolbar = quillRef?.current?.toolbar;

      const handleSelectionChange = () => {
        const selection = quill.getSelection();
        if (selection) {
          const bounds = quill.getBounds(selection.index);
          // setToolbarStyle({ display: 'block', left: bounds.left, top: bounds.bottom });
        } else {
          setToolbarStyle({ display: 'none' });
        }
      };

      quill.on('selection-change', handleSelectionChange);

      return () => {
        quill.off('selection-change', handleSelectionChange);
      };

      // setEditorState(EditorState.createWithContent(state));
    });
  }, []);

  const handleOnChange = (newState: EditorState) => {

  };

  const handleUpdatePrompt = (editedText: string) => {
    if (!selectionStateGlobal) {
      return;
    }

    if (!editedText) {
      return;
    }

    const contentState = editorState.getCurrentContent();

    // Update the content state with the new text
    const updatedContentState = Modifier.replaceText(
      contentState,
      selectionStateGlobal,
      editedText
    );

    // Create a new editor state with the updated content state
    const updatedEditorState = EditorState.push(
      editorState,
      updatedContentState,
      "change-block-data"
    );

    setEditorState(updatedEditorState);
  };

  const component = () => {
    return <button>Test</button>;
  };



  const handlePasteHTML = (html: any) => {
    if (quillRef.current) {
      quillRef.current.getEditor().clipboard.dangerouslyPasteHTML(0, html);
    }
  };

  const handleBoldClick = () => {
    const quill = quillRef?.current?.getEditor();
    quill?.format('bold', true);
  };

  const handleItalicClick = () => {
    const quill = quillRef?.current?.getEditor();
    quill?.format('italic', true);
  };

  // const handleSelection = (selection) => {
  // const bounds = quill.getBounds(selection.index);
  // }

  const commentWidth = "300px"

  return (
    <>
      <h1> Chat GPT interaction</h1>

      <p>Selected Text: {selectedTextState?.text ?? "N/A"}</p>

      <h1> Editor</h1>

      <Grid
        marginLeft={"5%"}
        marginRight={"5%"}
        templateAreas={`"header header"
                  "main comments"
                  "footer comments"`}
        gridTemplateRows={'50px 1fr 30px'}
        gridTemplateColumns={`1fr ${commentWidth}`}
        h='200px'
        gap='1'
      >
        <GridItem pl='2' area={'header'}>
          Header
        </GridItem>
        <GridItem pl='2' area={'comments'}>
          {selectedTextState && (
            <NewAIConversation
              width={commentWidth}
              handleUpdatePrompt={handleUpdatePrompt}
              selectedText={selectedTextState.text}
              top={selectedTextState?.top}
              bottom={selectedTextState?.bottom}
              left={selectedTextState?.left}
              right={selectedTextState?.right}
            />

          )}
        </GridItem>
        <GridItem pl='2' area={'main'}>
          <div>
            {/* <Editor editorState={editorState} onChange={handleOnChange} blockRendererFn={blockRender} plugins={[inlineToolbarPlugin]} /> */}
            {/* <InlineToolbar> */}
            {/* {component} */}
            {/* </InlineToolbar> */}
            <div style={toolbarStyle}>
              <button onClick={handleBoldClick}>Bold</button>
              <button onClick={handleItalicClick}>Italic</button>
            </div>
            <ReactQuill ref={quillRef} onChangeSelection={(e, b, c,) => {
              if (e?.length ?? 0 > 0) {
                var text = quill?.getText(e?.index, e?.length);
                const bounds = quillRef.current?.editor?.getBounds(e?.index ?? 0);

                const editingArea = quillRef.current?.getEditingArea().getBoundingClientRect();

                const scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft;
                const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;

                const selection = window.getSelection();
                const range = selection?.getRangeAt(0);
                const boundingRect = range?.getBoundingClientRect();

                console.log(scrollTop);

                setSelectedTextState({
                  text: text ?? "",
                  top: (boundingRect?.top ?? 0) + scrollTop,
                  bottom: boundingRect?.bottom ?? 0,
                  right: boundingRect?.right ?? 0,
                  left: (boundingRect?.left ?? 0) + scrollLeft,
                })

              }
            }} />
          </div>
        </GridItem>
        <GridItem pl='2' area={'footer'}>
          Footer
        </GridItem>
      </Grid>

    </>
  );
}

function App() {
  return (
    <div className="App">
      <ChakraProvider>
        <MyEditor />
      </ChakraProvider>
    </div>
  );
}

export default App;

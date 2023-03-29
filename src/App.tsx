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

  const [selectedTextState, setSelectedTextState] = useState<string>("");
  const [selectionStateGlobal, setSelectionState] = useState<SelectionState>();

  // const [plugins, InlineToolbar] = useMemo(() => {
  //   const inlineToolbarPlugin = createInlineToolbarPlugin();
  //   return [[inlineToolbarPlugin], inlineToolbarPlugin.InlineToolbar];
  // }, []);

  useEffect(() => {
    const html = getHtml().then((html) => {
      // const blocksFromHTML = convertFromHTML(html || "");

      // const state = ContentState.createFromBlockArray(
      //   blocksFromHTML.contentBlocks,
      //   blocksFromHTML.entityMap
      // );

      handlePasteHTML(html);

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

  const quillRef: any = React.useRef(null);

  const handlePasteHTML = (html: any) => {
    if (quillRef.current) {
      quillRef.current.getEditor().clipboard.dangerouslyPasteHTML(0, html);
    }
  };

  return (
    <>
      <h1> Chat GPT interaction</h1>

      <p>Selected Text: {selectedTextState}</p>

      <div style={{ position: "relative", height: "200px" }}>
        {selectedTextState && (
          <NewAIConversation
            handleUpdatePrompt={handleUpdatePrompt}
            selectedText={selectedTextState}
          />
        )}
      </div>

      <h1> Editor</h1>

      <div
        style={{
          padding: "10%",
        }}
      >
        {/* <Editor editorState={editorState} onChange={handleOnChange} blockRendererFn={blockRender} plugins={[inlineToolbarPlugin]} /> */}
        {/* <InlineToolbar> */}
        {/* {component} */}
        {/* </InlineToolbar> */}
        <ReactQuill ref={quillRef} />
      </div>
    </>
  );
}

function App() {
  return (
    <div className="App">
      <MyEditor />
    </div>
  );
}

export default App;

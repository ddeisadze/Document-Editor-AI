import React, { useEffect, useMemo, useRef, useState } from 'react';
import { EditorState, ContentState, convertFromHTML, EditorBlock, Modifier, SelectionState } from 'draft-js';
import Editor from "@draft-js-plugins/editor"
import 'draft-js/dist/Draft.css';
import mammoth from 'mammoth';
import { NewAIConversation } from './NewAIConversation';
import createInlineToolbarPlugin from '@draft-js-plugins/inline-toolbar';
import '@draft-js-plugins/inline-toolbar/lib/plugin.css'
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
} from '@draft-js-plugins/buttons';

const resumeFileName = `http://localhost:3000/resume.docx`;

async function getHtml() {
  const arrBuffer = await fetch(resumeFileName)
    .then(res => res.blob())
    .then(blob => blob.arrayBuffer())


  const html = await mammoth.convertToHtml({ arrayBuffer: arrBuffer })
    .then(function (result) {
      var html = result.value;
      // var messages = result.messages;

      return html;
    }).catch(err => console.log("error", err))

  return html;
}

function EditorBlockWrapper(props: any) {

  return <div>
    <EditorBlock {...props} />
  </div>

}

function blockRender(contentBlock: any) {

  return {
    component: EditorBlockWrapper,
    editable: true,
    props: {
      foo: 'bar',
    }
  }
}

const inlineToolbarPlugin = createInlineToolbarPlugin();

const { InlineToolbar } = inlineToolbarPlugin;

function MyEditor() {
  const [editorState, setEditorState] = useState<EditorState>(
    () => EditorState.createEmpty()
  );

  const [selectedTextState, setSelectedTextState] = useState<string>("");
  const [selectionStateGlobal, setSelectionState] = useState<SelectionState>();

  // const [plugins, InlineToolbar] = useMemo(() => {
  //   const inlineToolbarPlugin = createInlineToolbarPlugin();
  //   return [[inlineToolbarPlugin], inlineToolbarPlugin.InlineToolbar];
  // }, []);

  useEffect(() => {
    const html = getHtml().then(html => {
      console.log(html, "yooo");
      
      const blocksFromHTML = convertFromHTML(html || "");

      const state = ContentState.createFromBlockArray(
        blocksFromHTML.contentBlocks,
        blocksFromHTML.entityMap,
      );

      setEditorState(EditorState.createWithContent(state))
    });


  }, [])

  const handleOnChange = (newState: EditorState) => {

    const currentContentState = editorState.getCurrentContent()
    const newContentState = newState.getCurrentContent()

    if (currentContentState !== newContentState) {
      // There was a change in the content  
    } else {

      // The change was triggered by a change in focus/selection
      const selectionState = newState.getSelection();
      const contentState = newState.getCurrentContent();
      const startKey = selectionState.getStartKey();
      const endKey = selectionState.getEndKey();
      const startOffset = selectionState.getStartOffset();
      const endOffset = selectionState.getEndOffset();
      let selectedText = '';

      const blockWithSelection = contentState.getBlockForKey(selectionState.getAnchorKey());

      if (startKey === endKey) {
        // If the selection is within a single block
        const block = contentState.getBlockForKey(startKey);
        selectedText = block.getText().slice(startOffset, endOffset);
      } else {
        // If the selection spans multiple blocks
        const startBlock = contentState.getBlockForKey(startKey);
        const endBlock = contentState.getBlockForKey(endKey);

        // Add text from the start block
        selectedText += startBlock.getText().slice(startOffset) + '\n';

        // Add text from any intervening blocks
        for (let blockKey = startKey; blockKey !== endKey; blockKey = contentState.getKeyAfter(blockKey)) {
          const block = contentState.getBlockForKey(blockKey);
          selectedText += block.getText() + '\n';
        }

        // Add text from the end block
        selectedText += endBlock.getText().slice(0, endOffset);
      }

      setSelectionState(selectionState);
      setSelectedTextState(selectedText)

    }
    setEditorState(newState);

  }

  const handleUpdatePrompt = (editedText: string) => {
    if (!selectionStateGlobal) {
      return;
    }

    if (!editedText) {
      return;
    }

    const contentState = editorState.getCurrentContent();

    // Update the content state with the new text
    const updatedContentState = Modifier.replaceText(contentState, selectionStateGlobal, editedText);

    // Create a new editor state with the updated content state
    const updatedEditorState = EditorState.push(editorState, updatedContentState, 'change-block-data');

    setEditorState(updatedEditorState)
  }

  const component = () => {
    return <button>Test</button>
  }



  return <>
    <h1> Chat GPT interaction</h1>

    <p>Selected Text: {selectedTextState}</p>

    <div style={{ position: "relative", height: "200px" }}>
      {selectedTextState && <NewAIConversation handleUpdatePrompt={handleUpdatePrompt} selectedText={selectedTextState} />}

    </div>

    <h1> Editor</h1>


    <div style={{
      padding: "10%"
    }}>
      <Editor editorState={editorState} onChange={handleOnChange} blockRendererFn={blockRender} plugins={[inlineToolbarPlugin]} />
      <InlineToolbar>
        {component}
      </InlineToolbar>
    </div>


  </>
}

function App() {
  return (
    <div className="App">
      <MyEditor />
    </div>
  );
}

export default App;

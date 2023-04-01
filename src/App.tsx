import React, { FC, useCallback, useEffect, useMemo, useRef, useState } from "react";
import mammoth from "mammoth";
import { NewAIConversation } from "./NewAIConversation";
import ReactQuill, { Quill, Range } from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./App.css"
import { ChakraProvider, Grid, GridItem, Text, VStack } from "@chakra-ui/react"

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
import DocumentTitle from "./LoginTitle";

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

interface aiConvoComponents {
  key: string,
  componenet: JSX.Element,
  range: Range
}

function MyEditor() {
  const [toolbarStyle, setToolbarStyle] = useState({ display: 'none' });

  const [aiConversationsChildren, setAiConversationsChildren] = useState<aiConvoComponents[]>([]);

  const [lastModified, setLastModified] = useState<Date>();


  const quillRef = React.useRef<ReactQuill>(null);

  let quill = quillRef?.current?.getEditor();

  useEffect(() => {
    const html = getHtml().then((html) => {
      handlePasteHTML(html);

      const quill = quillRef?.current?.getEditor();

      if (!quill) {
        return false;
      }

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
    });
  }, []);

  const handleUpdatePrompt = (editedText: string) => {

    if (!editedText) {
      return;
    }

  };

  const component = () => {
    return <button>Test</button>;
  };

  const handleChange = (): void => {
    setLastModified(new Date());
  };



  const handlePasteHTML = (html: any) => {
    if (quillRef.current) {
      quillRef.current.getEditor().clipboard.dangerouslyPasteHTML(0, html);
    }
  };

  const commentWidth = "300px"

  const removeAiConvo = (key: string) => {
    setAiConversationsChildren((prev) => {
      const componentToRemove = prev.filter(i => i.key == key)[0];
      quillRef.current?.editor?.removeFormat(componentToRemove.range?.index ?? 0, componentToRemove.range?.length ?? 0)

      return prev.filter(i => i.key != key)
    }
    )
  };

  return (
    <>
      <Grid
        marginLeft={"5%"}
        marginRight={"5%"}
        templateAreas={`"header header"
                  "main comments"
                  "footer comments"`}
        gridTemplateRows={'50px 1fr 30px'}
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
          <div>
            {/* <Editor editorState={editorState} onChange={handleOnChange} blockRendererFn={blockRender} plugins={[inlineToolbarPlugin]} /> */}
            {/* <InlineToolbar> */}
            {/* {component} */}
            {/* </InlineToolbar> */}
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

                  const selectedAttrs = {
                    text: text ?? "",
                    top: (boundingRect?.top ?? 0) + scrollTop,
                    bottom: boundingRect?.bottom ?? 0,
                    right: boundingRect?.right ?? 0,
                    left: (boundingRect?.left ?? 0) + scrollLeft,
                  }

                  const format = {
                    background: "rgb(124, 114, 227)" // set background color to yellow
                  };

                  if (range) {
                    quillRef?.current?.editor?.formatText(range, format); // apply new background color format
                    // quillRef?.current?.editor?.format('highlight', true);
                    // quillRef?.current?.editor?.format('cursor', 'pointer', "user");
                  }

                  const key = new Date().getTime().toString();

                  setAiConversationsChildren([
                    ...aiConversationsChildren,
                    {
                      range: range,
                      key: key,
                      componenet: <NewAIConversation
                        key={key}
                        width={commentWidth}
                        handleUpdatePrompt={handleUpdatePrompt}
                        onRemoveComponent={() => removeAiConvo(key)}
                        selectedText={selectedAttrs.text}
                        top={selectedAttrs.top}
                        bottom={selectedAttrs.bottom}
                        left={selectedAttrs.left}
                        right={selectedAttrs.right}
                      />
                    }
                  ]);
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

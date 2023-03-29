import React, { useEffect, useRef, useState } from 'react';
import { Editor, EditorState, ContentState, convertFromHTML, EditorBlock } from 'draft-js';
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";

import { } from "@draft-js-plugins/editor"
import 'draft-js/dist/Draft.css';
import mammoth from 'mammoth';

// import styles from "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  MessageModel,
  TypingIndicator,
} from "@chatscope/chat-ui-kit-react";
// import doc from './resume.docx'


import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from "openai"

const configuration = new Configuration({
  apiKey: "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",
});
const openai = new OpenAIApi(configuration);

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

  //   onClick = {(a: any) => console.log(a)
  // } onMouseEnter = {(a) => console.log(a)}
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

class ChatState {

  messages = [];

  constructor() {

  }

}

class OpenAiState {

}

function NewAIConversation(props: {
  selectedText: string
}) {

  // const [chatState, setChatState] = useState<ChatState>()
  // const [openAiState, setOpenAiState] = useState<OpenAiState>();

  const openAiDefaultValue: ChatCompletionRequestMessage[] = [
    {
      role: 'system',
      content: "You are a wrting assistant. I will pass you a prompt and a question, or ask for improvement. It is your job to help."
    },
    {
      role: "system",
      content: `Here is the prompt we want to answer the question about: ${props.selectedText}`
    }
  ];


  const [chatState, setChatState] = useState<MessageModel[]>([{
    message: "Ask questions and/or suggestions from our AI model.",
    sentTime: "just now",
    sender: "AiDox",
    direction: 'incoming',
    position: 'first'
  }])
  const [openAiState, setOpenAiState] = useState<ChatCompletionRequestMessage[]>(openAiDefaultValue);

  const [openAiLoading, setOpenAiLoading] = useState<boolean>(false);

  console.log("message state", chatState)
  console.log("openAi state", openAiState)



  // useEffect(() => {

  //   setOpenAiState(
  //     [{
  //       role: 'system',
  //       content: "You are a wrting assistant. I will pass you a prompt and a question, or ask for improvement. It is your job to help."
  //     },
  //     {
  //       role: "system",
  //       content: `Here is the prompt we want to answer the question about: ${prompt}`
  //     },
  //     ]
  //   )

  // }, [])


  const handleMessageSend = (question: string) => {

    setChatState(
      [
        ...chatState,
        {
          message: question,
          sentTime: "just now",
          sender: "You",
          direction: 'outgoing',
          position: 'last'
        }
      ]
    )

    setOpenAiLoading(true)
    openai.createChatCompletion(
      {
        model: "gpt-3.5-turbo",
        messages: [
          ...openAiState,
          {
            role: "user",
            content: question
          }]
      }
    )
      .then(r => {
        console.log("chatgpt succ", r)
        const answer = r.data.choices[0].message as ChatCompletionRequestMessage;
        setOpenAiState([
          ...openAiState,
          {
            role: "user",
            content: question
          },
          answer
        ])

        setOpenAiLoading(false)

        setChatState(
          [
            ...chatState,
            {
              message: answer.content,
              sentTime: "just now",
              sender: "AiDox",
              direction: 'outgoing',
              position: 'last'
            }
          ]
        )
      }
      )
      .catch(e => {
        console.log("chatgpt error", e)
        setOpenAiLoading(false)
      })
  };

  return <>
    <ChatContainer>
      <MessageList typingIndicator={openAiLoading && <TypingIndicator content="AiDox is typing" />}>
        {chatState.map((item) => <Message model={item} />)}

      </MessageList>
      <MessageInput onSend={e => handleMessageSend(e)} placeholder="Type message here" attachButton={false} />
    </ChatContainer>
  </>
}

function MyEditor() {
  const [editorState, setEditorState] = useState<EditorState>(
    () => EditorState.createEmpty()
  );

  const [selectedTextState, setSelectedTextState] = useState<string>("");

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

      setSelectedTextState(selectedText)

    }
    setEditorState(newState);

  }

  return <>
    <h1> Chat GPT interaction</h1>

    <p>Selected Text: {selectedTextState}</p>

    <div style={{ position: "relative", height: "200px" }}>
      {selectedTextState && <NewAIConversation selectedText={selectedTextState} />}

    </div>

    <h1> Editor</h1>
    <Editor editorState={editorState} onChange={handleOnChange} blockRendererFn={blockRender} />
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

import React, { useReducer, useState } from 'react';
import {
    ChatContainer,
    MessageList,
    Message,
    MessageInput,
    MessageModel,
    TypingIndicator,
    Button
} from "@chatscope/chat-ui-kit-react";
import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from "openai";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";

const configuration = new Configuration({
    apiKey: "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",
});

const openai = new OpenAIApi(configuration);


export function NewAIConversation(props: {
    handleUpdatePrompt: (updatedText: string) => void | undefined;
    selectedText: string;
}) {
    // const [chatState, setChatState] = useState<ChatState>()
    // const [openAiState, setOpenAiState] = useState<OpenAiState>();

    const openAiDefaultValue: ChatCompletionRequestMessage[] = [
        {
            role: 'system',
            content: `You are a resume writing assistant. I will pass you a prompt and a question or ask from an user. It is your job to help answer and fulfill the ask. 
      Everytime you revise the prompt, please preface with: updated version`
        },
        {
            role: "system",
            content: `Here is the prompt: ${props.selectedText}`
        }
    ];


    const [chatState, ChatDispatch] = useReducer((myArray: MessageModel[], { type, value }: { type: string; value: MessageModel; }): MessageModel[] => {
        switch (type) {
            case "add":
                return [...myArray, value];
            case "remove":
                return myArray.filter((_: any, index: any) => index !== value);
            default:
                return myArray;
        }
    }, [{
        message: "Ask questions and/or suggestions from our AI model.",
        sentTime: "just now",
        sender: "AiDox",
        direction: 'incoming',
        position: 'first'
    }]);

    const [openAiState, setOpenAiState] = useState<ChatCompletionRequestMessage[]>(openAiDefaultValue);

    const [openAiLoading, setOpenAiLoading] = useState<boolean>(false);

    const [aiAnswer, setAiAnswer] = useState<string>("");


    const handleMessageSend = (question: string) => {

        ChatDispatch({
            type: "add",
            value: {
                message: question,
                sentTime: "just now",
                sender: "You",
                direction: 'outgoing',
                position: 'last'
            }
        });

        setOpenAiLoading(true);
        const newAiMessage: ChatCompletionRequestMessage = {
            role: "user",
            content: `Here is the ask or question from user : ${question} about the provided prompt. Everytime you revise the prompt, please preface with: updated version`
        };

        openai.createChatCompletion(
            {
                model: "gpt-3.5-turbo",
                messages: [
                    ...openAiState,
                    newAiMessage
                ]
            }
        )
            .then(r => {
                console.log("chatgpt succ", r);
                const answer = r.data.choices[0].message as ChatCompletionRequestMessage;
                setOpenAiState([
                    ...openAiState,
                    newAiMessage,
                    answer
                ]);

                setOpenAiLoading(false);

                setAiAnswer(answer.content);

                ChatDispatch({
                    type: "add",
                    value: {
                        message: answer.content,
                        sentTime: "just now",
                        sender: "AiDox",
                        direction: 'incoming',
                        position: 'last'
                    }
                });
            }
            )
            .catch(e => {
                console.log("chatgpt error", e);
                setOpenAiLoading(false);
            });
    };

    return <>
        <ChatContainer>
            <MessageList typingIndicator={openAiLoading && <TypingIndicator content="AiDox is typing" />}>
                {chatState.map((item: any) => <Message model={item} />)}
                {chatState[chatState.length - 1].message?.toLowerCase().includes("updated version") &&
                    <Message model={{
                        direction: "incoming",
                        type: "custom",
                        position: 'last'
                    }}>
                        <Message.CustomContent>
                            <Button onClick={e => props.handleUpdatePrompt?.call({}, aiAnswer)} border>Add gennerated prompt to Document</Button>
                        </Message.CustomContent>
                    </Message>}
            </MessageList>
            <MessageInput onSend={e => handleMessageSend(e)} placeholder="Type message here" attachButton={false} />
        </ChatContainer>
    </>;
}

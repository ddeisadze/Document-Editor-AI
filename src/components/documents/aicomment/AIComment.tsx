import React, { useReducer, useState, useEffect, ReactElement } from "react";
import { ChatCompletionRequestMessage } from "openai";
import {
    Button,
} from "@chakra-ui/react";
import { Range } from "react-quill";
import CommentDialog, { } from "./CommentDialog";
import openai from "../../../utility/openai";

export interface MessageModel {
    message: string,
    sentTime: string,
    sender: string,
    direction: string,
    position: string,
}

export const returnAiRecs = (text?: string) => {
    if (!text) {
        return null;
    }

    const regex = /Generated\s+answer:\s+(?<text>.+)/i
    const result = text.match(regex);

    if (result && result.groups) {
        const updatedText = result.groups.text;

        return updatedText.trim();
    } else {
        return null;
    }
}


export function AiChat(props: {
    handleUpdatePrompt?: (updatedText: string, range?: Range) => void | undefined;
    onNewMessage?: (messages: MessageModel[]) => void;
    messages?: MessageModel[];

    footerComponent?: ReactElement;
    headerComponent?: ReactElement;

    top?: string | number

    range?: Range;
    selectedText: string;
    width: string;

}) {
    const openAiDefaultValue: ChatCompletionRequestMessage[] = [
        {
            role: "system",
            content: `You are a resume writing assistant. 
            I will pass you a text and multiple requests from the user on the text.
            It is your job to answer and fulfill the request. 

            Desired format:
            Generated answer: <your_answer_to_request>

            Text: """
            ${props.selectedText}
            """
            `,
        }
    ];

    const [chatState, ChatDispatch] = useReducer(
        (
            myArray: MessageModel[],
            { type, value }: { type: string; value?: MessageModel }
        ): MessageModel[] => {
            let updatedArr = [];
            switch (type) {
                case "add":
                    if (!value) return myArray;
                    updatedArr = [...myArray, value];
                    props?.onNewMessage?.call({}, updatedArr)
                    return updatedArr;
                case "remove":
                    updatedArr = myArray.filter((_: any, index: any) => index !== value);
                    props?.onNewMessage?.call({}, updatedArr)
                    return updatedArr;
                case "reset":
                    return props?.messages ?? myArray
                default:
                    updatedArr = myArray;
                    props?.onNewMessage?.call({}, updatedArr)
                    return updatedArr;
            }

        },
        props?.messages ?? []
    );

    useEffect(() => {
        ChatDispatch({
            type: "reset"
        })
    }, [props.messages])

    const [openAiState, setOpenAiState] =
        useState<ChatCompletionRequestMessage[]>(openAiDefaultValue);

    const [openAiLoading, setOpenAiLoading] = useState<boolean>(false);

    const handleMessageSend = (question: string) => {
        ChatDispatch({
            type: "add",
            value: {
                message: question,
                sentTime: "just now",
                sender: "You",
                direction: "outgoing",
                position: "last",
            },
        });

        setOpenAiLoading(true);
        const newAiMessage: ChatCompletionRequestMessage = {
            role: "user",
            content: `Answer the request from the user below about the original text.

            Request: """
            ${question}"""`
        };

        openai
            .createChatCompletion({
                model: "gpt-3.5-turbo",
                messages: [...openAiState, newAiMessage]
            })
            .then((r: any) => {
                const answer = r.data.choices[0]
                    .message as ChatCompletionRequestMessage;
                setOpenAiState([...openAiState, newAiMessage, answer]);

                setOpenAiLoading(false);

                ChatDispatch({
                    type: "add",
                    value: {
                        message: answer.content,
                        sentTime: "just now",
                        sender: "AiDox",
                        direction: "incoming",
                        position: "last",
                    },
                });
            })
            .catch((e) => {
                console.log("chatgpt error", e);
                setOpenAiLoading(false);
            });
    };

    const messagesToDialog = chatState.map((item) => ({ text: item?.message ?? "", isUser: item?.sender != "AiDox", time: new Date() }));

    return (
        <>
            <CommentDialog
                footerComponent={props.footerComponent}
                headerComponent={props.headerComponent}
                onMessageSend={comment => handleMessageSend(comment)}
                width={props.width}
                messages={messagesToDialog}
                top={props.top}
                messageReactionButtons={[
                    returnAiRecs(chatState[chatState.length - 1]?.message?.toLowerCase())
                    && <Button
                        onClick={e => props.handleUpdatePrompt?.call({}, returnAiRecs(chatState[chatState.length - 1]?.message) ?? "", props.range)}>Insert change</Button>,
                    // checkIfUpdatedPrompt(chatState[chatState.length - 1].message?.toLowerCase())
                    // && <Button
                    //     onClick={onOpen}>Compare change</Button>
                ]}
                typingIndicator={openAiLoading}
            />
        </>
    );
}

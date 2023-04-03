import React, { useReducer, useState, useEffect } from "react";
import {
    ChatContainer,
    MessageList,
    Message,
    MessageInput,
    MessageModel,
    TypingIndicator,
} from "@chatscope/chat-ui-kit-react";
import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from "openai";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
    Grid,
    GridItem,
    IconButton,
    Button,
} from "@chakra-ui/react";
import { ChatIcon, MinusIcon } from "@chakra-ui/icons";
import { Range } from "react-quill";

const configuration = new Configuration({
    apiKey: "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",
});

const openai = new OpenAIApi(configuration);

const checkIfUpdatedPrompt = (text?: string) => {
    if (!text) {
        return null;
    }

    const regex = /^\s*updated\s*version\s*:?\s*(.*?)\s*ending\.?\s*$/i
    const result = text.match(regex);

    if (result) {
        return result[1].trim();
    } else {
        return null;
    }
}

export function NewAIConversation(props: {
    handleUpdatePrompt: (updatedText: string, range: Range) => void | undefined;
    range: Range,
    selectedText: string;
    onRemoveComponent: () => void;
    top: Number | undefined;
    bottom: Number | undefined;
    left: Number | undefined;
    right: Number | undefined;
    width: string;
    openConvoKey: String | undefined;
    componentKey: string;
    setOpenConvoKey: React.Dispatch<React.SetStateAction<String | undefined>>;
}) {
    const openAiDefaultValue: ChatCompletionRequestMessage[] = [
        {
            role: "system",
            content: `You are a resume writing assistant. I will pass you a prompt and a question or ask from an user. It is your job to help answer and fulfill the ask. Everytime you revise the prompt, please preface with: updated version`,
        },
        {
            role: "system",
            content: `Here is the prompt: ${props.selectedText}`,
        },
    ];

    const [chatState, ChatDispatch] = useReducer(
        (
            myArray: MessageModel[],
            { type, value }: { type: string; value: MessageModel }
        ): MessageModel[] => {
            switch (type) {
                case "add":
                    return [...myArray, value];
                case "remove":
                    return myArray.filter((_: any, index: any) => index !== value);
                default:
                    return myArray;
            }
        },
        [
            {
                message: "Ask questions and/or suggestions from our AI model.",
                sentTime: "just now",
                sender: "AiDox",
                direction: "incoming",
                position: "first",
            },
        ]
    );

    const [openAiState, setOpenAiState] =
        useState<ChatCompletionRequestMessage[]>(openAiDefaultValue);

    const [openAiLoading, setOpenAiLoading] = useState<boolean>(false);

    const [aiAnswer, setAiAnswer] = useState<string>("");

    const [isMinimized, setMinimized] = useState<boolean>(false);
    useEffect(() => {
        if (props.openConvoKey) {
            setMinimized(props.openConvoKey != props.componentKey);
        }
    }, [props.openConvoKey]);
    useEffect(() => {
        if (!isMinimized) {
            props.setOpenConvoKey(props.componentKey);
        }
    }, [isMinimized]);

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
            content: `Here is the ask or question from user : ${question} about the provided prompt. Everytime you revise the prompt, please preface with: updated version and suffix with :Ending.`
        };

        openai
            .createChatCompletion({
                model: "gpt-3.5-turbo",
                messages: [...openAiState, newAiMessage],
            })
            .then((r) => {
                const answer = r.data.choices[0]
                    .message as ChatCompletionRequestMessage;
                setOpenAiState([...openAiState, newAiMessage, answer]);

                setOpenAiLoading(false);

                setAiAnswer(answer.content);

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

    return (
        <>
            {isMinimized ? (
                <IconButton
                    position="absolute"
                    float={"left"}
                    top={props.top?.toFixed(0)}
                    onClick={() => setMinimized(!isMinimized)}
                    size={"sm"}
                    aria-label="Search database"
                    icon={<ChatIcon onClick={() => setMinimized(!isMinimized)} />}
                />
            ) : (
                <Grid
                    templateAreas={`"header"
                  "main"
                  "footer"`}
                    gridTemplateRows={'50px 1fr'}
                    gridTemplateColumns={'1fr'}
                    width="100%"
                    maxWidth={props.width}
                    maxHeight="200px"
                    position="absolute"
                    top={props.top?.toFixed(0)}
                    height={"200px"}
                    gap='1'
                >
                    <GridItem pl='2' area={'header'}>
                        <IconButton onClick={() => setMinimized(true)} size={"sm"} float={"right"} margin={"5px"} aria-label='Search database' icon={<MinusIcon />} />
                    </GridItem>
                    <GridItem pl='2' area={'main'} maxHeight="500px">
                        <ChatContainer>
                            <MessageList typingIndicator={openAiLoading && <TypingIndicator content="AiDox is typing" />}>
                                {chatState.map((item: any) => <Message model={item} />)}
                                {checkIfUpdatedPrompt(chatState[chatState.length - 1].message?.toLowerCase()) &&
                                    <Message model={{
                                        direction: "incoming",
                                        type: "custom",
                                        position: 'last'
                                    }}>
                                        <Message.CustomContent>
                                            <Button onClick={e => props.handleUpdatePrompt?.call({}, checkIfUpdatedPrompt(chatState[chatState.length - 1].message?.toLowerCase()) ?? "", props.range)}>Add generated prompt to Document</Button>
                                        </Message.CustomContent>
                                    </Message>}
                            </MessageList>
                            <MessageInput onSend={e => handleMessageSend(e)} placeholder="Type message here" attachButton={false} />
                        </ChatContainer>
                    </GridItem>
                    <GridItem pl='2' area={'footer'} alignItems="center" justifyContent='center' alignSelf="center">
                        <Button colorScheme='teal' variant='solid' onClick={props.onRemoveComponent}>Resolve</Button>

                        {/* <ButtonGroup spacing='6'> */}
                        {/* <Button>Save</Button> */}
                        {/* </ButtonGroup> */}
                    </GridItem>
                </Grid>
            )}
        </>
    );
}

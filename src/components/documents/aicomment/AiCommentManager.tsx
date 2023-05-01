import { ChatIcon } from "@chakra-ui/icons";
import {
    Button, ButtonGroup,
    IconButton
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { FaWindowClose, FaWindowMinimize } from "react-icons/fa";
import { Range } from "react-quill";
import DiffViewer from "../diff/DiffViewer";
import { AiChat, MessageModel, returnAiRecs } from "./AiChat";

export interface aiChatManagerProps {
    isOpen?: boolean;
    range?: Range;
    selectedText: string;
    top?: Number | undefined;
    bottom?: Number | undefined;
    left?: Number | undefined;
    right?: Number | undefined;
    width: string;

    handleUpdatePrompt?: (updatedText: string, range?: Range) => void | undefined;
    onRemoveComponent: () => void;
    onNewMessage?: (messageHistory: MessageModel[]) => void

    onOpenConvo?: () => void;
    onCloseConvo?: () => void;

    commentId: string;

    messageHistory?: MessageModel[]
}

export function AiCommentManager(props: aiChatManagerProps) {
    const [isOpen, setIsOpen] = useState<boolean | undefined>(props.isOpen);
    const [isDiffOpen, setIsDiffOpen] = useState<boolean>(false);

    const [aiMessages, setAiMessages] = useState<MessageModel[]>(props.messageHistory ?? []);

    const onNewMessageFromChild = (messages: MessageModel[]) => {
        setAiMessages(messages);
    };

    useEffect(() => {
        props.onNewMessage?.call({}, aiMessages)
    }, [aiMessages])

    useEffect(() => {
        setIsOpen(props.isOpen);
    }, [props.isOpen]);

    const componentToDisp = isOpen ?
        <AiChat
            footerComponent={<Button variant={"outline"} colorScheme='green' onClick={() => setIsDiffOpen(true)}>Open in Collab Mode</Button>}
            headerComponent={<ButtonGroup variant='outline' size={"sm"} spacing='2' float={"right"}>
                <IconButton onClick={() => props?.onCloseConvo?.call({})} size={"sm"} aria-label='Minimize chat' icon={<FaWindowMinimize />} />
                <IconButton title="Resolve and close chat" onClick={props.onRemoveComponent} size={"sm"} colorScheme="red" aria-label='Resolve chat' icon={<FaWindowClose />} />

                {/* <IconButton onClick={() => setIsDiffOpen(true)} size={"sm"} colorScheme="yellow" aria-label='Maximize to window' icon={<FaWindowMaximize />} /> */}

            </ButtonGroup>}
            top={props.top?.toFixed(0)}
            width={props.width}
            range={props.range}
            selectedText={props.selectedText}
            onNewMessage={onNewMessageFromChild}
            handleUpdatePrompt={(updatedText: string) => props.handleUpdatePrompt?.call({}, updatedText, props.range)}
            messages={aiMessages} /> :
        <IconButton
            position="absolute"
            float={"left"}
            top={props.top?.toFixed(0)}
            onClick={() => {
                if (!isOpen) {
                    props?.onOpenConvo?.call({});
                } else {
                    props?.onCloseConvo?.call({});
                }
            }}
            size={"sm"}
            aria-label="Search database"
            colorScheme={"blackAlpha"}
            icon={<ChatIcon onClick={() => setIsOpen(!isOpen)} />}
        />;

    return <>
        {componentToDisp}

        {isDiffOpen && <DiffViewer
            onAcceptChanges={(updatedText: string) => props.handleUpdatePrompt?.call({}, updatedText, props.range)}
            onClose={(aiMessagesOutside) => {
                console.log(aiMessagesOutside, "asdassdsad")
                if (aiMessagesOutside && aiMessagesOutside.length > 0) {
                    setAiMessages(aiMessagesOutside);
                }
                setIsDiffOpen(false);
            }}
            AiMessages={aiMessages}
            isOpen={isDiffOpen}
            oldText={props.selectedText}
            newText={returnAiRecs(aiMessages[aiMessages.length - 1]?.message) ?? props.selectedText} />}
    </>;
}

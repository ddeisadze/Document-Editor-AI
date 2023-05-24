import { Box, ButtonGroup, Grid, GridItem, IconButton, Input, InputGroup, InputRightElement, Text } from '@chakra-ui/react';
import React, { ReactElement, useEffect, useRef, useState } from 'react';
import { FaRegPaperPlane } from 'react-icons/fa';
import { useReadonly } from '../../../contexts';
import styles from "./CommentDialog.module.css";

interface Props {
    onMessageSend: (comment: string) => void;
    width: string,
    height?: string,
    typingIndicator: boolean;
    messages?: Message[];
    top?: number | string;

    footerComponent?: ReactElement
    headerComponent?: ReactElement

    messageReactionButtons: (ReactElement | null | "")[]

    className?: string;
}

export interface Message {
    text: string;
    isUser: boolean;
    time: Date;
}

interface WaveSpinnerProps {
    color?: string;
    size?: string;
}

const WaveSpinner: React.FC<WaveSpinnerProps> = ({ color, size }) => {
    const style = { color: color ?? "#000", size: size ?? "2em" };
    return (
        <div className={styles.waveSpinner} style={style}>
            <div className={styles.waveDot}></div>
            <div className={styles.waveDot} style={{ animationDelay: "-0.16s" }}></div>
            <div className={styles.waveDot} style={{ animationDelay: "-0.32s" }}></div>
        </div>
    );
};

const CommentDialog = ({ onMessageSend: onSubmit, typingIndicator, messages = [], ...props }: Props) => {
    const [comment, setComment] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const readonlyContext = useReadonly();

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setComment(event.target.value);
    };

    const handleSubmit = (commentArg?: string) => {
        onSubmit(commentArg ?? comment);
        setComment('');
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            handleSubmit();
        }
    }

    useEffect(() => {
        if (messagesEndRef?.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
            messagesEndRef.current.scrollTop =
                messagesEndRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <Grid
            className={props.className}
            style={{
                zIndex: 200
            }}
            backgroundColor='white'
            borderWidth="1px"
            borderRadius="md"
            minHeight="300px"
            maxHeight={props.height ?? "300px"}
            maxWidth={props.width}
            top={props.top}
            templateAreas={`"header"
                  "main"
                  "footer"`}
            gridTemplateRows={'0.5fr 1fr 1fr'}
            gridTemplateColumns={'1fr'}
            position="relative" >

            <GridItem pl='2' area={'header'} >
                {props.headerComponent}
            </GridItem>
            <GridItem pl='2' area={'main'} width="100%">
                {messages.length > 0 && (
                    <Box mb="4"
                        ref={messagesEndRef}
                        minH="150px"
                        maxH="150px"
                        overflowY="scroll">
                        {messages.map((message, index) => (
                            <Box
                                key={index}
                                mt="2"
                                display="flex"
                                flexDirection={message.isUser ? 'row' : 'row-reverse'}
                                alignItems="flex-end"
                                justifyContent="flex-end"
                                position="relative"
                            >
                                <Text fontSize="3xs" mb="1" textAlign={message.isUser ? 'right' : 'left'}>{message.isUser ? 'You' : 'System'}</Text>
                                <Box
                                    bg={message.isUser ? 'green.400' : 'blue.400'}
                                    color="white"
                                    p="2"
                                    borderRadius="md"
                                    maxWidth="70%"
                                    wordBreak="break-word"
                                    alignSelf="flex-start"
                                    position="relative"
                                >
                                    <Text fontSize="3xs" mb="1" position="absolute" bottom="-16px" right={message.isUser ? 'auto' : '0'} left={message.isUser ? '0' : 'auto'}>
                                        {message.time.toLocaleTimeString([], { hour: 'numeric', minute: 'numeric' })}
                                    </Text>
                                    <Text fontSize="2xs">
                                        {message.text}
                                    </Text>
                                </Box>

                            </Box>
                        ))}

                        {props.messageReactionButtons &&
                            <ButtonGroup size={"sm"} isAttached variant='outline'>
                                {props.messageReactionButtons}
                            </ButtonGroup>}

                        {typingIndicator && (
                            <Box paddingBottom={0} marginLeft={"0.3em"} display="flex" alignItems="center">
                                <WaveSpinner />
                                <Text fontSize="2xs">AIDox is Typing...</Text>
                            </Box>
                        )}

                    </Box>
                )}
            </GridItem>

            <GridItem p={2} pl='2' area={'footer'} alignItems="center" justifyContent='center' alignSelf="center">
                <InputGroup>
                    <Input
                        fontSize={"sm"}
                        value={comment}
                        isDisabled={readonlyContext.readonly}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        placeholder="Ask our AI to help..."
                    />
                    <InputRightElement children={<IconButton
                        size='sm'
                        isDisabled={readonlyContext.readonly}
                        aria-label='Send message'
                        color={"blue.300"}
                        icon={<FaRegPaperPlane id="inlineToolbar" />}
                        variant={'outline'} colorScheme="blue" onClick={() => handleSubmit()}>
                    </IconButton>} />
                </InputGroup>
                {props.footerComponent}
            </GridItem>
        </Grid >
    );
};

export default CommentDialog;

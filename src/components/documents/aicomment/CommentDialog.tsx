import { ReactElement, useEffect, useRef, useState } from 'react';
import { Box, FormControl, FormLabel, Textarea, Button, Text, Spinner, Grid, GridItem, IconButton, ButtonGroup, Input } from '@chakra-ui/react';
import "./CommentDialog.css";
import { MinusIcon } from '@chakra-ui/icons';

interface Props {
    onSubmit: (comment: string) => void;
    onMinimize: () => void;
    onResolve: () => void;
    width: string,
    typingIndicator: boolean;
    messages?: Message[];
    top?: number | string;

    updateTextButton: "" | ReactElement | null
}

interface Message {
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
        <div className="wave-spinner" style={style}>
            <div className="wave-dot"></div>
            <div className="wave-dot" style={{ animationDelay: "-0.16s" }}></div>
            <div className="wave-dot" style={{ animationDelay: "-0.32s" }}></div>
        </div>
    );
};

const CommentDialog = ({ onSubmit, typingIndicator, messages = [], ...props }: Props) => {
    const [comment, setComment] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

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
            style={{
                zIndex: 10000
            }}
            backgroundColor='white'
            borderWidth="1px"
            borderRadius="md"
            minHeight="300px"
            maxHeight="300px"
            maxWidth={props.width}
            top={props.top}
            templateAreas={`"header"
                  "main"
                  "footer"`}
            gridTemplateRows={'0.5fr 1fr 1fr'}
            gridTemplateColumns={'1fr'}
            position="relative" >

            <GridItem pl='2' area={'header'} >
                <IconButton onClick={props.onMinimize} size={"sm"} float={"right"} aria-label='Search database' icon={<MinusIcon />} />
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
                        {props.updateTextButton &&
                            <Box maxWidth={props.width}>
                                {props.updateTextButton}
                            </Box>}
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
                <Input fontSize={"sm"} value={comment} onChange={handleInputChange} onKeyDown={handleKeyDown} placeholder="Ask our AI to edit, generate new content" />
                <ButtonGroup mt="1em" variant='outline'>
                    <Button
                        variant={'solid'} colorScheme="blue" onClick={() => handleSubmit()}>
                        Comment
                    </Button>
                    <Button colorScheme='orange' onClick={props.onResolve}>Resolve</Button>
                </ButtonGroup>

            </GridItem>
        </Grid >
    );
};

export default CommentDialog;

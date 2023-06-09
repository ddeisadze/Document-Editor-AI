import { DeltaStatic } from "quill";
import { Range } from "react-quill";



export interface DocumentProps {
    id: string;
    documentName: string;
    aiChats?: aiChatProps[];
    thumbnail?: string,
    content?: DeltaStatic | undefined;
  }

 



export interface aiChatProps {
    id: string;
    isOpen?: boolean;
    range: Range;
    selectedText: string;
    top?: Number | undefined;
    bottom?: Number | undefined;
    left?: Number | undefined;
    right?: Number | undefined;
    width: string;
    messageHistory?: MessageModelProps[]
}

export interface MessageModelProps {
    message: string;
    sentTime: string;
    sender: string;
    direction: string;
    position: string;
  }
import { TabPanels, TabPanel, Flex } from "@chakra-ui/react";
import Quill, { DeltaStatic, Delta as DeltaType } from "quill";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import { Range } from "react-quill";
import { useReadonly } from "../../../contexts";
import { updateSpecificDocumentWithComments } from "../../../utility/storageHelpers";
import { MessageModel } from "../aicomment/AiChat";
import { AiCommentManager } from "../aicomment/AiCommentManager";
import { QuillEditor } from "./QuillEditor";
import debounce from "lodash/debounce";
import { AiChat } from "../aicomment/AiChat";
import styles from "./QuillEditor.module.css";

const Delta = Quill.import("delta") as typeof DeltaType;

export interface aiCommentState {
  id: string;
  isOpen: boolean;
  range: Range;

  selectedText: string;

  top?: Number | undefined;
  bottom?: Number | undefined;
  left?: Number | undefined;
  right?: Number | undefined;
  width: string;

  messageHistory: MessageModel[];
}

interface DocumentEditorProps {
  documentHtml?: string;
  documentName: string | undefined;
  documentId: string;
  aiComments?: aiCommentState[];
  isDemoView?: boolean;
  initialDeltaStaticContent?: DeltaStatic | undefined;
  navHeight?: string;
  lastModified?: Date;
  setLastModified: Dispatch<SetStateAction<Date | undefined>>;
}

export function DocumentEditor(props: DocumentEditorProps) {
  const commentWidth = "300px";

  const [aiComments, setAiComments] = useState<aiCommentState[]>(
    props.aiComments ?? []
  );
  const [content, setContent] = useState<DeltaStatic>();

  const readonlyContext = useReadonly();

  useEffect(() => {
    updateSpecificDocumentWithComments(props.documentId, aiComments);
  }, [aiComments]);

  useEffect(() => {
    if (props.initialDeltaStaticContent) {
      setContent(props.initialDeltaStaticContent);
    }
  }, [props.initialDeltaStaticContent]);

  useEffect(() => {
    window.addEventListener("click", (e) => {
      const target = e.target as HTMLElement;
      const commentId = target.getAttribute("commentId");

      if (target.tagName.toLowerCase() === "comment-link" && commentId) {
        setAiComments((prevState) =>
          prevState.map((p) => {
            if (p.id === commentId.trim()) {
              p.isOpen = true;
            } else {
              p.isOpen = false;
            }

            return p;
          })
        );
      }
    });

    if (readonlyContext.showComments) {
      setAiComments((prevState) =>
        prevState.map((p, i) => {
          if (i == 0) {
            p.isOpen = true;
          } else {
            p.isOpen = false;
          }

          return p;
        })
      );
    }
  }, []);

  const removeAiConvo = (key: string, range: Range) => {
    setAiComments((prev) => {
      return prev.filter((i) => i.id != key);
    });

    if (!range) {
      return;
    }

    const updateDelta = content?.compose(
      new Delta().retain(range.index).retain(range.length, { background: {} })
    );

    setContent(updateDelta);
  };

  const handleContentChange = useCallback(
    debounce((value) => {
      setContent(value);
      props.setLastModified(new Date());
      // Perform any other actions you want to take when the user stops typing
    }, 500),
    []
  );
  // const handleContentChange = (value: DeltaStatic) => {

  //     setContent(value);
  //     setLastModified(new Date());

  //     // #TODO: if content is part of comment-link,  update what we pass to diff viewer
  // };

  // #TODO: if content is part of comment-link,  update what we pass to diff viewer

  const handleOnAiUpdatedPrompt = useCallback(
    (editedText: string, range?: Range) => {
      if (!editedText || !range || !content) {
        return;
      }

      const start = range.index; // The start index of the range
      const end = start + range.length;

      const rangeDelta = content.slice(start, end);

      // Get the attributes for the range
      const attributes = rangeDelta?.ops?.at(0)?.attributes ?? {};

      //#todo: we need to update range here also when there are changes made to range from editor
      const updateDelta = content.compose(
        new Delta()
          .retain(range.index)
          .delete(range.length)
          .insert(editedText, attributes)
      );

      setContent(updateDelta);
    },
    [content]
  );

  const addAiConvo = (
    commentId: string,
    range: Range,
    selectedAttrs: SelectedText
  ) => {
    setAiComments((prevState) => {
      const oldVals = prevState.map((c) => ({
        ...c,
        isOpen: false,
      }));

      const newList = [
        ...oldVals,
        {
          id: commentId,
          range: range,
          top: selectedAttrs.top,
          bottom: selectedAttrs.bottom,
          left: selectedAttrs.left,
          right: selectedAttrs.right,
          selectedText: selectedAttrs.text,
          width: commentWidth,
          isOpen: true,
          messageHistory: [],
        },
      ];

      return newList;
    });
  };

  const [generalChatMessages, setGeneralChatMessages] = useState<MessageModel[]>([]);

  useEffect(() => {
    // Load the general chat messages from local storage
    const savedMessages = localStorage.getItem("generalChatMessages");
    if (savedMessages) {
      setGeneralChatMessages(JSON.parse(savedMessages));
    }
  }, []);

  useEffect(() => {
    // Update local storage whenever there is an update to general chat messages
    localStorage.setItem("generalChatMessages", JSON.stringify(generalChatMessages));
  }, [generalChatMessages]);

  const chatComponents = aiComments.map((aiComment) => (
    <AiCommentManager
      commentId={aiComment.id}
      width={commentWidth}
      range={aiComment.range}
      handleUpdatePrompt={handleOnAiUpdatedPrompt}
      onRemoveComponent={() => removeAiConvo(aiComment.id, aiComment.range)}
      messageHistory={aiComment.messageHistory}
      onNewMessage={(msgs) =>
        setAiComments((prevState) => {
          const newState = prevState.map((c) => {
            if (c.id === aiComment.id) {
              c.messageHistory = msgs;
            }

            return c;
          });

          return newState;
        })
      }
      onOpenConvo={() =>
        setAiComments((prevState) =>
          prevState.map((p) => {
            if (p.id === aiComment.id) {
              p.isOpen = true;
            } else {
              p.isOpen = false;
            }

            return p;
          })
        )
      }
      onCloseConvo={() =>
        setAiComments((prevState) =>
          prevState.map((p) => {
            p.isOpen = false;
            return p;
          })
        )
      }
      selectedText={aiComment.selectedText}
      top={aiComment.top}
      bottom={aiComment.bottom}
      left={aiComment.left}
      right={aiComment.right}
      isOpen={aiComment.isOpen}
    />
  ));

  return (
    <>
      <Flex flexDirection={"row"} basis={"auto"}>
        <QuillEditor
          documentId={props.documentId}
          initialHtmlData={props.documentHtml}
          onContentChange={handleContentChange}
          onAddComment={addAiConvo}
          content={content}
          documentName={props.documentName}
          navHeight={props.navHeight}
        />

        <TabPanelsComponent chatComponents={chatComponents} 
          generalChatMessages={generalChatMessages}
          onGeneralChatMessage={(message) => setGeneralChatMessages((prevMessages) => [...prevMessages, message])}
        />/>
      </Flex>
    </>
  );
}

const TabPanelsComponent = (props: { chatComponents: JSX.Element[] }) => {
  return (
    <TabPanels minWidth={"30%"} className={styles.chatTab}>
      <TabPanel>
        <div className="">{props.chatComponents}</div>
      </TabPanel>
      <TabPanel padding={0} height={"100%"}>
        <AiChat width={"100%"} height={"100%"} miniChat={true} />
      </TabPanel>
    </TabPanels>
  );
};
export interface SelectedText {
  text: string;
  top: Number;
  bottom: Number;
  left: Number;
  right: Number;
}

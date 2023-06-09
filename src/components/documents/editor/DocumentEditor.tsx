import { TabPanels, TabPanel, Flex } from "@chakra-ui/react";
import Quill, { Delta as DeltaType } from "quill";
import { useCallback, useEffect } from "react";
import { Range } from "react-quill";
import { useReadonly } from "../../../contexts";
import { updateSpecificDocumentWithComments } from "../../../utility/storageHelpers";
import { AiCommentManager } from "../aicomment/AiCommentManager";
import { QuillEditor } from "./QuillEditor";
import { AiChat } from "../aicomment/AiChat";
import styles from "./QuillEditor.module.css";
import {
  documentIdAtom,
  aiChatsAtom,
  contentAtom,
} from "../../../store/atoms/documentsAtom";
import { useAtom, useAtomValue } from "jotai";

const Delta = Quill.import("delta") as typeof DeltaType;

export function DocumentEditor() {
  const commentWidth = "300px";

  const documentId = useAtomValue(documentIdAtom);
  const [aiChats, setAiChats] = useAtom(aiChatsAtom);
  const [content, setContent] = useAtom(contentAtom);

  const readonlyContext = useReadonly();

  useEffect(() => {
    updateSpecificDocumentWithComments(documentId, aiChats);
  }, [aiChats]);

  useEffect(() => {
    window.addEventListener("click", (e) => {
      const target = e.target as HTMLElement;
      const commentId = target.getAttribute("commentId");

      if (target.tagName.toLowerCase() === "comment-link" && commentId) {
        setAiChats((prevState) =>
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
      setAiChats((prevState) =>
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
    setAiChats((prev) => {
      return prev.filter((i) => i.id != key);
    });

    if (!range) {
      return;
    }

    const updateDelta = content?.compose(
      new Delta().retain(range.index).retain(range.length, { background: {} })
    );
    if (updateDelta) {
      setContent(updateDelta);
    }
  };

  // #TODO: if content is part of comment-link,  update what we pass to diff viewer
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

  // const [generalChatMessages, setGeneralChatMessages] = useState<MessageModel[]>([]);

  // useEffect(() => {
  //   // Load the general chat messages from local storage
  //   const savedMessages = localStorage.getItem("generalChatMessages");
  //   if (savedMessages) {
  //     setGeneralChatMessages(JSON.parse(savedMessages));
  //   }
  // }, []);

  // useEffect(() => {
  //   // Update local storage whenever there is an update to general chat messages
  //   localStorage.setItem("generalChatMessages", JSON.stringify(generalChatMessages));
  // }, [generalChatMessages]);

  const chatComponents = aiChats.map((aiChat) => (
    <AiCommentManager
      commentId={aiChat.id}
      width={commentWidth}
      range={aiChat.range}
      handleUpdatePrompt={handleOnAiUpdatedPrompt}
      onRemoveComponent={() => removeAiConvo(aiChat.id, aiChat.range)}
      messageHistory={aiChat.messageHistory}
      onNewMessage={(msgs) =>
        setAiChats((prevState) => {
          const newState = prevState.map((c) => {
            if (c.id === aiChat.id) {
              c.messageHistory = msgs;
            }

            return c;
          });

          return newState;
        })
      }
      onOpenConvo={() =>
        setAiChats((prevState) =>
          prevState.map((p) => {
            if (p.id === aiChat.id) {
              p.isOpen = true;
            } else {
              p.isOpen = false;
            }

            return p;
          })
        )
      }
      onCloseConvo={() =>
        setAiChats((prevState) =>
          prevState.map((p) => {
            p.isOpen = false;
            return p;
          })
        )
      }
      selectedText={aiChat.selectedText}
      top={aiChat.top}
      bottom={aiChat.bottom}
      left={aiChat.left}
      right={aiChat.right}
      isOpen={aiChat.isOpen}
    />
  ));

  return (
    <>
      <Flex flexDirection={"row"} basis={"auto"}>
        <QuillEditor />

        <TabPanelsComponent chatComponents={chatComponents} />
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

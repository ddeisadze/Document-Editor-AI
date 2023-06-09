import { useToast } from "@chakra-ui/react";
import { useSession } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { Delta as DeltaStatic } from "quill";

import { useState } from "react";
import { Quill } from "react-quill";
import AuthLogin from "../components/auth/auth";
import { DocumentEditor } from "../components/documents/editor/DocumentEditor";
import WithSubnavigation from "../components/sidebar/horizontalNav";
import { getMarkdownFromDocFile } from "../utility/helpers";
import { CreateNewDocument } from "../utility/storageHelpers";
import NewResumeModal from "./ImportResumeDialog";
import { Tabs } from "@chakra-ui/react";
import { useSetAtom, useAtom, useAtomValue } from "jotai";
import {
  documentIdAtom,
  contentAtom,
  documentAtom,
  aiChatsAtom,
} from "../store/atoms/documentsAtom";
import markdownToDelta from "markdown-to-quill-delta";

const Delta = Quill.import("delta") as typeof DeltaStatic;

interface documentEditorPageProps {
  documentName?: string;
  blank?: boolean;
  hideNav?: boolean;
}

export default function DocumentPage(props: documentEditorPageProps) {
  const [showUpload, setShowUpload] = useState(props.blank);
  const [documentName, setDocumentName] = useState<string | undefined>(
    props.documentName
  );
  const [documentId, setDocumentId] = useAtom(documentIdAtom);
  const setContent = useSetAtom(contentAtom);
  const setDocumentAtom = useSetAtom(documentAtom);
  const aiChats = useAtomValue(aiChatsAtom);

  const toast = useToast();
  const session = useSession();
  const router = useRouter();

  const onFileUpload = async (file: File) => {
    const fileType = file?.type;

    if (fileType == "application/pdf") {
      console.log("pdf");
    } else if (
      fileType == "application/msword" ||
      fileType ==
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      // convert to html use legacy until api is fixed
      getMarkdownFromDocFile(await file.arrayBuffer()).then((markdown) => {
        const markdownString = markdown;

        if (markdownString) {
          const deltaOp = markdownToDelta(markdownString);
          const delta = new Delta(deltaOp);

          setContent(delta);
          CreateNewDocument(
            {
              id: "",
              documentName: file.name,
              content: delta,
            },
            setDocumentAtom,
            aiChats,
            setDocumentId,
            router
          );
        } else {
          toast({
            title: "Error converting file to html. ",
            description: `Try copy/paste.`,
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        }
      });
    }
  };

  const onCopyPaste = (html?: string) => {
    CreateNewDocument(
      {
        id: "",
        documentName: `Untitled Resume - ${documentId}`,
      },
      setDocumentAtom,
      aiChats,
      setDocumentId,
      router
    );
  };

  const docEditorComp = <DocumentEditor />;

  return (
    <div className="App" style={{ minHeight: "100%" }}>
      <Tabs>
        {showUpload && (
          <NewResumeModal
            isOpen={true}
            onClose={() => {}}
            onFileUpload={onFileUpload}
            onCopyPaste={onCopyPaste}
          />
        )}

        {props.hideNav ? (
          docEditorComp
        ) : (
          <AuthLogin session={session} show={!showUpload}>
            <WithSubnavigation
              documentName={documentName}
              setDocumentName={setDocumentName}
            />
            {docEditorComp}
          </AuthLogin>
        )}
      </Tabs>
    </div>
  );
}

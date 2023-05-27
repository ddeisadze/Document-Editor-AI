import { useToast } from "@chakra-ui/react";
import { useSession } from "@supabase/auth-helpers-react";
import { saveAs } from "file-saver";
import { useRouter } from "next/router";
import { DeltaOperation, Delta as DeltaStatic } from "quill";
import { QuillDeltaToHtmlConverter } from "quill-delta-to-html";
import { useState } from "react";
import { Quill } from "react-quill";
import utf8 from "utf8";
import AuthLogin from "../components/auth/auth";
import {
  DocumentEditor,
  aiCommentState,
} from "../components/documents/editor/DocumentEditor";
import NavigationBar from "../components/sidebar/verticalSidebar";
import WithSubnavigation from "../components/sidebar/horizontalNav";
import {
  getHtmlFromDocFileLegacy,
  getPdfFileFromHtml,
} from "../utility/helpers";
import { createNewDocument } from "../utility/storageHelpers";
import NewResumeModal from "./ImportResumeDialog";
import { Tabs } from "@chakra-ui/react";

const Delta = Quill.import("delta") as typeof DeltaStatic;

interface documentEditorPageProps {
  documentName?: string;
  documentContent?: DeltaStatic | DeltaOperation[];
  documentId: string;
  aiComments?: aiCommentState[];
  initialHtmlContent?: string;
  blank?: boolean;
  hideNav?: boolean;
}

export default function DocumentPage(props: documentEditorPageProps) {
  const [resumeHtml, setresumeHtml] = useState<string | undefined>(
    props.initialHtmlContent
  );
  const [showUpload, setShowUpload] = useState(props.blank);
  const [documentName, setDocumentName] = useState<string | undefined>(
    props.documentName
  );

  const [documentId, setDocumentId] = useState<string>(props.documentId);
  const [navHeight, setNavHeight] = useState();
  const [lastModified, setLastModified] = useState<Date>();

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
      getHtmlFromDocFileLegacy(await file.arrayBuffer()).then((html) => {
        setresumeHtml(html ?? "");
        const docId = new Date().getTime().toString();

        if (html) {
          createNewDocument({
            documentName: file.name,
            id: docId,
            initialHtmlData: html,
          });
        } else {
          toast({
            title: "Error converting file to html. ",
            description: `Try copy/paste.`,
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        }

        router.push(`/files/${encodeURIComponent(docId)}`);
      });
    }
  };

  const onLoadEditor = (html?: string) => {
    const docId = new Date().getTime().toString();

    createNewDocument({
      documentName: `Untitled Resume - ${docId}`,
      id: docId,
      initialHtmlData: html,
    });

    router.push(`/files/${encodeURIComponent(docId)}`);
  };

  const docEditorComp = (
    <DocumentEditor
      key={documentId}
      documentId={documentId}
      initialDeltaStaticContent={
        typeof props.documentContent == typeof DeltaStatic
          ? (props.documentContent as DeltaStatic)
          : new Delta(props.documentContent as DeltaOperation[])
      }
      documentHtml={resumeHtml}
      documentName={documentName}
      aiComments={props.aiComments}
      navHeight={navHeight}
      lastModified={lastModified}
      setLastModified={setLastModified}
    />
  );
  const handleChildHeightChange = (height: any) => {
    // Do something with the height value
    setNavHeight(height);
  };

  return (
    <div className="App" style={{ minHeight: "100%" }}>
      <Tabs>
        {showUpload && (
          <NewResumeModal
            isOpen={true}
            onClose={() => {}}
            onFileUpload={onFileUpload}
            onCopyPaste={onLoadEditor}
          />
        )}

        {
          props.hideNav ? (
            docEditorComp
          ) : (
            <AuthLogin session={session} show={!showUpload}>
              <WithSubnavigation
                lastModified={lastModified}
                onHeightChange={handleChildHeightChange}
                documentName={documentName}
                setDocumentName={setDocumentName}
              />
              {docEditorComp}
            </AuthLogin>
          )
          // </NavigationBar>
        }
      </Tabs>
    </div>
  );
}

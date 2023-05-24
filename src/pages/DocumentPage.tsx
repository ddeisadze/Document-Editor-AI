import { useToast } from "@chakra-ui/react";
import { useSession } from "@supabase/auth-helpers-react";
import { saveAs } from 'file-saver';
import { useRouter } from "next/router";
import { DeltaOperation, Delta as DeltaStatic } from "quill";
import { QuillDeltaToHtmlConverter } from "quill-delta-to-html";
import { useState } from "react";
import { Quill } from "react-quill";
import utf8 from "utf8";
import AuthLogin from "../components/auth/auth";
import { DocumentEditor, aiCommentState } from "../components/documents/editor/DocumentEditor";
import NavigationBar from "../components/sidebar/verticalSidebar";
import { getHtmlFromDocFileLegacy, getPdfFileFromHtml } from "../utility/helpers";
import { createNewDocument, getDocument } from "../utility/storageHelpers";
import NewResumeModal from "./ImportResumeDialog";


const Delta = Quill.import("delta") as typeof DeltaStatic;

interface documentEditorPageProps {
  documentName?: string;
  documentContent?: DeltaStatic | DeltaOperation[];
  documentId: string;
  aiComments?: aiCommentState[];
  initialHtmlContent?: string;
  blank?: boolean;
  hideNav?: boolean
}

export default function DocumentPage(props: documentEditorPageProps) {

  const [resumeHtml, setresumeHtml] = useState<string | undefined>(props.initialHtmlContent);
  const [showUpload, setShowUpload] = useState(
    props.blank
  );

  const [documentId, setDocumentId] = useState<string>(props.documentId)

  const toast = useToast()
  const session = useSession()
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
            initialHtmlData: html
          })


        } else {
          toast({
            title: 'Error converting file to html. ',
            description: `Try copy/paste.`,
            status: 'error',
            duration: 5000,
            isClosable: true,
          })
        }

        router.push(`/files/${encodeURIComponent(docId)}`)
      });
    }
  };

  const onLoadEditor = (html?: string) => {
    const docId = new Date().getTime().toString();

    createNewDocument({
      documentName: `Untitled Resume - ${docId}`,
      id: docId,
      initialHtmlData: html
    })

    router.push(`/files/${encodeURIComponent(docId)}`)
  };

  const docEditorComp = <DocumentEditor
    isDemoView
    key={documentId}
    documentId={documentId}
    initialDeltaStaticContent={typeof props.documentContent == typeof DeltaStatic ? props.documentContent as DeltaStatic : new Delta(props.documentContent as DeltaOperation[])}
    documentHtml={resumeHtml}
    documentName={props.documentName}
    aiComments={props.aiComments}
  />

  return (
    <div className="App">
      {showUpload && <NewResumeModal
        isOpen={true}
        onClose={() => { }}
        onFileUpload={onFileUpload}
        onCopyPaste={onLoadEditor} />}

      {
        props.hideNav ? docEditorComp
          : <NavigationBar
            newDocumentOnClick={() => setShowUpload(true)}
            pdfExportOnClick={() => {

              const documentDelta = getDocument(documentId)?.content;

              if ((documentDelta?.ops?.length ?? 0) < 1) {
                toast({
                  title: 'Cannot export empty document',
                  description: `Start loading your resume and editing with our AI!`,
                  status: 'info',
                  duration: 3000,
                  isClosable: true,
                })

                return;

              }

              toast({
                title: 'Exporting document to PDF.',
                description: `Your file ${props.documentName} is exporting`,
                status: 'loading',
                duration: 1000,
                isClosable: true,
              })

              const html: string = new QuillDeltaToHtmlConverter(documentDelta?.ops ?? [], {
                inlineStyles: true
              }).convert();

              const html_encoded = utf8.encode(html)

              getPdfFileFromHtml(html_encoded)
                .then(blob => {
                  saveAs(blob, `${props.documentName}.pdf`);
                  toast({
                    title: `${props.documentName}.pdf successfully exported`,
                    description: "View the file in your downloads.",
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                  })
                });
            }}>
            <AuthLogin session={session} show={!showUpload}>
              {docEditorComp}
            </AuthLogin>

          </NavigationBar>
      }

    </div>
  );
}

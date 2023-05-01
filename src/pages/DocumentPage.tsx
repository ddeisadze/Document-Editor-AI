import { ChakraProvider, extendTheme, useTheme, useToast } from "@chakra-ui/react"
import { DocumentEditor } from "../components/documents/editor/DocumentEditor";
import NewResumeModal from "./ImportResumeDialog";
import { getHtmlFromDocFileLegacy, getPdfFileFromHtml } from "../utility/helpers";
import { useEffect, useState } from "react";
import NavigationBar from "../components/sidebar/verticalSidebar";
import { QuillDeltaToHtmlConverter } from "quill-delta-to-html";
import utf8 from "utf8";
import { saveAs } from 'file-saver';
import { Delta as DeltaStatic } from "quill";
import AuthLogin from "../components/auth/auth";
import ReactQuill, { Range, Quill } from "react-quill";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";

interface localStorageTempFile {
  fileHtml: string
}

interface documentEditorPageProps {
  documentName?: string;
  documentContent?: DeltaStatic;
}

const Delta = Quill.import("delta");

export default function DocumentEditorPage(props: documentEditorPageProps) {
  const [resumeHtml, setresumeHtml] = useState<string>();
  const [fileName, setFileName] = useState<string>(props?.documentName ?? "");
  const [showUpload, setShowUpload] = useState(
    props.documentContent !== undefined
  );

  console.log(showUpload, "showUpload");
  console.table(props);

  const [copyOfDelta, setCopyOfDelta] = useState<DeltaStatic>(
    props.documentContent ?? new Delta()
  );

  const [documentContent, setDocumentContent] = useState<DeltaStatic>()


  const toast = useToast()
  const session = useSession()
  const supabase = useSupabaseClient()

  useEffect(() => {
    const uploadedFileHtml = localStorage.getItem("uploadedFileHtml");
    if (session && uploadedFileHtml) {
      const parsedUploadtedFile: localStorageTempFile = JSON.parse(uploadedFileHtml);
      setresumeHtml(parsedUploadtedFile.fileHtml)
      setShowUpload(false)
      localStorage.removeItem("uploadedFileHtml")
    }
  }, [])


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

        if (!session && html) {
          const storageValue: localStorageTempFile = {
            fileHtml: html
          }
          localStorage.setItem("uploadedFileHtml", JSON.stringify(storageValue))
        }

        setShowUpload(false);
        setFileName(file.name);
      });
    }
  };

  const onLoadEditor = (html?: string) => {
    setFileName("New Resume Document");
    setresumeHtml("");
    setShowUpload(false);
  };


  return (
    <div className="App">
      {showUpload && <NewResumeModal
        isOpen={true}
        onClose={() => { }}
        onFileUpload={onFileUpload}
        onLoadEditor={onLoadEditor} />}
      {
        <NavigationBar
          newDocumentOnClick={() => setShowUpload(true)}
          pdfExportOnClick={() => {

            if (documentContent?.length() ?? 0 < 1) {
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
              description: `Your file ${fileName} is exporting`,
              status: 'loading',
              duration: 1000,
              isClosable: true,
            })

            const html: string = new QuillDeltaToHtmlConverter(documentContent?.ops ?? [], {
              inlineStyles: true
            }).convert();

            const html_encoded = utf8.encode(html)

            getPdfFileFromHtml(html_encoded)
              .then(blob => {
                saveAs(blob, `${fileName}.pdf`);
                toast({
                  title: `${fileName}.pdf successfully exported`,
                  description: "View the file in your downloads.",
                  status: 'success',
                  duration: 3000,
                  isClosable: true,
                })
              });
          }}>
          <AuthLogin session={session} show={!showUpload}>
            <DocumentEditor onDocumentChangeText={(content) => setDocumentContent(content)} documentHtml={resumeHtml ?? ""} documentName={fileName} />
          </AuthLogin>
        </NavigationBar>}
    </div>
  );
}

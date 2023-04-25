import "react-quill/dist/quill.snow.css";
import "./DocumentEditor.module.css"
import { ChakraProvider, extendTheme, useTheme, useToast } from "@chakra-ui/react"
import { DocumentEditor } from "../components/documents/editor/DocumentEditor";
import ResumeModal from "./ImportResumeDialog";
import { getHtmlFromDocFileLegacy, getPdfFileFromHtml } from "../utility/helpers";
import { useState } from "react";
import SimpleSidebar from "../components/sidebar/verticalSidebar";
import { QuillDeltaToHtmlConverter } from "quill-delta-to-html";
import utf8 from "utf8";
import { saveAs } from 'file-saver';
import { Delta } from "quill";

export default function DocumentEditorPage() {

  const [resumeHtml, setresumeHtml] = useState<string>();
  const [fileName, setFileName] = useState<string>();
  const [showUpload, setShowUpload] = useState(true);

  const [documentContent, setDocumentContent] = useState<Delta>()

  const theme = extendTheme({
    styles: {
      global: {
        "&::-webkit-scrollbar": {
          width: "4px",
        },
        "&::-webkit-scrollbar-track": {
          bg: "gray.100",
        },
        "&::-webkit-scrollbar-thumb": {
          bg: "gray.500",
          borderRadius: "20px",
        },
      },
    },
  });

  const onFileUpload = async (file: File) => {
    const fileType = file?.type;

    if (fileType == "application/pdf") {
      console.log("pdf")
    } else if (fileType == "application/msword" || fileType == "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
      // convert to html use legacy until api is fixed
      getHtmlFromDocFileLegacy(await file.arrayBuffer()).then((html) => {
        setresumeHtml(html ?? "");
        setShowUpload(false);
        setFileName(file.name);
      });
    }
  }

  const onLoadEditor = (html?: string) => {
    setFileName("New Resume Document")
    setresumeHtml("");
    setShowUpload(false);
  }

  const toast = useToast()

  return (
    <div className="App">
      <ChakraProvider theme={theme}>
        {showUpload && <ResumeModal
          isOpen={true}
          onClose={() => { }}
          onFileUpload={onFileUpload}
          onLoadEditor={onLoadEditor} />}
        {
          <SimpleSidebar
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
            <DocumentEditor onDocumentChangeText={(content) => setDocumentContent(content)} documentHtml={resumeHtml ?? ""} documentName={fileName} />
          </SimpleSidebar>}
      </ChakraProvider>

    </div>
  );
}

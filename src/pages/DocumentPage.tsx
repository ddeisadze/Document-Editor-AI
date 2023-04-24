import "react-quill/dist/quill.snow.css";
import "react-quill/dist/quill.snow.css";
import "./DocumentEditor.css"
import { ChakraProvider, extendTheme, useTheme } from "@chakra-ui/react"
import { DocumentEditor } from "../components/documents/editor/DocumentEditor";
import ResumeModal from "./ImportResumeDialog";
import { LinkedInCallback } from 'react-linkedin-login-oauth2';
import { getHtmlFromDocFileLegacy } from "../utility/helpers";
import { useState } from "react";
import { test_resume_html } from "../utility/sampleData";

export default function DocumentEditorPage() {

  const [resumeHtml, setresumeHtml] = useState<string>();
  const [fileName, setFileName] = useState<string>();
  const [showUpload, setShowUpload] = useState(true);

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

  return (
    <div className="App">
      <ChakraProvider theme={theme}>
        {showUpload && <ResumeModal
          isOpen={true}
          onClose={() => { }}
          onFileUpload={onFileUpload}
          onLoadEditor={onLoadEditor} />}
        {showUpload && <DocumentEditor isDemoView documentHtml={test_resume_html} documentName={"Test Resume"} />}
        {!showUpload && <DocumentEditor documentHtml={resumeHtml ?? ""} documentName={fileName} />}
      </ChakraProvider>

    </div>
  );
}

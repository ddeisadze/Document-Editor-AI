import React, { useEffect, useMemo, useRef, useState } from "react";
import "draft-js/dist/Draft.css";
import mammoth from "mammoth";
import ReactQuill, { Quill, ReactQuillProps } from "react-quill";
import "react-quill/dist/quill.snow.css";

const resumeFileName = `http://localhost:3000/resume.docx`;

async function getHtml() {
  const arrBuffer = await fetch(resumeFileName)
    .then((res) => res.blob())
    .then((blob) => blob.arrayBuffer());

  const html = await mammoth
    .convertToHtml({ arrayBuffer: arrBuffer })
    .then(function (result) {
      var html = result.value;
      return html;
    })
    .catch((err) => console.log("error", err));

  return html;
}

function MyEditor() {
  useEffect(() => {
    const html = getHtml().then((html) => {
      handlePasteHTML(html);
    });
  }, []);

  const quillRef: any = React.useRef(null);

  const handlePasteHTML = (html: any) => {
    console.log(quillRef.current);
    console.log("yoo");
    console.log("yoo");

    if (quillRef.current) {
      quillRef.current.getEditor().clipboard.dangerouslyPasteHTML(0, html);
    }
    console.log(quillRef.current.value);
  };
  const handleSelectionChange = (range: any) => {
    console.log(range);

    if (range) {
      const text = quillRef.current
        ?.getEditor()
        .getText(range.index, range.length);
      console.log("Selected text:", text);
    }
  };

  return (
    <>
      <h1> Chat GPT interaction</h1>
      <h1> Editor</h1>

      <div
        style={{
          padding: "10%",
        }}
      >
        <ReactQuill ref={quillRef} onChangeSelection={handleSelectionChange} />
      </div>
    </>
  );
}

function App() {
  return (
    <div className="App">
      <MyEditor />
    </div>
  );
}

export default App;

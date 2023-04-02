import React, { FC, useCallback, useMemo, useRef } from "react";
import mammoth from "mammoth";
import { Quill, Range, ReactQuillProps } from "react-quill";
import "react-quill/dist/quill.snow.css";
import { EditorState, Modifier, SelectionState } from "draft-js";
import "react-quill/dist/quill.snow.css";
import "./App.css"
import { ChakraProvider, VStack } from "@chakra-ui/react"
import { MyEditor } from "./MyEditor";

function App() {
  return (
    <div className="App">
      <ChakraProvider>
        <MyEditor />
      </ChakraProvider>
    </div>
  );
}

export default App;

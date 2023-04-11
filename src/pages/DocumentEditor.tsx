import "react-quill/dist/quill.snow.css";
import "react-quill/dist/quill.snow.css";
import "./DocumentEditor.css"
import { ChakraProvider } from "@chakra-ui/react"
import { DocumentEditor } from "../components/documents/editor/DocumentEditor";
import { DocumentManager } from "../components/documents/Gallery";

function App() {
  return (
    <div className="App">
      <ChakraProvider>
        {/* <DocumentEditor /> */}
        <DocumentManager />
      </ChakraProvider>
    </div>
  );
}

export default App;

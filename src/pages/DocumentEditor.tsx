import "react-quill/dist/quill.snow.css";
import "react-quill/dist/quill.snow.css";
import "./DocumentEditor.css"
import { ChakraProvider, extendTheme, useTheme } from "@chakra-ui/react"
import { DocumentEditor } from "../components/documents/editor/DocumentEditor";
import { DocumentManager } from "../components/documents/Gallery";

function App() {

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

  return (
    <div className="App">
      <ChakraProvider theme={theme}>
        {/* <DocumentEditor /> */}
        <DocumentManager />
      </ChakraProvider>
    </div>
  );
}



export default App;

import { useState, useRef } from "react";
import {
  Box,
  Button,
  Heading,
  SimpleGrid,
  Popover,
  PopoverTrigger,
  PopoverContent,
  ButtonGroup,
  VStack,
  PopoverArrow,
  PopoverCloseButton,
  Grid,
} from "@chakra-ui/react";
import GalleryNavbar from "./GalleryNavbar";
import ThumbnailPreview from "./editor/ThumbnailPreview";
import { IconButton } from "@chakra-ui/react";
import { FaPlus } from "react-icons/fa";

type Document = {
  id: number;
  name: string;
  content: string;
};

const documents: Document[] = [
  { id: 1, name: "Document 1", content: "This is the content of Document 1." },
  { id: 2, name: "Document 2", content: "This is the content of Document 2." },
  { id: 3, name: "Document 3", content: "This is the content of Document 3." },
];

type NewDocumentCardProps = {
  onClick: () => void;
};

function NewDocumentCard({ onClick }: NewDocumentCardProps) {
  return (
    <Box borderWidth="1px" borderRadius="md" padding={4}>
      <Button variant="ghost" onClick={onClick}>
        Create new document
      </Button>
    </Box>
  );
}

type ExistingDocumentCardProps = {
  document: Document;
};

function ExistingDocumentCard({ document }: ExistingDocumentCardProps) {
  return (
    <Box borderWidth="1px" borderRadius="md" padding={4}>
      <Heading size="md">{document.name}</Heading>
      <Box minHeight="60px">{document.content}</Box>
    </Box>
  );
}

type DocumentGalleryProps = {
  documents: Document[];
};

function DocumentGallery({ documents }: DocumentGalleryProps) {
  return (
    <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={4}>
      {documents.map((document) => (
        <ExistingDocumentCard key={document.id} document={document} />
      ))}
    </SimpleGrid>
  );
}
const ThumbnailPreviewRow = ({
  documents,
}: {
  documents: Array<any> | null;
}) => {
  console.log("yooo", Array.isArray(documents), typeof documents);

  return documents && Array.isArray(documents) ? (
    <Grid templateColumns="repeat(4, 1fr)" gap={4} mt={8} mr={60} ml={60}>
      {documents.map((document: any) => (
        <ThumbnailPreview thumbnail={document.thumbnail} />
      ))}
    </Grid>
  ) : null;
};

const AddButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <IconButton
      aria-label="Add Document"
      icon={<FaPlus size={30} />}
      sx={{ width: "100px", height: "100px" }}
      variant="solid"
      colorScheme="teal"
      position="fixed"
      bottom="15"
      right="15"
      borderRadius="full"
      onClick={onClick}
    />
  );
};

const FileExplorer = ({ handleSelect }: any) => {
  const inputRef: any = useRef();

  const handleButtonClick = () => {
    inputRef.current.click();
  };

  const handleSelectFile = (event: any) => {
    const file = event.target.files[0];
    handleSelect(file);
  };

  return (
    <div>
      <button onClick={handleButtonClick}>Select a file</button>
      <input
        type="file"
        ref={inputRef}
        style={{ display: "none" }}
        onChange={handleSelectFile}
      />
    </div>
  );
};
const MyUploader = () => {
  console.log("uploader");

  const handleSelect = (file: any) => {
    // handle the selected file here
    console.log(file);
  };

  return (
    <div>
      <h2>Upload a file</h2>
      <FileExplorer handleSelect={handleSelect} />
    </div>
  );
};

export function DocumentManager() {
  const documentsString = localStorage.getItem("documents");
  const documents = documentsString
    ? JSON.parse(documentsString)
    : (null as Array<any> | null);
  const [isCreatingNew, setIsCreatingNew] = useState(documents === null);
  console.log(isCreatingNew, documents ? documents[0].documentName : null);

  function handleNewDocumentClick() {
    setIsCreatingNew(true);
  }

  return (
    <div className="">
      <GalleryNavbar />
      {isCreatingNew ? (
        <MyUploader />
      ) : (
        <ThumbnailPreviewRow documents={documents} />
      )}
      <AddButton onClick={() => null} />

      <Popover placement="top" offset={[0, 20]}>
        <PopoverTrigger>
          <IconButton
            aria-label="Add Document"
            icon={<FaPlus size={30} />}
            sx={{ width: "100px", height: "100px" }}
            variant="solid"
            colorScheme="teal"
            position="fixed"
            bottom="15"
            right="15"
            borderRadius="full"
          />
        </PopoverTrigger>
        <PopoverContent height={"150px"} width={"100px"} border={"none"}  boxShadow={'none'}>
          {/* <PopoverArrow /> */}

          {/* <PopoverBody> */}
            <ButtonGroup variant="outline" spacing="6" >
            <VStack>

              <Button colorScheme="#10a33f">New Blank</Button>
              <Button colorScheme="#10a33f">Upload</Button>
              </VStack>
            </ButtonGroup>
            
          {/* </PopoverBody> */}
        </PopoverContent>
      </Popover>
    </div>
  );
}

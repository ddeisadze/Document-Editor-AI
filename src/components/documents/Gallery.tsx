import { useState } from "react";
import {
  Box,
  Button,
  Center,
  Heading,
  SimpleGrid,
  Stack,
  Flex,
  Grid
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
const ThumbnailPreviewRow = () => {
    const thumbnails = [
      localStorage.getItem("thumbnail") as string | undefined,
      localStorage.getItem("thumbnail") as string | undefined,
      localStorage.getItem("thumbnail") as string | undefined,
      localStorage.getItem("thumbnail") as string | undefined,
      localStorage.getItem("thumbnail") as string | undefined,
      localStorage.getItem("thumbnail") as string | undefined,
  
      localStorage.getItem("thumbnail") as string | undefined,
    ];
  
    return (
      <Grid templateColumns='repeat(4, 1fr)' gap={4} mt={8} mr={60} ml={60}>
        {thumbnails.map((thumbnail, index) => (
            <ThumbnailPreview thumbnail={thumbnail} />
        ))}
      </Grid>
    );
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

export function DocumentManager() {
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  function handleNewDocumentClick() {
    setIsCreatingNew(true);
  }

  return (
    <div className="">
      <GalleryNavbar />
      {/* <Grid
      minHeight="100vh"
      templateRows="auto 1fr auto"
      templateColumns='repeat(4, 1fr)'
      gap={4}
      padding={4}
    > */}
      {/* <Center> */}
        {/* <Stack spacing={4} alignItems="center"> */}
        {isCreatingNew ? (
            <Box borderWidth="1px" borderRadius="md" padding={4}>
              {/* Here you can add the form to create a new document */}
            </Box>
          ) : (
            <ThumbnailPreviewRow />
          )}        
          {/* </Stack> */}
      {/* </Center> */}
    {/* </Grid> */}
      
    <AddButton onClick={handleNewDocumentClick} />
    </div>
  );
}

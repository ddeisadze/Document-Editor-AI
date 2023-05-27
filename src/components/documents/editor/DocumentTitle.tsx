import React, { useState } from "react";
import { Flex, Text, IconButton, Input } from "@chakra-ui/react";
import { EditIcon } from "@chakra-ui/icons";

interface DocumentTitleProps {
  documentName?: string;
  onDocumentNameChange?: (newName: string) => void;
}

const defaultDocumentName = "Untitled Document";

function DocumentTitle({
  documentName = defaultDocumentName,
  ...props
}: DocumentTitleProps): JSX.Element {
  const [isEditing, setIsEditing] = useState<boolean>(false);

  function handleTitleClick(): void {
    setIsEditing(true);
  }

  function handleTitleChange(event: React.ChangeEvent<HTMLInputElement>): void {
    if (props.onDocumentNameChange)
      props.onDocumentNameChange(event.target.value);
  }

  function handleTitleBlur(): void {
    document.title = documentName;
    setIsEditing(false);
  }

  return (
    <Flex alignItems="center" justifyContent="space-between">
      {isEditing ? (
        <Input
          value={documentName == defaultDocumentName ? "" : documentName}
          onChange={handleTitleChange}
          onBlur={handleTitleBlur}
          variant="flushed"
          size="lg"
          autoFocus
          type={"text"}
        />
      ) : (
        <Text
          style={{
            color: 'rgba(51,65,85,1)',
            fontWeight: 500,
            maxWidth: "220px",
            maxHeight: "30px",
            overflow: "hidden",
            whiteSpace: "nowrap",  // Keeps the text on a single line
            textOverflow: "ellipsis"
          }}
          size="lg"
          onClick={handleTitleClick}
          cursor="pointer"
          opacity={documentName === defaultDocumentName ? 0.5 : 1}
          _hover={{
            transition: "border 0.3s ease-in-out",
            backgroundColor: "rgb(248,250,252)",
          }}
        >
          {documentName}
          {documentName === defaultDocumentName && (
            <IconButton
              icon={<EditIcon />}
              aria-label="Edit document title"
              ml="2"
              size="sm"
              variant="ghost"
            />
          )}
        </Text>
      )}
    </Flex>
  );
}

export default DocumentTitle;

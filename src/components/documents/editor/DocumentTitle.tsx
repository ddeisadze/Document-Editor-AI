import React, { useState } from "react";
import { Flex, Heading, IconButton, Input } from "@chakra-ui/react";
import { EditIcon } from "@chakra-ui/icons";

interface DocumentTitleProps {
    documentName?: string,
    onDocumentNameChange?: (newName: string) => void
}

const defaultDocumentName = "Untitled Document"

function DocumentTitle({ documentName = defaultDocumentName, ...props }: DocumentTitleProps): JSX.Element {
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
                    variant='flushed'
                    size="lg"
                    autoFocus
                    type={"text"}
                />
            ) : (
                <Heading
                    size="lg"
                    onClick={handleTitleClick}
                    cursor="pointer"
                    opacity={documentName === defaultDocumentName ? 0.5 : 1}
                    _hover={{ border: "1px solid gray", transition: "border 0.3s ease-in-out" }}
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
                </Heading>
            )}
        </Flex>
    );
}

export default DocumentTitle;

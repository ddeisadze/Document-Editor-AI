import React, { useState } from "react";
import { Flex, Heading, IconButton, Input } from "@chakra-ui/react";
import { EditIcon } from "@chakra-ui/icons";

interface DocumentTitleProps {
    defaultTitle?: string;
}

function DocumentTitle({ defaultTitle = "Untitled Document" }: DocumentTitleProps): JSX.Element {
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [title, setTitle] = useState<string>(defaultTitle);

    function handleTitleClick(): void {
        setIsEditing(true);
    }

    function handleTitleChange(event: React.ChangeEvent<HTMLInputElement>): void {
        setTitle(event.target.value);
    }

    function handleTitleBlur(): void {
        document.title = title;
        setIsEditing(false);
    }

    return (
        <Flex alignItems="center" justifyContent="space-between">
            {isEditing ? (
                <Input
                    value={title == defaultTitle ? "" : title}
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
                    opacity={title === defaultTitle ? 0.5 : 1}
                    _hover={{ border: "1px solid gray", transition: "border 0.3s ease-in-out" }}
                >
                    {title}
                    {title === defaultTitle && (
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

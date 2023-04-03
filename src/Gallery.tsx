import { useState } from 'react';
import {
    Box,
    Button,
    Center,
    Heading,
    SimpleGrid,
    Stack,
} from '@chakra-ui/react';

type Document = {
    id: number;
    name: string;
    content: string;
};

const documents: Document[] = [
    { id: 1, name: 'Document 1', content: 'This is the content of Document 1.' },
    { id: 2, name: 'Document 2', content: 'This is the content of Document 2.' },
    { id: 3, name: 'Document 3', content: 'This is the content of Document 3.' },
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

export function DocumentManager() {
    const [isCreatingNew, setIsCreatingNew] = useState(false);

    function handleNewDocumentClick() {
        setIsCreatingNew(true);
    }

    return (
        <Center minHeight="100vh" padding={4}>
            <Stack spacing={4}>
                <NewDocumentCard onClick={handleNewDocumentClick} />
                {isCreatingNew ? (
                    <Box borderWidth="1px" borderRadius="md" padding={4}>
                        {/* Here you can add the form to create a new document */}
                    </Box>
                ) : (
                    <DocumentGallery documents={documents} />
                )}
            </Stack>
        </Center>
    );
}
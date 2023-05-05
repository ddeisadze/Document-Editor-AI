import {
    Accordion,
    AccordionButton,
    AccordionIcon,
    AccordionItem,
    AccordionPanel,
    Box,
    Stack,
    Table,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tr,
    VStack
} from "@chakra-ui/react";
import React from "react";
import { JobRowData } from "./jobTable";
import { UserInfo } from "./userInfoStep";

export interface Batch {
    userInfo: UserInfo;
    jobs: JobRowData[];
    date: Date
}

interface BatchesDisplayProps {
    batches: Batch[];
}

export const BatchesDisplay: React.FC<BatchesDisplayProps> = ({ batches }) => {
    return (
        <VStack spacing={6} alignItems="stretch">
            <Box p={4} borderWidth={1} borderRadius="lg">
                <Table>
                    <Thead>
                        <Tr>
                            <Th>Date</Th>
                            <Th>URLs</Th>
                            <Th>Status</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {batches.map((row, index) => (
                            <Tr key={index}>
                                <Td>
                                    <Text>{new Date(row.date).toLocaleDateString()}</Text>
                                </Td>
                                <Td>
                                    <Accordion allowToggle>
                                        <AccordionItem >
                                            <h2>
                                                <AccordionButton>
                                                    <Box flex="1" textAlign="left">
                                                        Job urls in this batch
                                                    </Box>
                                                    <AccordionIcon />
                                                </AccordionButton>
                                            </h2>
                                            <AccordionPanel pb={4}>
                                                {row.jobs.map((job, urlIndex) => (
                                                    <Stack spacing={3}>
                                                        <Text fontSize='md'>{job.url}</Text>
                                                    </Stack>
                                                ))}

                                            </AccordionPanel>
                                        </AccordionItem>
                                    </Accordion>
                                </Td>
                                <Td>
                                    <Text>In Progress</Text>
                                </Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </Box>
        </VStack>
    );
};
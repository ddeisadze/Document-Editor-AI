import {
    Box,
    Button,
    Checkbox,
    Editable,
    EditableInput,
    EditablePreview,
    Flex,
    Table,
    TableContainer,
    Tbody,
    Td,
    Th,
    Thead,
    Tr,
    useColorModeValue
} from "@chakra-ui/react";
import { useState } from "react";

export interface JobRowData {
    url: string;
    notes: string;
    disability: boolean;
    termsAndConditions: boolean;
}

interface JobTableProps {
    jobs?: JobRowData[],
    onChange?: (row: JobRowData[]) => void,
    readonly?: boolean
}


export function JobTable({ readonly = false, ...props }: JobTableProps) {
    const [rows, setRows] = useState<JobRowData[]>(props.jobs ?? []);

    console.log(rows)

    const addRow = () => {
        setRows([
            ...rows,
            { url: "", notes: "", disability: false, termsAndConditions: false },
        ]);
    };

    const updateRow = (index: number, newRowData: JobRowData) => {
        const newRows = rows.map((row, idx) => (idx === index ? { ...newRowData } : row));
        setRows(
            newRows
        );

        if (props.onChange) {
            props.onChange(newRows)
        }
    };


    return (

        <Box>
            <TableContainer>
                <Table variant={"striped"}>
                    <Thead>
                        <Tr>
                            <Th>Job URL</Th>
                            <Th>Additional Notes</Th>
                            <Th>Disability</Th>
                            <Th>Terms & Conditions</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {rows.map((row, index) => (
                            <Tr key={index}>
                                <Td>
                                    <Editable
                                        isDisabled={readonly}
                                        placeholder="Enter url for job"
                                        value={row.url}
                                        onChange={(url) => updateRow(index, { ...row, url })}
                                    >
                                        <EditablePreview py={2}
                                            fontStyle={'italic'}
                                            px={4}
                                            _hover={{
                                                background: useColorModeValue("gray.100", "gray.700")
                                            }} />
                                        <EditableInput />
                                    </Editable>
                                </Td>
                                <Td>
                                    <Editable
                                        isDisabled={readonly}
                                        placeholder="Any other notes? (optional)"
                                        value={row.notes}
                                        onChange={(notes) => updateRow(index, { ...row, notes })}
                                    >
                                        <EditablePreview py={2}
                                            px={4}
                                            fontStyle={'italic'}
                                            _hover={{
                                                background: useColorModeValue("gray.100", "gray.700")
                                            }} />
                                        <EditableInput />
                                    </Editable>
                                </Td>
                                <Td>
                                    <Checkbox
                                        isReadOnly={readonly}
                                        isChecked={row.disability}
                                        onChange={(e) =>
                                            updateRow(index, { ...row, disability: e.target.checked })
                                        }
                                    />
                                </Td>
                                <Td>
                                    <Checkbox
                                        isReadOnly={readonly}

                                        isChecked={row.termsAndConditions}
                                        onChange={(e) =>
                                            updateRow(index, {
                                                ...row,
                                                termsAndConditions: e.target.checked,
                                            })
                                        }
                                    />
                                </Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </TableContainer>

            {!readonly && <Flex justifyContent="center" mt={4}>
                <Button onClick={addRow} colorScheme="blue">
                    Add Row
                </Button>
            </Flex>}
        </Box>
    );
};
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
    Text,
    Th,
    Thead,
    Tr
} from "@chakra-ui/react";
import { useState } from "react";

export interface JobRowData {
    url: string;
    notes: string;
    termsAndConditions: boolean;

    validations?: {
        url: string;
        termsAndConditions: string
    }

}


interface JobTableProps {
    jobs?: JobRowData[],
    onChange?: (row: JobRowData[]) => void,
    readonly?: boolean
}

const validateURL = (url: string): string => {
    const regex = /^(ftp|http|https):\/\/[^ "]+$/;
    return regex.test(url) ? "" : "Invalid URL";
};

export function JobTable({ readonly = false, ...props }: JobTableProps) {
    const [rows, setRows] = useState<JobRowData[]>(props.jobs ?? []);

    console.log(rows)

    const addRow = () => {
        setRows([
            ...rows,
            { url: "", notes: "", termsAndConditions: false },
        ]);
    };

    const updateRow = (index: number, newRowData: JobRowData) => {
        const isUrlValid = validateURL(newRowData.url);
        const isTermsAndConditionValid = !newRowData.termsAndConditions ? "Check terms and conditions." : "";

        const newRows = rows.map((row, idx) => (idx === index ? {
            ...newRowData,
            validations: {
                url: isUrlValid,
                termsAndConditions: isTermsAndConditionValid
            }
        } : row));

        if (newRowData.url)
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
                                        <EditablePreview
                                            py={2}
                                            fontStyle={row.validations?.url ? "normal" : "italic"}
                                            px={4}
                                            color={row.validations?.url ? "red.500" : "inherit"}
                                        />
                                        <EditableInput />
                                    </Editable>
                                    {row.validations?.url && (
                                        <Text fontSize="sm" color="red.500" mt={1}>
                                            {row.validations?.url}
                                        </Text>
                                    )}
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
                                        />
                                        <EditableInput />
                                    </Editable>
                                </Td>
                                <Td>
                                    <Checkbox
                                        color={row.validations?.termsAndConditions ? "red.500" : "inherit"}
                                        isReadOnly={readonly}
                                        isChecked={row.termsAndConditions}
                                        onChange={(e) =>
                                            updateRow(index, {
                                                ...row,
                                                termsAndConditions: e.target.checked,
                                            })
                                        }
                                    />
                                    {row.validations?.termsAndConditions && (
                                        <Text fontSize="sm" color="red.500" mt={1}>
                                            {row.validations?.termsAndConditions}
                                        </Text>
                                    )}
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
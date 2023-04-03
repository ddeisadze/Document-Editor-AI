import React from "react";
import { Box, Button, Flex, useBoolean } from "@chakra-ui/react";
import { saveAs } from 'file-saver';
import { QuillDeltaToHtmlConverter } from 'quill-delta-to-html';
import { DeltaStatic } from 'quill';
import { getPdfFileFromHtml } from "../../../utility/helpers";

export function DocumentFooter(props: {
    contents?: DeltaStatic;
    documentName: string;
}) {
    const [loading, setLoading] = useBoolean(false);

    return (
        <Flex bg="white">
            <Box>
                <Button isLoading={loading} onClick={() => {
                    setLoading.on();
                    const html = new QuillDeltaToHtmlConverter(props.contents?.ops ?? [], {}).convert();

                    getPdfFileFromHtml(html)
                        .then(blob => {
                            saveAs(blob, `${props.documentName}.pdf`);
                            setLoading.off();
                        });
                }}
                >Export to PDF</Button>
            </Box>
        </Flex>
    );
}

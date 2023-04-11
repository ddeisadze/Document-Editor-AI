import React from "react";
import { Box, Button, Flex, useBoolean } from "@chakra-ui/react";
import { saveAs } from 'file-saver';
import { QuillDeltaToHtmlConverter } from 'quill-delta-to-html';
import { DeltaStatic } from 'quill';
import { getPdfFileFromHtml } from "../../../utility/helpers";
import utf8 from "utf8";

export function DocumentFooter(props: {
    contents?: DeltaStatic;
    documentName: string;
}) {
    const [loading, setLoading] = useBoolean(false);

    const getDocxFile = (html: string) => { }

    return (
        <Flex bg="white">
            <Box>
                <Button isLoading={loading} onClick={() => {
                    setLoading.on();
                    const html: string = new QuillDeltaToHtmlConverter(props.contents?.ops ?? [], {
                        inlineStyles: true
                    }).convert();

                    const html_encoded = utf8.encode(html)

                    getPdfFileFromHtml(html_encoded)
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

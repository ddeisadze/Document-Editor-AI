import { Box, Text } from "@chakra-ui/react";
import React from "react";
import { getDocument } from "../../utility/storageHelpers";
import ThumbnailPreview from "../documents/editor/ThumbnailPreview";
import { JobRowData, JobTable } from "./jobTable";
import { UserInfo } from "./userInfoStep";

interface ConfirmationStepProps {
    userInfo: UserInfo;
    jobs: JobRowData[];
}

export const ConfirmationStep: React.FC<ConfirmationStepProps> = ({
    userInfo,
    jobs,
}) => {

    const doc = getDocument(userInfo.resumeDocumentId);

    return (
        <Box>
            <Text fontSize="lg" fontWeight="bold">
                User Information
            </Text>
            <Text>First Name: {userInfo.firstName}</Text>
            <Text>Last Name: {userInfo.lastName}</Text>
            <ThumbnailPreview documentId={doc?.id ?? ""} documentName={doc?.documentName ?? ""} thumbnail={doc?.thumbnail} key={doc?.id} newTab />
            <Text fontSize="lg" fontWeight="bold" mt={4}>
                Job Applications
            </Text>
            <JobTable jobs={jobs} readonly />
        </Box>
    );
};
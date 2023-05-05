import { Box, FormControl, FormLabel, Input } from "@chakra-ui/react";
import React, { useState } from "react";
import { getDocument, getDocuments } from "../../utility/storageHelpers";
import { ThumbnailGallery } from "../documents/Gallery";
import ThumbnailPreview from "../documents/editor/ThumbnailPreview";

export interface UserInfo {
    firstName: string;
    lastName: string;
    resumeDocumentId: string;
}

interface UserInfoStepProps {
    userInfo: UserInfo;
    onChange: (userInfo: UserInfo) => void;
}

export const UserInfoStep: React.FC<UserInfoStepProps> = ({
    userInfo,
    onChange,
}) => {

    const [fileDialog, setFileDialog] = useState(!userInfo?.resumeDocumentId ?? true);

    const doc = getDocument(userInfo.resumeDocumentId);

    return (
        <Box>
            <FormControl id="firstName">
                <FormLabel>First Name</FormLabel>
                <Input
                    value={userInfo.firstName}
                    onChange={(e) =>
                        onChange({ ...userInfo, firstName: e.target.value })
                    }
                />
            </FormControl>
            <FormControl id="lastName" mt={4}>
                <FormLabel>Last Name</FormLabel>
                <Input
                    value={userInfo.lastName}
                    onChange={(e) =>
                        onChange({
                            ...userInfo
                            , lastName: e.target.value
                        })
                    }
                />
            </FormControl>
            <FormControl id="resume" mt={4}>
                <FormLabel>Resume</FormLabel>
                <Box maxH={"400px"} display='block' overflowY='scroll'>
                    {fileDialog ? <ThumbnailGallery documents={getDocuments()} onClick={(documentId) => {
                        setFileDialog(false)
                        onChange({ ...userInfo, resumeDocumentId: documentId })
                    }} /> :
                        <ThumbnailPreview documentId={doc?.id ?? ""} documentName={doc?.documentName ?? ""} thumbnail={doc?.thumbnail} key={doc?.id} newTab />
                    }
                </Box>
            </FormControl>
        </Box>
    );
};

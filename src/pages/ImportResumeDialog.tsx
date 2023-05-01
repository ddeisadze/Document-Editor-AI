import React, { useState } from "react";
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    Button,
    HStack,
    Icon,
} from "@chakra-ui/react";
import { FaGoogle, FaLinkedin, FaFileUpload, FaClipboard } from "react-icons/fa";
import { useLinkedIn } from 'react-linkedin-login-oauth2';


type ModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onFileUpload: (file: File) => void;
    onCopyPaste: (html?: string) => void
};

const NewResumeModal: React.FC<ModalProps> = ({ isOpen, onClose, ...props }) => {
    const [linkedinAccessCode, setLinkedinAccessCode] = useState<string>();

    const { linkedInLogin } = useLinkedIn({
        clientId: '78jz6w0ihwoyew',
        redirectUri: `${window.location.origin}/linkedin`, // for Next.js, you can use `${typeof window === 'object' && window.location.origin}/linkedin`
        onSuccess: (code) => {
            console.log(code);
            // setLinkedinAccessCode(code);

            console.log(`Bearer ${code}`)

            fetch("https://api.linkedin.com/v2/me", {
                method: "GET",
                mode: "no-cors",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${code}`
                },

            }).then(resp => console.log(resp)).catch(e => console.log(e))
        },
        onError: (error) => {
            console.log(error);
        },
    });

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files && event.target.files[0];
        console.log(file?.type)
        if (file) {
            props.onFileUpload(file)
        } else {
            alert("Please select a PDF or Word document.");
        }
    };

    const handleUploadResume = () => {
        const fileInput = document.getElementById("fileInput");
        fileInput && fileInput.click();
    };

    const handleImportFromGoogleDrive = () => {
        // Launch Google Drive API to select file
        console.log("Import from Google Drive clicked");
    };

    const handleImportFromLinkedIn = () => {
        // Connect to LinkedIn API to import user's profile
        console.log("Import from LinkedIn clicked");
        linkedInLogin.call({});
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} >
            <ModalOverlay bg='blackAlpha.300'
                backdropFilter='blur(8px) hue-rotate(90deg)'
            />
            <ModalContent>
                <ModalHeader>Import Your Resume</ModalHeader>
                <ModalBody>
                    <input
                        id="fileInput"
                        type="file"
                        style={{ display: "none" }}
                        onChange={handleFileChange}
                        accept=".doc,.docx"
                    />
                    <HStack spacing={2}>
                        <Button leftIcon={<Icon as={FaFileUpload} />} onClick={handleUploadResume}>File (.doc, .docx)</Button>
                        <Button leftIcon={<Icon as={FaClipboard} />} onClick={() => props.onCopyPaste()}>Copy and Paste</Button>

                    </HStack>
                </ModalBody>
                <ModalFooter>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default NewResumeModal;

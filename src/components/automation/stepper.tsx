import { Box, Button, Flex, VStack } from "@chakra-ui/react";
import { useState } from "react";
import { useUser } from "../../../utils/useUser";
import { Batch } from "./batchesDisplay";
import { ConfirmationStep } from "./confirmationStep";
import { JobRowData, JobTable } from "./jobTable";
import { UserInfo, UserInfoStep } from "./userInfoStep";

interface StepperProps {
    addNewJobs: (newBatch: Batch) => void
}

export function Stepper(props: StepperProps) {
    const [step, setStep] = useState(1);
    const user = useUser();

    const [userInfo, setUserInfo] = useState<UserInfo>({
        firstName: user.userDetails?.full_name?.split(" ").at(0) ?? "",
        lastName: user.userDetails?.full_name?.split(" ").at(1) ?? "",
        resumeDocumentId: "",
        email: user.user?.email ?? ""
    });
    const [jobs, setJobs] = useState<JobRowData[]>([]);

    const onNextStep = () => {
        setStep((prevStep) => (prevStep < 3 ? prevStep + 1 : 1));
    };

    const onPreviousStep = () => {
        setStep((prevStep) => (prevStep > 1 ? prevStep - 1 : 3));
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <UserInfoStep
                        userInfo={userInfo}
                        onChange={(u) => setUserInfo(u)}
                    />
                );
            case 2:
                return (
                    <JobTable
                        jobs={jobs}
                        onChange={(jobs => setJobs(jobs))}
                    />
                );
            case 3:
                return (
                    <ConfirmationStep
                        userInfo={userInfo}
                        jobs={jobs}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <VStack spacing={6} alignItems="stretch">
            <Box>{renderStep()}</Box>
            <Flex justifyContent="space-between">
                {step > 1 && <Button onClick={onPreviousStep}>Previous</Button>}
                {step === 3 ? <Button alignSelf={"flex-end"} colorScheme="blue" onClick={() => {

                    props.addNewJobs({
                        jobs,
                        userInfo,
                        date: new Date()
                    })

                }}>Submit jobs</Button> :
                    <Button alignSelf={"flex-end"} colorScheme="blue" onClick={() => {
                        onNextStep()
                    }}>Next</Button>}
            </Flex>
        </VStack>
    );
};

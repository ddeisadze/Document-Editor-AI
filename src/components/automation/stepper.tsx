import { Box, Button, Flex, useToast, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useUser } from "../../../utils/useUser";
import { Batch } from "./batchesDisplay";
import { ConfirmationStep } from "./confirmationStep";
import { JobRowData, JobTable } from "./jobTable";
import { UserInfo, UserInfoStep } from "./userInfoStep";

interface StepperProps {
    submitBatch: (newBatch: Batch) => void
}

export function Stepper(props: StepperProps) {
    const [step, setStep] = useState(1);
    const [userInfo, setUserInfo] = useState<UserInfo>({
        firstName: "",
        lastName: "",
        resumeDocumentId: "",
    });
    const [jobs, setJobs] = useState<JobRowData[]>([]);

    const toast = useToast();

    const { user, isLoading, userDetails } = useUser();

    useEffect(() => {
        if (isLoading) return;

        const firstName = userDetails?.first_name ?? "";
        const lastName = userDetails?.last_name ?? "";

        setUserInfo({ ...userInfo, firstName, lastName })
    }, [user]);


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

                    props.submitBatch({
                        jobs,
                        userInfo,
                        date: new Date()
                    })

                    return toast({
                        title: 'Automation request submitted!',
                        description: 'Our systems will auto apply to these set of jobs, custom matching your resume to the job description.',
                        status: 'success',
                        duration: 5000,
                        isClosable: true,
                    })
                }}>Submit jobs</Button> :
                    <Button alignSelf={"flex-end"} colorScheme="blue" onClick={onNextStep}>Next</Button>}
            </Flex>
        </VStack>
    );
};

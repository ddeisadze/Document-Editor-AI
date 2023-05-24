import { IconButton } from '@chakra-ui/button';
import { Tooltip } from "@chakra-ui/react";
import { FaRocketchat } from "react-icons/fa";

import { useTour } from '@reactour/tour';
import { useEffect } from 'react';
import { getIsNewUser } from '../../../../utility/storageHelpers';
import styles from "./inlineToolbar.module.css";

interface InlineToolbarProps {
  top: number,
  bottom: number,
  right: number,
  left: number,
  lineHeight: number,
  isOpen?: boolean,
  onClickLaunchChat: () => void,
  onClickCheckGrammer: () => void,

}

function InlineToolbar(props: InlineToolbarProps) {
  const { isOpen, currentStep, steps, setIsOpen, setCurrentStep } = useTour()

  useEffect(() => {

    if (isOpen && getIsNewUser() && currentStep === 0) {
      // quillRef?.current?.editor?.setSelection(222, 148);
      setCurrentStep(1)
    }

  }, []);

  return <div
    className={`${styles.wandContainer} ${styles.bubbleFloatBottom} inlineToolbar`}
    style={{
      top: props?.top - props?.lineHeight - 15,
      left: props?.left,
      position: "absolute",
      display: (props.isOpen ?? true) ? "block" : "none",
    }}

  >
    <Tooltip label='General chat with AI'>
      <IconButton
        id="inlineToolbar" // DO NOT REMOVE, dependency from editor
        variant='ghost'
        aria-label='Call Sage'
        size={'sm'}
        onClick={() => {
          props.onClickLaunchChat();
          // write me code to wait a second for the last function to load 
          setTimeout(() => setCurrentStep(2), 100)
        }}
        icon={<FaRocketchat id="inlineToolbar" style={{ color: "#10a33f" }} />}
      />
    </Tooltip>
  </div>;
}

export default InlineToolbar
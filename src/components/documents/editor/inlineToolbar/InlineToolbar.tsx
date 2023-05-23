import { IconButton } from '@chakra-ui/button';
import { Tooltip } from "@chakra-ui/react";
import { FaRocketchat } from "react-icons/fa";

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
        onClick={props.onClickLaunchChat}
        icon={<FaRocketchat id="inlineToolbar" style={{ color: "#10a33f" }} />}
      />
    </Tooltip>
  </div>;
}

export default InlineToolbar
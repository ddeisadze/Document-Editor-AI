import { FaRocketchat, FaEdit, FaPlus } from "react-icons/fa";
import { IconButton } from '@chakra-ui/button';
import { Tooltip } from "@chakra-ui/react";

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
    className="wandContainer bubble-float-bottom"
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
        // colorScheme='#10a33f'
        variant='ghost'
        aria-label='Call Sage'
        size={'sm'}
        onClick={props.onClickLaunchChat}
        icon={<FaRocketchat id="inlineToolbar" style={{ color: "#10a33f" }} />}
      />
    </Tooltip>
    <Tooltip label='Edit text'>
      <IconButton
        id="inlineToolbar" // DO NOT REMOVE, dependency from editor
        // colorScheme='#10a33f'
        variant='ghost'
        aria-label='Call Sage'
        size={'sm'}
        onClick={props.onClickCheckGrammer}
        icon={<FaEdit id="inlineToolbar" style={{ color: "#10a33f" }} />}
      />
    </Tooltip>

    <Tooltip label='Generate new text'>
      <IconButton
        id="inlineToolbar" // DO NOT REMOVE, dependency from editor
        // colorScheme='#10a33f'
        variant='ghost'
        aria-label='Call Sage'
        size={'sm'}
        // onClick={props.onClick}
        icon={<FaPlus id="inlineToolbar" style={{ color: "#10a33f" }} />}
      />
    </Tooltip>

  </div>;
}

export default InlineToolbar
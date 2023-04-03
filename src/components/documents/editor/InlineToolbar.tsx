import { FaMagic } from "react-icons/fa";
import { IconButton } from '@chakra-ui/button';

interface InlineToolbarProps {
  top: number,
  bottom: number,
  right: number,
  left: number,
  lineHeight: number,
  isOpen?: boolean,
  onClick: () => void
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
    <IconButton
      id="inlineToolbar" // DO NOT REMOVE, dependency from editor
      // colorScheme='#10a33f'
      variant='ghost'
      aria-label='Call Sage'
      size={'sm'}
      onClick={props.onClick}
      icon={<FaMagic id="inlineToolbar" style={{ color: "#10a33f" }} />}
    />
  </div>;
}

export default InlineToolbar
import React from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWandSparkles } from "@fortawesome/free-solid-svg-icons";

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
      // bottom: selectedTextState?.bottom,
      left: props?.left,
      // right: selectedTextState?.right,
      position: "absolute",
      display: (props.isOpen ?? true) ? "block" : "none",
    }}
  >
    <FontAwesomeIcon
      onClick={props.onClick}
      icon={faWandSparkles}
      style={{ color: "#10a33f" }} />
  </div>;
}

export default InlineToolbar
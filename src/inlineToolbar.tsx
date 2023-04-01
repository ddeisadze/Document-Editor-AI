import React from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWandSparkles } from "@fortawesome/free-solid-svg-icons";

function inlineToolbar(selectedTextState: { text: string; top: number; bottom: number; right: number; left: number; lineHeight: number; }, showWand: boolean) {
    return <div
      className="wandContainer bubble-float-bottom"
      style={{
        top: selectedTextState?.top - selectedTextState?.lineHeight - 15,
        // bottom: selectedTextState?.bottom,
        left: selectedTextState?.left,
        // right: selectedTextState?.right,
        position: "absolute",
        display: showWand ? "block" : "none",
      }}
    >
      <FontAwesomeIcon
        icon={faWandSparkles}
        style={{ color: "#10a33f" }} />
    </div>;
  }

export default inlineToolbar
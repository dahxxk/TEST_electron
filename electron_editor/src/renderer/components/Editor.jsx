import React from "react";
import style from "./Editor.css";

export default function Editor(props) {
  return (
    <textarea
      id="editor"
      className={`${style.editor} ${props.className}`}
      value={props.value}
      onChange={props.onChange}
    />
  );
}

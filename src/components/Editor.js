import React, { useEffect } from "react";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/dracula.css";
import "codemirror/mode/javascript/javascript";
import Codemirror from "codemirror";

const Editor = () => {
  useEffect(() => {
    async function init() {
      Codemirror.fromTextArea(document.getElementById("realTimeEditor"), {
        mode: {
          name: "javascript",
          json: true,
        },
        theme: "dracula",
        autoCloseTags: true,
        autoCloseBrackets: true,
        lineNumbers: true,
      });
    }
    init();
  }, []);
  return <textarea id="realTimeEditor"  style={{ display: 'none' }}></textarea>;
};

export default Editor;

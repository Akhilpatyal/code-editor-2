import React, { useEffect, useRef } from "react";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/dracula.css";
import "codemirror/mode/javascript/javascript";
import Codemirror from "codemirror";
import { Actions } from "../Actions";

const Editor = ({ socketRef, roomId, onCodeChange }) => {
  const editorRef = useRef(null);
  useEffect(() => {
    async function init() {
      editorRef.current = Codemirror.fromTextArea(
        document.getElementById("realTimeEditor"),
        {
          mode: {
            name: "javascript",
            json: true,
          },
          theme: "dracula",
          autoCloseTags: true,
          autoCloseBrackets: true,
          lineNumbers: true,
        }
      );
      editorRef.current.on("change", (instance, changes) => {
        // console.log(changes);
        const { origin } = changes;
        const code = instance.getValue();
        onCodeChange(code);
        // console.log(code);
        if (origin !== "setValue") {
          socketRef.current.emit(Actions.CODE_CHANGE, { roomId, code });
          // console.log('working');
        }
      });

      // editorRef.current.setValue("hello worlds") -- we are use this if we want to change dynamically
    }
    init();
  }, [roomId, socketRef, onCodeChange]);
  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.on(Actions.CODE_CHANGE, ({ code }) => {
        console.log("receiving");

        if (code !== null) {
          editorRef.current.setValue(code);
        }
      });
    }
  });
  // what ever we are wrote in this it get emit to socket
  return <textarea id="realTimeEditor" style={{ display: "none" }}></textarea>;
};

export default Editor;

import React, { useEffect, useRef } from "react";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/dracula.css";
import "codemirror/mode/javascript/javascript";
import Codemirror from "codemirror";

const Editor = (socketRef) => {
  const editorRef=useRef(null);
  useEffect(() => {
    async function init() {
     editorRef.current= Codemirror.fromTextArea(document.getElementById("realTimeEditor"), {
        mode: {
          name: "javascript",
          json: true,
        },
        theme: "dracula",
        autoCloseTags: true,
        autoCloseBrackets: true,
        lineNumbers: true,
      });
      editorRef.current.on('change',(instance,changes)=>{
        // console.log(changes);
        const {origin}=changes;
        const code=instance.getValue()
        // console.log(code);
        if (origin!=='setValue') {
          socketRef.current.emit();
        }
        
      })
      // editorRef.current.setValue("hello worlds") -- we are use this if we want to change dynamically
    }
    init();
  }, []);
  // what ever we are wrote in this it get emit to socket
  return <textarea id="realTimeEditor"  style={{ display: 'none' }}></textarea>;
};

export default Editor;

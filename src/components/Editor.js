import React, { useEffect, useRef } from "react";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/dracula.css";
import "codemirror/mode/javascript/javascript";
import "codemirror/addon/edit/closetag";
import "codemirror/addon/edit/closebrackets";
import Codemirror from "codemirror";
import { Actions } from "../Actions";

const Editor = ({ socketRef, roomId, onCodeChange, socketReady }) => {
  const editorRef = useRef(null);

  useEffect(() => {
    const textarea = document.getElementById("realTimeEditor");
    if (!textarea) return undefined;

    const wrap = textarea.closest(".editorWrap");
    const editor = Codemirror.fromTextArea(textarea, {
      mode: {
        name: "javascript",
        json: true,
      },
      theme: "dracula",
      autoCloseTags: true,
      autoCloseBrackets: true,
      lineNumbers: true,
    });
    editorRef.current = editor;

    const syncSize = () => {
      const ed = editorRef.current;
      if (!ed || !wrap) return;
      const h = wrap.clientHeight;
      if (h > 0) {
        ed.setSize("100%", h);
        ed.refresh();
      }
    };

    const onLocalChange = (instance, changes) => {
      const { origin } = changes;
      const code = instance.getValue();
      onCodeChange(code);
      if (origin !== "setValue" && socketRef.current) {
        socketRef.current.emit(Actions.CODE_CHANGE, { roomId, code });
      }
    };
    editor.on("change", onLocalChange);

    syncSize();
    requestAnimationFrame(() => {
      syncSize();
      requestAnimationFrame(syncSize);
    });

    const ro = wrap ? new ResizeObserver(syncSize) : null;
    if (wrap && ro) ro.observe(wrap);
    window.addEventListener("resize", syncSize);

    return () => {
      window.removeEventListener("resize", syncSize);
      if (ro && wrap) ro.disconnect();
      editor.off("change", onLocalChange);
      if (editorRef.current) {
        editorRef.current.toTextArea();
        editorRef.current = null;
      }
    };
  }, [roomId, onCodeChange, socketRef]);

  useEffect(() => {
    if (!socketReady || !socketRef.current) return undefined;

    const socket = socketRef.current;
    const onRemoteCode = ({ code }) => {
      if (code == null) return;
      const ed = editorRef.current;
      if (!ed) return;
      if (ed.getValue() !== code) {
        ed.setValue(code);
      }
    };

    socket.on(Actions.CODE_CHANGE, onRemoteCode);
    return () => {
      socket.off(Actions.CODE_CHANGE, onRemoteCode);
    };
  }, [roomId, socketReady, socketRef]);

  return <textarea id="realTimeEditor" style={{ display: "none" }}></textarea>;
};

export default Editor;

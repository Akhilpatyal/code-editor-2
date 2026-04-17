import React, { useEffect, useState, useRef, useCallback } from "react";
import Client from "../components/Client";
import Editor from "../components/Editor";
import { initSocket } from "../socket";
import { Actions } from "../Actions";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

const EditorPage = () => {
  const [clients, setClients] = useState([]);
  const [socketReady, setSocketReady] = useState(false);
  const socketRef = useRef(null);
  const codeRef = useRef(null);
  const location = useLocation();
  const { roomId } = useParams();
  const reactNavigator = useNavigate();

  useEffect(() => {
    if (!location.state?.username) {
      toast.error("Username is missing. Redirecting...");
      reactNavigator("/");
      return undefined;
    }

    const handleErr = (e) => {
      console.log("socket error", e);
      toast.error("Socket connection failed. Please try again later.");
      reactNavigator("/");
    };

    let cancelled = false;

    const init = async () => {
      const socket = await initSocket();
      if (cancelled) {
        socket.disconnect();
        return;
      }

      socketRef.current = socket;
      setSocketReady(true);

      socket.on("connect_error", handleErr);

      socket.emit(Actions.JOIN, {
        roomId,
        username: location.state.username,
      });

      socket.on(
        Actions.JOINED,
        ({ clients: connectedClients, username, socketId }) => {
          if (username !== location.state?.username) {
            toast.success(`Welcome ${username}`);
          }
          setClients(
            connectedClients.filter(
              (client, index, self) =>
                index === self.findIndex((c) => c.username === client.username)
            )
          );
          socket.emit(Actions.SYNC_CODE, {
            code: codeRef.current,
            socketId,
          });
        }
      );

      socket.on(Actions.DISCONNECTED, ({ socketId, username }) => {
        toast.success(`${username} left the room`);
        setClients((prev) =>
          prev.filter((client) => client.socketId !== socketId)
        );
      });
    };

    init();

    return () => {
      cancelled = true;
      setSocketReady(false);
      if (socketRef.current) {
        socketRef.current.off("connect_error", handleErr);
        socketRef.current.off(Actions.JOINED);
        socketRef.current.off(Actions.DISCONNECTED);
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [location.state?.username, roomId, reactNavigator]);

  const onCodeChange = useCallback((code) => {
    codeRef.current = code;
  }, []);
  async function copyRoomId() {
    try {
      await navigator.clipboard.writeText(roomId);
      toast.success("your room id Copied to your clipboard");
    } catch (error) {
      toast.error("Could not copy room ID to clipboard.");
      console.log(error);
    }
  }
  function leaveRoom() {
    reactNavigator("/");
  }

  //
  // if (location.state) {
  //   return <Navigate to="" state={location.state} />;
  // }
  return (
    <div className="mainWrap">
      <div className="aside">
        <div className="asideInner">
          <div className="logo">
            <img
              src="/code-sync.png"
              alt="code-sync.png"
              className="logoImage"
            />
          </div>
          <h3>Connected</h3>
          <div className="clientList">
            {clients.map((client) => (
              <Client key={client.socketId} username={client.username} />
            ))}
          </div>
        </div>
        <button className="btn copyBtn" onClick={copyRoomId}>
          Copy RoomID
        </button>
        <button className="btn leaveBtn" onClick={leaveRoom}>
          Leave
        </button>
      </div>

      <div className="editorWrap">
        <Editor
          socketRef={socketRef}
          roomId={roomId}
          onCodeChange={onCodeChange}
          socketReady={socketReady}
        />
      </div>
    </div>
  );
};

export default EditorPage;

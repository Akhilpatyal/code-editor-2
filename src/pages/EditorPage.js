import React, { useEffect, useState, useRef } from "react";
import Client from "../components/Client";
import Editor from "../components/Editor";
import { initSocket } from "../socket";
import { Actions } from "../Actions";
import {
  // Navigate,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import toast from "react-hot-toast";
const EditorPage = () => {
  const [clients, setClients] = useState([]);
  const socketRef = useRef(null);
  const codeRef = useRef(null);
  const location = useLocation(); 
  const { roomId } = useParams();
  const reactNavigator = useNavigate();
  useEffect(() => {
    const init = async () => {
      socketRef.current = await initSocket();
      // error handling
      socketRef.current.on("connect_error", (err) => handleErr(err));
      socketRef.current.on("connect_failed", (err) => handleErr(err));
      function handleErr(e) {
        console.log("socket error", e);
        toast.error("scoket connection failed please try again later");
        reactNavigator("/");
      }

      //
      socketRef.current.emit(Actions.JOIN, {
        roomId,
        username: location.state?.username,
      });
      // listening socket
      socketRef.current.on(
        Actions.JOINED,
        ({ clients: connectedClients, username, socketId }) => {
          if (username !== location.state?.username) {
            toast.success(`Welcome ${username} to the room ${roomId}`);
            console.log(`Welcome ${username} to the room ${roomId}`);
          }
          setClients(connectedClients);
          socketRef.current.emit(Actions.SYNC_CODE,{
            code:codeRef.current,socketId
          });
        }
      );

      // listening for disconnected
      socketRef.current.on(Actions.DISCONNECTED, ({ socketId, username }) => {
        toast.success(`${username} left the room`);
        setClients((prev) => {
          return prev.filter((client) => client.socketId !== socketId);
        });
      });
    };
    init();

    // cleaning function
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current.off(Actions.JOINED);
        socketRef.current.off(Actions.DISCONNECTED);
      }
    };
  }, [location.state?.username,roomId,reactNavigator]);

  async function copyRoomId(){
    try {
      await navigator.clipboard.writeText(roomId);
      toast.success('your room id Copied to your clipboard')
    } catch (error) {
        toast.success('i am not able to copy your roomid');
        console.log(error);
        
    }
  }
  function leaveRoom(){
    reactNavigator('/');
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
        <button className="btn copyBtn" onClick={copyRoomId}>Copy RoomID</button>
        <button className="btn leaveBtn" onClick={leaveRoom}>Leave</button>
      </div>

      <div className="editorWrap">
        <Editor socketRef={socketRef} roomId={roomId} onCodeChange={(code)=>{
          codeRef.current=code
        }}/>
      </div>
    </div>
  );
};

export default EditorPage;

import React, { useEffect,useState,useRef } from 'react'
import Client from '../components/Client'
import Editor from '../components/Editor';
import { initSocket } from '../socket';
import {Actions} from '../Actions';
import { useLocation } from 'react-router-dom';
const EditorPage=()=> { 
  const socketRef=useRef(null);
  const location=useLocation();
  useEffect(() => {
  const init =async()=>{
    socketRef.current=await initSocket();
    socketRef.current.emit(Actions.JOIN,{
      username:location.state?.username,
    });
  }
  init();
  })
  const [clients] = useState([
    {
      socketId: 1,
      username: 'jk munna',
    },
    {
      socketId: 2,
      username: 'pj kapla',
    },
    {
      socketId: 3,
      username: 'Lj kapla',
    }
  ]);
  return (
    <div className='mainWrap'>
      <div className="aside">
        <div className="asideInner">
          <div className="logo">
            <img src="/code-sync.png" alt="code-sync.png" className='logoImage' />
          </div>
          <h3>Connected</h3>
          <div className="clientList">
            {
              clients.map((client) =>
              (<Client
                key={client.socketId}
                username={client.username}
              />

              ))

            }
          </div>
        </div>
        <button className="btn copyBtn">Copy RoomID</button>
        <button className="btn leaveBtn">Leave</button>
      </div>

      <div className="editorWrap">
        <Editor />
      </div>
    </div>
  )
}

export default EditorPage;

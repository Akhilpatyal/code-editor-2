import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
function Home() {
  const navigate = useNavigate();
  const [roomid, setRoomid] = useState("");
  const [username, setuserName] = useState("");

  const createNewRoom = (e) => {
    e.preventDefault(); //so that the page didnot refresh during click
    const id = uuidv4();
    setRoomid(id);
    toast.success("created a new room");
  };

  const joinRoom = () => {
    if (!roomid || !username) {
      toast.error("Room Id and username is required");
      return;
    }
    navigate(`/editorPage/${roomid}`, {
      // we can also passes the state as a parameter also we do by redux
      state: {
        roomid,
        username,
      },
    });
  };
  const handleEnter = (e) => {
    if (e.code === "Enter") {
      joinRoom();
    }
  };

  return (
    <div className="homePagewrapper">
      <div className="formWrapper">
        <img
          className="homePageLogo"
          src="/code-sync.png"
          alt="code-sync.png"
        />
        <h4 className="mainLabel">Invitationn Room ID</h4>
        <div className="inputGroup">
          <input
            type="text"
            className="inputBox"
            placeholder="RoomID"
            onChange={(e) => setRoomid(e.target.value)} //if user already has id
            value={roomid}
            onKeyUp={handleEnter}
          />
          <input
            type="text"
            className="inputBox"
            placeholder="USER NAME"
            onChange={(e) => setuserName(e.target.value)}
            value={username}
            onKeyUp={handleEnter}
          />

          <button className="btn joinBtn" onClick={joinRoom}>
            Join
          </button>
          <span className="createInfo">
            If you don't have an invite then create &nbsp;
            <a onClick={createNewRoom} href="##" className="createNewBtn">
              New Room
            </a>
          </span>
        </div>
      </div>
      <footer>
        <h4>
          Built with @ Love India &nbsp;
          <a href="https://google.com">Akhil Patyal</a>
        </h4>
      </footer>
    </div>
  );
}

export default Home;

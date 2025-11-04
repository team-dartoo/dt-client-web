import React from "react";
import NavBar from "../../shared/components/Navbar";
import Header from "../../shared/components/Header";
import chatIcon from "@/images/chat_icon.svg";
import dartooLogo from "@/images/DARTOO.svg";

const Profile = () => {
  return (
    <div className="Profile">
      <NavBar />
      <Header
        title={<img src={dartooLogo} alt="dartoo" />}
        right={
          <button onClick={() => navigate(-1)}>
            <img src={chatIcon} alt="AI-chat" />
          </button>
        }
      />
    </div>
  );
};

export default Profile;

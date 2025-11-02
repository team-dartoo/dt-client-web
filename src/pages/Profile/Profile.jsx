import React from "react";
import NavBar from "../../shared/components/Navbar";
import Header from "../../shared/components/Header";

const Profile = () => {
  return (
    <div className="Profile">
      <NavBar />
      <Header
        title="DARTOO"
        // right={
        //   <button onClick={() => navigate(-1)}>
        //     <img src={chatIcon} alt="AI-chat" />
        //   </button>
        // }
      />
    </div>
  );
};

export default Profile;

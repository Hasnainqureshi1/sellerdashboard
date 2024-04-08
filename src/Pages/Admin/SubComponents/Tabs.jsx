import React, { useState } from "react";
import AdminList from "../Components/Setting/AdminList";
import Profile from "../Components/Setting/Profile";
import AddAdmin from "../Components/Setting/AddAdmin";

const Tabs = () => {
  const [activeTab, setActiveTab] = useState("general");

  const changeTab = (tabName) => {
    setActiveTab(tabName);
  };

  return (
    <div className="  w-full">
      <div className=" w-full flex flex-row  border-b border-gray-200">
        <button
          className={`${
            activeTab === "general"
              ? "border-cyan-500 text-cyan-500 font-bold "
              : "text-gray-500 hover:text-gray-700"
          }      text-md px-4 py-4 focus:outline-none`}
          onClick={() => changeTab("general")}
        >
          General
        </button>
        <button
          className={`${
            activeTab === "profile"
              ? "border-cyan-500 text-cyan-500 font-bold"
              : "text-gray-500 hover:text-gray-700"
          }      text-md px-4 py-2 focus:outline-none`}
          onClick={() => changeTab("profile")}
        >
          Profile
        </button>
        <button
          className={`${
            activeTab === "addAdmin"
              ? "border-cyan-500 text-cyan-500 font-bold"
              : "text-gray-500 hover:text-gray-700"
          }      text-md px-4 py-2 focus:outline-none`}
          onClick={() => changeTab("addAdmin")}
        >
          Add User
        </button>
      </div>
      <div className="mt-8">
        {activeTab === "general" &&  <AdminList/>}
        {activeTab === "profile" &&  <Profile/>}
        {activeTab === "addAdmin" &&  <AddAdmin/>}
      </div>
    </div>
  );
};

export default Tabs;

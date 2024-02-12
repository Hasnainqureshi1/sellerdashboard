import React, { useEffect, useState } from "react";
import Login from "./Pages/Login";
import Admin from "./Pages/Admin";
import Seller from "./Pages/Seller";
import Membership from "./Pages/Admin/Components/Membership";
import Setting from "./Pages/Admin/Components/Setting";
import { Route, Routes } from "react-router-dom";
import Header from "./Pages/Admin/Header";
import SideBar from "./Pages/Admin/SideBar";
import Sellers from "./Pages/Admin/Components/Sellers";
import SellerDetails from "./Pages/Admin/SubComponents/SellerDetails";
import SellerTable from "./Pages/Admin/SubComponents/SellerTable";
const showSidebar = () => {};
const App = () => {
  const [sidebarShow, setsidebarShow] = useState(true);
  useEffect(() => {
    const handleResize = () => {
      window.innerWidth >= 768 ? setsidebarShow(true) : setsidebarShow(false);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return (
    <div>
      <Header setsidebarShow={setsidebarShow} sdbr={sidebarShow} />
      <div className="flex  flex-col lg:flex-row overflow-hidden">
        <SideBar sdbr={sidebarShow} />
        <Routes>
          <Route path="dashboard" element={<Admin />} />
          <Route path="/sellers/*" element={<Sellers/>}/>
          <Route path="sellers/:sellerid" element={<SellerDetails/>}/>

          
          
         
          <Route path="membership" element={<Membership />} />
          <Route path="settings" element={<Setting />} />
          <Route path="/" element={<Admin />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;

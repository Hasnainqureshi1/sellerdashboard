import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaUser, FaStore, FaCog, FaUsersCog, FaHistory } from "react-icons/fa";
import { AiFillThunderbolt } from "react-icons/ai";
import { BsQrCodeScan } from "react-icons/bs";

const SideBar = ({ sdbr }) => {
  return (
    <div
      className={` ${
        sdbr ? "animate-slide-in block" : "animate-slide-out hidden"
      }   lg:w-300px w-screen bg-white h-90vh flex-wrap overflow-hidden shadow-lg`}
    >
     
     <ul className="bg-white h-full pt-4">
  <li className="p-3 hover:bg-cyan-50   transition mx-3 rounded-2xl hover:border-l-4 hover:border-cyan-500">
    <Link to="./dashboard" className="flex items-center hover:text-cyan-400">
      <FaUser size={24} className="hover:text-cyan-400" /> <span className="pl-3 text-lg">Dashboard</span>
    </Link>
  </li>
  <li className="p-3 hover:bg-cyan-50 transition mx-3 rounded-2xl hover:border-l-4 hover:border-cyan-500">
    <Link to="./sellers" className="flex items-center hover:text-cyan-400">
      <FaStore size={24} className="hover:text-cyan-400" /> <span className="pl-3 text-lg">Sellers</span>
    </Link>
  </li>
  <li className="p-3 hover:bg-cyan-50 transition mx-3 rounded-2xl hover:border-l-4 hover:border-cyan-500">
    <Link to="./membership" className="flex items-center hover:text-cyan-400">
      <FaUsersCog  size={24} className="hover:text-cyan-400" /> <span className="pl-3 text-lg">Membership</span>
    </Link>
  </li>
  <li className="p-3 hover:bg-cyan-50 transition mx-3 rounded-2xl hover:border-l-4 hover:border-cyan-500">
    <Link to="./order-scan" className="flex items-center hover:text-cyan-400">
      <BsQrCodeScan   size={24} className="hover:text-cyan-400" /> <span className="pl-3 text-lg">Order Scan</span>
    </Link>
  </li>
  <li className="p-3 hover:bg-cyan-50 transition mx-3 rounded-2xl hover:border-l-4 hover:border-cyan-500">
    <Link to="./order-history" className="flex items-center hover:text-cyan-400">
      <FaHistory  size={24} className="hover:text-cyan-400" /> <span className="pl-3 text-lg">Order History</span>
    </Link>
  </li>
  <li className="p-3 hover:bg-cyan-50 transition mx-3 rounded-2xl hover:border-l-4 hover:border-cyan-500">
    <Link to="./settings" className="flex items-center hover:text-cyan-400">
      <FaCog size={24} className="hover:text-cyan-400" /> <span className="pl-3 text-lg">Settings</span>
    </Link>
  </li>
</ul>
      </div>
   
  );
};

export default SideBar;

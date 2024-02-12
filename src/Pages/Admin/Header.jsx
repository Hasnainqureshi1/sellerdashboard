import React, { useState } from 'react'
import { AiOutlineMenu } from "react-icons/ai";
import { CiSaveDown1 } from "react-icons/ci";
import { FaCaretDown } from "react-icons/fa";
import { IoIosSettings } from "react-icons/io";

const Header = ({setsidebarShow,sdbr}) => {
 const [setting, setsetting] = useState(false);
 const showSetting = ()=>{
setsetting(!setting);
console.log(setting);
 }
 const sidebar =()=>{
  setsidebarShow(!sdbr);
  console.log(sdbr);
 }
  return (
    <div className='flex justify-between bg-white w-full p-3 shadow-lg'>
     <div className="left  flex flex-row-reverse">
     <p>Logo</p>
     <div className="menu lg:hidden pr-10" >
     <AiOutlineMenu fontSize={24} onClick={sidebar}/>

     </div>
     </div>
     <div className="right">
    <div className='p-1 px-5 cursor-pointer bg-white border-xl shadow-sm flex rounded-xl justify-center items-center' onClick={showSetting}>
     <img src="https://www.iconpacks.net/icons/2/free-user-icon-3296-thumb.png" alt="user image" className='w-3 h-3 mr-2 md:w-7 md:h-7'  />
     <p className='text-vsm mr-1 md:text-lg   '>Hasnain Qureshi</p>
      
     <FaCaretDown />

    </div>
    <div className={`w-full ${setting?'block':'hidden'} `}>
 
    <div className='absolute top-10 md:top-14 animate-fade-in bg-slate-200  flex p-1 md:p-1 px-7 md:px-12  mr-10 cursor-pointer  justify-center items-center'>
    <IoIosSettings   className='text-sm md:text-4xl'/>
    <span className='text-xs mr-1 md:text-lg ml-5  '>Setting</span>
    </div>
    </div>
     </div>
    </div>
  )
}

export default Header
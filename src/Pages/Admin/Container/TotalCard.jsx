import React from 'react';
import { LuUserPlus } from "react-icons/lu";

const TotalCard = ({ totalUser }) => {
  return (
    <div className='bg-cyan-100 w-full max-w-[45%] mx-auto p-6 shadow-xl rounded-lg hover:shadow-2xl transition-shadow duration-200 ease-in-out'>
      <div className="flex justify-between items-center mb-4">
        <h3 className='text-2xl lg:text-4xl font-bold text-cyan-800'>{totalUser.head}</h3>
        <LuUserPlus className='text-4xl text-cyan-600'/>
      </div>
      <p className='text-xl lg:text-3xl font-semibold text-cyan-700'>{totalUser.total}</p>
    </div>
  );
}

export default TotalCard;

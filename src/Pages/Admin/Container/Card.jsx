import React from 'react';
import { FaMoneyCheckDollar } from "react-icons/fa6";

const Card = ({ totalSales }) => {
  return (
    <div className='bg-cyan-100 w-2/5 m-2  p-6 shadow-xl rounded-lg hover:shadow-2xl transition-shadow duration-200 ease-in-out'>
      <div className=''>
        <h3 className='text-xl lg:text-2xl font-bold text-cyan-800'>{totalSales.head}</h3>
      </div>
      <div className='flex justify-between items-center mt-4'>
        <p className='text-lg lg:text-xl font-semibold text-cyan-700'>${totalSales.sale}</p>
        <FaMoneyCheckDollar className='text-3xl text-cyan-600'/>
      </div>
    </div>
  );
}

export default Card;

{/* <div className='bg-cyan-100 w-full m-2  p-6 shadow-xl rounded-lg hover:shadow-2xl transition-shadow duration-200 ease-in-out'> */}
 
import React from 'react'
import { FaMoneyCheckDollar } from "react-icons/fa6";
const Card = ({totalSales}) => {
 console.log(totalSales)
  return (
   <div className='bg-cyan-100 w-1/4 p-3 shadow-lg rounded'>
   <div>
     <h3 className='text-lg font-bold '>{totalSales.head}</h3>
   </div>
   <div className='flex justify-between'>
     <p  className='text-lg font-bold '>${totalSales.sale}</p>
     <FaMoneyCheckDollar   className='text-2xl font-bold '/>

   </div>
 </div>
  )
}

export default Card
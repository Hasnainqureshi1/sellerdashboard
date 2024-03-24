import React from 'react'
import { LuUserPlus } from "react-icons/lu";
const TotalCard = ({totalUser}) => {
 // console.log(totalSales)
  return (
   <div className='bg-cyan-100 w-2/5 p-3 shadow-lg rounded'>
   <div>
     <h3 className='text-lg font-bold '>{totalUser.head}</h3>
   </div>
   <div className='flex justify-between'>
     <p  className='text-lg font-bold '>{totalUser.total}</p>
   
     <LuUserPlus  className='text-2xl font-bold '/>

   </div>
 </div>
  )
}

export default TotalCard
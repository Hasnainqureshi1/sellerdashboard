import React from 'react'
import { FaMoneyCheckDollar } from "react-icons/fa6";
import Card from './Container/Card';
import TotalCard from './Container/TotalCard';
import MembersDashboardChart from './Container/MembersDashboardChart';

const Dashboard = () => {
  const totalSales=[
    {
      head:'Total Market Sales',
      sale:0,
    },
    {
      head:"This Week Market Sales",
      sale:0,
    },
    {
     head:"This Month Market Sales",
     sale:0, 
    }
  ]
  const totalUsers = [
    {
      head:'Total Sellers',
      total:2,
    },
    {
      head:"Total Mebership",
      total:2,
    }

  ]
  return (
    <div className='p-2 m-3 bg-slate-100 lg:w-80v  '>
      <div className='bg-white shadow-lg'>

      
      <div className='mt-5  flex w-auto bg-white justify-around p-3'>
       {
        totalSales.map((totalSales) =>(
          
          <Card totalSales={totalSales}/>
        ))
       }
        
      </div>
      <div className='mt-5   flex w-auto bg-white justify-evenly  px-0 p-3'>
       {
        totalUsers.map((totalUser) =>(
          
          <TotalCard totalUser={totalUser}/>
        ))
       }
        
      </div>
      </div>
      <MembersDashboardChart/>
      
    </div>
  )
}

export default Dashboard
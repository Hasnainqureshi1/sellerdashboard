import React, { useEffect, useState } from 'react';
import { Link, Outlet } from 'react-router-dom';

const SellerTable = ({ data, onDelete,selectedRows ,onButtonClick, setSelectedRows}) => {
 

  const handleCheckboxChange = (sellerId) => {
   console.log(sellerId)
    setSelectedRows((prevSelectedRows) => {
     // console.log(prevSelectedRows);
      if (prevSelectedRows.includes(sellerId)) {
        return prevSelectedRows.filter((id) => id !== sellerId);
      } else {
        return [...prevSelectedRows, sellerId];
      }
    });
    // console.log(selectedRows);
  };
  useEffect(() => {
   console.log(selectedRows);
 }, [selectedRows]);
  const handleCheck10Rows = () => {
    const first10Rows = data.slice(0, 10).map((row) => row.seller_id);
    setSelectedRows(first10Rows);
  };

  const handleViewButtonClick = () => {
    console.log('View Button Clicked for selected rows:', selectedRows);
  };

  return (
    <div className='mt-3 shadow-md md:overflow-x-hidden overflow-x-scroll'>
       
      <table className="table-auto w-full bg-white text-center border  ">
        <thead className='text-md text-cyan-700 uppercase bg-gray-50 dark:bg-cyan-700 dark:text-gray-50'>
          <tr>
            <th className="px-4 py-2  text-xs lg:text-lg">Select</th>
            <th className="px-4 py-2 text-xs lg:text-lg">Seller ID</th>
            <th className="px-4 py-2 text-xs lg:text-lg">Name</th>
            <th className="px-4 py-2 text-xs lg:text-lg">Shop Name</th>
            <th className="px-4 py-2 text-xs lg:text-lg">Date Created</th>
            <th className="px-4 py-2 text-xs lg:text-lg">Total Sales</th>
            <th className="px-4 py-2 text-xs lg:text-lg">Items</th>
            <th className="px-4 py-2 text-xs lg:text-lg">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.seller_id} className='bg-white border dark:border-gray-300'>
              <td className="px-4 py-2 w-2">
                <input
                  type="checkbox"
                  onChange={() => handleCheckboxChange(row.seller_id)}
                  checked={selectedRows.includes(row.seller_id)}
                  className='p-3 w-3 h-3 text-xl'
                />
              </td>
              <td className="px-0 py-2 md:px-1 w-2 text-xs lg:text-lg">{row.seller_id}</td>
              <td className="px-0 py-2 md:px-1 w-2 text-xs lg:text-lg ">{row.name}</td>
              <td className="px-0 py-2 md:px-1 w-2 text-xs lg:text-lg">{row.shop_name}</td>
              <td className="px-0 py-2 md:px-1 w-2 text-xs lg:text-lg">{row.date_created}</td>
              <td className="px-0 py-2 md:px-1 w-2 text-xs lg:text-lg">{row.total_sales}</td>
              <td className="px-0 md:px-1 py-2 w-2 text-xs lg:text-lg">{row.items}</td>
              <td className="px-0 md:px-1 py-2 w-2 text-xs lg:text-lg">
                <Link
                to={`/sellers/${row.seller_id}`}
                  
                  className="bg-cyan-100 text-cyan-500 font-bold hover:bg-cyan-200 px-4 py-2 rounded focus:outline-none"
                >
                  View
                </Link>
            
               
                 
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    
    </div>
  );
};

export default SellerTable;

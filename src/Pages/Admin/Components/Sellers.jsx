import React, { useState , useEffect } from 'react';
import { CiSearch } from 'react-icons/ci';
import { MdDelete  } from "react-icons/md";
import { HiOutlineSearch } from "react-icons/hi";
import SellerTable from './../SubComponents/SellerTable';
import AddSellerModal from '../SubComponents/AddSellerModal';
import { useNavigate, Link, Route, Routes, Outlet } from 'react-router-dom';
import SellerDetails from '../SubComponents/SellerDetails';
const Sellers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);
  const [sortOption, setSortOption] = useState('default');
  const navigate = useNavigate();
  const [isAddSellerModalOpen, setAddSellerModalOpen] = useState(false);
  const [data, setData] = useState([
    { seller_id: 1, name: 'John Doe', shop_name: 'Doe Emporium', date_created: '2022-01-01', total_sales: 500, items: 20 },
    { seller_id: 2, name: 'Jane Smith', shop_name: 'Smith & Co', date_created: '2022-02-15', total_sales: 800, items: 30 },
    { seller_id: 3, name: 'Bob Johnson', shop_name: 'Bob Mart', date_created: '2022-03-10', total_sales: 300, items: 15 },
    // ... Add more initial data as needed
  ]);
  // Generate additional dummy data
  const generateDummyData = () => {
    const newEntries = Array.from({ length: 10 }, (_, index) => {
      const userId = index + 1;
      const randomChar = String.fromCharCode(65 + (userId % 26)); // A-Z characters based on userId
    
      return {
        seller_id: userId,
        name: `User${userId}_${randomChar}`,
        shop_name: `Shop${userId}_${randomChar}`,
        date_created: '2022-01-01',
        total_sales: Math.floor(Math.random() * 1000) + 1,
        items: Math.floor(Math.random() * 50) + 1,
      };
    });

    setData(newEntries);
  };
 useEffect(() => {
  generateDummyData();
}, [ ])
const [filteredData, setFilteredData] = useState([]);
 

const handleSearch = (e) => {
  const searchTerm = e.target.value.toLowerCase();
  setSearchTerm(searchTerm);

  const filteredData = data.filter((row) => {
    return (
      row.name.toLowerCase().includes(searchTerm) ||
      row.shop_name.toLowerCase().includes(searchTerm)
      // Add more fields to search if needed
    );
  });

  setFilteredData(filteredData);
};

useEffect(() => {
  // Set the filtered data when the original data changes
  setFilteredData(data);
}, [data]);
  const handleDelete = () => {
    console.log()
    const updatedData = data.filter((row) => !selectedRows.includes(row.seller_id));
    setData(updatedData);
    setSelectedRows([]);
  };

  const handleSortChange = (option) => {
    setSortOption(option);
    // Perform sorting logic here if needed
  };
  const handleViewButtonClick = (sellerId) => {
    navigate(`/sellerdetails/${sellerId}`);
   
  };
   
  return (
    <div className='p-2 m-3 bg-slate-100 lg:w-80v  '>
      <h1 className=' '>Sellers</h1>
      <div className="flex items-center mt-3 p-4 border bg-white border-gray-300 rounded shadow-md">
      {/* Search Bar */}
      <div className="relative w-full flex flex-row mr-4 bg-white">
        <span className=" flex-row  inset-y-0 left-0 flex items-center pl-2 bg-white">
        <HiOutlineSearch fontSize={20} className='absolute left-3 ' />

        </span>
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleSearch}
          className="pl-8 pr-2 py-2 w-full border shadow-sm border-gray-300 bg-cyan-50 rounded focus:outline-none focus:border-blue-500"
        />
      </div>

      {/* Sorting Options */}
      <select
        value={sortOption}
        onChange={handleSortChange}
        className="mr-2 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
      >
        <option value="default">Default</option>
        <option value="recent">Recent</option>
      </select>

      {/* Delete Icon */}
      <button
          onClick={() => handleDelete()}
          className="p-2 text-red-500 hover:text-red-700 focus:outline-none"
        >
       <MdDelete fontSize={24} />

      </button>
      <button
          onClick={() => setAddSellerModalOpen(true)}
          className="p-2 text-cyan-500 hover:text-cyan-700 bg-cyan-50 hover:bg-cyan-200 font-medium rounded-lg shadow-md focus:outline-none border px-5 w-1/3"
        >
          Add Seller
        </button>
        {isAddSellerModalOpen && (
        <AddSellerModal isOpen={isAddSellerModalOpen} onClose={() => setAddSellerModalOpen(false)} />
      )}

    </div>
    {/* Seller table  */}
 
     <SellerTable onButtonClick={handleViewButtonClick}  data={filteredData} onDelete={handleDelete} setSelectedRows ={setSelectedRows} selectedRows ={selectedRows} />   
 
      </div>
  )
}

export default Sellers
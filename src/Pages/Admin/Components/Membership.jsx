import React,{useState,useEffect} from 'react'
import SellerTable from '../SubComponents/SellerTable'
import MembershipTable from './Tables/MembershipTable'
import { CiSearch } from 'react-icons/ci';
import { MdDelete  } from "react-icons/md";
import { HiOutlineSearch } from "react-icons/hi";
import { AiFillCheckCircle } from 'react-icons/ai';
import { IoIosPersonAdd } from "react-icons/io";

const Membership = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);
  const [sortOption, setSortOption] = useState('default');
 
  const [isAddSellerModalOpen, setAddSellerModalOpen] = useState(false);
  const [data, setData] = useState([
    { member_id: 1, name: 'John Doe', email: '123@gmail.com', date: '2022-01-01', total_orders: 500,  },
    { member_id: 2, name: 'Jane Smith', email: '123@gmail.com', date: '2022-02-15', total_orders: 800,  },
    { member_id: 3, name: 'Bob Johnson', email: '123@gmail.com', date: '2022-03-10', total_orders: 300,  },
    // ... Add more initial data as needed
  ]);
  // Generate additional dummy data
  const generateDummyData = () => {
    const newEntries = Array.from({ length: 10 }, (_, index) => {
      const userId = index + 1;
      const randomChar = String.fromCharCode(65 + (userId % 26)); // A-Z characters based on userId
    
      return {
        member_id: userId,
        name: `User${userId}_${randomChar}`,
        email: `Shop${userId}_${randomChar}@gmail.com`,
        date: '2022-01-01',
        status:"pending",
        total_orders: Math.floor(Math.random() * 1000) + 1,
       
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
 

  return (
 <>
    <div className='p-2 m-3 bg-slate-100 lg:w-80v  '>
      <h1 className=' '>Membership</h1>
      <div className="flex flex-row-reverse items-center mt-3 p-4 border bg-white border-gray-300 rounded shadow-md">
      {/* Search Bar */}
      <div className="relative w-full flex flex-row mr-4 bg-white hover:shadow-sm">
        <span className=" flex-row  inset-y-0 left-0 flex items-center pl-2 bg-white">
        <HiOutlineSearch fontSize={20} className='absolute left-3 ' />

        </span>
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleSearch}
          className="pl-8 pr-2 py-2 w-full focus:bg-white border focus:shadow-lg shadow-sm border-gray-300 bg-cyan-50 rounded focus:outline-none focus:border-blue-500"
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
          className="p-2 text-cyan-500 border shadow-sm mr-3 hover:shadow-md rounded-md hover:text-cyan-700 focus:outline-none"
        >
  <IoIosPersonAdd fontSize={32} />

      </button>
     
  

    </div>
      <MembershipTable    data={filteredData} onDelete={handleDelete} setSelectedRows ={setSelectedRows} selectedRows ={selectedRows} />   
      </div>
   
    </> )
}

export default Membership
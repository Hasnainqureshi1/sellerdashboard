import React, { useState , useEffect, useContext } from 'react';
import { CiSearch } from 'react-icons/ci';
import { MdDelete  } from "react-icons/md";
import { HiOutlineSearch } from "react-icons/hi";
import SellerTable from './../SubComponents/SellerTable';
import AddSellerModal from '../SubComponents/AddSellerModal';
import { useNavigate, Link, Route, Routes, Outlet } from 'react-router-dom';
import SellerDetails from '../SubComponents/SellerDetails';
import { auth, firestore } from '../../../firebase/config';
import { collection, getDocs, query, where, doc, getDoc, onSnapshot } from 'firebase/firestore';
import { checkAuthAndRole } from '../../../firebase/functions';
import { AppContext } from '../../../Context/Context';
const Sellers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);
  const [sortOption, setSortOption] = useState('default');
  const navigate = useNavigate();
  const [isAddSellerModalOpen, setAddSellerModalOpen] = useState(false);
  const [data, setData] = useState();
  
  const [token, settoken] = useState( )
  const { User,Showalert,checkTokenExpiration } = useContext(AppContext);
  // getting token 
  useEffect(() => {
    User.getIdToken().then((token) => {
     
      settoken(token);
    }).
    catch((error) => {
      console.log('error',error);
    });
  }, [ ])

  const [sellersData, setSellersData] = useState([]);
  const fetchProductLengthPerSeller = async (sellerId) => {
    try {
      const productsCollectionRef = collection(firestore, 'products');
      const q = query(productsCollectionRef, where('sellerId', '==', sellerId));
      const querySnapshot = await getDocs(q);
  
      return querySnapshot.size; // Number of products for the seller
    } catch (error) {
      console.error('Error fetching products:', error);
      // Handle error appropriately
    }
  };
  
 
    
   
 console.log(sellersData)
 
//      
useEffect(() => {
  const fetchSellers = async () => {
    try {
      // Fetch data from users collection and listen for real-time updates
      const usersCollection = collection(firestore, 'users');
      const usersQuery = query(usersCollection, where('role', '==', 'seller'));
      
      onSnapshot(usersQuery, async (snapshot) => {
        const usersData = {};
  
        snapshot.forEach((doc) => {
          const userData = doc.data();
          usersData[doc.id] = { id: doc.id, ...userData };
        });
  
        // Fetch data from sellers collection and merge with user data
        const sellersCollection = collection(firestore, 'sellers');
        const sellersQuerySnapshot = await getDocs(sellersCollection);
        
        const sellersData = {};
        sellersQuerySnapshot.forEach((doc) => {
          const sellerData = doc.data();
          const userId = doc.id; // Assuming the document ID in sellers collection matches the users collection
          
          if (userId in usersData) {
            // Merge seller data into existing user data
            usersData[userId] = { ...usersData[userId], ...sellerData };
          } else {
            // If there's no matching user data, just add seller data separately
            sellersData[doc.id] = { id: doc.id, ...sellerData };
          }
        });
  
        // Update state or perform actions with the fetched data
        console.log(sellersData); // This will show the newly fetched sellers data
        setFilteredData(usersData);
        setData(usersData);
      });
    } catch (error) {
      console.error('Error fetching users data:', error);
      // Handle error appropriately
    }
  };
  

  fetchSellers();
}, [data]); // Empty dependency array ensures the effect runs only once when the component mounts

const [filteredData, setFilteredData] = useState([]);
 

const handleSearch = (e) => {
  const searchTerm = e.target.value.toLowerCase();
  setSearchTerm(searchTerm);

  const filteredData =  Object.values(data).filter((row) => {
    return (
      row.name.toLowerCase().includes(searchTerm) ||
      row.shopName.toLowerCase().includes(searchTerm)
      // Add more fields to search if needed
    );
  })  ;
  
  setFilteredData(filteredData);
};
 // deleting the sellers
  const handleDelete = async() => {
     //logic for deleting seller only in frontend
    console.log("Selected rows ", selectedRows);
     const updatedData = Object.values(data).filter((row) => !selectedRows.includes(row.id));
    setFilteredData(updatedData);

    setSelectedRows([]);
    Showalert("Seller Deleted successfully!",'green');
    //logic for deleting seller from backend 
    try {
      const response = await fetch(`http://localhost:5000/api/auth/seller`, { //Api Call
        method: "DELETE", 
        headers: {
          authorization: token, //verifying user role using token 
          "Content-Type": "application/json", 
         
        },
        body: JSON.stringify({
        sellerId:selectedRows, 
        })
      });
      if (response.ok) {
        const json = await response.json();
        console.log(json);
   
       
      
      }
     } catch (error) {
       console.error('Error Deleting seller: ', error);
     }
   
  };

  const handleSortChange = (option) => {
    setSortOption(option);
    // Perform sorting logic here if needed
  };
  const handleViewButtonClick = (sellerId) => {
    navigate(`./sellerdetails/${sellerId}`);
   
  };
   
  return (
    <div className='p-2 m-3 bg-slate-100 lg:w-80v  '>
      <h1 className=' text-4xl p-3'>Sellers</h1>
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
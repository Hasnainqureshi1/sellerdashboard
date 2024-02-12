// SellerDetails.js
import React ,{useState} from 'react';
import { useParams } from 'react-router-dom';
import SalesAnalytic from './SalesAnalytics';

const SellerDetails = () => {
  const { sellerid } = useParams();
  const seller = {
   name: 'John Doe',
   dateCreated: '2022-01-01',
   shopName: 'Doe Emporium',
   sales: 500,
   shopCategory:"Electronics",
   email: 'johndoe@example.com',
   password: 'password hai bro', // Displaying password as asterisks for security
   orders: 20,
   reviews: 15,
 };
 const [showPassword, setShowPassword] = useState(false);

 const togglePasswordVisibility = () => {
   setShowPassword((prevShowPassword) => !prevShowPassword);
 };
  // Fetch seller details based on the sellerId

  return (
   <div className='p-2 m-3 bg-slate-100 lg:w-80v  '>
    <div className='mt-3 ml-3 bg-white border shadow-md p-5'>
      <h2 className="text-2xl font-semibold mb-4">Seller Details</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-lg font-semibold">Name:</p>
          <p className="text-gray-600">{seller.name}</p>
        </div>
        <div>
          <p className="text-lg font-semibold">Date Created:</p>
          <p className="text-gray-600">{seller.dateCreated}</p>
        </div>
        <div>
          <p className="text-lg font-semibold">Shop Name:</p>
          <p className="text-gray-600">{seller.shopName}</p>
        </div>
        <div>
          <p className="text-lg font-semibold">Shop Category:</p>
          <p className="text-gray-600">{seller.shopCategory}</p>
        </div>
        <div>
          <p className="text-lg font-semibold">Sales:</p>
          <p className="text-gray-600">{seller.sales}</p>
        </div>
        <div>
          <p className="text-lg font-semibold">Password:</p>
          <div className="flex items-center">
            <input
              type={showPassword ? 'text' : 'password'}
              value={seller.password}
              readOnly
              className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:border-blue-500"
            />
            <button
              onClick={togglePasswordVisibility}
              className="ml-2 text-gray-600 hover:text-gray-800 focus:outline-none"
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
        
        </div>
        <div>
          <p className="text-lg font-semibold">Email:</p>
          <p className="text-gray-600">{seller.email}</p>
        </div>
        
        <div>
          <p className="text-lg font-semibold">Orders:</p>
          <p className="text-gray-600">{seller.orders}</p>
        </div>
        <div>
          <p className="text-lg font-semibold">Reviews:</p>
          <p className="text-gray-600">{seller.reviews}</p>
        </div>
      </div>
      <SalesAnalytic/>
      </div>
    </div>
  );
};

export default SellerDetails;

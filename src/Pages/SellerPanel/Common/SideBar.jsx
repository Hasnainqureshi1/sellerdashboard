import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore'; // Import Firestore functions
import { FaUser, FaStore, FaCog, FaUsersCog, FaShoppingCart } from 'react-icons/fa';
 
import { AppContext } from '../../../Context/Context';
import { firestore } from '../../../firebase/config';

const SideBar = ({ sdbr }) => {
  const { User } = useContext(AppContext);
  const [isStoreSetup, setIsStoreSetup] = useState(false);

  useEffect(() => {
    const checkShopExists = async () => {
      if (User && User.uid) {
        try {
          const ShopDocRef = doc(firestore, 'shop', User.uid);
          const ShopDocSnapshot = await getDoc(ShopDocRef);
          if (ShopDocSnapshot.exists()) {
            // Document exists, indicating the store is set up
            setIsStoreSetup(true);
          } else {
            // Document does not exist, indicating no store setup
            setIsStoreSetup(false);
          }
        } catch (error) {
          console.error("Error checking shop existence:", error);
          setIsStoreSetup(false);
        }
      }
    };

    checkShopExists();
  }, [User]);

  return (
    <div
      className={`${sdbr ? 'animate-slide-in block' : 'animate-slide-out hidden'} lg:w-300px w-screen bg-white h-90vh flex-wrap overflow-hidden shadow-lg`}
    >
      <ul className="bg-white h-full pt-4">
        <li className="p-3 hover:bg-cyan-50 transition mx-3 rounded-2xl hover:border-l-4 hover:border-cyan-500">
          <Link to="./dashboard" className="flex items-center hover:text-cyan-400">
            <FaUser size={24} className="hover:text-cyan-400" /> <span className="pl-3 text-lg">Dashboard</span>
          </Link>
        </li>
        {isStoreSetup && (
          <>
            <li className="p-3 hover:bg-cyan-50 transition mx-3 rounded-2xl hover:border-l-4 hover:border-cyan-500">
              <Link to="./products" className="flex items-center hover:text-cyan-400">
                <FaShoppingCart size={24} className="hover:text-cyan-400" /> <span className="pl-3 text-lg">Products</span>
              </Link>
            </li>
            <li className="p-3 hover:bg-cyan-50 transition mx-3 rounded-2xl hover:border-l-4 hover:border-cyan-500">
              <Link to="./Store" className="flex items-center hover:text-cyan-400">
                <FaStore size={24} className="hover:text-cyan-400" /> <span className="pl-3 text-lg">Store</span>
              </Link>
            </li>
            <li className="p-3 hover:bg-cyan-50 transition mx-3 rounded-2xl hover:border-l-4 hover:border-cyan-500">
              <Link to="./orders" className="flex items-center hover:text-cyan-400">
                <FaUsersCog size={24} className="hover:text-cyan-400" /> <span className="pl-3 text-lg">Orders</span>
              </Link>
            </li>
          </>
        )}
        <li className="p-3 hover:bg-cyan-50 transition mx-3 rounded-2xl hover:border-l-4 hover:border-cyan-500">
          <Link to="./settings" className="flex items-center hover:text-cyan-400">
            <FaCog size={24} className="hover:text-cyan-400" /> <span className="pl-3 text-lg">Settings</span>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default SideBar;

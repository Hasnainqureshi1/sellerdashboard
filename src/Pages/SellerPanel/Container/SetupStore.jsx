import React from 'react';
import { FaStore } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const SetupStore = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold mb-4">Setup Your Store</h1>
      <div className="flex items-center justify-center mb-4">
        <FaStore className="text-4xl mr-2" />
        {/* <span className="text-xl">Icon Here</span> You can replace this with your icon */}
      </div>
      <Link to='./storeSetup' className="bg-cyan-500 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded">
        Setup Store
      </Link>
    </div>
  );
};

export default SetupStore;

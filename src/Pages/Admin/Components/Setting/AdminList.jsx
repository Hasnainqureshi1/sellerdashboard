import React, { useState, useEffect, useContext } from 'react';
import Alert from '../../Container/Alert';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { firestore } from '../../../../firebase/config';
import { AppContext } from '../../../../Context/Context';

const AdminList = () => {
  const [admins, setAdmins] = useState([]);
  const { User,Showalert } = useContext(AppContext);
  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const usersCollection = collection(firestore, 'users');
        const querySnapshot = await getDocs(usersCollection);
        const adminsData = [];
    
        querySnapshot.forEach((doc) => {
          const userData = doc.data();
          console.log(userData.role, userData.email)
          // Check if the user has the 'admin' role in their custom claims
          if (userData.role === 'admin') {
            adminsData.push({ id: doc.id, ...userData });
          }
        });
    
        setAdmins(adminsData);
      } catch (error) {
        console.error('Error fetching admins:', error);
      }
    };

    fetchAdmins();
  }, []);

  const handleDeleteAdmin = async (id) => {
    Showalert("Admin deleted","green")
  };

  return (
    <div className="mx-auto">
      <h1 className="text-2xl font-bold mb-4">Users List</h1>
      <ul className="divide-y divide-gray-200">
        {admins.map(admin => (
          <li key={admin.id} className="py-4 flex justify-between items-center">
            <div>
              <p className="text-lg font-semibold">{admin.name}</p>
              <p className="text-gray-500">{admin.email}</p>
            </div>
            {
  (admin.id !== User.uid) && (
    <button
      className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
      onClick={() => handleDeleteAdmin(admin.id)}
    >
      Delete
    </button>
  )
}

          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminList;

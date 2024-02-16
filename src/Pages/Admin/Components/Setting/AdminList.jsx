import React, { useState } from 'react';

const AdminList = () => {
  // Dummy admin data for demonstration
  const [admins, setAdmins] = useState([
    { id: 1, name: 'Admin 1', email: 'admin1@example.com' },
    { id: 2, name: 'Admin 2', email: 'admin2@example.com' },
    { id: 3, name: 'Admin 3', email: 'admin3@example.com' },
  ]);

  const handleDeleteAdmin = (id) => {
    // Filter out the admin with the provided id
    const updatedAdmins = admins.filter(admin => admin.id !== id);
    // Update the admins state
    setAdmins(updatedAdmins);
  };

  return (
    <div className="  mx-auto">
      <h1 className="text-2xl font-bold mb-4">Admin List</h1>
      <ul className="divide-y divide-gray-200">
        {admins.map(admin => (
          <li key={admin.id} className="py-4 flex justify-between items-center">
            <div>
              <p className="text-lg font-semibold">{admin.name}</p>
              <p className="text-gray-500">{admin.email}</p>
            </div>
            <button
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
              onClick={() => handleDeleteAdmin(admin.id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminList;

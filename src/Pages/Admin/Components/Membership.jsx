import React, { useState, useEffect, useContext } from "react";
import SellerTable from "../SubComponents/SellerTable";
import MembershipTable from "./Tables/MembershipTable";
import { CiSearch } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import { HiOutlineSearch } from "react-icons/hi";
import { AiFillCheckCircle } from "react-icons/ai";
import { IoIosPersonAdd } from "react-icons/io";
import { firestore } from "../../../firebase/config";
import { collection, getDocs, onSnapshot } from "firebase/firestore";
import { AppContext } from "../../../Context/Context";

const Membership = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [sortOption, setSortOption] = useState("All");
  const { User, Showalert, checkTokenExpiration } = useContext(AppContext);
  const [isAddSellerModalOpen, setAddSellerModalOpen] = useState(false);
  const [data, setData] = useState([]);
  const [MembershipIds, setMembershipIds] = useState([]);

  const [filteredData, setFilteredData] = useState([]);

  const handleSearch = (e) => {
    
    const searchTerm = e.target.value?.toLowerCase();
    setSearchTerm(searchTerm);

    const filteredData = Object.values(data).filter((row) => {
      return row.name.toLowerCase().includes(searchTerm);
    });

    setFilteredData(filteredData);
  };
  useEffect(() => {
    const fetchMembershipRequests = async () => {
      try {
        const membershipRequestCollection = collection(
          firestore,
          "membership_request"
        );

        // Subscribe to real-time updates
        const unsubscribe = onSnapshot(
          membershipRequestCollection,
          (snapshot) => {
            const membershipRequestsData = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
            // Set membership request data to the state
            setFilteredData(membershipRequestsData);
            setData(membershipRequestsData);
           
          }
        );
      } catch (error) {
        console.error("Error fetching membership requests data:", error);
        // Handle error appropriately
      }
    };

    fetchMembershipRequests();
  }, []); // Empty dependency array ensures the effect runs only once when the component mounts

  // handling membership request accept decline
  const membershiphandler = async (isAccept, memberIds) => {
    if (memberIds.length > 0 && isAccept) {
      try {
        const response = await fetch(
          `http://localhost:5000/api/membership/request-membership`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              memberId: memberIds,
              isAccept: isAccept,
            }),
          }
        );

        if (response.ok) {
          console.log("Membership request updated successfully.");
          console.log(response);
          // You can optionally handle a successful response here
        } else {
          const text = await response.text();
          console.error("Error Updating Request: ", text);
        }
      } catch (error) {
        console.error("Error Updating Request: ", error);
      }
    }
  };

  useEffect(() => {
    // Set the filtered data when the original data changes
    setFilteredData(data);
  }, [data]);

  const handleAccept = (isAccept, id) => {
    if (id) {
      const memberId = [id];
      membershiphandler(isAccept, memberId);
    } else {
      membershiphandler(isAccept, selectedRows);

      setSelectedRows([]);
    }
  };

  const handleSortChange = (e) => {
    const sortOption = e.target.value?.toLowerCase();
    setSortOption(sortOption);

    let filteredData;

    if (sortOption === "all") {
      // If "All" is selected, show all data without filtering
      filteredData = data;
    } else {
      // Otherwise, filter based on the selected option
      filteredData = Object.values(data).filter((row) => {
        return row.status.toLowerCase().includes(sortOption);
      });
    }

    setFilteredData(filteredData);
    // Perform sorting logic here if needed
  };
  useEffect(() => {
    // Call handleSortChange to apply sorting/filtering based on the updated data
    handleSortChange({ target: { value: sortOption } });
  }, [data]); // Re-run the effect when the data changes

  return (
    <>
      <div className="p-2 m-3 bg-slate-100 lg:w-80v  ">
        <h1 className="text-4xl p-3 ">Membership</h1>
        <div className="flex flex-row-reverse items-center mt-3 p-4 border bg-white border-gray-300 rounded shadow-md">
          {/* Search Bar */}
          <div className="relative w-full flex flex-row mr-4 bg-white hover:shadow-sm">
            <span className=" flex-row  inset-y-0 left-0 flex items-center pl-2 bg-white">
              <HiOutlineSearch fontSize={20} className="absolute left-3 " />
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
            <option value="all">All</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
            <option value="pending">Pending</option>
          </select>

          {/* Delete Icon */}
          <button
            onClick={() => handleAccept("Accepted")}
            className="p-2 text-cyan-500 border shadow-sm mr-3 hover:shadow-md rounded-md hover:text-cyan-700 focus:outline-none"
          >
            <IoIosPersonAdd fontSize={32} />
          </button>
        </div>
        <MembershipTable
          data={filteredData}
          handleAccept={handleAccept}
          setSelectedRows={setSelectedRows}
          selectedRows={selectedRows}
        />
      </div>
    </>
  );
};

export default Membership;

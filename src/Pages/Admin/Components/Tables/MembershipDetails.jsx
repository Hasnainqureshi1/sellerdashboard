import React, { useContext, useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { AppContext } from "../../../../Context/Context";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { firestore } from "../../../../firebase/config";
import AddAdmin from "./../Setting/AddAdmin";

const MembershipDetails = () => {
  const location = useLocation();

 
  const [data, setdata] = useState(location.state);
 
  const params = useParams();

  useEffect(() => {
    const fetchMembershipRequests = async () => {
     
      try {
        const membershipRequestCollection = collection(
          firestore,
          "membership_request"
        );
        const allMembershipRequestsQuery = query(membershipRequestCollection);

        // Subscribe to real-time updates for all membership requests
        const unsubscribe = onSnapshot(
          allMembershipRequestsQuery,
          (snapshot) => {
            
            const membershipRequestsData = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));

            // Find the membership request corresponding to params.id
            const membershipRequest = membershipRequestsData.find(
              (request) => request.id === params.id
            );
            if (membershipRequest) {
              // Handle the membership request data
              setdata(membershipRequest);
            } else {
              console.log("Membership request not found for id:", params.id);
            }
          }
        );

        // Return the unsubscribe function to clean up the subscription
      } catch (error) {
        console.error("Error fetching membership requests data:", error);
        throw error;
      }
    };

    const unsubscribe = fetchMembershipRequests();
  }, []); // Empty dependency array to subscribe only once during component mount

  // Convert data object to an array of key-value pairs
  const dataArray = data ? Object.entries(data) : [];
  function formatDate(timestamp) {
    try {
      // Check for valid Firestore Timestamp object and construct Date object
      const date = new Date(
        timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000
      );

      // Get month, day, and year using Date object methods
      const month = date.toLocaleString("en-US", { month: "long" });
      const day = date.getDate();
      const year = date.getFullYear();

      // Return formatted date string
      return `${month} ${day}, ${year}`;
    } catch (error) {
      // Handle any errors (e.g., invalid timestamp format)
      console.error("Error formatting date:", error);
      return "Invalid Date"; // Or consider returning a default date or placeholder
    }
  }
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
  const handleAccept = (isAccept, id) => {
    if (id) {
      const memberId = [id];
      membershiphandler(isAccept, memberId);
    }
  };

  return (
    <div className="p-2 m-3 bg-slate-100 lg:w-80v  ">
      <div className="mt-3 ml-3 bg-white border shadow-md p-5">
        <h2 className="text-2xl border-b pb-3 font-semibold mb-4">
          Membership Request Details
        </h2>
        <div className="grid grid-cols-2 mt-3 gap-4">
          <div>
            <p className="text-lg font-semibold">Email:</p>
            <p className="text-gray-600">{data.email}</p>
          </div>

          <div>
            <p className="text-lg font-semibold">Name:</p>
            <p className="text-gray-600">{data.name}</p>
          </div>
          <div>
            <p className="text-lg font-semibold">City:</p>
            <p className="text-gray-600">{data.city}</p>
          </div>
          <div>
            <p className="text-lg font-semibold">Occupation:</p>
            <p className="text-gray-600">{data.occupation}</p>
          </div>
          <div>
            <p className="text-lg font-semibold">Phone Number:</p>
            <p className="text-gray-600">{data.number}</p>
          </div>
          <div>
            <p className="text-lg font-semibold">Status:</p>
            <p className="text-gray-600">{data.status}</p>
          </div>
         
          <div>
            <p className="text-lg font-semibold">Date:</p>
            <p className="text-gray-600">{formatDate(data?.date)}</p>
          </div>
        </div>
        {data.status === "Accepted" || data.status === "Rejected" ? (
          ""
        ) : (
          <div className="mt-4">
            <button
              onClick={() => handleAccept("Accepted", data.id)}
              className="p-2 text-cyan-500 hover:text-cyan-700 bg-cyan-50
       hover:bg-cyan-200 font-medium rounded-lg shadow-md 
       focus:outline-none border px-5 w-40"
            >
              Accept
            </button>
            <button
              onClick={() => handleAccept("Rejected", data.id)}
              className="p-2 mx-5 text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-200 font-medium rounded-lg shadow-md focus:outline-none border px-5 w-40"
            >
              Reject
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MembershipDetails;

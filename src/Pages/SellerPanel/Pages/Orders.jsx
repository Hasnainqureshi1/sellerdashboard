import React, { useState, useEffect, useContext } from "react";
// Adjust the import path as needed
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  
} from "firebase/firestore";
import { FaQrcode } from "react-icons/fa";
import { Link } from "react-router-dom";
import { AppContext } from "../../../Context/Context";
import { firestore } from "../../../firebase/config";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const { User } = useContext(AppContext);
  const [isLoading, setIsLoading] = useState(true);
  const [allOrders, setAllOrders] = useState([]); // Store all fetched orders
  const [displayedOrders, setDisplayedOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("pending");
  useEffect(() => {
    if (!User || !User.uid) {
      console.log("User is not logged in");
      setIsLoading(false);
      return;
    }

    const ordersRef = collection(firestore, "orders");
    const ordersQuery = query(ordersRef, where("seller_id", "==", User.uid), orderBy("order_date", "desc"));

    const unsubscribe = onSnapshot(
      ordersQuery,
      async (querySnapshot) => {
        setIsLoading(true);
        let fetchedOrders = [];

        for (const docz of querySnapshot.docs) {
          const orderData = docz.data();
          console.log(orderData)
          // Normalize the products to an array if it's not one
          let products = Array.isArray(orderData.products)
            ? orderData.products
            : [orderData.products];
          let productsInfo = [];

          try {
            productsInfo = await Promise.all(
              products.map(async (product) => {
                try {
                  console.log(product);
                  const productRef = doc(
                    firestore,
                    "products",
                    product.prod_id
                  );
                  const productSnap = await getDoc(productRef);
                  if (!productSnap.exists()) {
                    throw new Error(
                      `Product with ID ${product.prod_id} not found`
                    );
                  }
                  return {
                    ...product,
                    productName: productSnap.data().name,
                    price: productSnap.data().price,
                  };
                } catch (error) {
                  console.error(error);
                  return {
                    prod_id: product.prod_id,
                    productName: "Product not found",
                    price: 0,
                  };
                }
              })
            );
          } catch (error) {
            console.error("Error fetching products:", error);
          }

          // Fetch customer name
          let customerName = "Unknown Customer";
          try {
            const userRef = doc(firestore, "app_users", orderData.user_id);
            const userSnap = await getDoc(userRef);
            if (userSnap.exists()) {
              customerName = userSnap.data().name;
            } else {
              throw new Error(`User with ID ${orderData.user_id} not found`);
            }
          } catch (error) {
            console.error(error);
          }

          fetchedOrders.push({
            id: doc.uid,
            ...orderData,
            productsInfo,
            customerName,
          });
        }

        setOrders(fetchedOrders);
        setAllOrders(fetchedOrders);
        console.log(fetchedOrders);
        setIsLoading(false);
      },
      (error) => {
        console.error("Error listening to orders:", error);
        setIsLoading(false);
      }
    );

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [User]);

  useEffect(() => {
    setSortOption('pending')
  }, [])
  
  const handleSortChange = (e) => {
    const sortOption = e.target.value?.toLowerCase();
    setSortOption(sortOption);

    let filteredData;

    // Otherwise, filter based on the selected option
    filteredData = Object.values(allOrders).filter((row) => {
      return row.status.toLowerCase().includes(sortOption);
    });

    setOrders(filteredData);
    // Perform sorting logic here if needed
  };
  // Filter orders based on search term
  const filterOrders = (term) => {
    if (!term.trim()) {
      setOrders(allOrders); // Show all orders if search term is empty
      return;
    }

    const lowerCaseTerm = term.toLowerCase();
    const filteredOrders = allOrders.filter(
      (order) =>
        order.id.toLowerCase().includes(lowerCaseTerm) || // Search by Order ID
        // Include other attributes you might want to search by
        order.customerName.toLowerCase().includes(lowerCaseTerm)
    );

    setOrders(filteredOrders);
  };
  // Update search term and filter orders
  const handleSearchChange = (e) => {
    const newSearchTerm = e.target.value;
    setSearchTerm(newSearchTerm);
    filterOrders(newSearchTerm);
  };
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

  return (
    <div className="w-full bg-gray-100 flex flex-col px-5">
      <div className="bg-white mt-4 relative">
         
        <header className="p-3 my-2 border-b shadow-md flex justify-between items-center">
          <h2 className="text-xl font-bold">Orders</h2>
          <div className="flex items-center space-x-4">
            <input
              type="text"
              placeholder="Search by Order ID or Customer Name..."
              className="border px-4 py-2"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <select
              className="border px-4 py-2"
              value={sortOption}
              onChange={handleSortChange}
            >
              <option value="pending">Pending</option>
              <option value="cancelled">Cancelled</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        
        </header>

        {isLoading ? (
          <div className="text-center py-4">Loading...</div>
        ) : orders.length > 0 ? (
          <table className="min-w-full text-center table-auto border-collapse">
            <thead className="bg-cyan-100">
              <tr>
                <th className="border px-4 py-2">Product Name(s)</th>
                <th className="border px-4 py-2">Customer Name</th>
                <th className="border px-4 py-2">Total Price</th>
                <th className="border px-4 py-2">Status</th>
                <th className="border px-4 py-2">Date</th>
                <th className="border px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>
                    {order.productsInfo && order.productsInfo.length > 0 ? (
                      order.productsInfo.map((product, index) => (
                        <div key={index}>{`${product.productName} (${
                          product.quantity
                        } x $${product.price})`}</div>
                      ))
                    ) : (
                      <div>No products</div>
                    )}
                  </td>
                  <td className="border px-4 py-2">{order.customerName}</td>
                  <td className="border px-4 py-2">
                    $
                    {order.productsInfo
                      .reduce(
                        (total, product) =>
                          total + product.quantity * product.price,
                        0
                      )
                      .toFixed(2)}
                  </td>
                  <td className="border px-4 py-2">{order.status}</td>
                  <td className="border px-4 py-2">
                    {formatDate(order.order_date)}
                  </td>
                  <td className="border px-4 py-2">
                    <Link
                      to={`./${order.id}`}
                      className="bg-cyan-100 text-cyan-500 font-bold hover:bg-cyan-200 px-4 py-2 rounded focus:outline-none"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center py-4">No orders found.</p>
        )}
      </div>
    </div>
  );
};

export default Orders;

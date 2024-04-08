import React, { useState, useEffect } from 'react';
import { firestore } from '../../../firebase/config';
import { collection, getDocs, orderBy, where,query,limit, doc, getDoc, onSnapshot } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { prodErrorMap } from 'firebase/auth';
 
 

const RecentOrders = ({ userId }) => {
  const [orders, setOrders] = useState([]);
  console.log(userId)
  useEffect(() => {
    if (!userId) {
      throw new Error('Missing userId');
    }

    const ordersRef = collection(firestore, 'orders');
    const OrderQueryRecent = query(
      ordersRef,
      where('status', '==', 'pending'),
      where('seller_id', '==', userId),
      limit(3) // Assuming you want to fetch only the 3 most recent orders
    );
    const unsubscribe = onSnapshot(
      OrderQueryRecent,
      async (querySnapshot) => {
        // setIsLoading(true);
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
            id: doc.id,
            ...orderData,
            productsInfo,
            customerName,
          });
        }

        setOrders(fetchedOrders);
       console.log(fetchedOrders)

        // setIsLoading(false);
      },
      (error) => {
        console.error("Error listening to orders:", error);
        // setIsLoading(false);
      }
    );

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  
  
  // useEffect(() => {
  //   const fetchOrders = async () => {
  //     try {
  //       if (!userId) {
  //         throw new Error('Missing userId');
  //       }

  //       const ordersRef = collection(firestore, 'orders');
  //       const OrderQueryRecent = query(
  //         ordersRef,
  //         where('status', '==', 'pending'),
  //         where('seller_id', '==', userId),
  //         limit(3) // Assuming you want to fetch only the 3 most recent orders
  //       );

  //       const orderSnapshot = await getDocs(OrderQueryRecent);
  //       const productsMap = {}; // Create a map to store products data

  //       const ordersData = await Promise.all(orderSnapshot.docs.map(async (docs) => {
  //         const order = docs.data();
  //         const prodIds = order.prod_id; // Assuming prod_id is now an array
  //         const productDetails = await Promise.all(prodIds.map(async (prodId) => {
  //           if (!productsMap[prodId]) { // Check if product details are already fetched
  //             const prodDocRef = doc(firestore, 'products', prodId);
  //             const productSnapshot = await getDoc(prodDocRef);
  //             const productData = productSnapshot.exists() ? productSnapshot.data() : { name: "Unknown Product", price: 0 };
  //             productsMap[prodId] = productData; // Store fetched product data in the map
  //             console.log(productData)
  //           }
  //           return productsMap[prodId];
  //         }));

  //         return {
  //           id: doc.id,
  //           products: productDetails, // Attach array of product details to the order
  //           quantity: order.quantity, // Assuming quantity applies to each product in the order
  //           order_date: order.order_date,
  //           totalPrice: productDetails.reduce((total, prod) => total + (prod.price * order.quantity), 0), // Calculate total price
  //         };
  //       }));
  //         console.log(ordersData)
  //       setOrders(ordersData);
  //     } catch (error) {
  //       console.error('Error fetching orders:', error.message);
  //     }
  //   };

  //   fetchOrders();
  // }, [userId]);

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
   <div className="bg-white border-t  mt-2 p-6 rounded-lg shadow-md">
   <h2 className="text-xl font-bold mb-4">Recent Orders</h2>
   {orders?.length > 0 ? (
    <>
       <table className="min-w-full divide-y divide-gray-200">
           <thead className="bg-gray-50">
               <tr>
               <th className="border px-4 py-2">Product Name(s)</th>
                <th className="border px-4 py-2">Customer Name</th>
                <th className="border px-4 py-2">Total Price</th>
                <th className="border px-4 py-2">Status</th>
                <th className="border px-4 py-2">Date</th>
               </tr>
           </thead>
           <tbody className="bg-white divide-y divide-gray-200">
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
                 
                </tr>
              ))}
            </tbody>
       </table>
        <div className="mt-4">
        <Link to='../orders' className="bg-cyan-500 mr-3 text-white px-4 py-2 rounded">View All</Link>
    </div>
    </> ) : (
       <p className="text-gray-500">There is no recent orders.</p>
   )}
  
</div>
);
};

export default RecentOrders;

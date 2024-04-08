import React, { useEffect, useState, useContext } from 'react';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { AppContext } from '../../../Context/Context'; // Adjust import path as necessary
import { firestore } from '../../../firebase/config'; // Make sure this path is correct

const Store = () => {
  const { User } = useContext(AppContext);
  const [usersDetails, setUsersDetails] = useState({});
  const [storeDetails, setStoreDetails] = useState({
    storeName: '',
    category: '',
    imageUrl: '',
    reviews: []
  });
  const [isLoading, setIsLoading] = useState(true); // Added loading state

  useEffect(() => {
    const fetchStoreDetailsAndReviews = async () => {
      if (!User || !User.uid) return;
      setIsLoading(true); // Start loading before fetching data

      // Fetch store details
      const storeRef = doc(firestore, 'shop', User.uid);
      const docSnap = await getDoc(storeRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        console.log(data)
        setStoreDetails(prevState => ({
          ...prevState,
          storeName: data.storeName,
          category: data.category,
          imageUrl: data.imageUrl,
          address:data.address
        }));
       
      } else {
        console.log("No such document!");
      }
      
      // Fetch reviews
      const reviewsRef = collection(firestore, 'reviews');
      const q = query(reviewsRef, where('seller_id', '==', User.uid));
      const querySnapshot = await getDocs(q);
      const reviews = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Fetch user details for each unique user_id in reviews
      const userIds = [...new Set(reviews.map(review => review.user_id))];
      const usersPromises = userIds.map(userId => {
        const userRef = doc(firestore, 'app_users', userId);
        return getDoc(userRef);
      });
      const usersDocs = await Promise.all(usersPromises);
      const userDetails = usersDocs.reduce((acc, docSnap) => {
        if (docSnap.exists()) {
          acc[docSnap.id] = docSnap.data();
        }
        return acc;
      }, {});

      setUsersDetails(userDetails);

      // Associate user details with reviews
      const reviewsWithUserDetails = reviews.map(review => ({
        ...review,
        userDetail: userDetails[review.user_id]
      }));
      setStoreDetails(prevState => ({
        ...prevState,
        reviews: reviewsWithUserDetails
      }));
    

      // Similar logic for fetching reviews and user details...

      setIsLoading(false); // Set loading to false after fetching all data
    };

    fetchStoreDetailsAndReviews();
  }, [User]); // Removed storeDetails from the dependency array to prevent infinite loop

  if (isLoading) {
    return <div>Loading store details...</div>; // Loading state display
  }

  return (
    <div className="w-full justify-center items-center bg-gray-100 flex flex-col">
      {/* Header section */}
      <header className="bg-white shadow w-full mt-2" >
        <div className=" py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Store Details</h1>
          
        </div>
      </header>
      <main className="flex-grow w-1/2">
        <div className="py-12">
          <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
            <div   >
              <img className="bg-contain bg-center h-56 p-4" src={storeDetails?.imageUrl} alt="" />
              {/* Store image */}
            </div>
            <div className="p-4">
              <h2 className="text-2xl font-bold">{storeDetails.storeName}</h2>
              <p className="text-md text-gray-600">{storeDetails.category}</p>
              <p className="text-md text-gray-600">Address: {storeDetails.address}</p>
            </div>
            <div className="p-4 border-t border-gray-200">
              <h3 className="font-bold">Reviews</h3>
              <div className="space-y-2 mt-2 overflow-y-scroll h-40">
            {storeDetails.reviews.map((review) => (
              <div key={review.id} className="bg-gray-100 p-3 rounded flex items-center gap-4">
                {review.userDetail && (
                  <img src={review.userDetail.imageUrl || 'https://via.placeholder.com/40'} alt={review.userDetail.name} className="w-10 h-10 rounded-full object-cover" />
                )}
                <div>
                  <h4 className="font-bold">{review.userDetail ? review.userDetail.name : 'Unknown User'}</h4>
                  <p className="text-sm">{review.comment}</p>
                  <span className="text-sm font-bold">Rating: {review.rating}</span>
                </div>
              </div>
            ))}
          </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Store;

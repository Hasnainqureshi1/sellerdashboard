import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { AppContext } from '../../../Context/Context'; // Adjust import path as necessary
import { firestore } from '../../../firebase/config'; // Adjust import path as necessary
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import defaultProfileImage from '../../../Assets/profile.jpg';


const ProductDetail = () => {
  const { productId } = useParams();
  const { User } = useContext(AppContext);  
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [activeImage, setActiveImage] = useState(0);
  const [LoadingProduct, setLoadingProduct] = useState(false)

  useEffect(() => {
    const fetchProduct = async () => {
      setLoadingProduct(true);
      const docRef = doc(firestore, "products", productId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setProduct({ id: docSnap.id, ...docSnap.data() });
      } else {
        console.log("No such product!");
      }
      setLoadingProduct(false);
    };

    const fetchReviews = async () => {
      if (!User) return;
      setLoadingProduct(true);
      const q = query(collection(firestore, "reviews"), where("seller_id", "==", User.uid), where("prod_id", "==", productId));
      const querySnapshot = await getDocs(q);
      const reviewsWithUserDetails = [];

      for (const reviewDoc of querySnapshot.docs) {
        const reviewData = reviewDoc.data();
        // Fetch user details for each review
        const userRef = doc(firestore, "app_users", reviewData.user_id);
        const userSnap = await getDoc(userRef);
    
        if (userSnap.exists()) {
            reviewsWithUserDetails.push({
                id: reviewDoc.id, // Use the reviewDoc variable here
                ...reviewData,
                userName: userSnap.data().name, // Assuming the user's name field is 'name'
                userImage: userSnap.data().image, // Assuming the user's image field is 'image'
            });
        }
    }

      setReviews(reviewsWithUserDetails);
      console.log(    reviewsWithUserDetails)
      setLoadingProduct(false);
    };

    fetchProduct();
    fetchReviews();
  }, [productId, User]);

  return (
    <div className="container bg-gray-50 shadow-lg  mx-auto p-4">
      {product ? (
        <div className="flex flex-row bg-white pt-2 pb-2">
          <div className="w-72 flex flex-col items-center">
            {/* Main Image Display */}
            <img src={product.images[activeImage]} alt={`Product ${product.name}`} className="max-w-full h-auto" />
            <div className="flex mt-2 overflow-x-auto">
              {/* Thumbnails */}
              {product.images.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`Thumbnail ${index + 1}`}
                  className={`w-20 h-20 object-cover ${index === activeImage ? 'border-2 border-cyan-500' : ''} cursor-pointer`}
                  onClick={() => setActiveImage(index)}
                />
              ))}
            </div>
          </div>
          <div className='ml-4'>
            <h2 className="text-2xl font-bold mt-3">{product.name}</h2>
            <p className="text-lg">Price: ${product.price}</p>
            <p>Description: {product.description}</p>
          </div>
        </div>
      ) : (
        LoadingProduct ? <p className="text-center">Loading...</p> : <p className="text-center">Product not found</p>
      )}
      <div className="mt-8 ">
        <h3 className="text-xl font-bold">Reviews</h3>
        {reviews.length > 0 ? (
        <div className="grid md:grid-cols-3 bg-white  gap-4">
          {reviews.map((review) => (
            <div key={review.id} className="p-4 border border-white  rounded-lg">
              <div className="flex items-center gap-2 mb-2">
              <img src={review.userImage || defaultProfileImage} alt={review.userName} className="w-10 h-10 rounded-full" />
                <p className="text-sm font-semibold">{review.userName}</p>
              </div>
              <p>{review.comment}</p>
              <p className="text-sm font-semibold">Rating: {review.rating}</p>
            </div>
         
            ))}
          </div>
        ) :(
          LoadingProduct ? <p className="text-center">Loading...</p> : <p className="text-center">There are no reviews yet.</p>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;

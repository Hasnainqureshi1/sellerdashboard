import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaEdit, FaEye, FaTrash } from 'react-icons/fa';
import AddProductModal from '../Model/AddProductModal';
import { AppContext } from '../../../Context/Context';
import { collection, query, where, getDocs, deleteDoc, doc, serverTimestamp, onSnapshot } from 'firebase/firestore';
import { firestore } from '../../../firebase/config'; 
const Products = () => {
    const [products, setProducts] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { User,Showalert } = useContext(AppContext); // Accessing current user from context
    const [LoadingProduct, setLoadingProduct] = useState(false)

    useEffect(() => {
        if (!User) return; // Make sure User is defined and not null
    
        setLoadingProduct(true);
    
        // Define the query
        const q = query(collection(firestore, "products"), where("seller_id", "==", User.uid));
    
        // Subscribe to the query
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const fetchedProducts = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
    
            setProducts(fetchedProducts);
            setLoadingProduct(false);
            console.log(fetchedProducts);
        }, 
        (error) => {
            // Handle any errors
            console.error("Error fetching products:", error);
            setLoadingProduct(false);
        });
    
        // Clean up the subscription
        return () => unsubscribe();
    
    }, [User]);
    const handleDelete = async (productId) => {
        try {
            // Reference to the document to delete
            const docRef = doc(firestore, "products", productId);
            // Delete the document
            await deleteDoc(docRef);
            // Filter out the deleted product from the local state to update the UI
            const updatedProducts = products.filter(product => product.id !== productId);
            setProducts(updatedProducts);
            console.log("Product deleted successfully");
            Showalert("Product deleted successfully","green");
        } catch (error) {
            console.error("Error deleting product: ", error);
        }
    };

    const truncateDescription = (description) => {
        return description.length > 100 ? `${description.substring(0, 100)}...` : description;
    };

    return (
     <div className="w-full   bg-gray-100 flex flex-col px-5">
        <div className=" bg-white  mt-4">
            <header className='p-3 my-2 border-b shadow-md  '>
            <button onClick={() => setIsModalOpen(true)} className="px-3 py-1 shadow-md bg-cyan-500 text-white rounded-md hover:bg-cyan-600">
            Add Products
          </button>
            </header>
            <AddProductModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        {(products.length >0) ?
                <table className="min-w-full table-auto border-collapse">
                <thead className="bg-cyan-100">
                    <tr>
                        <th className="border px-2 py-2">Product</th>
                        <th className="border px-2 py-2">Description</th>
                        <th className="border px-2 py-2">Price</th>
                        <th className="border px-2 py-2">Image</th>
                        <th className="border px-2 py-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product) => (
                        <tr key={product.id} >
                            <td className="border px-4 py-2">{product.name}</td>
                            <td className="border px-4 py-2">{truncateDescription(product.description)}</td>
                            <td className="border px-4 py-2">${product.price}</td>
                            <td className="border px-2 py-2 items-center flex justify-center">
                                <img src={product.images[0]} alt="Product" className="h-10 w-10 object-cover" />
                            </td>
                            <td className="border px-4 py-2  ">
                             <div className="  flex gap-2 justify-center items-center  flex-1 ">

                            
    <Link to={`/sellerPanel/edit-product/${product.id}`} className="text-indigo-600 hover:text-indigo-800">
        <FaEdit aria-label="Edit" />
    </Link>
    <Link to={`/sellerPanel/product/${product.id}`} className="text-cyan-600 hover:text-cyan-800">
        <FaEye aria-label="View" />
    </Link>
    <button onClick={() => handleDelete(product.id)} className="text-red-600 hover:text-red-800">
        <FaTrash aria-label="Delete" />
    </button>
    </div>
</td>
                        </tr>
                    ))}
                </tbody>
            </table>
          : <div className='w-full '>
            {LoadingProduct &&   <h3 className='text-center'>Loading...</h3> }
            {!LoadingProduct &&   <h3 className='text-center'>No products are currently listed.</h3> }
           
          </div>  }
        </div>
        </div>
    );
};

export default Products;

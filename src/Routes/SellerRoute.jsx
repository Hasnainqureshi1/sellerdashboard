import React, { useContext,useEffect,useState } from 'react'
 
 
 
import { Route, Routes, useNavigate } from 'react-router-dom'
import { auth } from '../firebase/config'
import Alert from './../Pages/SellerPanel/Container/Alert';

 
 
import SellerDashboard from '../Pages/SellerPanel/Pages/SellerDashboard';
import { AppContext } from '../Context/Context';
import SideBar from './../Pages/SellerPanel/Common/SideBar';
import Header from '../Pages/SellerPanel/Common/Header';
import SellerSettings from '../Pages/SellerPanel/Pages/SellerSettings';
import Store from '../Pages/SellerPanel/Pages/Store';
import StoreSetup from '../Pages/SellerPanel/Pages/StoreSetup';
import Products from '../Pages/SellerPanel/Pages/Products';
import ProductDetail from './../Pages/SellerPanel/Pages/ProductDetail';
import ProductEdit from '../Pages/SellerPanel/Pages/ProductEdit';
import Orders from '../Pages/SellerPanel/Pages/Orders';
import QrScanner from '../Pages/SellerPanel/Pages/QrScanner';
import OrderView from '../Pages/SellerPanel/Pages/OrderView';
import CreateOrder from '../Pages/SellerPanel/Pages/CreateOrder';
import Stripe from '../Pages/SellerPanel/Pages/Stripe';
 
 
 
const SellerRoute = () => {
  const [sidebarShow, setsidebarShow] = useState(true);
  const { User, checkAuthAndRole, topalert } = useContext(AppContext);
  const navigate = useNavigate()
  useEffect(() => {
    const handleResize = () => {
      window.innerWidth >= 768 ? setsidebarShow(true) : setsidebarShow(false);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  useEffect(() => {
    console.log(User)
    // Listen for authentication state changes
    // const role =  localStorage.getItem('userRole');
    // const access =  localStorage.getItem('access');
    const userRole = localStorage.getItem('userRole');
const userId = localStorage.getItem('userId');
    console.log(userRole)
    if(userRole){

    }
        if (userRole =='admin'){
            navigate('/superadmin')
          }
          else if (userRole =='seller'){
              // navigate('/sellerPanel')
          }
          else{
            console.log('user not logged in')
            navigate('/');
            return ;
            
          }
          const unsubscribe = auth.onAuthStateChanged(async (user) => {
          console.log(user)
    const role =    checkAuthAndRole();
    console.log(role);
    if(role ==="seller") {
      navigate('/sellerPanel')
      localStorage.setItem('userRole','')
      localStorage.setItem('userId','')
  }
    else if(!role ==="admin") {
      navigate('/')
      localStorage.setItem('userRole','')
      localStorage.setItem('userId','')
  }
          })
          return () => unsubscribe();

 
  

  }, [ ]);
 
  return (
  
 
   
    <>
    
    {
    
    (Object.keys(User)?.length > 0)?(
    
      <>
    
        <Alert alert={topalert} />
        <Header setsidebarShow={setsidebarShow} sdbr={sidebarShow} />
        <div className="flex flex-col lg:flex-row overflow-hidden">
          <SideBar sdbr={sidebarShow} />
          <Routes>
            <Route path="/dashboard" element={<SellerDashboard />} />
            <Route path="/settings" element={<SellerSettings />} />
            <Route path="/storeSetup" element={<StoreSetup />} />
            <Route path="/store" element={<Store />} />
            <Route path="/products" element={<Products />} />
            <Route path="/create-order" element={<CreateOrder />} />
            <Route path="/edit-product/:productId" element={<ProductEdit />} />
            <Route path="/product/:productId" element={<ProductDetail />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/orderScan" element={<QrScanner />} />
            <Route path="/orders/:orderId" element={<OrderView/>} />
            <Route path="/" element={<SellerDashboard />} />
            {/* <Route path="/connectStripe" element={<Stripe />} /> */}

            
          </Routes>
        </div>
      </>
    ):(
      <div className='w-screen h-screen flex justify-center items-center'>
        <h1 className="text-lg">Loading...</h1>
      </div>
    )}
    
    
      </>
     
    
    
     
      )
    }
export default SellerRoute
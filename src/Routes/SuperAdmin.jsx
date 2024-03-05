import React, { useContext, useEffect,useState } from 'react'
import Header from '../Pages/Admin/Header'
import SideBar from '../Pages/Admin/SideBar'
import { Route, Routes, useNavigate } from 'react-router-dom'
import Admin from '../Pages/Admin'
import Sellers from '../Pages/Admin/Components/Sellers'
import SellerDetails from '../Pages/Admin/SubComponents/SellerDetails'
import Membership from '../Pages/Admin/Components/Membership'
import Setting from '../Pages/Admin/Components/Setting'
import { auth } from '../firebase/config'
import { checkAuthAndRole } from '../firebase/functions'
import AdminState from './../Context/AdminState';
import { AppContext } from '../Context/Context'
import Alert from '../Pages/Admin/Container/Alert'

const SuperAdmin = () => {
 const [sidebarShow, setsidebarShow] = useState(true);
 const { User, checkAuthAndRole, topalert } = useContext(AppContext);
 const navigate =useNavigate();
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
            // navigate('/superadmin')
          }
          else if (userRole =='seller'){

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
    if(!role ==="admin") {
      navigate('/')
      localStorage.setItem('userRole','')
      localStorage.setItem('userId','')
  }
          })
          return () => unsubscribe();

 
    //   const unsubscribe = auth.onAuthStateChanged(async (user) => {
    //     if (user) {
           
    //       // User is signed in, fetch data
    //       console.log("User is signed in");
    //     const role =  await checkAuthAndRole();
    //     if(!role ==="admin") {
    //         navigate('/')
    //         localStorage.setItem('userRole','')
    //         localStorage.setItem('userId','')
    //     }
        
    //     } else {
          
    //       navigate('/')
    //       // User is signed out, handle accordingly
    //       console.log("User is signed out");
    //     }
    //   });
    //   return () => unsubscribe();// Call the async function
    // // Set the filtered data when the original data changes

  }, [ ]);
 
  return (
   <>
  { }
 
  <>
  {console.log(User?.length > 0)}
  {console.log(User)}
  {console.log(Object.keys(User)?.length) }
  {
  
  (Object.keys(User)?.length > 0)?(
    
  <>

    <Alert alert={topalert} />
    <Header setsidebarShow={setsidebarShow} sdbr={sidebarShow} />
    <div className="flex flex-col lg:flex-row overflow-hidden">
      <SideBar sdbr={sidebarShow} />
      <Routes>
        <Route path="/dashboard" element={<Admin />} />
        <Route path="/sellers/*" element={<Sellers />} />
        <Route path="/sellers/:sellerid" element={<SellerDetails />} />
        <Route path="/membership" element={<Membership />} />
        <Route path="/settings" element={<Setting />} />
        <Route path="/*" element={<Admin />} />
      </Routes>
    </div>
  </>
):(
  <div className='w-screen h-screen flex justify-center items-center'>
    <h1 className="text-lg">Loading...</h1>
  </div>
)}


  </>
 


   </>
  )
}

export default SuperAdmin
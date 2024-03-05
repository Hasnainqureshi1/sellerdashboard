// import { signInWithEmailAndPassword } from "firebase/auth";
// import { getDoc, doc } from "firebase/firestore";
// import { auth, firestore } from "./config";
// import { useNavigate } from "react-router-dom";
// // import { auth, firestore } from "./firebase"; // Assuming you have already initialized Firebase
// // Function to check if the user is authenticated and has the correct role
// export const checkAuthAndRole = async () => {
 
//   try {
   
//     const user = await auth.currentUser; // Get the current user
//    console.log(user);
//     if (user) {
//       // User is signed in
//       const userDoc = await getDoc(doc(firestore, "users", user.uid));
//       const userData = userDoc.data();

//       // Store user role in local storage
//       localStorage.setItem("userRole", userData.user_type);
//       localStorage.setItem("access", user.accessToken);

//       return userData; // Return the user's role
//     } else {
//       // User is not signed in
//       localStorage.removeItem("userRole"); // Remove user role from local storage
//       return null;
//     }
//   } catch (error) {
//     console.error("Error checking authentication and role:", error);
//     localStorage.removeItem("userRole"); // Remove user role from local storage in case of an error
//     return null;
//   }
// };

// // Usage example:
// export const authenticateUser = async (email, password,navigate) => {
 
//   try {
//     const userCredential = await signInWithEmailAndPassword(auth, email, password);
//     const user = userCredential.user;

//     if (user) {
//       const user = await checkAuthAndRole(); // Check authentication and role

//       if (user.user_type === "admin") {
//         navigate("./superadmin");
//       } else {
//         navigate("/"); // Redirect to regular user page or default route
//       }
//     } else {
//       navigate("/login"); // Redirect to login page if no user is logged in
//     }
//   } catch (error) {
//     console.error("Error signing in:", error);
//     navigate("/login"); // Redirect to login page in case of an error
//   }
// };

 

import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import BusSearch from './components/BusSearch';
//import Seats from './pages/Seats';
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminLogin from "./pages/AdminLogin";
import Buses from "./pages/Buses";
import RoutesPage from "./pages/Routes";
import Bookings from "./pages/Bookings";
import Payments from "./pages/Payments";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import Profile from "./pages/Profile"; 
//import UsersPage from "./pages/Users";
//import OperatorsPage from "./pages/Operators";
import SeatsPage from "./pages/Seats";
import Navbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";
// Add these imports to your App.js
import ManageBuses from './pages/admin/ManageBuses';
import ManageRoutes from './pages/admin/ManageRoutes';
import ManageBookings from './pages/admin/ManageBookings';
import ManageUsers from './pages/admin/ManageUsers';
import ManageOperators from './pages/admin/ManageOperators';
import ManageSeats from './pages/admin/ManageSeats';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* ------------------ USER ROUTES ------------------ */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute role="USER">
              <UserDashboard />
            </PrivateRoute>
          }
        />

        <Route
  path="/buses/search"
  element={
    <PrivateRoute role="USER">
      <BusSearch />
    </PrivateRoute>
  }
/>

        <Route
  path="/profile"
  element={
    <PrivateRoute role="USER">
      <Profile />
    </PrivateRoute>
  }
/>

<Route
  path="/seats"
  element={
    <PrivateRoute role="USER">
      <SeatsPage />
    </PrivateRoute>
  }
/>
        <Route
          path="/buses"
          element={
            <PrivateRoute role="USER">
              <Buses />
            </PrivateRoute>
          }
        />
        <Route
          path="/routes"
          element={
            <PrivateRoute role="USER">
              <RoutesPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/bookings"
          element={
            <PrivateRoute role="USER">
              <Bookings />
            </PrivateRoute>
          }
        />
        <Route
          path="/payments"
          element={
            <PrivateRoute role="USER">
              <Payments />
            </PrivateRoute>
          }
        />

        {/* ------------------ ADMIN ROUTES ------------------ */}

     
<Route
  path="/admin/buses"
  element={
    <PrivateRoute role="ADMIN">
      <ManageBuses />
    </PrivateRoute>
  }
/>
<Route
  path="/admin/routes"
  element={
    <PrivateRoute role="ADMIN">
      <ManageRoutes />
    </PrivateRoute>
  }
/>
<Route
  path="/admin/bookings"
  element={
    <PrivateRoute role="ADMIN">
      <ManageBookings />
    </PrivateRoute>
  }
/>
<Route
  path="/admin/users"
  element={
    <PrivateRoute role="ADMIN">
      <ManageUsers />
    </PrivateRoute>
  }
/>
<Route
  path="/admin/operators"
  element={
    <PrivateRoute role="ADMIN">
      <ManageOperators />
    </PrivateRoute>
  }
/>
<Route
  path="/admin/seats"
  element={
    <PrivateRoute role="ADMIN">
      <ManageSeats />
    </PrivateRoute>
  }
/>
        <Route
          path="/admin/dashboard"
          element={
            <PrivateRoute role="ADMIN">
              <AdminDashboard />
            </PrivateRoute>
          }
        />
        {/* <Route
          path="/admin/buses"
          element={
            <PrivateRoute role="ADMIN">
              <Buses />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/routes"
          element={
            <PrivateRoute role="ADMIN">
              <RoutesPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/bookings"
          element={
            <PrivateRoute role="ADMIN">
              <Bookings />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <PrivateRoute role="ADMIN">
              <UsersPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/operators"
          element={
            <PrivateRoute role="ADMIN">
              <OperatorsPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/seats"
          element={
            <PrivateRoute role="ADMIN">
              <SeatsPage />
            </PrivateRoute>
          }
        /> */}
      </Routes>
    </>
  );
}

export default App;


// import { Routes, Route } from "react-router-dom";
// import Home from "./pages/Home";
// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import AdminLogin from "./pages/AdminLogin";
// import Buses from "./pages/Buses";
// import RoutesPage from "./pages/Routes";
// import Bookings from "./pages/Bookings";
// import Payments from "./pages/Payments";
// import AdminDashboard from "./pages/AdminDashboard";
// import UserDashboard from "./pages/UserDashboard";
// import Navbar from "./components/Navbar";
// import PrivateRoute from "./components/PrivateRoute";

// function App() {
//   return (
//     <>
//       <Navbar />
//       <Routes>
//         {/* Public */}
//         <Route path="/" element={<Home />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/register" element={<Register />} />
//         <Route path="/admin/login" element={<AdminLogin />} />

//         {/* User Routes */}
//         <Route
//           path="/buses"
//           element={
//             <PrivateRoute role="USER">
//               <Buses />
//             </PrivateRoute>
//           }
//         />
//         <Route
//           path="/routes"
//           element={
//             <PrivateRoute role="USER">
//               <RoutesPage />
//             </PrivateRoute>
//           }
//         />
//         <Route
//           path="/bookings"
//           element={
//             <PrivateRoute role="USER">
//               <Bookings />
//             </PrivateRoute>
//           }
//         />
//         <Route
//           path="/payments"
//           element={
//             <PrivateRoute role="USER">
//               <Payments />
//             </PrivateRoute>
//           }
//         />
//         <Route
//           path="/dashboard"
//           element={
//             <PrivateRoute role="USER">
//               <UserDashboard />
//             </PrivateRoute>
//           }
//         />

//         {/* Admin Routes */}
//         <Route
//           path="/admin/dashboard"
//           element={
//             <PrivateRoute role="ADMIN">
//               <AdminDashboard />
//             </PrivateRoute>
//           }

          
//         />
//       </Routes>
//     </>
//   );
// }

// export default App;

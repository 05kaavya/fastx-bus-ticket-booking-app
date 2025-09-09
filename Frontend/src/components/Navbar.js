import { Link, useNavigate, useLocation } from "react-router-dom";
import { Navbar, Nav, Container, Dropdown, Badge, Button } from "react-bootstrap";
import { useState, useEffect } from "react";
import "./Navbar.css";

export default function AppNavbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [role, setRole] = useState(localStorage.getItem("role"));
  const [username, setUsername] = useState(localStorage.getItem("username"));
  const [showBackButton, setShowBackButton] = useState(false);
  const [showRefreshButton, setShowRefreshButton] = useState(false);

  // Check if we should show the back button (not on home pages)
  useEffect(() => {
    const hideBackButtonPaths = ["/", "/dashboard", "/admin/dashboard", "/operator/dashboard", "/login", "/register", "/admin/login", "/operator/login"];
    setShowBackButton(!hideBackButtonPaths.includes(location.pathname));
    
    // Show refresh button on all pages except login/register pages
    const hideRefreshButtonPaths = ["/login", "/register", "/admin/login", "/operator/login"];
    setShowRefreshButton(!hideRefreshButtonPaths.includes(location.pathname));
  }, [location]);

  // Listen for storage changes to update state
  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem("token"));
      setRole(localStorage.getItem("role"));
      setUsername(localStorage.getItem("username"));
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setToken(null);
    setRole(null);
    setUsername(null);
    navigate("/");
  };

  const handleBack = () => {
    navigate(-1); // Go back to previous page
  };

  const handleRefresh = () => {
    window.location.reload(); // Refresh the current page
  };

  // Get badge color based on role
  const getRoleBadgeColor = () => {
    switch(role) {
      case "ADMIN": return "warning";
      case "OPERATOR": return "success";
      case "USER": return "info";
      default: return "secondary";
    }
  };

  // Get role display name
  const getRoleDisplayName = () => {
    switch(role) {
      case "ADMIN": return "ADMIN";
      case "OPERATOR": return "OPERATOR";
      case "USER": return "USER";
      default: return "USER";
    }
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="app-navbar">
      <Container>
        {/* Back Button - Only show on appropriate pages */}
        {showBackButton && (
          <Button 
            variant="outline-light" 
            className="me-2 back-button"
            onClick={handleBack}
            aria-label="Go back"
            size="sm"
          >
            <i className="fas fa-arrow-left"></i>
          </Button>
        )}
        
        {/* Refresh Button - Show on most pages */}
        {showRefreshButton && (
          <Button 
            variant="outline-light" 
            className="me-3 refresh-button"
            onClick={handleRefresh}
            aria-label="Refresh page"
            size="sm"
          >
            <i className="fas fa-sync-alt"></i>
          </Button>
        )}
        
        <Navbar.Brand as={Link} to="/" className="brand">
          <i className="fas fa-bus me-2"></i>FastX
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {!token && (
              <>
                <Nav.Link as={Link} to="/login" className="nav-link-custom">
                  <i className="fas fa-user me-1"></i>User Login
                </Nav.Link>
                <Nav.Link as={Link} to="/register" className="nav-link-custom">
                  <i className="fas fa-user-plus me-1"></i>User Register
                </Nav.Link>
                <Nav.Link as={Link} to="/admin/login" className="nav-link-custom">
                  <i className="fas fa-user-cog me-1"></i>Admin Login
                </Nav.Link>
                <Nav.Link as={Link} to="/operator/login" className="nav-link-custom">
                  <i className="fas fa-bus me-1"></i>Operator Login
                </Nav.Link>
              </>
            )}

            {role === "USER" && (
              <>
                <Nav.Link as={Link} to="/dashboard" className="nav-link-custom">
                  <i className="fas fa-home me-1"></i>User Dashboard
                </Nav.Link>
                <Nav.Link as={Link} to="/buses" className="nav-link-custom">
                  <i className="fas fa-bus me-1"></i>Buses
                </Nav.Link>
                <Nav.Link as={Link} to="/bookings" className="nav-link-custom">
                  <i className="fas fa-ticket-alt me-1"></i>My Bookings
                </Nav.Link>
              </>
            )}

            {role === "ADMIN" && (
              <>
                <Nav.Link as={Link} to="/admin/dashboard" className="nav-link-custom">
                  <i className="fas fa-tachometer-alt me-1"></i>Admin Dashboard
                </Nav.Link>
                <Nav.Link as={Link} to="/admin/buses" className="nav-link-custom">
                  <i className="fas fa-bus me-1"></i>Manage Buses
                </Nav.Link>
                <Nav.Link as={Link} to="/admin/routes" className="nav-link-custom">
                  <i className="fas fa-route me-1"></i>Manage Routes
                </Nav.Link>
                <Nav.Link as={Link} to="/admin/operators" className="nav-link-custom">
                  <i className="fas fa-users-cog me-1"></i>Manage Operators
                </Nav.Link>
              </>
            )}

            {role === "OPERATOR" && (
              <>
                <Nav.Link as={Link} to="/operator/dashboard" className="nav-link-custom">
                  <i className="fas fa-tachometer-alt me-1"></i>Operator Dashboard
                </Nav.Link>
               
              </>
            )}
          </Nav>

          {token && (
            <Nav className="ms-auto">
              <Dropdown align="end">
                <Dropdown.Toggle
                  variant="outline-light"
                  id="dropdown-user"
                  className="user-dropdown"
                >
                  <i className="fas fa-user-circle me-1"></i>
                  {username || "User"}
                  <Badge
                    bg={getRoleBadgeColor()}
                    className="ms-2 role-badge"
                  >
                    {getRoleDisplayName()}
                  </Badge>
                </Dropdown.Toggle>

                <Dropdown.Menu className="dropdown-menu-custom">
                  <Dropdown.Header className="dropdown-header-custom">
                    <i className="fas fa-user me-1"></i>
                    {username || "User"}
                    <div>
                      <small className="text-muted">{getRoleDisplayName()} Account</small>
                    </div>
                  </Dropdown.Header>

                  <Dropdown.Divider />
                  <Dropdown.Divider />
                  <Dropdown.Item
                    onClick={handleLogout}
                    className="logout-item"
                  >
                    <i className="fas fa-sign-out-alt me-2"></i>Logout
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Nav>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}



// AppNavbar.js
// import { Link, useNavigate, useLocation } from "react-router-dom";
// import { Navbar, Nav, Container, Dropdown, Badge, Button } from "react-bootstrap";
// import { useState, useEffect } from "react";
// import "./Navbar.css";

// export default function AppNavbar() {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [token, setToken] = useState(localStorage.getItem("token"));
//   const [role, setRole] = useState(localStorage.getItem("role"));
//   const [username, setUsername] = useState(localStorage.getItem("username"));
//   const [showBackButton, setShowBackButton] = useState(false);

//   // Check if we should show the back button (not on home pages)
//   useEffect(() => {
//     const hideBackButtonPaths = ["/", "/dashboard", "/admin/dashboard", "/operator/dashboard", "/login", "/register", "/admin/login", "/operator/login"];
//     setShowBackButton(!hideBackButtonPaths.includes(location.pathname));
//   }, [location]);

//   // Listen for storage changes to update state
//   useEffect(() => {
//     const handleStorageChange = () => {
//       setToken(localStorage.getItem("token"));
//       setRole(localStorage.getItem("role"));
//       setUsername(localStorage.getItem("username"));
//     };

//     window.addEventListener("storage", handleStorageChange);
//     return () => window.removeEventListener("storage", handleStorageChange);
//   }, []);

//   const handleLogout = () => {
//     localStorage.clear();
//     setToken(null);
//     setRole(null);
//     setUsername(null);
//     navigate("/");
//   };

//   const handleBack = () => {
//     navigate(-1); // Go back to previous page
//   };

//   // Get badge color based on role
//   const getRoleBadgeColor = () => {
//     switch(role) {
//       case "ADMIN": return "warning";
//       case "OPERATOR": return "success";
//       case "USER": return "info";
//       default: return "secondary";
//     }
//   };

//   // Get role display name
//   const getRoleDisplayName = () => {
//     switch(role) {
//       case "ADMIN": return "ADMIN";
//       case "OPERATOR": return "OPERATOR";
//       case "USER": return "USER";
//       default: return "USER";
//     }
//   };

//   return (
//     <Navbar bg="dark" variant="dark" expand="lg" className="app-navbar">
//       <Container>
//         {/* Back Button - Only show on appropriate pages */}
//         {showBackButton && (
//           <Button 
//             variant="outline-light" 
//             className="me-3 back-button"
//             onClick={handleBack}
//             aria-label="Go back"
//           >
//             <i className="fas fa-arrow-left"></i>
//           </Button>
//         )}
        
//         <Navbar.Brand as={Link} to="/" className="brand">
//           <i className="fas fa-bus me-2"></i>FastX
//         </Navbar.Brand>

//         <Navbar.Toggle aria-controls="basic-navbar-nav" />

//         <Navbar.Collapse id="basic-navbar-nav">
//           <Nav className="me-auto">
//             {!token && (
//               <>
//                 <Nav.Link as={Link} to="/login" className="nav-link-custom">
//                   <i className="fas fa-user me-1"></i>User Login
//                 </Nav.Link>
//                 <Nav.Link as={Link} to="/register" className="nav-link-custom">
//                   <i className="fas fa-user-plus me-1"></i>User Register
//                 </Nav.Link>
//                 <Nav.Link as={Link} to="/admin/login" className="nav-link-custom">
//                   <i className="fas fa-user-cog me-1"></i>Admin Login
//                 </Nav.Link>
//                 <Nav.Link as={Link} to="/operator/login" className="nav-link-custom">
//                   <i className="fas fa-bus me-1"></i>Operator Login
//                 </Nav.Link>
//               </>
//             )}

//             {role === "USER" && (
//               <>
//                 <Nav.Link as={Link} to="/dashboard" className="nav-link-custom">
//                   <i className="fas fa-home me-1"></i>User Dashboard
//                 </Nav.Link>
//                 <Nav.Link as={Link} to="/buses" className="nav-link-custom">
//                   <i className="fas fa-bus me-1"></i>Buses
//                 </Nav.Link>
//                 <Nav.Link as={Link} to="/bookings" className="nav-link-custom">
//                   <i className="fas fa-ticket-alt me-1"></i>My Bookings
//                 </Nav.Link>
//               </>
//             )}

//             {role === "ADMIN" && (
//               <>
//                 <Nav.Link as={Link} to="/admin/dashboard" className="nav-link-custom">
//                   <i className="fas fa-tachometer-alt me-1"></i>Admin Dashboard
//                 </Nav.Link>
//                 <Nav.Link as={Link} to="/admin/buses" className="nav-link-custom">
//                   <i className="fas fa-bus me-1"></i>Manage Buses
//                 </Nav.Link>
//                 <Nav.Link as={Link} to="/admin/routes" className="nav-link-custom">
//                   <i className="fas fa-route me-1"></i>Manage Routes
//                 </Nav.Link>
//                 <Nav.Link as={Link} to="/admin/operators" className="nav-link-custom">
//                   <i className="fas fa-users-cog me-1"></i>Manage Operators
//                 </Nav.Link>
//               </>
//             )}

//             {role === "OPERATOR" && (
//               <>
//                 <Nav.Link as={Link} to="/operator/dashboard" className="nav-link-custom">
//                   <i className="fas fa-tachometer-alt me-1"></i>Operator Dashboard
//                 </Nav.Link>
               
//               </>
//             )}
//           </Nav>

//           {token && (
//             <Nav className="ms-auto">
//               <Dropdown align="end">
//                 <Dropdown.Toggle
//                   variant="outline-light"
//                   id="dropdown-user"
//                   className="user-dropdown"
//                 >
//                   <i className="fas fa-user-circle me-1"></i>
//                   {username || "User"}
//                   <Badge
//                     bg={getRoleBadgeColor()}
//                     className="ms-2 role-badge"
//                   >
//                     {getRoleDisplayName()}
//                   </Badge>
//                 </Dropdown.Toggle>

//                 <Dropdown.Menu className="dropdown-menu-custom">
//                   <Dropdown.Header className="dropdown-header-custom">
//                     <i className="fas fa-user me-1"></i>
//                     {username || "User"}
//                     <div>
//                       <small className="text-muted">{getRoleDisplayName()} Account</small>
//                     </div>
//                   </Dropdown.Header>

//                   <Dropdown.Divider />
//                   <Dropdown.Divider />
//                   <Dropdown.Item
//                     onClick={handleLogout}
//                     className="logout-item"
//                   >
//                     <i className="fas fa-sign-out-alt me-2"></i>Logout
//                   </Dropdown.Item>
//                 </Dropdown.Menu>
//               </Dropdown>
//             </Nav>
//           )}
//         </Navbar.Collapse>
//       </Container>
//     </Navbar>
//   );
// }




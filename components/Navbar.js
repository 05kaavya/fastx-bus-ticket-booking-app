// AppNavbar.js
import { Link, useNavigate } from "react-router-dom";
import { Navbar, Nav, Container, Dropdown, Badge } from "react-bootstrap";
import { useState, useEffect } from "react";
import "./Navbar.css";

export default function AppNavbar() {
  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [role, setRole] = useState(localStorage.getItem("role"));
  const [username, setUsername] = useState(localStorage.getItem("username"));

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
    navigate("/login");
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="app-navbar">
      <Container>
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
                    bg={role === "ADMIN" ? "warning" : "info"}
                    className="ms-2"
                  >
                    {role}
                  </Badge>
                </Dropdown.Toggle>

                <Dropdown.Menu className="dropdown-menu-custom">
                  <Dropdown.Header>
                    <i className="fas fa-user me-1"></i>
                    {username || "User"}
                    <div>
                      <small className="text-muted">{role} Account</small>
                    </div>
                  </Dropdown.Header>

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


// // AppNavbar.js
// import { Link, useNavigate } from "react-router-dom";
// import { Navbar, Nav, Container } from "react-bootstrap";

// export default function AppNavbar() {
//   const navigate = useNavigate();
//   const token = localStorage.getItem("token");
//   const role = localStorage.getItem("role");

//   const handleLogout = () => {
//     localStorage.clear();
//     navigate("/login");
//   };

//   return (
//     <Navbar bg="dark" variant="dark" expand="lg">
//       <Container>
//         <Navbar.Brand as={Link} to="/">FastX</Navbar.Brand>
//         <Nav className="me-auto">
//           {!token && <Nav.Link as={Link} to="/login">User Login</Nav.Link>}
//           {!token && <Nav.Link as={Link} to="/register">User Register</Nav.Link>}
//           {!token && <Nav.Link as={Link} to="/admin/login">Admin Login</Nav.Link>}
//           {/* {!token && <Nav.Link as={Link} to="/admin/register">Admin Register</Nav.Link>} */}

//           {role === "USER" && <Nav.Link as={Link} to="/buses">Buses</Nav.Link>}
//           {role === "USER" && <Nav.Link as={Link} to="/bookings">My Bookings</Nav.Link>}
//           {role === "ADMIN" && <Nav.Link as={Link} to="/admin/dashboard">Admin Dashboard</Nav.Link>}
//         </Nav>
//         {token && <Nav.Link onClick={handleLogout}>Logout</Nav.Link>}
//       </Container>
//     </Navbar>
//   );
// }

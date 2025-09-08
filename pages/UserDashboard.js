// src/pages/UserDashboard.js
import React, { useEffect, useState } from "react";
import { Card, Button, Row, Col, Container, Spinner, Alert, Badge } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaBus, FaTicketAlt, FaUser } from "react-icons/fa";
import "./UserDashboard.css";

const UserDashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // ✅ Fetch logged-in user
        const userRes = await axios.get("http://localhost:8080/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(userRes.data);
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Failed to load dashboard. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" />
        <p>Loading your dashboard...</p>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Welcome, {user?.name} 👋</h2>
        <Badge bg="primary" className="fs-6 p-2">USER</Badge>
      </div>
      
      {error && <Alert variant="danger">{error}</Alert>}

      {/* Quick Actions */}
      <Row className="g-4 justify-content-center">
        <Col xs={12} md={6} lg={4}>
          <Card className="text-center h-100 shadow-sm action-card">
            <Card.Body className="d-flex flex-column">
              <div className="icon-wrapper mb-3">
                <FaBus size={40} className="text-primary" />
              </div>
              <Card.Title className="fw-bold">Book a Bus</Card.Title>
              <Card.Text className="text-muted">
                Search and book buses for your journey
              </Card.Text>
              <Button 
                variant="primary" 
                className="w-100 mt-auto" 
                onClick={() => navigate("/buses")}
              >
                Search Buses
              </Button>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} md={6} lg={4}>
          <Card className="text-center h-100 shadow-sm action-card">
            <Card.Body className="d-flex flex-column">
              <div className="icon-wrapper mb-3">
                <FaTicketAlt size={40} className="text-success" />
              </div>
              <Card.Title className="fw-bold">My Bookings</Card.Title>
              <Card.Text className="text-muted">
                View and manage your existing bookings
              </Card.Text>
              <Button 
                variant="success" 
                className="w-100 mt-auto" 
                onClick={() => navigate("/bookings")}
              >
                View Bookings
              </Button>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} md={6} lg={4}>
          <Card className="text-center h-100 shadow-sm action-card">
            <Card.Body className="d-flex flex-column">
              <div className="icon-wrapper mb-3">
                <FaUser size={40} className="text-info" />
              </div>
              <Card.Title className="fw-bold">Profile</Card.Title>
              <Card.Text className="text-muted">
                View and update your personal information
              </Card.Text>
              <Button 
                variant="info" 
                className="w-100 mt-auto" 
                onClick={() => navigate("/profile")}
              >
                View Profile
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default UserDashboard;


// // src/pages/UserDashboard.js
// import React, { useEffect, useState } from "react";
// import { Card, Button, Row, Col, Container, Spinner, Alert, Badge } from "react-bootstrap";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { FaBus, FaTicketAlt, FaUser, FaMapMarkerAlt, FaCalendarAlt, FaClock } from "react-icons/fa";

// const UserDashboard = () => {
//   const [user, setUser] = useState(null);
//   const [bookings, setBookings] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   const token = localStorage.getItem("token");

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         // ✅ Fetch logged-in user
//         const userRes = await axios.get("http://localhost:8080/api/users/me", {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setUser(userRes.data);

//         // ✅ Fetch user bookings
//         const bookingsRes = await axios.get("http://localhost:8080/api/bookings/my", {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setBookings(Array.isArray(bookingsRes.data) ? bookingsRes.data : []);
//       } catch (err) {
//         console.error("Error fetching dashboard data:", err);
//         setError("Failed to load dashboard. Please try again.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [token]);

//   const formatDate = (dateString) => {
//     const options = { year: 'numeric', month: 'short', day: 'numeric' };
//     return new Date(dateString).toLocaleDateString(undefined, options);
//   };

//   if (loading) {
//     return (
//       <Container className="text-center mt-5">
//         <Spinner animation="border" />
//         <p>Loading your dashboard...</p>
//       </Container>
//     );
//   }

//   return (
//     <Container className="my-5">
//       <div className="d-flex justify-content-between align-items-center mb-4">
//         <h2>Welcome, {user?.name} 👋</h2>
//         <Badge bg="primary" className="fs-6 p-2">USER</Badge>
//       </div>
      
//       {error && <Alert variant="danger">{error}</Alert>}

//       {/* Quick Actions */}
//       <Row className="mb-5 g-4">
//         <Col xs={12} md={6} lg={3}>
//           <Card className="text-center h-100 shadow-sm">
//             <Card.Body>
//               <FaBus size={30} className="mb-3 text-primary" />
//               <Card.Title>Book a Bus</Card.Title>
//               <Button variant="outline-primary" className="w-100" onClick={() => navigate("/buses")}>
//                 Search Buses
//               </Button>
//             </Card.Body>
//           </Card>
//         </Col>
//         <Col xs={12} md={6} lg={3}>
//           <Card className="text-center h-100 shadow-sm">
//             <Card.Body>
//               <FaTicketAlt size={30} className="mb-3 text-success" />
//               <Card.Title>My Bookings</Card.Title>
//               <Button variant="outline-success" className="w-100" onClick={() => navigate("/bookings")}>
//                 View Bookings
//               </Button>
//             </Card.Body>
//           </Card>
//         </Col>
//         <Col xs={12} md={6} lg={3}>
//           <Card className="text-center h-100 shadow-sm">
//             <Card.Body>
//               <FaUser size={30} className="mb-3 text-info" />
//               <Card.Title>Profile</Card.Title>
//               <Button variant="outline-info" className="w-100" onClick={() => navigate("/profile")}>
//                 View Profile
//               </Button>
//             </Card.Body>
//           </Card>
//         </Col>
//         <Col xs={12} md={6} lg={3}>
//           <Card className="text-center h-100 shadow-sm">
//             <Card.Body>
//               <FaTicketAlt size={30} className="mb-3 text-warning" />
//               <Card.Title>Booking History</Card.Title>
//               <Button variant="outline-warning" className="w-100" onClick={() => navigate("/booking-history")}>
//                 View History
//               </Button>
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>

//       {/* Recent Bookings Preview */}
//       {bookings.length > 0 && (
//         <Row>
//           <Col>
//             <Card>
//               <Card.Header>
//                 <h5 className="mb-0">Recent Bookings</h5>
//               </Card.Header>
//               <Card.Body>
//                 <Row>
//                   {bookings.slice(0, 2).map(booking => (
//                     <Col md={6} key={booking._id} className="mb-3">
//                       <Card className="h-100">
//                         <Card.Body>
//                           <div className="d-flex justify-content-between align-items-start mb-2">
//                             <h6 className="mb-0">{booking.bus?.busNumber || 'N/A'}</h6>
//                             <Badge bg={booking.status === 'confirmed' ? 'success' : 'warning'}>
//                               {booking.status}
//                             </Badge>
//                           </div>
//                           <div className="mb-2">
//                             <small>
//                               <FaMapMarkerAlt className="me-1" />
//                               {booking.bus?.source || 'N/A'} → {booking.bus?.destination || 'N/A'}
//                             </small>
//                           </div>
//                           <div className="d-flex justify-content-between text-muted">
//                             <small>
//                               <FaCalendarAlt className="me-1" />
//                               {formatDate(booking.travelDate)}
//                             </small>
//                             <small>
//                               <FaClock className="me-1" />
//                               {booking.bus?.departureTime}
//                             </small>
//                           </div>
//                         </Card.Body>
//                       </Card>
//                     </Col>
//                   ))}
//                 </Row>
//                 {bookings.length > 2 && (
//                   <div className="text-center mt-3">
//                     <Button variant="outline-primary" onClick={() => navigate("/bookings")}>
//                       View All Bookings ({bookings.length})
//                     </Button>
//                   </div>
//                 )}
//               </Card.Body>
//             </Card>
//           </Col>
//         </Row>
//       )}
//     </Container>
//   );
// };

// export default UserDashboard;
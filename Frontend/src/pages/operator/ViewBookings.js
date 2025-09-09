// src/pages/operator/ViewBookings.js
import React, { useEffect, useState, useCallback } from "react";
import {
  Container,
  Table,
  Button,
  Form,
  Row,
  Col,
  Alert,
  Card,
  Badge,
  Modal,
  InputGroup
} from "react-bootstrap";
import operatorService from "../../services/operatorService";

export default function ViewBookings() {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleString("en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    } catch (error) {
      return dateString;
    }
  };

  const formatCurrency = (amount) => {
    if (!amount) return "₹0.00";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR"
    }).format(amount);
  };

  const getStatusVariant = (status) => {
    if (!status) return "secondary";
    switch (status.toLowerCase()) {
      case "confirmed":
        return "success";
      case "pending":
        return "warning";
      case "cancelled":
        return "danger";
      case "refunded":
        return "info";
      default:
        return "secondary";
    }
  };

  // Filtering bookings
  const filterBookings = useCallback(() => {
    let result = Array.isArray(bookings) ? bookings : [];
    if (statusFilter !== "all") {
      result = result.filter(
        (b) =>
          b?.status &&
          b.status.toLowerCase() === statusFilter.toLowerCase()
      );
    }
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (b) =>
          (b?.user?.name && b.user.name.toLowerCase().includes(term)) ||
          (b?.user?.email && b.user.email.toLowerCase().includes(term)) ||
          (b?.bookingId && b.bookingId.toString().includes(term)) ||
          (b?.route?.origin && b.route.origin.toLowerCase().includes(term)) ||
          (b?.route?.destination &&
            b.route.destination.toLowerCase().includes(term))
      );
    }
    setFilteredBookings(result);
  }, [bookings, searchTerm, statusFilter]);

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    filterBookings();
  }, [bookings, searchTerm, statusFilter, filterBookings]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await operatorService.getMyBookings();
      setBookings(Array.isArray(res) ? res : []);
    } catch (err) {
      console.error("Failed to fetch bookings:", err);
      setError(
        "Failed to load bookings: " +
          (err.response?.data?.message || err.message)
      );
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (booking) => {
    setSelectedBooking(booking);
    setShowDetailModal(true);
  };

  const handleCloseModal = () => {
    setShowDetailModal(false);
    setSelectedBooking(null);
  };

  // Refund action
 const handleRefund = async (booking) => {
  try {
    if (!booking.cancellation || !booking.cancellation.cancellationId) {
      setError("Refund not possible: No cancellation record found.");
      return;
    }

    await operatorService.processRefund(booking.cancellation.cancellationId);

    setSuccess(`Refund processed for Booking #${booking.bookingId}`);

    // Update booking status in UI
    setBookings((prev) =>
      prev.map((b) =>
        b.bookingId === booking.bookingId ? { ...b, status: "Refunded" } : b
      )
    );
  } catch (err) {
    console.error("Refund failed:", err);
    setError("Refund failed: " + (err.response?.data?.message || err.message));
  }
};


  if (loading) {
    return (
      <Container className="mt-4 text-center">
        <div className="d-flex justify-content-center align-items-center" style={{ height: "50vh" }}>
          <div>
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Loading bookings...</p>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <h2 className="mb-4 text-center">Booking Management</h2>
      {error && <Alert variant="danger" onClose={() => setError("")} dismissible>{error}</Alert>}
      {success && <Alert variant="success" onClose={() => setSuccess("")} dismissible>{success}</Alert>}

      {/* Filters */}
      <Card className="mb-4">
        <Card.Body>
          <Row>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Search Bookings</Form.Label>
                <InputGroup>
                  <Form.Control
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Button
                    variant="outline-secondary"
                    onClick={() => setSearchTerm("")}
                    disabled={!searchTerm}
                  >
                    Clear
                  </Button>
                </InputGroup>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Filter by Status</Form.Label>
                <Form.Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="pending">Pending</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="refunded">Refunded</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Table */}
      <Card>
        <Table responsive hover>
          <thead className="table-dark">
            <tr>
              <th>Booking ID</th>
              <th>Passenger</th>
              <th>Route</th>
              <th>Travel Date</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center">No bookings found</td>
              </tr>
            ) : (
              filteredBookings.map((b) => (
                <tr key={b.bookingId}>
                  <td>#{b.bookingId}</td>
                  <td>{b.user?.name} <br /> <small>{b.user?.email}</small></td>
                  <td>{b.route?.origin} → {b.route?.destination}</td>
                  <td>{formatDate(b.travelDate)}</td>
                  <td>{formatCurrency(b.totalAmount)}</td>
                  <td><Badge bg={getStatusVariant(b.status)}>{b.status}</Badge></td>
                  <td>
                    <Button size="sm" variant="outline-primary" onClick={() => handleViewDetails(b)}>Details</Button>{" "}
                    {b.status === "Cancelled" && (
                      <Button size="sm" variant="outline-success" onClick={() => handleRefund(b)}>
                        Refund
                      </Button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </Card>

      {/* Modal */}
      <Modal show={showDetailModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Booking Details #{selectedBooking?.bookingId}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedBooking && (
            <>
              <p><strong>Passenger:</strong> {selectedBooking.user?.name}</p>
              <p><strong>Email:</strong> {selectedBooking.user?.email}</p>
              <p><strong>Status:</strong> {selectedBooking.status}</p>
              <p><strong>Amount:</strong> {formatCurrency(selectedBooking.totalAmount)}</p>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>Close</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}




// // src/pages/operator/ViewBookings.js
// import React, { useEffect, useState, useCallback } from "react";
// import {
//   Container,
//   Table,
//   Button,
//   Form,
//   Row,
//   Col,
//   Alert,
//   Card,
//   Badge,
//   Modal,
//   InputGroup
// } from "react-bootstrap";
// import operatorService from "../../services/operatorService";

// export default function ViewBookings() {
//   const [bookings, setBookings] = useState([]);
//   const [filteredBookings, setFilteredBookings] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");
//   const [selectedBooking, setSelectedBooking] = useState(null);
//   const [showDetailModal, setShowDetailModal] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [statusFilter, setStatusFilter] = useState("all");

//   const formatDate = (dateString) => {
//     if (!dateString) return "N/A";
//     try {
//       const date = new Date(dateString);
//       return date.toLocaleString("en-IN", {
//         year: "numeric",
//         month: "short",
//         day: "numeric",
//         hour: "2-digit",
//         minute: "2-digit"
//       });
//     } catch (error) {
//       return dateString;
//     }
//   };

//   const formatCurrency = (amount) => {
//     if (!amount) return "₹0.00";
//     return new Intl.NumberFormat("en-IN", {
//       style: "currency",
//       currency: "INR"
//     }).format(amount);
//   };

//   const getStatusVariant = (status) => {
//     if (!status) return "secondary";
//     switch (status.toLowerCase()) {
//       case "confirmed":
//         return "success";
//       case "pending":
//         return "warning";
//       case "cancelled":
//         return "danger";
//       case "refunded":
//         return "info";
//       default:
//         return "secondary";
//     }
//   };

//   // Filtering bookings
//   const filterBookings = useCallback(() => {
//     let result = Array.isArray(bookings) ? bookings : [];
//     if (statusFilter !== "all") {
//       result = result.filter(
//         (b) =>
//           b?.status &&
//           b.status.toLowerCase() === statusFilter.toLowerCase()
//       );
//     }
//     if (searchTerm) {
//       const term = searchTerm.toLowerCase();
//       result = result.filter(
//         (b) =>
//           (b?.user?.name && b.user.name.toLowerCase().includes(term)) ||
//           (b?.user?.email && b.user.email.toLowerCase().includes(term)) ||
//           (b?.bookingId && b.bookingId.toString().includes(term)) ||
//           (b?.route?.origin && b.route.origin.toLowerCase().includes(term)) ||
//           (b?.route?.destination &&
//             b.route.destination.toLowerCase().includes(term))
//       );
//     }
//     setFilteredBookings(result);
//   }, [bookings, searchTerm, statusFilter]);

//   useEffect(() => {
//     fetchBookings();
//   }, []);

//   useEffect(() => {
//     filterBookings();
//   }, [bookings, searchTerm, statusFilter, filterBookings]);

//   const fetchBookings = async () => {
//     try {
//       setLoading(true);
//       const res = await operatorService.getMyBookings();
//       setBookings(Array.isArray(res) ? res : []);
//     } catch (err) {
//       console.error("Failed to fetch bookings:", err);
//       setError(
//         "Failed to load bookings: " +
//           (err.response?.data?.message || err.message)
//       );
//       setBookings([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleViewDetails = (booking) => {
//     setSelectedBooking(booking);
//     setShowDetailModal(true);
//   };

//   const handleCloseModal = () => {
//     setShowDetailModal(false);
//     setSelectedBooking(null);
//   };

//   // Refund action
//   const handleRefund = async (booking) => {
//     try {
//       await operatorService.processRefund(booking.payment?.paymentId, {
//         refundAmount: booking.totalAmount
//       });
//       setSuccess(`Refund processed for Booking #${booking.bookingId}`);
//       setBookings((prev) =>
//         prev.map((b) =>
//           b.bookingId === booking.bookingId ? { ...b, status: "Refunded" } : b
//         )
//       );
//     } catch (err) {
//       console.error("Refund failed:", err);
//       setError("Refund failed: " + (err.response?.data?.message || err.message));
//     }
//   };

//   if (loading) {
//     return (
//       <Container className="mt-4 text-center">
//         <div className="d-flex justify-content-center align-items-center" style={{ height: "50vh" }}>
//           <div>
//             <div className="spinner-border text-primary" role="status">
//               <span className="visually-hidden">Loading...</span>
//             </div>
//             <p className="mt-3">Loading bookings...</p>
//           </div>
//         </div>
//       </Container>
//     );
//   }

//   return (
//     <Container className="mt-4">
//       <h2 className="mb-4 text-center">Booking Management</h2>
//       {error && <Alert variant="danger" onClose={() => setError("")} dismissible>{error}</Alert>}
//       {success && <Alert variant="success" onClose={() => setSuccess("")} dismissible>{success}</Alert>}

//       {/* Filters */}
//       <Card className="mb-4">
//         <Card.Body>
//           <Row>
//             <Col md={6}>
//               <Form.Group>
//                 <Form.Label>Search Bookings</Form.Label>
//                 <InputGroup>
//                   <Form.Control
//                     type="text"
//                     placeholder="Search..."
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                   />
//                   <Button
//                     variant="outline-secondary"
//                     onClick={() => setSearchTerm("")}
//                     disabled={!searchTerm}
//                   >
//                     Clear
//                   </Button>
//                 </InputGroup>
//               </Form.Group>
//             </Col>
//             <Col md={6}>
//               <Form.Group>
//                 <Form.Label>Filter by Status</Form.Label>
//                 <Form.Select
//                   value={statusFilter}
//                   onChange={(e) => setStatusFilter(e.target.value)}
//                 >
//                   <option value="all">All</option>
//                   <option value="confirmed">Confirmed</option>
//                   <option value="pending">Pending</option>
//                   <option value="cancelled">Cancelled</option>
//                   <option value="refunded">Refunded</option>
//                 </Form.Select>
//               </Form.Group>
//             </Col>
//           </Row>
//         </Card.Body>
//       </Card>

//       {/* Table */}
//       <Card>
//         <Table responsive hover>
//           <thead className="table-dark">
//             <tr>
//               <th>Booking ID</th>
//               <th>Passenger</th>
//               <th>Route</th>
//               <th>Travel Date</th>
//               <th>Amount</th>
//               <th>Status</th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredBookings.length === 0 ? (
//               <tr>
//                 <td colSpan="7" className="text-center">No bookings found</td>
//               </tr>
//             ) : (
//               filteredBookings.map((b) => (
//                 <tr key={b.bookingId}>
//                   <td>#{b.bookingId}</td>
//                   <td>{b.user?.name} <br /> <small>{b.user?.email}</small></td>
//                   <td>{b.route?.origin} → {b.route?.destination}</td>
//                   <td>{formatDate(b.travelDate)}</td>
//                   <td>{formatCurrency(b.totalAmount)}</td>
//                   <td><Badge bg={getStatusVariant(b.status)}>{b.status}</Badge></td>
//                   <td>
//                     <Button size="sm" variant="outline-primary" onClick={() => handleViewDetails(b)}>Details</Button>{" "}
//                     {b.status === "Cancelled" && (
//                       <Button size="sm" variant="outline-success" onClick={() => handleRefund(b)}>
//                         Refund
//                       </Button>
//                     )}
//                   </td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </Table>
//       </Card>

//       {/* Modal */}
//       <Modal show={showDetailModal} onHide={handleCloseModal} size="lg">
//         <Modal.Header closeButton>
//           <Modal.Title>Booking Details #{selectedBooking?.bookingId}</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           {selectedBooking && (
//             <>
//               <p><strong>Passenger:</strong> {selectedBooking.user?.name}</p>
//               <p><strong>Email:</strong> {selectedBooking.user?.email}</p>
//               <p><strong>Status:</strong> {selectedBooking.status}</p>
//               <p><strong>Amount:</strong> {formatCurrency(selectedBooking.totalAmount)}</p>
//             </>
//           )}
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={handleCloseModal}>Close</Button>
//         </Modal.Footer>
//       </Modal>
//     </Container>
//   );
// }


// // src/pages/operator/ViewBookings.js
// import React, { useEffect, useState, useCallback } from "react";
// import {
//   Container,
//   Table,
//   Button,
//   Form,
//   Row,
//   Col,
//   Alert,
//   Card,
//   Badge,
//   Modal,
//   InputGroup
// } from "react-bootstrap";
// import operatorService from "../../services/operatorService";

// export default function ViewBookings() {
//   const [bookings, setBookings] = useState([]);
//   const [filteredBookings, setFilteredBookings] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");
//   const [selectedBooking, setSelectedBooking] = useState(null);
//   const [showDetailModal, setShowDetailModal] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [statusFilter, setStatusFilter] = useState("all");

//   // Format date without external library
//   const formatDate = (dateString) => {
//     if (!dateString) return "N/A";
//     try {
//       const date = new Date(dateString);
//       return date.toLocaleString('en-IN', {
//         year: 'numeric',
//         month: 'short',
//         day: 'numeric',
//         hour: '2-digit',
//         minute: '2-digit'
//       });
//     } catch (error) {
//       return dateString;
//     }
//   };

//   // Filter function with useCallback to avoid dependency issues
//   const filterBookings = useCallback(() => {
//     let result = bookings;

//     // Apply status filter
//     if (statusFilter !== "all") {
//       result = result.filter(booking => 
//         booking.status && booking.status.toLowerCase() === statusFilter.toLowerCase()
//       );
//     }

//     // Apply search filter
//     if (searchTerm) {
//       const term = searchTerm.toLowerCase();
//       result = result.filter(booking =>
//         (booking.user?.name && booking.user.name.toLowerCase().includes(term)) ||
//         (booking.user?.email && booking.user.email.toLowerCase().includes(term)) ||
//         (booking.bookingId && booking.bookingId.toString().includes(term)) ||
//         (booking.route?.origin && booking.route.origin.toLowerCase().includes(term)) ||
//         (booking.route?.destination && booking.route.destination.toLowerCase().includes(term))
//       );
//     }

//     setFilteredBookings(result);
//   }, [bookings, searchTerm, statusFilter]);

//   // Fetch bookings on component mount
//   useEffect(() => {
//     fetchBookings();
//   }, []);

//   // Filter bookings when search term or status filter changes
//   useEffect(() => {
//     filterBookings();
//   }, [bookings, searchTerm, statusFilter, filterBookings]);

//   const fetchBookings = async () => {
//     try {
//       setLoading(true);
//       const res = await operatorService.getMyBookings();
//       setBookings(res.data);
//     } catch (err) {
//       console.error("Failed to fetch bookings:", err);
//       setError("Failed to load bookings: " + (err.response?.data?.message || err.message));
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleViewDetails = (booking) => {
//     setSelectedBooking(booking);
//     setShowDetailModal(true);
//   };

//   const handleCloseModal = () => {
//     setShowDetailModal(false);
//     setSelectedBooking(null);
//   };

//   const getStatusVariant = (status) => {
//     if (!status) return "secondary";
    
//     switch (status.toLowerCase()) {
//       case "confirmed": return "success";
//       case "pending": return "warning";
//       case "cancelled": return "danger";
//       default: return "secondary";
//     }
//   };

//   const formatCurrency = (amount) => {
//     if (!amount) return "₹0.00";
//     return new Intl.NumberFormat('en-IN', {
//       style: 'currency',
//       currency: 'INR'
//     }).format(amount);
//   };

//   if (loading) {
//     return (
//       <Container className="mt-4 text-center">
//         <div className="d-flex justify-content-center align-items-center" style={{ height: "50vh" }}>
//           <div>
//             <div className="spinner-border text-primary" role="status">
//               <span className="visually-hidden">Loading...</span>
//             </div>
//             <p className="mt-3">Loading bookings...</p>
//           </div>
//         </div>
//       </Container>
//     );
//   }

//   return (
//     <Container className="mt-4">
//       <h2 className="mb-4 text-center">Booking Management</h2>
//       <p className="text-center text-muted mb-4">
//         View and manage all bookings for your buses
//       </p>

//       {error && (
//         <Alert variant="danger" onClose={() => setError("")} dismissible>
//           {error}
//         </Alert>
//       )}
      
//       {success && (
//         <Alert variant="success" onClose={() => setSuccess("")} dismissible>
//           {success}
//         </Alert>
//       )}

//       {/* Filters and Search */}
//       <Card className="mb-4">
//         <Card.Body>
//           <Row>
//             <Col md={6}>
//               <Form.Group>
//                 <Form.Label>Search Bookings</Form.Label>
//                 <InputGroup>
//                   <Form.Control
//                     type="text"
//                     placeholder="Search by name, email, booking ID, or route..."
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                   />
//                   <Button 
//                     variant="outline-secondary" 
//                     onClick={() => setSearchTerm("")}
//                     disabled={!searchTerm}
//                   >
//                     Clear
//                   </Button>
//                 </InputGroup>
//               </Form.Group>
//             </Col>
//             <Col md={6}>
//               <Form.Group>
//                 <Form.Label>Filter by Status</Form.Label>
//                 <Form.Select
//                   value={statusFilter}
//                   onChange={(e) => setStatusFilter(e.target.value)}
//                 >
//                   <option value="all">All Statuses</option>
//                   <option value="confirmed">Confirmed</option>
//                   <option value="pending">Pending</option>
//                   <option value="cancelled">Cancelled</option>
//                 </Form.Select>
//               </Form.Group>
//             </Col>
//           </Row>
//         </Card.Body>
//       </Card>

//       {/* Results Count */}
//       <div className="d-flex justify-content-between align-items-center mb-3">
//         <h5>
//           {filteredBookings.length} {filteredBookings.length === 1 ? 'Booking' : 'Bookings'} Found
//         </h5>
//         <Button variant="outline-primary" onClick={fetchBookings}>
//           Refresh
//         </Button>
//       </div>

//       {/* Bookings Table */}
//       {filteredBookings.length === 0 ? (
//         <Alert variant="info" className="text-center">
//           {bookings.length === 0 
//             ? "No bookings found for your buses." 
//             : "No bookings match your search criteria."}
//         </Alert>
//       ) : (
//         <Card>
//           <Table responsive hover className="mb-0">
//             <thead className="table-dark">
//               <tr>
//                 <th>Booking ID</th>
//                 <th>Passenger</th>
//                 <th>Contact</th>
//                 <th>Route</th>
//                 <th>Travel Date</th>
//                 <th>Amount</th>
//                 <th>Status</th>
//                 <th>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredBookings.map((booking) => (
//                 <tr key={booking.bookingId}>
//                   <td className="fw-bold">#{booking.bookingId}</td>
//                   <td>
//                     {booking.user?.name || "N/A"}
//                     {booking.user?.email && (
//                       <div className="small text-muted">{booking.user.email}</div>
//                     )}
//                   </td>
//                   <td>
//                     {booking.user?.contactNumber || "N/A"}
//                   </td>
//                   <td>
//                     {booking.route ? (
//                       <>
//                         <div>{booking.route.origin} → {booking.route.destination}</div>
//                         <small className="text-muted">
//                           Bus: {booking.route.bus?.busName} ({booking.route.bus?.busNumber})
//                         </small>
//                       </>
//                     ) : (
//                       "N/A"
//                     )}
//                   </td>
//                   <td>
//                     {formatDate(booking.travelDate)}
//                   </td>
//                   <td className="fw-bold">
//                     {formatCurrency(booking.totalAmount)}
//                   </td>
//                   <td>
//                     <Badge bg={getStatusVariant(booking.status)}>
//                       {booking.status || "Unknown"}
//                     </Badge>
//                   </td>
//                   <td>
//                     <Button
//                       variant="outline-primary"
//                       size="sm"
//                       onClick={() => handleViewDetails(booking)}
//                     >
//                       View Details
//                     </Button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </Table>
//         </Card>
//       )}

//       {/* Booking Detail Modal */}
//       <Modal show={showDetailModal} onHide={handleCloseModal} size="lg">
//         <Modal.Header closeButton>
//           <Modal.Title>Booking Details #{selectedBooking?.bookingId}</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           {selectedBooking && (
//             <Row>
//               <Col md={6}>
//                 <h6>Passenger Information</h6>
//                 <p>
//                   <strong>Name:</strong> {selectedBooking.user?.name || "N/A"}<br />
//                   <strong>Email:</strong> {selectedBooking.user?.email || "N/A"}<br />
//                   <strong>Contact:</strong> {selectedBooking.user?.contactNumber || "N/A"}<br />
//                   <strong>Address:</strong> {selectedBooking.user?.address || "N/A"}
//                 </p>
//               </Col>
//               <Col md={6}>
//                 <h6>Booking Information</h6>
//                 <p>
//                   <strong>Status:</strong>{" "}
//                   <Badge bg={getStatusVariant(selectedBooking.status)}>
//                     {selectedBooking.status || "Unknown"}
//                   </Badge>
//                   <br />
//                   <strong>Booking Date:</strong> {formatDate(selectedBooking.bookingDate)}<br />
//                   <strong>Travel Date:</strong> {formatDate(selectedBooking.travelDate)}<br />
//                   <strong>Total Amount:</strong> {formatCurrency(selectedBooking.totalAmount)}
//                 </p>
//               </Col>
//               <Col md={12}>
//                 <h6>Route & Bus Details</h6>
//                 {selectedBooking.route ? (
//                   <Row>
//                     <Col md={6}>
//                       <strong>Route:</strong> {selectedBooking.route.origin} → {selectedBooking.route.destination}<br />
//                       <strong>Departure:</strong> {selectedBooking.route.departureTime || "N/A"}<br />
//                       <strong>Arrival:</strong> {selectedBooking.route.arrivalTime || "N/A"}<br />
//                       <strong>Duration:</strong> {selectedBooking.route.duration || "N/A"}
//                     </Col>
//                     <Col md={6}>
//                       <strong>Bus:</strong> {selectedBooking.route.bus?.busName || "N/A"} ({selectedBooking.route.bus?.busNumber || "N/A"})<br />
//                       <strong>Bus Type:</strong> {selectedBooking.route.bus?.busType || "N/A"}<br />
//                       <strong>Amenities:</strong> {selectedBooking.route.bus?.amenities || "N/A"}
//                     </Col>
//                   </Row>
//                 ) : (
//                   <p>No route information available.</p>
//                 )}
//               </Col>
//             </Row>
//           )}
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={handleCloseModal}>
//             Close
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </Container>
//   );
// }

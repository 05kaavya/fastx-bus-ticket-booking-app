// src/pages/Bookings.js
import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Table,
  Button,
  Alert,
  Form,
  Spinner,
  Badge,
  Modal,
  Card,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import {
  getMyBookings,
  getAllBookings,
  getBookingById,
  deleteBooking,
} from "../services/bookingService";
import { userService } from "../services/userService";

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [role] = useState(localStorage.getItem("role"));
  const [searchId, setSearchId] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(true);

  // Cancellation state
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [cancellationReason, setCancellationReason] = useState("");

  const navigate = useNavigate();

  // Fetch bookings based on role
  useEffect(() => {
    const shouldRefresh = localStorage.getItem("refreshBookings");
    if (shouldRefresh === "true") {
      setSuccessMessage("Booking completed successfully!");
      localStorage.removeItem("refreshBookings");

      setTimeout(() => {
        setSuccessMessage("");
      }, 5000);
    }

    if (role === "ADMIN") {
      loadAllBookings();
    } else {
      loadMyBookings();
    }
  }, [role]);

  const loadMyBookings = async () => {
    try {
      setLoading(true);
      const res = await getMyBookings();
      setBookings(res.data);
    } catch (err) {
      console.error("Error loading bookings:", err);
      setError("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  const loadAllBookings = async () => {
    try {
      setLoading(true);
      const res = await getAllBookings();
      setBookings(res.data);
    } catch (err) {
      console.error("Error loading all bookings:", err);
      setError("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchById = async () => {
    if (!searchId) return;
    try {
      setLoading(true);
      const res = await getBookingById(searchId);
      setBookings(res.data ? [res.data] : []);
    } catch (err) {
      setError("Booking not found");
    } finally {
      setLoading(false);
    }
  };

  // === CANCELLATION LOGIC ===
  const handleCancelClick = (booking) => {
    setSelectedBooking(booking);
    setShowCancelModal(true);
  };

  const confirmCancellation = async () => {
    try {
      const cancellationData = {
        bookingId: selectedBooking.bookingId,
        paymentId: selectedBooking.payment?.paymentId || selectedBooking.paymentId,
        refundAmount: selectedBooking.totalAmount * 0.8, // 80% refund
        reason: cancellationReason,
      };

      await userService.cancelBooking(cancellationData);
      setSuccessMessage("Booking cancelled successfully. Refund request submitted.");
      setShowCancelModal(false);
      setCancellationReason("");
      loadMyBookings();
    } catch (err) {
      setError(err.message || "Failed to cancel booking");
      console.error("Error cancelling booking:", err);
    }
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case "Confirmed":
        return "success";
      case "Pending":
        return "warning";
      case "Cancelled":
        return "danger";
      case "Refunded":
        return "info";
      default:
        return "secondary";
    }
  };

  const canCancelBooking = (booking) => {
    return booking.status === "Confirmed";
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" />
        <p>Loading bookings...</p>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <h2>{role === "ADMIN" ? "All Bookings (Admin)" : "My Bookings"}</h2>

      {successMessage && (
        <Alert variant="success" className="mb-3" onClose={() => setSuccessMessage("")} dismissible>
          {successMessage}
        </Alert>
      )}

      {error && (
        <Alert variant="danger" className="mb-3" onClose={() => setError("")} dismissible>
          {error}
        </Alert>
      )}

      {/* Admin Search */}
      {role === "ADMIN" && (
        <Row className="mb-3">
          <Col md={4}>
            <Form.Control
              type="number"
              placeholder="Enter Booking ID"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
            />
          </Col>
          <Col>
            <Button onClick={handleSearchById}>Search</Button>
            <Button className="ms-2" variant="secondary" onClick={loadAllBookings}>
              Reset
            </Button>
          </Col>
        </Row>
      )}

      {/* USER Add booking */}
      {role === "USER" && (
        <Button className="mb-3" onClick={() => navigate("/buses/search")}>
          + Add Booking
        </Button>
      )}

      <Card>
        <Card.Header>
          <h5 className="mb-0">Booking History</h5>
        </Card.Header>
        <Card.Body>
          {bookings && bookings.length > 0 ? (
            <Table responsive striped bordered hover>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Route</th>
                  <th>Travel Date</th>
                  <th>Total Amount</th>
                  <th>Status</th>
                  {role === "USER" && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b.bookingId}>
                    <td>{b.bookingId}</td>
                    <td>{b.route?.origin} → {b.route?.destination}</td>
                    <td>{new Date(b.travelDate || b.bookingDate).toLocaleDateString()}</td>
                    <td>₹{b.totalAmount}</td>
                    <td>
                      <Badge bg={getStatusVariant(b.status)}>{b.status}</Badge>
                    </td>
                    {role === "USER" && (
                      <td>
                        {canCancelBooking(b) && (
                          <Button
                            size="sm"
                            variant="outline-danger"
                            onClick={() => handleCancelClick(b)}
                          >
                            Cancel
                          </Button>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <Alert variant="info">No bookings found.</Alert>
          )}
        </Card.Body>
      </Card>

      {/* Cancellation Modal */}
      <Modal show={showCancelModal} onHide={() => setShowCancelModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Cancel Booking</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedBooking && (
            <>
              <p>Are you sure you want to cancel your booking for:</p>
              <p>
                <strong>Route:</strong> {selectedBooking.route?.origin} → {selectedBooking.route?.destination}
              </p>
              <p>
                <strong>Travel Date:</strong> {new Date(selectedBooking.travelDate).toLocaleDateString()}
              </p>
              <p>
                <strong>Refund Amount:</strong> ₹{(selectedBooking.totalAmount * 0.8).toFixed(2)}
              </p>

              <Form.Group className="mb-3">
                <Form.Label>Reason for cancellation</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={cancellationReason}
                  onChange={(e) => setCancellationReason(e.target.value)}
                  placeholder="Please specify your reason for cancellation"
                />
              </Form.Group>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCancelModal(false)}>
            Close
          </Button>
          <Button variant="danger" onClick={confirmCancellation}>
            Confirm Cancellation
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}



// // src/pages/Bookings.js
// import React, { useEffect, useState } from "react";
// import { Table, Button, Container, Row, Col, Alert, Form } from "react-bootstrap";
// import { useNavigate } from "react-router-dom";
// import {
//   getMyBookings,
//   getAllBookings,
//   getBookingById,
//   deleteBooking,
// } from "../services/bookingService";

// export default function Bookings() {
//   const [bookings, setBookings] = useState([]);
//   const [role] = useState(localStorage.getItem("role"));
//   const [searchId, setSearchId] = useState("");
//   const [error, setError] = useState("");
//   const [successMessage, setSuccessMessage] = useState("");
//   const navigate = useNavigate();

//   // Fetch bookings based on role
//   useEffect(() => {
//     const shouldRefresh = localStorage.getItem('refreshBookings');
//     if (shouldRefresh === 'true') {
//       setSuccessMessage("Booking completed successfully!");
//       localStorage.removeItem('refreshBookings');
      
//       setTimeout(() => {
//         setSuccessMessage("");
//       }, 5000);
//     }

//     if (role === "ADMIN") {
//       loadAllBookings();
//     } else {
//       loadMyBookings();
//     }
//   }, [role]);

//   const loadMyBookings = async () => {
//     try {
//       const res = await getMyBookings();
//       setBookings(res.data);
//     } catch (err) {
//       console.error("Error loading bookings:", err);
//       setError("Failed to load bookings");
//     }
//   };

//   const loadAllBookings = async () => {
//     try {
//       const res = await getAllBookings();
//       setBookings(res.data);
//     } catch (err) {
//       console.error("Error loading all bookings:", err);
//       setError("Failed to load bookings");
//     }
//   };

//   const handleDelete = async (id) => {
//     await deleteBooking(id);
//     loadMyBookings();
//   };

//   const handleSearchById = async () => {
//     if (!searchId) return;
//     const res = await getBookingById(searchId);
//     setBookings(res.data ? [res.data] : []);
//   };

//   return (
//     <Container className="mt-4">
//       <h2>{role === "ADMIN" ? "All Bookings (Admin)" : "My Bookings"}</h2>

//       {successMessage && (
//         <Alert variant="success" className="mb-3">
//           {successMessage}
//         </Alert>
//       )}

//       {error && (
//         <Alert variant="danger" className="mb-3" onClose={() => setError("")} dismissible>
//           {error}
//         </Alert>
//       )}

//       {role === "ADMIN" && (
//         <Row className="mb-3">
//           <Col md={4}>
//             <Form.Control
//               type="number"
//               placeholder="Enter Booking ID"
//               value={searchId}
//               onChange={(e) => setSearchId(e.target.value)}
//             />
//           </Col>
//           <Col>
//             <Button onClick={handleSearchById}>Search</Button>
//             <Button className="ms-2" variant="secondary" onClick={loadAllBookings}>
//               Reset
//             </Button>
//           </Col>
//         </Row>
//       )}

//       {/* USER Add booking button navigates to /buses/search */}
//       {role === "USER" && (
//         <Button className="mb-3" onClick={() => navigate("/buses/search")}>
//           + Add Booking
//         </Button>
//       )}

//       <Table bordered hover responsive>
//         <thead>
//           <tr>
//             <th>ID</th>
//             <th>Route</th>
//             <th>Date</th>
//             <th>Total Amount</th>
//             <th>Status</th>
//             {role === "USER" && <th>Actions</th>}
//           </tr>
//         </thead>
//         <tbody>
//           {bookings.map((b) => (
//             <tr key={b.bookingId}>
//               <td>{b.bookingId}</td>
//               <td>{b.route?.origin} → {b.route?.destination}</td>
//               <td>{new Date(b.bookingDate).toLocaleDateString()}</td>
//               <td>₹{b.totalAmount}</td>
//               <td>{b.status}</td>
//               {role === "USER" && (
//                 <td>
//                   <Button size="sm" variant="danger" onClick={() => handleDelete(b.bookingId)}>
//                     Delete
//                   </Button>
//                 </td>
//               )}
//             </tr>
//           ))}
//         </tbody>
//       </Table>
//     </Container>
//   );
// }



// // src/pages/Bookings.js
// import React, { useEffect, useState } from "react";
// import { Table, Button, Modal, Form, Container, Row, Col, Alert } from "react-bootstrap";
// import {
//   getMyBookings,
//   addBooking,
//   updateBooking,
//   deleteBooking,
//   getAllBookings,
//   getBookingById,
// } from "../services/bookingService";

// export default function Bookings() {
//   const [bookings, setBookings] = useState([]);
//   const [showModal, setShowModal] = useState(false);
//   const [form, setForm] = useState({ bookingId: "", routeId: "", bookingDate: "", totalAmount: "", status: "Pending" });
//   const [role] = useState(localStorage.getItem("role")); // fixed: removed setRole
//   const [searchId, setSearchId] = useState("");
//   const [error, setError] = useState("");

//   // Fetch bookings based on role
//   useEffect(() => {
//     if (role === "ADMIN") {
//       loadAllBookings();
//     } else {
//       loadMyBookings();
//     }
//   }, [role]);

//   const loadMyBookings = async () => {
//     const res = await getMyBookings();
//     setBookings(res.data);
//   };

//   const loadAllBookings = async () => {
//     const res = await getAllBookings();
//     setBookings(res.data);
//   };

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   // ✅ Validation before submit
//   const validateForm = () => {
//     const today = new Date().toISOString().split("T")[0];

//     if (!form.routeId || form.routeId <= 0) {
//       return "Route ID must be greater than 0.";
//     }
//     if (!form.bookingDate || form.bookingDate <= today) {
//       return "Booking date must be in the future.";
//     }
//     if (!form.totalAmount || form.totalAmount <= 0) {
//       return "Total amount must be greater than 0.";
//     }
//     if (!["Confirmed", "Cancelled", "Pending"].includes(form.status)) {
//       return "Invalid status selected.";
//     }
//     return null;
//   };

//   const handleSubmit = async () => {
//     const validationError = validateForm();
//     if (validationError) {
//       setError(validationError);
//       return;
//     }

//     try {
//       if (form.bookingId) {
//         await updateBooking(form);
//       } else {
//         await addBooking(form);
//       }
//       setShowModal(false);
//       setError("");
//       role === "ADMIN" ? loadAllBookings() : loadMyBookings();
//     } catch (err) {
//       console.error(err);
//       setError("Error while saving booking");
//     }
//   };

//   const handleDelete = async (id) => {
//     await deleteBooking(id);
//     loadMyBookings();
//   };

//   const handleSearchById = async () => {
//     if (!searchId) return;
//     const res = await getBookingById(searchId);
//     setBookings(res.data ? [res.data] : []);
//   };

//   return (
//     <Container className="mt-4">
//       <h2>{role === "ADMIN" ? "All Bookings (Admin)" : "My Bookings"}</h2>

//       {/* ADMIN Search by Booking ID */}
//       {role === "ADMIN" && (
//         <Row className="mb-3">
//           <Col md={4}>
//             <Form.Control
//               type="number"
//               placeholder="Enter Booking ID"
//               value={searchId}
//               onChange={(e) => setSearchId(e.target.value)}
//             />
//           </Col>
//           <Col>
//             <Button onClick={handleSearchById}>Search</Button>
//             <Button className="ms-2" variant="secondary" onClick={loadAllBookings}>
//               Reset
//             </Button>
//           </Col>
//         </Row>
//       )}

//       {/* USER Add booking button */}
//       {role === "USER" && (
//         <Button className="mb-3" onClick={() => { setForm({}); setShowModal(true); }}>
//           + Add Booking
//         </Button>
//       )}

//       {/* Table */}
//       <Table bordered hover responsive>
//         <thead>
//           <tr>
//             <th>ID</th>
//             <th>Route</th>
//             <th>Date</th>
//             <th>Total Amount</th>
//             <th>Status</th>
//             {role === "USER" && <th>Actions</th>}
//           </tr>
//         </thead>
//         <tbody>
//           {bookings.map((b) => (
//             <tr key={b.bookingId}>
//               <td>{b.bookingId}</td>
//               <td>{b.route?.origin} → {b.route?.destination}</td>
//               <td>{new Date(b.bookingDate).toLocaleDateString()}</td>
//               <td>₹{b.totalAmount}</td>
//               <td>{b.status}</td>
//               {role === "USER" && (
//                 <td>
//                   <Button size="sm" variant="info" onClick={() => { setForm(b); setShowModal(true); }}>
//                     Edit
//                   </Button>{" "}
//                   <Button size="sm" variant="danger" onClick={() => handleDelete(b.bookingId)}>
//                     Delete
//                   </Button>
//                 </td>
//               )}
//             </tr>
//           ))}
//         </tbody>
//       </Table>

//       {/* Modal for Add/Edit */}
//       <Modal show={showModal} onHide={() => setShowModal(false)}>
//         <Modal.Header closeButton>
//           <Modal.Title>{form.bookingId ? "Update Booking" : "Add Booking"}</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           {error && <Alert variant="danger">{error}</Alert>}
//           <Form>
//             <Form.Group className="mb-2">
//               <Form.Label>Route ID</Form.Label>
//               <Form.Control type="number" name="routeId" value={form.routeId || ""} onChange={handleChange} required />
//             </Form.Group>
//             <Form.Group className="mb-2">
//               <Form.Label>Booking Date</Form.Label>
//               <Form.Control type="date" name="bookingDate" value={form.bookingDate?.substring(0,10) || ""} onChange={handleChange} required />
//             </Form.Group>
//             <Form.Group className="mb-2">
//               <Form.Label>Total Amount</Form.Label>
//               <Form.Control type="number" name="totalAmount" value={form.totalAmount || ""} onChange={handleChange} required />
//             </Form.Group>
//             <Form.Group>
//               <Form.Label>Status</Form.Label>
//               <Form.Select name="status" value={form.status || "Pending"} onChange={handleChange}>
//                 <option>Confirmed</option>
//                 <option>Cancelled</option>
//                 <option>Pending</option>
//               </Form.Select>
//             </Form.Group>
//           </Form>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button onClick={handleSubmit}>{form.bookingId ? "Update" : "Add"}</Button>
//         </Modal.Footer>
//       </Modal>
//     </Container>
//   );
// }

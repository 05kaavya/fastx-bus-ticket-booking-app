import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Alert, Spinner, Badge } from 'react-bootstrap';
import { adminService } from '../../services/adminService';

const ManageBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const response = await adminService.getAllBookings();
      
      if (Array.isArray(response)) {
        setBookings(response);
      } else if (Array.isArray(response.data)) {
        setBookings(response.data);
      } else {
        console.warn('Unexpected bookings response structure:', response);
        setBookings([]);
      }
      
    } catch (err) {
      setError(err.message || 'Failed to load bookings');
      console.error('Error loading bookings:', err);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this booking?')) {
      try {
        await adminService.deleteBooking(id);
        setSuccess('Booking deleted successfully');
        loadBookings();
      } catch (err) {
        setError(err.message || 'Failed to delete booking');
        console.error('Error deleting booking:', err);
      }
    }
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case 'Confirmed': return 'success';
      case 'Pending': return 'warning';
      case 'Cancelled': return 'danger';
      case 'Refunded': return 'info';
      default: return 'secondary';
    }
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
      <Row className="mb-4">
        <Col>
          <h2>Manage Bookings</h2>
        </Col>
      </Row>

      {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}
      {success && <Alert variant="success" onClose={() => setSuccess('')} dismissible>{success}</Alert>}

      <Row>
        <Col>
          <Card>
            <Card.Header>
              <h5 className="mb-0">All Bookings</h5>
            </Card.Header>
            <Card.Body>
              {bookings && bookings.length > 0 ? (
                <Table responsive striped>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>User</th>
                      <th>Route</th>
                      <th>Booking Date</th>
                      <th>Travel Date</th>
                      <th>Total Amount</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((booking) => (
                      <tr key={booking.bookingId}>
                        <td>{booking.bookingId}</td>
                        <td>{booking.user?.name || 'N/A'} ({booking.user?.userId || 'N/A'})</td>
                        <td>
                          {booking.route?.origin || 'N/A'} → {booking.route?.destination || 'N/A'}
                        </td>
                        <td>{new Date(booking.bookingDate).toLocaleString()}</td>
                        <td>{new Date(booking.travelDate).toLocaleDateString()}</td>
                        <td>₹{booking.totalAmount}</td>
                        <td>
                          <Badge bg={getStatusVariant(booking.status)}>
                            {booking.status}
                          </Badge>
                        </td>
                        <td>
                          <Button 
                            variant="outline-danger" 
                            size="sm" 
                            onClick={() => handleDelete(booking.bookingId)}
                            className="me-2"
                          >
                            Delete
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <Alert variant="info">
                  No bookings found.
                </Alert>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ManageBookings;


// import React, { useState, useEffect } from 'react';
// import { Container, Row, Col, Card, Button, Table, Alert, Spinner, Badge } from 'react-bootstrap';
// import { adminService } from '../../services/adminService';

// const ManageBookings = () => {
//   const [bookings, setBookings] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');

//   useEffect(() => {
//     loadBookings();
//   }, []);

//   const loadBookings = async () => {
//     try {
//       const response = await adminService.getAllBookings();
      
//       // Debug: Check what the API actually returns
//       console.log('Bookings API response:', response);
      
//       // The response IS the array, not wrapped in .data!
//       if (Array.isArray(response)) {
//         setBookings(response);
//       } else if (Array.isArray(response.data)) {
//         // Fallback: if somehow it's wrapped in .data
//         setBookings(response.data);
//       } else {
//         console.warn('Unexpected bookings response structure:', response);
//         setBookings([]);
//       }
      
//     } catch (err) {
//       setError('Failed to load bookings');
//       console.error('Error loading bookings:', err);
//       setBookings([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDelete = async (id) => {
//     if (window.confirm('Are you sure you want to delete this booking?')) {
//       try {
//         await adminService.deleteBooking(id);
//         setSuccess('Booking deleted successfully');
//         loadBookings();
//       } catch (err) {
//         setError('Failed to delete booking');
//         console.error('Error deleting booking:', err);
//       }
//     }
//   };

//   const getStatusVariant = (status) => {
//     switch (status) {
//       case 'Confirmed': return 'success';
//       case 'Pending': return 'warning';
//       case 'Cancelled': return 'danger';
//       default: return 'secondary';
//     }
//   };

//   if (loading) {
//     return (
//       <Container className="text-center mt-5">
//         <Spinner animation="border" />
//         <p>Loading bookings...</p>
//       </Container>
//     );
//   }

//   return (
//     <Container className="mt-4">
//       <Row className="mb-4">
//         <Col>
//           <h2>Manage Bookings</h2>
//         </Col>
//       </Row>

//       {error && <Alert variant="danger">{error}</Alert>}
//       {success && <Alert variant="success">{success}</Alert>}

//       <Row>
//         <Col>
//           <Card>
//             <Card.Header>
//               <h5 className="mb-0">All Bookings</h5>
//             </Card.Header>
//             <Card.Body>
//               {bookings.length > 0 ? (
//                 <Table responsive striped>
//                   <thead>
//                     <tr>
//                       <th>ID</th>
//                       <th>User</th>
//                       <th>Route</th>
//                       <th>Booking Date</th>
//                       <th>Total Amount</th>
//                       <th>Status</th>
//                       <th>Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {bookings.map((booking) => (
//                       <tr key={booking.bookingId}>
//                         <td>{booking.bookingId}</td>
//                         <td>{booking.user?.name || 'N/A'} ({booking.user?.userId || 'N/A'})</td>
//                         <td>
//                           {booking.route?.origin || 'N/A'} → {booking.route?.destination || 'N/A'}
//                         </td>
//                         <td>{new Date(booking.bookingDate).toLocaleString()}</td>
//                         <td>₹{booking.totalAmount}</td>
//                         <td>
//                           <Badge bg={getStatusVariant(booking.status)}>
//                             {booking.status}
//                           </Badge>
//                         </td>
//                         <td>
//                           <Button variant="outline-danger" size="sm" onClick={() => handleDelete(booking.bookingId)}>
//                             Delete
//                           </Button>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </Table>
//               ) : (
//                 <Alert variant="info">
//                   No bookings found.
//                 </Alert>
//               )}
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>
//     </Container>
//   );
// };

// export default ManageBookings;
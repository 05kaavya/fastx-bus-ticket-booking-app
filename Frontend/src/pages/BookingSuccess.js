// src/pages/BookingSuccess.js
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import jsPDF from 'jspdf';

const BookingSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    booking,
    payment,
    bus,
    route,
    date,
    selectedSeats,
    passengerEmail
  } = location.state || {};

  // ✅ Redirect if accessed without booking data
  useEffect(() => {
    if (!booking) {
      navigate('/');
    }
  }, [booking, navigate]);

  if (!booking) return null;

  // ✅ Generate & download PDF ticket
  const handleDownloadTicket = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("🎟️ FastX E-Ticket", 20, 20);

    doc.setFontSize(12);
    doc.text(`Booking ID: ${booking.bookingId}`, 20, 40);
    doc.text(`Payment ID: ${payment?.paymentId || "N/A"}`, 20, 50);
    doc.text(`Passenger Email: ${passengerEmail}`, 20, 60);
    doc.text(`Bus: ${bus?.busName || "N/A"}`, 20, 70);
    doc.text(`Route: ${route?.origin} → ${route?.destination}`, 20, 80);
    doc.text(`Travel Date: ${new Date(date).toLocaleDateString()}`, 20, 90);
    doc.text(`Departure: ${route?.departureTime ? new Date(route.departureTime).toLocaleTimeString() : "N/A"}`, 20, 100);
    doc.text(`Arrival: ${route?.arrivalTime ? new Date(route.arrivalTime).toLocaleTimeString() : "N/A"}`, 20, 110);
    doc.text(`Seats: ${selectedSeats?.map(s => s.seatNumber).join(", ")}`, 20, 120);
    doc.text(`Passengers: ${selectedSeats?.length}`, 20, 130);
    doc.text(`Total Paid: ₹${booking.totalAmount || payment?.amountPaid}`, 20, 140);
    doc.text(`Payment Status: ${payment?.paymentStatus || "N/A"}`, 20, 150);

    doc.save(`FastX_Ticket_${booking.bookingId}.pdf`);
  };

  const handlePrintTicket = () => {
    window.print();
  };

  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col md={10}>
          {/* Success Alert */}
          <Alert variant="success" className="text-center">
            <h2>🎉 Booking Confirmed!</h2>
            <p className="mb-0">
              Your booking has been confirmed. A confirmation email has been sent
              to <strong>{passengerEmail}</strong>.
            </p>
          </Alert>

          {/* Ticket Details */}
          <Card className="mb-4 shadow-sm">
            <Card.Header className="bg-primary text-white">
              <h4 className="mb-0">E-Ticket</h4>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <h5>Journey Details</h5>
                  <p><strong>Booking ID:</strong> {booking.bookingId}</p>
                  <p><strong>Payment ID:</strong> {payment?.paymentId || "N/A"}</p>
                  <p><strong>Bus:</strong> {bus?.busName}</p>
                  <p><strong>Route:</strong> {route?.origin} → {route?.destination}</p>
                  <p><strong>Travel Date:</strong> {new Date(date).toLocaleDateString()}</p>
                  <p><strong>Departure:</strong> {route?.departureTime ? new Date(route.departureTime).toLocaleTimeString() : "N/A"}</p>
                  <p><strong>Arrival:</strong> {route?.arrivalTime ? new Date(route.arrivalTime).toLocaleTimeString() : "N/A"}</p>
                </Col>
                <Col md={6}>
                  <h5>Passenger Details</h5>
                  <p><strong>Email:</strong> {passengerEmail}</p>
                  <p><strong>Seats:</strong> {selectedSeats?.map(s => s.seatNumber).join(", ")}</p>
                  <p><strong>Passengers:</strong> {selectedSeats?.length}</p>
                  <p><strong>Total Amount:</strong> ₹{booking.totalAmount || payment?.amountPaid}</p>
                  <p><strong>Payment Status:</strong> ✅ {payment?.paymentStatus || "N/A"}</p>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* Action Buttons */}
          <div className="text-center">
            <Button className="me-3" variant="primary" size="lg" onClick={handleDownloadTicket}>
              Download Ticket
            </Button>
            <Button className="me-3" variant="outline-primary" size="lg" onClick={handlePrintTicket}>
              Print Ticket
            </Button>
            
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default BookingSuccess;




// // src/pages/BookingSuccess.js
// import React from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
// import jsPDF from 'jspdf';

// const BookingSuccess = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const {
//     booking,
//     payment,
//     bus,
//     route,
//     date,
//     selectedSeats,
//     passengerEmail
//   } = location.state || {};

//   if (!booking) {
//     navigate('/');
//     return null;
//   }

//   // ✅ Generate & download PDF ticket
//   const handleDownloadTicket = () => {
//     const doc = new jsPDF();

//     doc.setFontSize(18);
//     doc.text("🎟️ FastX E-Ticket", 20, 20);

//     doc.setFontSize(12);
//     doc.text(`Booking ID: ${booking.bookingId}`, 20, 40);
//     doc.text(`Payment ID: ${payment?.paymentId || "N/A"}`, 20, 50);
//     doc.text(`Passenger Email: ${passengerEmail}`, 20, 60);
//     doc.text(`Bus: ${bus.busName}`, 20, 70);
//     doc.text(`Route: ${route.origin} → ${route.destination}`, 20, 80);
//     doc.text(`Travel Date: ${new Date(date).toLocaleDateString()}`, 20, 90);
//     doc.text(`Seats: ${selectedSeats.map(s => s.seatNumber).join(", ")}`, 20, 100);
//     doc.text(`Passengers: ${selectedSeats.length}`, 20, 110);
//     doc.text(`Total Paid: ₹${booking.totalAmount || payment.amountPaid}`, 20, 120);
//     doc.text(`Payment Status: ${payment?.paymentStatus || "N/A"}`, 20, 130);

//     doc.save(`FastX_Ticket_${booking.bookingId}.pdf`);
//   };

//   const handlePrintTicket = () => {
//     window.print();
//   };

//   return (
//     <Container className="my-5">
//       <Row className="justify-content-center">
//         <Col md={10}>
//           {/* Success Alert */}
//           <Alert variant="success" className="text-center">
//             <h2>🎉 Booking Confirmed!</h2>
//             <p className="mb-0">
//               Your booking has been confirmed. A confirmation email has been sent
//               to {passengerEmail}.
//             </p>
//           </Alert>

//           {/* Ticket Details */}
//           <Card className="mb-4">
//             <Card.Header className="bg-primary text-white">
//               <h4 className="mb-0">E-Ticket</h4>
//             </Card.Header>
//             <Card.Body>
//               <Row>
//                 <Col md={6}>
//                   <h5>Journey Details</h5>
//                   <p><strong>Booking ID:</strong> {booking.bookingId}</p>
//                   <p><strong>Payment ID:</strong> {payment?.paymentId || "N/A"}</p>
//                   <p><strong>Bus:</strong> {bus.busName}</p>
//                   <p><strong>Route:</strong> {route.origin} → {route.destination}</p>
//                   <p><strong>Travel Date:</strong> {new Date(date).toLocaleDateString()}</p>
//                   <p><strong>Departure:</strong> {new Date(route.departureTime).toLocaleTimeString()}</p>
//                   <p><strong>Arrival:</strong> {new Date(route.arrivalTime).toLocaleTimeString()}</p>
//                 </Col>
//                 <Col md={6}>
//                   <h5>Passenger Details</h5>
//                   <p><strong>Email:</strong> {passengerEmail}</p>
//                   <p><strong>Seats:</strong> {selectedSeats.map(s => s.seatNumber).join(", ")}</p>
//                   <p><strong>Passengers:</strong> {selectedSeats.length}</p>
//                   <p><strong>Total Amount:</strong> ₹{booking.totalAmount || payment.amountPaid}</p>
//                   <p><strong>Payment Status:</strong> ✅ {payment?.paymentStatus || "N/A"}</p>
//                 </Col>
//               </Row>
//             </Card.Body>
//           </Card>

//           {/* Action Buttons */}
//           <div className="text-center">
//             <Button className="me-3" variant="primary" size="lg" onClick={handleDownloadTicket}>
//               Download Ticket
//             </Button>
//             <Button className="me-3" variant="outline-primary" size="lg" onClick={handlePrintTicket}>
//               Print Ticket
//             </Button>
//             <Button className="me-3" variant="danger" size="lg" onClick={() => navigate('/cancel-booking')}>
//               Cancel Booking
//             </Button>
//             <Button variant="success" size="lg" onClick={() => navigate('/buses')}>
//               Book Another Ticket
//             </Button>
//           </div>
//         </Col>
//       </Row>
//     </Container>
//   );
// };

// export default BookingSuccess;


// // src/pages/BookingSuccess.js
// import React from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';

// const BookingSuccess = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { 
//     booking, 
//     payment, 
//     bus, 
//     route, 
//     date, 
//     selectedSeats, 
//     passengerEmail 
//   } = location.state || {};

//   // If no booking data, redirect to home
//   if (!booking) {
//     navigate('/');
//     return null;
//   }

//   const handleDownloadTicket = () => {
//     // This would typically generate a PDF in a real application
//     alert('Ticket download functionality would be implemented here!');
//   };

//   const handlePrintTicket = () => {
//     window.print();
//   };

//   return (
//     <Container className="my-5">
//       <Row className="justify-content-center">
//         <Col md={10}>
//           {/* Success Alert */}
//           <Alert variant="success" className="text-center">
//             <h2>🎉 Booking Confirmed!</h2>
//             <p className="mb-0">Your booking has been successfully confirmed. A confirmation email has been sent to {passengerEmail}.</p>
//           </Alert>

//           {/* Ticket Details */}
//           <Card className="mb-4">
//             <Card.Header className="bg-primary text-white">
//               <h4 className="mb-0">E-Ticket</h4>
//             </Card.Header>
//             <Card.Body>
//               <Row>
//                 <Col md={6}>
//                   <h5>Journey Details</h5>
//                   <p><strong>Booking ID:</strong> {booking.bookingId || 'N/A'}</p>
//                   <p><strong>Bus Name:</strong> {bus.busName}</p>
//                   <p><strong>Route:</strong> {route.origin} to {route.destination}</p>
//                   <p><strong>Travel Date:</strong> {new Date(date).toLocaleDateString()}</p>
//                   <p><strong>Departure:</strong> {new Date(route.departureTime).toLocaleTimeString()}</p>
//                   <p><strong>Arrival:</strong> {new Date(route.arrivalTime).toLocaleTimeString()}</p>
//                 </Col>
                
//                 <Col md={6}>
//                   <h5>Passenger Details</h5>
//                   <p><strong>Passenger Email:</strong> {passengerEmail}</p>
//                   <p><strong>Seats:</strong> {selectedSeats.map(s => s.seatNumber).join(', ')}</p>
//                   <p><strong>Total Passengers:</strong> {selectedSeats.length}</p>
//                   <p><strong>Total Amount:</strong> ₹{booking?.totalAmount || payment?.amountPaid || 'N/A'}</p>
// <p><strong>Payment Status:</strong> 
//   <span className="text-success">
//     {payment?.paymentStatus || 'Confirmed'}
//   </span>
// </p>
// <p><strong>Payment ID:</strong> {payment?.paymentId || 'N/A'}</p>

//                 </Col>
//               </Row>

//               <hr />
              
//               <div className="bg-light p-3 rounded">
//                 <h6>Important Instructions:</h6>
//                 <ul className="mb-0">
//                   <li>Please arrive at the boarding point at least 30 minutes before departure</li>
//                   <li>Carry a valid ID proof for verification</li>
//                   <li>Show this e-ticket or booking ID during boarding</li>
//                   <li>For cancellations, please refer to our cancellation policy</li>
//                 </ul>
//               </div>
//             </Card.Body>
//           </Card>

//           {/* Action Buttons */}
//           <div className="text-center">
//             <Button 
//               variant="primary" 
//               size="lg" 
//               className="me-3"
//               onClick={handleDownloadTicket}
//             >
//               Download Ticket
//             </Button>
//             <Button 
//               variant="outline-primary" 
//               size="lg" 
//               className="me-3"
//               onClick={handlePrintTicket}
//             >
//               Print Ticket
//             </Button>
//             <Button 
//               variant="success" 
//               size="lg"
//               onClick={() => navigate('/buses')}
//             >
//               Book Another Ticket
//             </Button>
//           </div>

//           {/* Support Information */}
//           <Card className="mt-4">
//             <Card.Header>
//               <h6 className="mb-0">Need Help?</h6>
//             </Card.Header>
//             <Card.Body>
//               <p className="mb-1">Customer Support: +91-XXXXX-XXXXX</p>
//               <p className="mb-1">Email: support@fastx.com</p>
//               <p className="mb-0">Office Hours: 8:00 AM - 10:00 PM (IST)</p>
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>
//     </Container>
//   );
// };

// export default BookingSuccess;
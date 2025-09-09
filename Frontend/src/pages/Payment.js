
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Alert, Form, Spinner, Modal } from 'react-bootstrap';
import bookingService from '../services/bookingServiceEnhanced';
import paymentService from '../services/paymentServiceEnhanced';

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { bus, route, date, selectedSeats, totalAmount } = location.state || {};
  
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showCancelModal, setShowCancelModal] = useState(false);
  
  // Form state with validation
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: '',
    email: ''
  });

  const [formErrors, setFormErrors] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: '',
    email: ''
  });

  useEffect(() => {
    if (!bus || !route || !selectedSeats || selectedSeats.length === 0) {
      navigate('/buses');
      return;
    }
  }, [bus, route, selectedSeats, navigate]);

  // Validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateCardNumber = (cardNumber) => {
    const cleanedNumber = cardNumber.replace(/\s/g, '');
    return cleanedNumber.length === 16 && /^\d+$/.test(cleanedNumber);
  };

  const validateExpiryDate = (expiryDate) => {
    const regex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
    if (!regex.test(expiryDate)) return false;
    
    const [month, year] = expiryDate.split('/');
    const now = new Date();
    const currentYear = now.getFullYear() % 100;
    const currentMonth = now.getMonth() + 1;
    
    if (parseInt(year) < currentYear) return false;
    if (parseInt(year) === currentYear && parseInt(month) < currentMonth) return false;
    
    return true;
  };

  const validateCVV = (cvv) => {
    return cvv.length >= 3 && cvv.length <= 4 && /^\d+$/.test(cvv);
  };

  const validateForm = () => {
    const errors = {
      cardNumber: '',
      cardHolder: '',
      expiryDate: '',
      cvv: '',
      email: ''
    };

    let isValid = true;

    // Validate email
    if (!formData.email) {
      errors.email = 'Email is required';
      isValid = false;
    } else if (!validateEmail(formData.email)) {
      errors.email = 'Please enter a valid email address';
      isValid = false;
    }

    // Validate card number
    if (!formData.cardNumber) {
      errors.cardNumber = 'Card number is required';
      isValid = false;
    } else if (!validateCardNumber(formData.cardNumber)) {
      errors.cardNumber = 'Please enter a valid 16-digit card number';
      isValid = false;
    }

    // Validate card holder
    if (!formData.cardHolder) {
      errors.cardHolder = 'Card holder name is required';
      isValid = false;
    } else if (formData.cardHolder.length < 3) {
      errors.cardHolder = 'Card holder name must be at least 3 characters';
      isValid = false;
    }

    // Validate expiry date
    if (!formData.expiryDate) {
      errors.expiryDate = 'Expiry date is required';
      isValid = false;
    } else if (!validateExpiryDate(formData.expiryDate)) {
      errors.expiryDate = 'Please enter a valid expiry date (MM/YY)';
      isValid = false;
    }

    // Validate CVV
    if (!formData.cvv) {
      errors.cvv = 'CVV is required';
      isValid = false;
    } else if (!validateCVV(formData.cvv)) {
      errors.cvv = 'Please enter a valid CVV (3-4 digits)';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Format card number with spaces
    if (name === 'cardNumber') {
      const formattedValue = value
        .replace(/\D/g, '')
        .replace(/(\d{4})/g, '$1 ')
        .trim()
        .slice(0, 19);
      setFormData({
        ...formData,
        [name]: formattedValue
      });
      return;
    }
    
    // Format expiry date
    if (name === 'expiryDate') {
      const formattedValue = value
        .replace(/\D/g, '')
        .replace(/(\d{2})(\d)/, '$1/$2')
        .slice(0, 5);
      setFormData({
        ...formData,
        [name]: formattedValue
      });
      return;
    }
    
    // Format CVV (numbers only)
    if (name === 'cvv') {
      const formattedValue = value.replace(/\D/g, '').slice(0, 4);
      setFormData({
        ...formData,
        [name]: formattedValue
      });
      return;
    }
    
    setFormData({
      ...formData,
      [name]: value
    });

    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
  };

  const createBookingAfterPayment = async () => {
    try {
      // Get user ID from authentication
      const userId = localStorage.getItem('userId') || 1;
      
      const bookingDto = {
        userId: parseInt(userId),
        routeId: route.routeId,
        bookingDate: new Date(),
        totalAmount: totalAmount,
        status: 'Confirmed', // Set to Confirmed directly since payment is done
        seatNumbers: selectedSeats.map(seat => seat.seatNumber),
        passengerCount: selectedSeats.length,
        travelDate: date // Add travel date
      };
      
      console.log('Creating booking after payment:', bookingDto);
      
      const newBooking = await bookingService.addBookingWithErrorHandling(bookingDto);
      return newBooking;
    } catch (err) {
      console.error('Error creating booking after payment:', err);
      throw new Error('Failed to create booking after payment: ' + err.message);
    }
  };

  const handlePayment = async () => {
  if (!validateForm()) {
    setError('Please fix the validation errors before proceeding');
    return;
  }

  setProcessing(true);
  setError('');

  try {
    // Booking DTO
    const userId = localStorage.getItem("userId") || 1;
    const bookingDto = {
      userId: parseInt(userId),
      routeId: route.routeId,
      bookingDate: new Date(),
      totalAmount: totalAmount,
      status: 'Confirmed',
      seatNumbers: selectedSeats.map(seat => seat.seatNumber),
      passengerCount: selectedSeats.length,
      travelDate: date
    };

    // Payment DTO
    const paymentDto = {
      amountPaid: totalAmount,
      paymentDate: new Date(),
      paymentStatus: "Success",
      paymentMethod: "Credit Card"
    };

    // Combined payload (what backend expects)
    const bookingPaymentDto = {
      booking: bookingDto,
      payment: paymentDto
    };

    console.log("Processing payment with data:", bookingPaymentDto);

    const paymentResult = await paymentService.processPaymentWithErrorHandling(bookingPaymentDto);

    setSuccess("Payment successful! Your tickets have been booked.");

    setTimeout(() => {
      navigate("/booking-success", {
        state: {
          booking: paymentResult.booking,
          payment: paymentResult.payment,
          bus,
          route,
          date,
          selectedSeats,
          passengerEmail: formData.email
        }
      });
    }, 2000);

  } catch (err) {
    setError("Payment processing failed: " + err.message);
    console.error("Payment error:", err);
  } finally {
    setProcessing(false);
  }
};


  const handleCancel = () => {
    // Just navigate back without creating any booking
    navigate('/buses');
  };

  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <h2 className="mb-4">Complete Your Payment</h2>
          
          {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}
          {success && <Alert variant="success" dismissible onClose={() => setSuccess('')}>{success}</Alert>}
          
          <Card className="mb-4">
            <Card.Header>
              <h5 className="mb-0">Booking Summary</h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <p><strong>Bus:</strong> {bus.busName}</p>
                  <p><strong>Route:</strong> {route.origin} to {route.destination}</p>
                  <p><strong>Date:</strong> {new Date(date).toLocaleDateString()}</p>
                </Col>
                <Col md={6}>
                  <p><strong>Departure:</strong> {new Date(route.departureTime).toLocaleTimeString()}</p>
                  <p><strong>Arrival:</strong> {new Date(route.arrivalTime).toLocaleTimeString()}</p>
                  <p><strong>Seats:</strong> {selectedSeats.map(s => s.seatNumber).join(', ')}</p>
                </Col>
              </Row>
              <hr />
              <h4 className="text-end">Total Amount: ₹{totalAmount}</h4>
            </Card.Body>
          </Card>

          <Card>
            <Card.Header>
              <h5 className="mb-0">Payment Details</h5>
            </Card.Header>
            <Card.Body>
              <Form>
                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Email Address</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Enter email for ticket"
                        required
                        isInvalid={!!formErrors.email}
                      />
                      <Form.Control.Feedback type="invalid">
                        {formErrors.email}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>
                
                <h6 className="mb-3">Card Information</h6>
                
                <Row className="mb-3">
                  <Col md={12}>
                    <Form.Group>
                      <Form.Label>Card Number</Form.Label>
                      <Form.Control
                        type="text"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleInputChange}
                        placeholder="1234 5678 9012 3456"
                        maxLength="19"
                        required
                        isInvalid={!!formErrors.cardNumber}
                      />
                      <Form.Control.Feedback type="invalid">
                        {formErrors.cardNumber}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>
                
                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Card Holder Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="cardHolder"
                        value={formData.cardHolder}
                        onChange={handleInputChange}
                        placeholder="John Doe"
                        required
                        isInvalid={!!formErrors.cardHolder}
                      />
                      <Form.Control.Feedback type="invalid">
                        {formErrors.cardHolder}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group>
                      <Form.Label>Expiry Date</Form.Label>
                      <Form.Control
                        type="text"
                        name="expiryDate"
                        value={formData.expiryDate}
                        onChange={handleInputChange}
                        placeholder="MM/YY"
                        maxLength="5"
                        required
                        isInvalid={!!formErrors.expiryDate}
                      />
                      <Form.Control.Feedback type="invalid">
                        {formErrors.expiryDate}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group>
                      <Form.Label>CVV</Form.Label>
                      <Form.Control
                        type="text"
                        name="cvv"
                        value={formData.cvv}
                        onChange={handleInputChange}
                        placeholder="123"
                        maxLength="4"
                        required
                        isInvalid={!!formErrors.cvv}
                      />
                      <Form.Control.Feedback type="invalid">
                        {formErrors.cvv}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>
                
                <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                  <Button 
                    variant="outline-danger" 
                    onClick={() => setShowCancelModal(true)}
                    disabled={processing || success}
                  >
                    Cancel Booking
                  </Button>
                  <Button 
                    variant="primary" 
                    onClick={handlePayment}
                    disabled={processing || success}
                  >
                    {processing ? (
                      <>
                        <Spinner animation="border" size="sm" /> Processing...
                      </>
                    ) : (
                      `Pay ₹${totalAmount}`
                    )}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Cancel Confirmation Modal */}
      <Modal show={showCancelModal} onHide={() => setShowCancelModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Cancellation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to cancel this booking? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCancelModal(false)}>
            Go Back
          </Button>
          <Button variant="danger" onClick={handleCancel}>
            Yes, Cancel Booking
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Payment;





// import React, { useState, useEffect } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import { Container, Row, Col, Card, Button, Alert, Form, Spinner, Modal } from 'react-bootstrap';
// import bookingService from '../services/bookingServiceEnhanced';
// import paymentService from '../services/paymentServiceEnhanced';

// const Payment = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { bus, route, date, selectedSeats, totalAmount } = location.state || {};
  
//   const [processing, setProcessing] = useState(false);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const [showCancelModal, setShowCancelModal] = useState(false);
  
//   // Form state with validation
//   const [formData, setFormData] = useState({
//     cardNumber: '',
//     cardHolder: '',
//     expiryDate: '',
//     cvv: '',
//     email: ''
//   });

//   const [formErrors, setFormErrors] = useState({
//     cardNumber: '',
//     cardHolder: '',
//     expiryDate: '',
//     cvv: '',
//     email: ''
//   });

//   useEffect(() => {
//     if (!bus || !route || !selectedSeats || selectedSeats.length === 0) {
//       navigate('/buses');
//       return;
//     }
//   }, [bus, route, selectedSeats, navigate]);

//   // Validation functions
//   const validateEmail = (email) => {
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     return emailRegex.test(email);
//   };

//   const validateCardNumber = (cardNumber) => {
//     const cleanedNumber = cardNumber.replace(/\s/g, '');
//     return cleanedNumber.length === 16 && /^\d+$/.test(cleanedNumber);
//   };

//   const validateExpiryDate = (expiryDate) => {
//     const regex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
//     if (!regex.test(expiryDate)) return false;
    
//     const [month, year] = expiryDate.split('/');
//     const now = new Date();
//     const currentYear = now.getFullYear() % 100;
//     const currentMonth = now.getMonth() + 1;
    
//     if (parseInt(year) < currentYear) return false;
//     if (parseInt(year) === currentYear && parseInt(month) < currentMonth) return false;
    
//     return true;
//   };

//   const validateCVV = (cvv) => {
//     return cvv.length >= 3 && cvv.length <= 4 && /^\d+$/.test(cvv);
//   };

//   const validateForm = () => {
//     const errors = {
//       cardNumber: '',
//       cardHolder: '',
//       expiryDate: '',
//       cvv: '',
//       email: ''
//     };

//     let isValid = true;

//     // Validate email
//     if (!formData.email) {
//       errors.email = 'Email is required';
//       isValid = false;
//     } else if (!validateEmail(formData.email)) {
//       errors.email = 'Please enter a valid email address';
//       isValid = false;
//     }

//     // Validate card number
//     if (!formData.cardNumber) {
//       errors.cardNumber = 'Card number is required';
//       isValid = false;
//     } else if (!validateCardNumber(formData.cardNumber)) {
//       errors.cardNumber = 'Please enter a valid 16-digit card number';
//       isValid = false;
//     }

//     // Validate card holder
//     if (!formData.cardHolder) {
//       errors.cardHolder = 'Card holder name is required';
//       isValid = false;
//     } else if (formData.cardHolder.length < 3) {
//       errors.cardHolder = 'Card holder name must be at least 3 characters';
//       isValid = false;
//     }

//     // Validate expiry date
//     if (!formData.expiryDate) {
//       errors.expiryDate = 'Expiry date is required';
//       isValid = false;
//     } else if (!validateExpiryDate(formData.expiryDate)) {
//       errors.expiryDate = 'Please enter a valid expiry date (MM/YY)';
//       isValid = false;
//     }

//     // Validate CVV
//     if (!formData.cvv) {
//       errors.cvv = 'CVV is required';
//       isValid = false;
//     } else if (!validateCVV(formData.cvv)) {
//       errors.cvv = 'Please enter a valid CVV (3-4 digits)';
//       isValid = false;
//     }

//     setFormErrors(errors);
//     return isValid;
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
    
//     // Format card number with spaces
//     if (name === 'cardNumber') {
//       const formattedValue = value
//         .replace(/\D/g, '')
//         .replace(/(\d{4})/g, '$1 ')
//         .trim()
//         .slice(0, 19);
//       setFormData({
//         ...formData,
//         [name]: formattedValue
//       });
//       return;
//     }
    
//     // Format expiry date
//     if (name === 'expiryDate') {
//       const formattedValue = value
//         .replace(/\D/g, '')
//         .replace(/(\d{2})(\d)/, '$1/$2')
//         .slice(0, 5);
//       setFormData({
//         ...formData,
//         [name]: formattedValue
//       });
//       return;
//     }
    
//     // Format CVV (numbers only)
//     if (name === 'cvv') {
//       const formattedValue = value.replace(/\D/g, '').slice(0, 4);
//       setFormData({
//         ...formData,
//         [name]: formattedValue
//       });
//       return;
//     }
    
//     setFormData({
//       ...formData,
//       [name]: value
//     });

//     // Clear error when user starts typing
//     if (formErrors[name]) {
//       setFormErrors({
//         ...formErrors,
//         [name]: ''
//       });
//     }
//   };

//   const createBookingAfterPayment = async () => {
//     try {
//       // Get user ID from authentication
//       const userId = localStorage.getItem('userId') || 1;
      
//       const bookingDto = {
//         userId: parseInt(userId),
//         routeId: route.routeId,
//         bookingDate: new Date(),
//         totalAmount: totalAmount,
//         status: 'Confirmed', // Set to Confirmed directly since payment is done
//         seatNumbers: selectedSeats.map(seat => seat.seatNumber),
//         passengerCount: selectedSeats.length,
//         travelDate: date // Add travel date
//       };
      
//       console.log('Creating booking after payment:', bookingDto);
      
//       const newBooking = await bookingService.addBookingWithErrorHandling(bookingDto);
//       return newBooking;
//     } catch (err) {
//       console.error('Error creating booking after payment:', err);
//       throw new Error('Failed to create booking after payment: ' + err.message);
//     }
//   };

//   const handlePayment = async () => {
//     // Validate form first
//     if (!validateForm()) {
//       setError('Please fix the validation errors before proceeding');
//       return;
//     }
    
//     setProcessing(true);
//     setError('');
    
//     try {
//       // 1. First process the payment
//       const paymentDto = {
//         amountPaid: totalAmount,
//         paymentDate: new Date(),
//         paymentStatus: 'Success',
//         paymentMethod: 'Credit Card',
//         // Note: We don't have bookingId yet, so we'll update payment after booking creation
//       };
      
//       console.log('Processing payment with data:', paymentDto);
      
//       const paymentResult = await paymentService.processPaymentWithErrorHandling(paymentDto);
      
//       // 2. After payment is successful, create the booking
//       const bookingData = await createBookingAfterPayment();
      
//       // 3. Update payment with booking ID (if needed)
//       // This depends on your payment entity structure
      
//       setSuccess('Payment successful! Your tickets have been booked.');
      
//       // Simulate email sending
//       setTimeout(() => {
//         setSuccess('Payment successful! Your tickets have been booked. A confirmation email has been sent to ' + formData.email);
        
//         // Redirect to success page after a delay
//         setTimeout(() => {
//           navigate('/booking-success', { 
//             state: { 
//               booking: bookingData, 
//               payment: paymentResult,
//               bus,
//               route,
//               date,
//               selectedSeats,
//               passengerEmail: formData.email
//             }
//           });
//         }, 3000);
//       }, 2000);
      
//     } catch (err) {
//       setError('Payment processing failed: ' + err.message);
//       console.error('Payment error:', err);
//     } finally {
//       setProcessing(false);
//     }
//   };

//   const handleCancel = () => {
//     // Just navigate back without creating any booking
//     navigate('/buses');
//   };

//   return (
//     <Container className="my-5">
//       <Row className="justify-content-center">
//         <Col md={8}>
//           <h2 className="mb-4">Complete Your Payment</h2>
          
//           {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}
//           {success && <Alert variant="success" dismissible onClose={() => setSuccess('')}>{success}</Alert>}
          
//           <Card className="mb-4">
//             <Card.Header>
//               <h5 className="mb-0">Booking Summary</h5>
//             </Card.Header>
//             <Card.Body>
//               <Row>
//                 <Col md={6}>
//                   <p><strong>Bus:</strong> {bus.busName}</p>
//                   <p><strong>Route:</strong> {route.origin} to {route.destination}</p>
//                   <p><strong>Date:</strong> {new Date(date).toLocaleDateString()}</p>
//                 </Col>
//                 <Col md={6}>
//                   <p><strong>Departure:</strong> {new Date(route.departureTime).toLocaleTimeString()}</p>
//                   <p><strong>Arrival:</strong> {new Date(route.arrivalTime).toLocaleTimeString()}</p>
//                   <p><strong>Seats:</strong> {selectedSeats.map(s => s.seatNumber).join(', ')}</p>
//                 </Col>
//               </Row>
//               <hr />
//               <h4 className="text-end">Total Amount: ₹{totalAmount}</h4>
//             </Card.Body>
//           </Card>

//           <Card>
//             <Card.Header>
//               <h5 className="mb-0">Payment Details</h5>
//             </Card.Header>
//             <Card.Body>
//               <Form>
//                 <Row className="mb-3">
//                   <Col md={6}>
//                     <Form.Group>
//                       <Form.Label>Email Address</Form.Label>
//                       <Form.Control
//                         type="email"
//                         name="email"
//                         value={formData.email}
//                         onChange={handleInputChange}
//                         placeholder="Enter email for ticket"
//                         required
//                         isInvalid={!!formErrors.email}
//                       />
//                       <Form.Control.Feedback type="invalid">
//                         {formErrors.email}
//                       </Form.Control.Feedback>
//                     </Form.Group>
//                   </Col>
//                 </Row>
                
//                 <h6 className="mb-3">Card Information</h6>
                
//                 <Row className="mb-3">
//                   <Col md={12}>
//                     <Form.Group>
//                       <Form.Label>Card Number</Form.Label>
//                       <Form.Control
//                         type="text"
//                         name="cardNumber"
//                         value={formData.cardNumber}
//                         onChange={handleInputChange}
//                         placeholder="1234 5678 9012 3456"
//                         maxLength="19"
//                         required
//                         isInvalid={!!formErrors.cardNumber}
//                       />
//                       <Form.Control.Feedback type="invalid">
//                         {formErrors.cardNumber}
//                       </Form.Control.Feedback>
//                     </Form.Group>
//                   </Col>
//                 </Row>
                
//                 <Row className="mb-3">
//                   <Col md={6}>
//                     <Form.Group>
//                       <Form.Label>Card Holder Name</Form.Label>
//                       <Form.Control
//                         type="text"
//                         name="cardHolder"
//                         value={formData.cardHolder}
//                         onChange={handleInputChange}
//                         placeholder="John Doe"
//                         required
//                         isInvalid={!!formErrors.cardHolder}
//                       />
//                       <Form.Control.Feedback type="invalid">
//                         {formErrors.cardHolder}
//                       </Form.Control.Feedback>
//                     </Form.Group>
//                   </Col>
//                   <Col md={3}>
//                     <Form.Group>
//                       <Form.Label>Expiry Date</Form.Label>
//                       <Form.Control
//                         type="text"
//                         name="expiryDate"
//                         value={formData.expiryDate}
//                         onChange={handleInputChange}
//                         placeholder="MM/YY"
//                         maxLength="5"
//                         required
//                         isInvalid={!!formErrors.expiryDate}
//                       />
//                       <Form.Control.Feedback type="invalid">
//                         {formErrors.expiryDate}
//                       </Form.Control.Feedback>
//                     </Form.Group>
//                   </Col>
//                   <Col md={3}>
//                     <Form.Group>
//                       <Form.Label>CVV</Form.Label>
//                       <Form.Control
//                         type="text"
//                         name="cvv"
//                         value={formData.cvv}
//                         onChange={handleInputChange}
//                         placeholder="123"
//                         maxLength="4"
//                         required
//                         isInvalid={!!formErrors.cvv}
//                       />
//                       <Form.Control.Feedback type="invalid">
//                         {formErrors.cvv}
//                       </Form.Control.Feedback>
//                     </Form.Group>
//                   </Col>
//                 </Row>
                
//                 <div className="d-grid gap-2 d-md-flex justify-content-md-end">
//                   <Button 
//                     variant="outline-danger" 
//                     onClick={() => setShowCancelModal(true)}
//                     disabled={processing || success}
//                   >
//                     Cancel Booking
//                   </Button>
//                   <Button 
//                     variant="primary" 
//                     onClick={handlePayment}
//                     disabled={processing || success}
//                   >
//                     {processing ? (
//                       <>
//                         <Spinner animation="border" size="sm" /> Processing...
//                       </>
//                     ) : (
//                       `Pay ₹${totalAmount}`
//                     )}
//                   </Button>
//                 </div>
//               </Form>
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>

//       {/* Cancel Confirmation Modal */}
//       <Modal show={showCancelModal} onHide={() => setShowCancelModal(false)}>
//         <Modal.Header closeButton>
//           <Modal.Title>Confirm Cancellation</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           Are you sure you want to cancel this booking? This action cannot be undone.
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShowCancelModal(false)}>
//             Go Back
//           </Button>
//           <Button variant="danger" onClick={handleCancel}>
//             Yes, Cancel Booking
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </Container>
//   );
// };

// export default Payment;

// import React, { useState, useEffect } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import { Container, Row, Col, Card, Button, Alert, Form, Spinner, Modal } from 'react-bootstrap';
// import bookingService from '../services/bookingServiceEnhanced';
// import paymentService from '../services/paymentServiceEnhanced';
// import cancellationService from '../services/cancellationServiceEnhanced';

// const Payment = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { bus, route, date, selectedSeats, totalAmount } = location.state || {};
  
//   const [loading, setLoading] = useState(false);
//   const [processing, setProcessing] = useState(false);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const [showCancelModal, setShowCancelModal] = useState(false);
//   const [booking, setBooking] = useState(null);
//   const [payment, setPayment] = useState(null);
  
//   // Form state with validation
//   const [formData, setFormData] = useState({
//     cardNumber: '',
//     cardHolder: '',
//     expiryDate: '',
//     cvv: '',
//     email: ''
//   });

//   const [formErrors, setFormErrors] = useState({
//     cardNumber: '',
//     cardHolder: '',
//     expiryDate: '',
//     cvv: '',
//     email: ''
//   });

//   useEffect(() => {
//     if (!bus || !route || !selectedSeats || selectedSeats.length === 0) {
//       navigate('/buses');
//       return;
//     }
//   }, [bus, route, selectedSeats, navigate]);

//   // Validation functions
//   const validateEmail = (email) => {
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     return emailRegex.test(email);
//   };

//   const validateCardNumber = (cardNumber) => {
//     const cleanedNumber = cardNumber.replace(/\s/g, '');
//     return cleanedNumber.length === 16 && /^\d+$/.test(cleanedNumber);
//   };

//   const validateExpiryDate = (expiryDate) => {
//     const regex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
//     if (!regex.test(expiryDate)) return false;
    
//     const [month, year] = expiryDate.split('/');
//     const now = new Date();
//     const currentYear = now.getFullYear() % 100;
//     const currentMonth = now.getMonth() + 1;
    
//     if (parseInt(year) < currentYear) return false;
//     if (parseInt(year) === currentYear && parseInt(month) < currentMonth) return false;
    
//     return true;
//   };

//   const validateCVV = (cvv) => {
//     return cvv.length >= 3 && cvv.length <= 4 && /^\d+$/.test(cvv);
//   };

//   const validateForm = () => {
//     const errors = {
//       cardNumber: '',
//       cardHolder: '',
//       expiryDate: '',
//       cvv: '',
//       email: ''
//     };

//     let isValid = true;

//     // Validate email
//     if (!formData.email) {
//       errors.email = 'Email is required';
//       isValid = false;
//     } else if (!validateEmail(formData.email)) {
//       errors.email = 'Please enter a valid email address';
//       isValid = false;
//     }

//     // Validate card number
//     if (!formData.cardNumber) {
//       errors.cardNumber = 'Card number is required';
//       isValid = false;
//     } else if (!validateCardNumber(formData.cardNumber)) {
//       errors.cardNumber = 'Please enter a valid 16-digit card number';
//       isValid = false;
//     }

//     // Validate card holder
//     if (!formData.cardHolder) {
//       errors.cardHolder = 'Card holder name is required';
//       isValid = false;
//     } else if (formData.cardHolder.length < 3) {
//       errors.cardHolder = 'Card holder name must be at least 3 characters';
//       isValid = false;
//     }

//     // Validate expiry date
//     if (!formData.expiryDate) {
//       errors.expiryDate = 'Expiry date is required';
//       isValid = false;
//     } else if (!validateExpiryDate(formData.expiryDate)) {
//       errors.expiryDate = 'Please enter a valid expiry date (MM/YY)';
//       isValid = false;
//     }

//     // Validate CVV
//     if (!formData.cvv) {
//       errors.cvv = 'CVV is required';
//       isValid = false;
//     } else if (!validateCVV(formData.cvv)) {
//       errors.cvv = 'Please enter a valid CVV (3-4 digits)';
//       isValid = false;
//     }

//     setFormErrors(errors);
//     return isValid;
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
    
//     // Format card number with spaces
//     if (name === 'cardNumber') {
//       const formattedValue = value
//         .replace(/\D/g, '')
//         .replace(/(\d{4})/g, '$1 ')
//         .trim()
//         .slice(0, 19);
//       setFormData({
//         ...formData,
//         [name]: formattedValue
//       });
//       return;
//     }
    
//     // Format expiry date
//     if (name === 'expiryDate') {
//       const formattedValue = value
//         .replace(/\D/g, '')
//         .replace(/(\d{2})(\d)/, '$1/$2')
//         .slice(0, 5);
//       setFormData({
//         ...formData,
//         [name]: formattedValue
//       });
//       return;
//     }
    
//     // Format CVV (numbers only)
//     if (name === 'cvv') {
//       const formattedValue = value.replace(/\D/g, '').slice(0, 4);
//       setFormData({
//         ...formData,
//         [name]: formattedValue
//       });
//       return;
//     }
    
//     setFormData({
//       ...formData,
//       [name]: value
//     });

//     // Clear error when user starts typing
//     if (formErrors[name]) {
//       setFormErrors({
//         ...formErrors,
//         [name]: ''
//       });
//     }
//   };

//   const createBooking = async () => {
//     try {
//       setLoading(true);
//       // Get user ID from authentication
//       const userId = localStorage.getItem('userId') || 1;
      
//       const bookingDto = {
//         userId: parseInt(userId),
//         routeId: route.routeId,
//         bookingDate: new Date().toISOString(),
//         travelDate: new Date(date).toISOString(), // Add travel date
//         totalAmount: totalAmount,
//         status: 'Pending',
//         seatNumbers: selectedSeats.map(seat => seat.seatNumber), // Send seat numbers
//         passengerCount: selectedSeats.length
//       };
      
//       console.log('Creating booking with data:', bookingDto);
      
//       const newBooking = await bookingService.addBookingWithErrorHandling(bookingDto);
//       setBooking(newBooking);
//       return newBooking;
//     } catch (err) {
//       setError('Failed to create booking: ' + err.message);
//       console.error('Error creating booking:', err);
//       throw err;
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handlePayment = async () => {
//     // Validate form first
//     if (!validateForm()) {
//       setError('Please fix the validation errors before proceeding');
//       return;
//     }
    
//     setProcessing(true);
//     setError('');
    
//     try {
//       // Create booking first
//       let bookingData = booking;
//       if (!bookingData) {
//         bookingData = await createBooking();
//       }
      
//       // Process payment
//       const paymentDto = {
//         bookingId: bookingData.bookingId || bookingData.bookingID,
//         amountPaid: totalAmount,
//         paymentDate: new Date().toISOString(),
//         paymentStatus: 'Success',
//         paymentMethod: 'Credit Card'
//       };
      
//       console.log('Processing payment with data:', paymentDto);
      
//       const paymentResult = await paymentService.processPaymentWithErrorHandling(paymentDto);
//       setPayment(paymentResult);
      
//       // Update booking status to Confirmed
//       const updatedBookingDto = {
//         bookingId: bookingData.bookingId || bookingData.bookingID,
//         userId: bookingData.user?.userId || bookingData.userID,
//         routeId: route.routeId,
//         bookingDate: bookingData.bookingDate,
//         totalAmount: bookingData.totalAmount,
//         status: 'Confirmed'
//       };
      
//       await bookingService.updateBookingWithErrorHandling(updatedBookingDto);
      
//       setSuccess('Payment successful! Your tickets have been booked.');
      
//       // Simulate email sending
//       setTimeout(() => {
//         setSuccess('Payment successful! Your tickets have been booked. A confirmation email has been sent to ' + formData.email);
        
//         // Redirect to success page after a delay
//         setTimeout(() => {
//           navigate('/booking-success', { 
//             state: { 
//               booking: updatedBookingDto, 
//               payment: paymentResult,
//               bus,
//               route,
//               date,
//               selectedSeats,
//               passengerEmail: formData.email
//             }
//           });
//         }, 3000);
//       }, 2000);
      
//     } catch (err) {
//       setError('Payment processing failed: ' + err.message);
//       console.error('Payment error:', err);
//     } finally {
//       setProcessing(false);
//     }
//   };

//   const handleCancel = async () => {
//     setProcessing(true);
    
//     try {
//       if (!booking) {
//         throw new Error('No booking to cancel');
//       }
      
//       // Process cancellation
//       const cancellationDto = {
//         bookingId: booking.bookingId || booking.bookingID,
//         paymentId: payment ? (payment.paymentId || payment.paymentID) : 0,
//         cancellationDate: new Date().toISOString(),
//         refundAmount: totalAmount,
//         refundStatus: 'Pending',
//         reason: 'User requested cancellation'
//       };
      
//       await cancellationService.cancelBookingWithErrorHandling(cancellationDto);
      
//       // Update booking status to Cancelled
//       const updatedBookingDto = {
//         bookingId: booking.bookingId || booking.bookingID,
//         userId: booking.user?.userId || booking.userID,
//         routeId: route.routeId,
//         bookingDate: booking.bookingDate,
//         totalAmount: booking.totalAmount,
//         status: 'Cancelled'
//       };
      
//       await bookingService.updateBookingWithErrorHandling(updatedBookingDto);
      
//       setShowCancelModal(false);
//       setSuccess('Booking cancelled successfully. Refund will be processed within 5-7 business days.');
      
//       // Navigate back after a delay
//       setTimeout(() => {
//         navigate('/buses');
//       }, 3000);
      
//     } catch (err) {
//       setError('Cancellation failed: ' + err.message);
//       console.error('Cancellation error:', err);
//     } finally {
//       setProcessing(false);
//     }
//   };

//   if (loading) {
//     return (
//       <Container className="text-center mt-5">
//         <Spinner animation="border" />
//         <p>Preparing your booking...</p>
//       </Container>
//     );
//   }

//   return (
//     <Container className="my-5">
//       <Row className="justify-content-center">
//         <Col md={8}>
//           <h2 className="mb-4">Complete Your Payment</h2>
          
//           {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}
//           {success && <Alert variant="success" dismissible onClose={() => setSuccess('')}>{success}</Alert>}
          
//           <Card className="mb-4">
//             <Card.Header>
//               <h5 className="mb-0">Booking Summary</h5>
//             </Card.Header>
//             <Card.Body>
//               <Row>
//                 <Col md={6}>
//                   <p><strong>Bus:</strong> {bus.busName}</p>
//                   <p><strong>Route:</strong> {route.origin} to {route.destination}</p>
//                   <p><strong>Date:</strong> {new Date(date).toLocaleDateString()}</p>
//                 </Col>
//                 <Col md={6}>
//                   <p><strong>Departure:</strong> {new Date(route.departureTime).toLocaleTimeString()}</p>
//                   <p><strong>Arrival:</strong> {new Date(route.arrivalTime).toLocaleTimeString()}</p>
//                   <p><strong>Seats:</strong> {selectedSeats.map(s => s.seatNumber).join(', ')}</p>
//                 </Col>
//               </Row>
//               <hr />
//               <h4 className="text-end">Total Amount: ₹{totalAmount}</h4>
//             </Card.Body>
//           </Card>

//           <Card>
//             <Card.Header>
//               <h5 className="mb-0">Payment Details</h5>
//             </Card.Header>
//             <Card.Body>
//               <Form>
//                 <Row className="mb-3">
//                   <Col md={6}>
//                     <Form.Group>
//                       <Form.Label>Email Address</Form.Label>
//                       <Form.Control
//                         type="email"
//                         name="email"
//                         value={formData.email}
//                         onChange={handleInputChange}
//                         placeholder="Enter email for ticket"
//                         required
//                         isInvalid={!!formErrors.email}
//                       />
//                       <Form.Control.Feedback type="invalid">
//                         {formErrors.email}
//                       </Form.Control.Feedback>
//                     </Form.Group>
//                   </Col>
//                 </Row>
                
//                 <h6 className="mb-3">Card Information</h6>
                
//                 <Row className="mb-3">
//                   <Col md={12}>
//                     <Form.Group>
//                       <Form.Label>Card Number</Form.Label>
//                       <Form.Control
//                         type="text"
//                         name="cardNumber"
//                         value={formData.cardNumber}
//                         onChange={handleInputChange}
//                         placeholder="1234 5678 9012 3456"
//                         maxLength="19"
//                         required
//                         isInvalid={!!formErrors.cardNumber}
//                       />
//                       <Form.Control.Feedback type="invalid">
//                         {formErrors.cardNumber}
//                       </Form.Control.Feedback>
//                     </Form.Group>
//                   </Col>
//                 </Row>
                
//                 <Row className="mb-3">
//                   <Col md={6}>
//                     <Form.Group>
//                       <Form.Label>Card Holder Name</Form.Label>
//                       <Form.Control
//                         type="text"
//                         name="cardHolder"
//                         value={formData.cardHolder}
//                         onChange={handleInputChange}
//                         placeholder="John Doe"
//                         required
//                         isInvalid={!!formErrors.cardHolder}
//                       />
//                       <Form.Control.Feedback type="invalid">
//                         {formErrors.cardHolder}
//                       </Form.Control.Feedback>
//                     </Form.Group>
//                   </Col>
//                   <Col md={3}>
//                     <Form.Group>
//                       <Form.Label>Expiry Date</Form.Label>
//                       <Form.Control
//                         type="text"
//                         name="expiryDate"
//                         value={formData.expiryDate}
//                         onChange={handleInputChange}
//                         placeholder="MM/YY"
//                         maxLength="5"
//                         required
//                         isInvalid={!!formErrors.expiryDate}
//                       />
//                       <Form.Control.Feedback type="invalid">
//                         {formErrors.expiryDate}
//                       </Form.Control.Feedback>
//                     </Form.Group>
//                   </Col>
//                   <Col md={3}>
//                     <Form.Group>
//                       <Form.Label>CVV</Form.Label>
//                       <Form.Control
//                         type="text"
//                         name="cvv"
//                         value={formData.cvv}
//                         onChange={handleInputChange}
//                         placeholder="123"
//                         maxLength="4"
//                         required
//                         isInvalid={!!formErrors.cvv}
//                       />
//                       <Form.Control.Feedback type="invalid">
//                         {formErrors.cvv}
//                       </Form.Control.Feedback>
//                     </Form.Group>
//                   </Col>
//                 </Row>
                
//                 <div className="d-grid gap-2 d-md-flex justify-content-md-end">
//                   <Button 
//                     variant="outline-danger" 
//                     onClick={() => setShowCancelModal(true)}
//                     disabled={processing || success}
//                   >
//                     Cancel Booking
//                   </Button>
//                   <Button 
//                     variant="primary" 
//                     onClick={handlePayment}
//                     disabled={processing || success}
//                   >
//                     {processing ? (
//                       <>
//                         <Spinner animation="border" size="sm" /> Processing...
//                       </>
//                     ) : (
//                       `Pay ₹${totalAmount}`
//                     )}
//                   </Button>
//                 </div>
//               </Form>
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>

//       {/* Cancel Confirmation Modal */}
//       <Modal show={showCancelModal} onHide={() => setShowCancelModal(false)}>
//         <Modal.Header closeButton>
//           <Modal.Title>Confirm Cancellation</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           Are you sure you want to cancel this booking? 
//           {payment ? ' A refund will be processed to your original payment method.' : ' This action cannot be undone.'}
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShowCancelModal(false)} disabled={processing}>
//             Go Back
//           </Button>
//           <Button variant="danger" onClick={handleCancel} disabled={processing}>
//             {processing ? (
//               <>
//                 <Spinner animation="border" size="sm" /> Cancelling...
//               </>
//             ) : (
//               'Yes, Cancel Booking'
//             )}
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </Container>
//   );
// };

// export default Payment;

// import React, { useState, useEffect } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import { Container, Row, Col, Card, Button, Alert, Form, Spinner, Modal } from 'react-bootstrap';
// import bookingService from '../services/bookingServiceEnhanced';
// import paymentService from '../services/paymentServiceEnhanced';
// import cancellationService from '../services/cancellationServiceEnhanced';

// const Payment = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { bus, route, date, selectedSeats, totalAmount } = location.state || {};
  
//   const [loading, setLoading] = useState(false);
//   const [processing, setProcessing] = useState(false);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const [showCancelModal, setShowCancelModal] = useState(false);
//   const [booking, setBooking] = useState(null);
//   const [payment, setPayment] = useState(null);
  
//   // Form state
//   const [formData, setFormData] = useState({
//     cardNumber: '',
//     cardHolder: '',
//     expiryDate: '',
//     cvv: '',
//     email: ''
//   });

//   useEffect(() => {
//     if (!bus || !route || !selectedSeats || selectedSeats.length === 0) {
//       navigate('/buses');
//       return;
//     }
//   }, [bus, route, selectedSeats, totalAmount, navigate]);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value
//     });
//   };

//   const createBooking = async () => {
//     try {
//       setLoading(true);
//       // Get user ID from authentication (this should be implemented based on your auth system)
//       const userId = localStorage.getItem('userId') || 1; // Fallback for demo
      
//       const bookingDto = {
//         userId: parseInt(userId),
//         routeId: route.routeId,
//         bookingDate: new Date().toISOString(), // Use ISO string format
//         totalAmount: totalAmount,
//         status: 'Pending',
//         // Add seat information if your backend expects it
//         seats: selectedSeats.map(seat => seat.seatId)
//       };
      
//       console.log('Creating booking with data:', bookingDto); // Debug
      
//       const newBooking = await bookingService.addBookingWithErrorHandling(bookingDto);
//       setBooking(newBooking);
//       return newBooking;
//     } catch (err) {
//       setError('Failed to create booking: ' + err.message);
//       console.error('Error creating booking:', err);
//       throw err;
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handlePayment = async () => {
//     // Simple validation
//     if (!formData.cardNumber || !formData.cardHolder || !formData.expiryDate || !formData.cvv || !formData.email) {
//       setError('Please fill all payment details');
//       return;
//     }
    
//     if (formData.cardNumber.replace(/\s/g, '').length !== 16) {
//       setError('Please enter a valid card number');
//       return;
//     }
    
//     setProcessing(true);
//     setError('');
    
//     try {
//       // Create booking first
//       let bookingData = booking;
//       if (!bookingData) {
//         bookingData = await createBooking();
//       }
      
//       // Process payment
//       const paymentDto = {
//         bookingId: bookingData.bookingId || bookingData.bookingID, // Try different possible field names
//         amountPaid: totalAmount,
//         paymentDate: new Date().toISOString(),
//         paymentStatus: 'Success'
//       };
      
//       console.log('Processing payment with data:', paymentDto); // Debug
      
//       const paymentResult = await paymentService.processPaymentWithErrorHandling(paymentDto);
//       setPayment(paymentResult);
      
//       // Update booking status to Confirmed
//       const updatedBookingDto = {
//         bookingId: bookingData.bookingId || bookingData.bookingID,
//         userId: bookingData.user?.userId || bookingData.userID,
//         routeId: route.routeId,
//         bookingDate: bookingData.bookingDate,
//         totalAmount: bookingData.totalAmount,
//         status: 'Confirmed'
//       };
      
//       await bookingService.updateBookingWithErrorHandling(updatedBookingDto);
      
//       setSuccess('Payment successful! Your tickets have been booked.');
      
//       // Simulate email sending
//       setTimeout(() => {
//         setSuccess('Payment successful! Your tickets have been booked. A confirmation email has been sent to ' + formData.email);
//       }, 2000);
      
//     } catch (err) {
//       setError('Payment processing failed: ' + err.message);
//       console.error('Payment error:', err);
//     } finally {
//       setProcessing(false);
//     }
//   };

//   const handleCancel = async () => {
//     setProcessing(true);
    
//     try {
//       if (!booking) {
//         throw new Error('No booking to cancel');
//       }
      
//       // Process cancellation
//       const cancellationDto = {
//         bookingId: booking.bookingId || booking.bookingID,
//         paymentId: payment ? (payment.paymentId || payment.paymentID) : 0,
//         cancellationDate: new Date().toISOString(),
//         refundAmount: totalAmount,
//         refundStatus: 'Pending',
//         reason: 'User requested cancellation'
//       };
      
//       await cancellationService.cancelBookingWithErrorHandling(cancellationDto);
      
//       // Update booking status to Cancelled
//       const updatedBookingDto = {
//         bookingId: booking.bookingId || booking.bookingID,
//         userId: booking.user?.userId || booking.userID,
//         routeId: route.routeId,
//         bookingDate: booking.bookingDate,
//         totalAmount: booking.totalAmount,
//         status: 'Cancelled'
//       };
      
//       await bookingService.updateBookingWithErrorHandling(updatedBookingDto);
      
//       setShowCancelModal(false);
//       setSuccess('Booking cancelled successfully. Refund will be processed within 5-7 business days.');
      
//       // Navigate back after a delay
//       setTimeout(() => {
//         navigate('/buses');
//       }, 3000);
      
//     } catch (err) {
//       setError('Cancellation failed: ' + err.message);
//       console.error('Cancellation error:', err);
//     } finally {
//       setProcessing(false);
//     }
//   };

//   if (loading) {
//     return (
//       <Container className="text-center mt-5">
//         <Spinner animation="border" />
//         <p>Preparing your booking...</p>
//       </Container>
//     );
//   }

//   return (
//     <Container className="my-5">
//       <Row className="justify-content-center">
//         <Col md={8}>
//           <h2 className="mb-4">Complete Your Payment</h2>
          
//           {error && <Alert variant="danger">{error}</Alert>}
//           {success && <Alert variant="success">{success}</Alert>}
          
//           <Card className="mb-4">
//             <Card.Header>
//               <h5 className="mb-0">Booking Summary</h5>
//             </Card.Header>
//             <Card.Body>
//               <Row>
//                 <Col md={6}>
//                   <p><strong>Bus:</strong> {bus.busName}</p>
//                   <p><strong>Route:</strong> {route.origin} to {route.destination}</p>
//                   <p><strong>Date:</strong> {new Date(date).toLocaleDateString()}</p>
//                 </Col>
//                 <Col md={6}>
//                   <p><strong>Departure:</strong> {new Date(route.departureTime).toLocaleTimeString()}</p>
//                   <p><strong>Arrival:</strong> {new Date(route.arrivalTime).toLocaleTimeString()}</p>
//                   <p><strong>Seats:</strong> {selectedSeats.map(s => s.seatNumber).join(', ')}</p>
//                 </Col>
//               </Row>
//               <hr />
//               <h4 className="text-end">Total Amount: ₹{totalAmount}</h4>
//             </Card.Body>
//           </Card>

//           <Card>
//             <Card.Header>
//               <h5 className="mb-0">Payment Details</h5>
//             </Card.Header>
//             <Card.Body>
//               <Form>
//                 <Row className="mb-3">
//                   <Col md={6}>
//                     <Form.Group>
//                       <Form.Label>Email Address</Form.Label>
//                       <Form.Control
//                         type="email"
//                         name="email"
//                         value={formData.email}
//                         onChange={handleInputChange}
//                         placeholder="Enter email for ticket"
//                         required
//                       />
//                     </Form.Group>
//                   </Col>
//                 </Row>
                
//                 <h6 className="mb-3">Card Information</h6>
                
//                 <Row className="mb-3">
//                   <Col md={12}>
//                     <Form.Group>
//                       <Form.Label>Card Number</Form.Label>
//                       <Form.Control
//                         type="text"
//                         name="cardNumber"
//                         value={formData.cardNumber}
//                         onChange={handleInputChange}
//                         placeholder="1234 5678 9012 3456"
//                         maxLength="19"
//                         required
//                       />
//                     </Form.Group>
//                   </Col>
//                 </Row>
                
//                 <Row className="mb-3">
//                   <Col md={6}>
//                     <Form.Group>
//                       <Form.Label>Card Holder Name</Form.Label>
//                       <Form.Control
//                         type="text"
//                         name="cardHolder"
//                         value={formData.cardHolder}
//                         onChange={handleInputChange}
//                         placeholder="John Doe"
//                         required
//                       />
//                     </Form.Group>
//                   </Col>
//                   <Col md={3}>
//                     <Form.Group>
//                       <Form.Label>Expiry Date</Form.Label>
//                       <Form.Control
//                         type="text"
//                         name="expiryDate"
//                         value={formData.expiryDate}
//                         onChange={handleInputChange}
//                         placeholder="MM/YY"
//                         maxLength="5"
//                         required
//                       />
//                     </Form.Group>
//                   </Col>
//                   <Col md={3}>
//                     <Form.Group>
//                       <Form.Label>CVV</Form.Label>
//                       <Form.Control
//                         type="text"
//                         name="cvv"
//                         value={formData.cvv}
//                         onChange={handleInputChange}
//                         placeholder="123"
//                         maxLength="3"
//                         required
//                       />
//                     </Form.Group>
//                   </Col>
//                 </Row>
                
//                 <div className="d-grid gap-2 d-md-flex justify-content-md-end">
//                   <Button 
//                     variant="outline-danger" 
//                     onClick={() => setShowCancelModal(true)}
//                     disabled={processing}
//                   >
//                     Cancel Booking
//                   </Button>
//                   <Button 
//                     variant="primary" 
//                     onClick={handlePayment}
//                     disabled={processing || success}
//                   >
//                     {processing ? (
//                       <>
//                         <Spinner animation="border" size="sm" /> Processing...
//                       </>
//                     ) : (
//                       `Pay ₹${totalAmount}`
//                     )}
//                   </Button>
//                 </div>
//               </Form>
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>

//       {/* Cancel Confirmation Modal */}
//       <Modal show={showCancelModal} onHide={() => setShowCancelModal(false)}>
//         <Modal.Header closeButton>
//           <Modal.Title>Confirm Cancellation</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           Are you sure you want to cancel this booking? 
//           {payment ? ' A refund will be processed to your original payment method.' : ' This action cannot be undone.'}
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShowCancelModal(false)}>
//             Go Back
//           </Button>
//           <Button variant="danger" onClick={handleCancel} disabled={processing}>
//             {processing ? 'Cancelling...' : 'Yes, Cancel Booking'}
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </Container>
//   );
// };

// export default Payment;

// import React, { useState, useEffect } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import { Container, Row, Col, Card, Button, Alert, Form, Spinner, Modal } from 'react-bootstrap';
// import bookingService from '../services/bookingServiceEnhanced';
// import paymentService from '../services/paymentServiceEnhanced';
// import cancellationService from '../services/cancellationServiceEnhanced';

// const Payment = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { bus, route, date, selectedSeats, totalAmount } = location.state || {};
  
//   const [loading, setLoading] = useState(false);
//   const [processing, setProcessing] = useState(false);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const [showCancelModal, setShowCancelModal] = useState(false);
//   const [booking, setBooking] = useState(null);
//   const [payment, setPayment] = useState(null);
  
//   // Form state
//   const [formData, setFormData] = useState({
//     cardNumber: '',
//     cardHolder: '',
//     expiryDate: '',
//     cvv: '',
//     email: ''
//   });

//   useEffect(() => {
//     if (!bus || !route || !selectedSeats || selectedSeats.length === 0) {
//       navigate('/buses');
//       return;
//     }
    
//     // Create a temporary booking record
//     const createTempBooking = async () => {
//       try {
//         setLoading(true);
//         // Get user ID from authentication (this should be implemented based on your auth system)
//         const userId = localStorage.getItem('userId') || 1; // Fallback for demo
        
//         const bookingDto = {
//           userId: parseInt(userId),
//           routeId: route.routeId,
//           bookingDate: new Date(),
//           totalAmount: totalAmount,
//           status: 'Pending'
//         };
        
//         // Use enhanced service with error handling
//         const newBooking = await bookingService.addBookingWithErrorHandling(bookingDto);
//         setBooking(newBooking.data || newBooking); // Handle different response formats
//       } catch (err) {
//         setError('Failed to initialize booking: ' + err.message);
//         console.error('Error creating booking:', err);
//       } finally {
//         setLoading(false);
//       }
//     };
    
//     createTempBooking();
//   }, [bus, route, selectedSeats, totalAmount, navigate]);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
    
//     // Format card number with spaces
//     if (name === 'cardNumber') {
//       const formattedValue = value
//         .replace(/\s/g, '')
//         .replace(/(\d{4})/g, '$1 ')
//         .trim()
//         .slice(0, 19);
//       setFormData({
//         ...formData,
//         [name]: formattedValue
//       });
//       return;
//     }
    
//     // Format expiry date
//     if (name === 'expiryDate') {
//       const formattedValue = value
//         .replace(/\D/g, '')
//         .replace(/(\d{2})(\d)/, '$1/$2')
//         .slice(0, 5);
//       setFormData({
//         ...formData,
//         [name]: formattedValue
//       });
//       return;
//     }
    
//     setFormData({
//       ...formData,
//       [name]: value
//     });
//   };

//   const handlePayment = async () => {
//     // Simple validation
//     if (!formData.cardNumber || !formData.cardHolder || !formData.expiryDate || !formData.cvv || !formData.email) {
//       setError('Please fill all payment details');
//       return;
//     }
    
//     if (formData.cardNumber.replace(/\s/g, '').length !== 16) {
//       setError('Please enter a valid 16-digit card number');
//       return;
//     }
    
//     if (!formData.expiryDate.match(/^(0[1-9]|1[0-2])\/([0-9]{2})$/)) {
//       setError('Please enter a valid expiry date in MM/YY format');
//       return;
//     }
    
//     if (!formData.cvv.match(/^[0-9]{3,4}$/)) {
//       setError('Please enter a valid CVV (3 or 4 digits)');
//       return;
//     }
    
//     if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
//       setError('Please enter a valid email address');
//       return;
//     }
    
//     setProcessing(true);
//     setError('');
    
//     try {
//       // Process payment using enhanced service
//       const paymentDto = {
//         bookingId: booking.bookingId || booking.data.bookingId,
//         amountPaid: totalAmount,
//         paymentDate: new Date(),
//         paymentStatus: 'Success'
//       };
      
//       const paymentResult = await paymentService.processPaymentWithErrorHandling(paymentDto);
//       setPayment(paymentResult.data || paymentResult);
      
//       // Update booking status to Confirmed
//       const bookingId = booking.bookingId || booking.data.bookingId;
//       const userId = booking.user?.userId || booking.data?.user?.userId;
      
//       const updatedBookingDto = {
//         bookingId: bookingId,
//         userId: userId,
//         routeId: route.routeId,
//         bookingDate: new Date(),
//         totalAmount: totalAmount,
//         status: 'Confirmed'
//       };
      
//       await bookingService.updateBookingWithErrorHandling(updatedBookingDto);
      
//       // In a real application, you would:
//       // 1. Update seat status to 'Booked' (call your seat service)
//       // 2. Send confirmation email with PDF ticket
//       // 3. Update any other relevant data
      
//       setSuccess('Payment successful! Your tickets have been booked.');
      
//       // Simulate email sending
//       setTimeout(() => {
//         setSuccess('Payment successful! Your tickets have been booked. A confirmation email has been sent to ' + formData.email);
        
//         // Redirect to success page after a delay
//         setTimeout(() => {
//           navigate('/booking-success', { 
//             state: { 
//               booking: updatedBookingDto, 
//               payment: paymentResult,
//               bus,
//               route,
//               date,
//               selectedSeats
//             }
//           });
//         }, 3000);
//       }, 2000);
      
//     } catch (err) {
//       setError('Payment processing failed: ' + err.message);
//       console.error('Payment error:', err);
//     } finally {
//       setProcessing(false);
//     }
//   };

//   const handleCancel = async () => {
//     setProcessing(true);
    
//     try {
//       // Get booking and payment IDs (handling different response formats)
//       const bookingId = booking.bookingId || booking.data.bookingId;
//       const paymentId = payment ? (payment.paymentId || payment.data.paymentId) : 0;
      
//       // Process cancellation using enhanced service
//       const cancellationDto = {
//         bookingId: bookingId,
//         paymentId: paymentId,
//         cancellationDate: new Date(),
//         refundAmount: totalAmount,
//         refundStatus: 'Pending',
//         reason: 'User requested cancellation'
//       };
      
//       await cancellationService.cancelBookingWithErrorHandling(cancellationDto);
      
//       // Update booking status to Cancelled
//       const userId = booking.user?.userId || booking.data?.user?.userId;
      
//       const updatedBookingDto = {
//         bookingId: bookingId,
//         userId: userId,
//         routeId: route.routeId,
//         bookingDate: new Date(),
//         totalAmount: totalAmount,
//         status: 'Cancelled'
//       };
      
//       await bookingService.updateBookingWithErrorHandling(updatedBookingDto);
      
//       setShowCancelModal(false);
//       setSuccess('Booking cancelled successfully. Refund will be processed within 5-7 business days.');
      
//       // Navigate back after a delay
//       setTimeout(() => {
//         navigate('/buses');
//       }, 3000);
      
//     } catch (err) {
//       setError('Cancellation failed: ' + err.message);
//       console.error('Cancellation error:', err);
//     } finally {
//       setProcessing(false);
//     }
//   };

//   if (loading) {
//     return (
//       <Container className="text-center mt-5">
//         <Spinner animation="border" />
//         <p>Preparing your booking...</p>
//       </Container>
//     );
//   }

//   return (
//     <Container className="my-5">
//       <Row className="justify-content-center">
//         <Col md={8}>
//           <h2 className="mb-4">Complete Your Payment</h2>
          
//           {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}
//           {success && <Alert variant="success" onClose={() => setSuccess('')} dismissible>{success}</Alert>}
          
//           <Card className="mb-4">
//             <Card.Header>
//               <h5 className="mb-0">Booking Summary</h5>
//             </Card.Header>
//             <Card.Body>
//               <Row>
//                 <Col md={6}>
//                   <p><strong>Bus:</strong> {bus.busName}</p>
//                   <p><strong>Route:</strong> {route.origin} to {route.destination}</p>
//                   <p><strong>Date:</strong> {new Date(date).toLocaleDateString()}</p>
//                 </Col>
//                 <Col md={6}>
//                   <p><strong>Departure:</strong> {new Date(route.departureTime).toLocaleTimeString()}</p>
//                   <p><strong>Arrival:</strong> {new Date(route.arrivalTime).toLocaleTimeString()}</p>
//                   <p><strong>Seats:</strong> {selectedSeats.map(s => s.seatNumber).join(', ')}</p>
//                 </Col>
//               </Row>
//               <hr />
//               <h4 className="text-end">Total Amount: ₹{totalAmount}</h4>
//             </Card.Body>
//           </Card>

//           <Card>
//             <Card.Header>
//               <h5 className="mb-0">Payment Details</h5>
//             </Card.Header>
//             <Card.Body>
//               <Form>
//                 <Row className="mb-3">
//                   <Col md={6}>
//                     <Form.Group>
//                       <Form.Label>Email Address</Form.Label>
//                       <Form.Control
//                         type="email"
//                         name="email"
//                         value={formData.email}
//                         onChange={handleInputChange}
//                         placeholder="Enter email for ticket"
//                         required
//                         isInvalid={formData.email && !formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)}
//                       />
//                       <Form.Control.Feedback type="invalid">
//                         Please enter a valid email address
//                       </Form.Control.Feedback>
//                     </Form.Group>
//                   </Col>
//                 </Row>
                
//                 <h6 className="mb-3">Card Information</h6>
                
//                 <Row className="mb-3">
//                   <Col md={12}>
//                     <Form.Group>
//                       <Form.Label>Card Number</Form.Label>
//                       <Form.Control
//                         type="text"
//                         name="cardNumber"
//                         value={formData.cardNumber}
//                         onChange={handleInputChange}
//                         placeholder="1234 5678 9012 3456"
//                         maxLength="19"
//                         required
//                         isInvalid={formData.cardNumber && formData.cardNumber.replace(/\s/g, '').length !== 16}
//                       />
//                       <Form.Control.Feedback type="invalid">
//                         Please enter a valid 16-digit card number
//                       </Form.Control.Feedback>
//                     </Form.Group>
//                   </Col>
//                 </Row>
                
//                 <Row className="mb-3">
//                   <Col md={6}>
//                     <Form.Group>
//                       <Form.Label>Card Holder Name</Form.Label>
//                       <Form.Control
//                         type="text"
//                         name="cardHolder"
//                         value={formData.cardHolder}
//                         onChange={handleInputChange}
//                         placeholder="John Doe"
//                         required
//                       />
//                     </Form.Group>
//                   </Col>
//                   <Col md={3}>
//                     <Form.Group>
//                       <Form.Label>Expiry Date</Form.Label>
//                       <Form.Control
//                         type="text"
//                         name="expiryDate"
//                         value={formData.expiryDate}
//                         onChange={handleInputChange}
//                         placeholder="MM/YY"
//                         maxLength="5"
//                         required
//                         isInvalid={formData.expiryDate && !formData.expiryDate.match(/^(0[1-9]|1[0-2])\/([0-9]{2})$/)}
//                       />
//                       <Form.Control.Feedback type="invalid">
//                         Please enter valid expiry date (MM/YY)
//                       </Form.Control.Feedback>
//                     </Form.Group>
//                   </Col>
//                   <Col md={3}>
//                     <Form.Group>
//                       <Form.Label>CVV</Form.Label>
//                       <Form.Control
//                         type="text"
//                         name="cvv"
//                         value={formData.cvv}
//                         onChange={handleInputChange}
//                         placeholder="123"
//                         maxLength="4"
//                         required
//                         isInvalid={formData.cvv && !formData.cvv.match(/^[0-9]{3,4}$/)}
//                       />
//                       <Form.Control.Feedback type="invalid">
//                         Please enter valid CVV (3-4 digits)
//                       </Form.Control.Feedback>
//                     </Form.Group>
//                   </Col>
//                 </Row>
                
//                 <div className="d-grid gap-2 d-md-flex justify-content-md-end">
//                   <Button 
//                     variant="outline-danger" 
//                     onClick={() => setShowCancelModal(true)}
//                     disabled={processing || success}
//                   >
//                     Cancel Booking
//                   </Button>
//                   <Button 
//                     variant="primary" 
//                     onClick={handlePayment}
//                     disabled={processing || success}
//                   >
//                     {processing ? (
//                       <>
//                         <Spinner animation="border" size="sm" /> Processing...
//                       </>
//                     ) : (
//                       `Pay ₹${totalAmount}`
//                     )}
//                   </Button>
//                 </div>
//               </Form>
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>

//       {/* Cancel Confirmation Modal */}
//       <Modal show={showCancelModal} onHide={() => setShowCancelModal(false)}>
//         <Modal.Header closeButton>
//           <Modal.Title>Confirm Cancellation</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           Are you sure you want to cancel this booking? 
//           {payment ? ' A refund will be processed to your original payment method.' : ' This action cannot be undone.'}
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShowCancelModal(false)} disabled={processing}>
//             Go Back
//           </Button>
//           <Button variant="danger" onClick={handleCancel} disabled={processing}>
//             {processing ? (
//               <>
//                 <Spinner animation="border" size="sm" /> Cancelling...
//               </>
//             ) : (
//               'Yes, Cancel Booking'
//             )}
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </Container>
//   );
// };

// export default Payment;
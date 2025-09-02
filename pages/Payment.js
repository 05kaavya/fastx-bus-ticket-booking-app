import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Alert, Form, Spinner, Modal } from 'react-bootstrap';
import bookingService from '../services/bookingServiceEnhanced';
import paymentService from '../services/paymentServiceEnhanced';
import cancellationService from '../services/cancellationServiceEnhanced';

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { bus, route, date, selectedSeats, totalAmount } = location.state || {};
  
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [booking, setBooking] = useState(null);
  const [payment, setPayment] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
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
    
    // Create a temporary booking record
    const createTempBooking = async () => {
      try {
        setLoading(true);
        // Get user ID from authentication (this should be implemented based on your auth system)
        const userId = localStorage.getItem('userId') || 1; // Fallback for demo
        
        const bookingDto = {
          userId: parseInt(userId),
          routeId: route.routeId,
          bookingDate: new Date(),
          totalAmount: totalAmount,
          status: 'Pending'
        };
        
        // Use enhanced service with error handling
        const newBooking = await bookingService.addBookingWithErrorHandling(bookingDto);
        setBooking(newBooking.data || newBooking); // Handle different response formats
      } catch (err) {
        setError('Failed to initialize booking: ' + err.message);
        console.error('Error creating booking:', err);
      } finally {
        setLoading(false);
      }
    };
    
    createTempBooking();
  }, [bus, route, selectedSeats, totalAmount, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Format card number with spaces
    if (name === 'cardNumber') {
      const formattedValue = value
        .replace(/\s/g, '')
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
    
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handlePayment = async () => {
    // Simple validation
    if (!formData.cardNumber || !formData.cardHolder || !formData.expiryDate || !formData.cvv || !formData.email) {
      setError('Please fill all payment details');
      return;
    }
    
    if (formData.cardNumber.replace(/\s/g, '').length !== 16) {
      setError('Please enter a valid 16-digit card number');
      return;
    }
    
    if (!formData.expiryDate.match(/^(0[1-9]|1[0-2])\/([0-9]{2})$/)) {
      setError('Please enter a valid expiry date in MM/YY format');
      return;
    }
    
    if (!formData.cvv.match(/^[0-9]{3,4}$/)) {
      setError('Please enter a valid CVV (3 or 4 digits)');
      return;
    }
    
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setError('Please enter a valid email address');
      return;
    }
    
    setProcessing(true);
    setError('');
    
    try {
      // Process payment using enhanced service
      const paymentDto = {
        bookingId: booking.bookingId || booking.data.bookingId,
        amountPaid: totalAmount,
        paymentDate: new Date(),
        paymentStatus: 'Success'
      };
      
      const paymentResult = await paymentService.processPaymentWithErrorHandling(paymentDto);
      setPayment(paymentResult.data || paymentResult);
      
      // Update booking status to Confirmed
      const bookingId = booking.bookingId || booking.data.bookingId;
      const userId = booking.user?.userId || booking.data?.user?.userId;
      
      const updatedBookingDto = {
        bookingId: bookingId,
        userId: userId,
        routeId: route.routeId,
        bookingDate: new Date(),
        totalAmount: totalAmount,
        status: 'Confirmed'
      };
      
      await bookingService.updateBookingWithErrorHandling(updatedBookingDto);
      
      // In a real application, you would:
      // 1. Update seat status to 'Booked' (call your seat service)
      // 2. Send confirmation email with PDF ticket
      // 3. Update any other relevant data
      
      setSuccess('Payment successful! Your tickets have been booked.');
      
      // Simulate email sending
      setTimeout(() => {
        setSuccess('Payment successful! Your tickets have been booked. A confirmation email has been sent to ' + formData.email);
        
        // Redirect to success page after a delay
        setTimeout(() => {
          navigate('/booking-success', { 
            state: { 
              booking: updatedBookingDto, 
              payment: paymentResult,
              bus,
              route,
              date,
              selectedSeats
            }
          });
        }, 3000);
      }, 2000);
      
    } catch (err) {
      setError('Payment processing failed: ' + err.message);
      console.error('Payment error:', err);
    } finally {
      setProcessing(false);
    }
  };

  const handleCancel = async () => {
    setProcessing(true);
    
    try {
      // Get booking and payment IDs (handling different response formats)
      const bookingId = booking.bookingId || booking.data.bookingId;
      const paymentId = payment ? (payment.paymentId || payment.data.paymentId) : 0;
      
      // Process cancellation using enhanced service
      const cancellationDto = {
        bookingId: bookingId,
        paymentId: paymentId,
        cancellationDate: new Date(),
        refundAmount: totalAmount,
        refundStatus: 'Pending',
        reason: 'User requested cancellation'
      };
      
      await cancellationService.cancelBookingWithErrorHandling(cancellationDto);
      
      // Update booking status to Cancelled
      const userId = booking.user?.userId || booking.data?.user?.userId;
      
      const updatedBookingDto = {
        bookingId: bookingId,
        userId: userId,
        routeId: route.routeId,
        bookingDate: new Date(),
        totalAmount: totalAmount,
        status: 'Cancelled'
      };
      
      await bookingService.updateBookingWithErrorHandling(updatedBookingDto);
      
      setShowCancelModal(false);
      setSuccess('Booking cancelled successfully. Refund will be processed within 5-7 business days.');
      
      // Navigate back after a delay
      setTimeout(() => {
        navigate('/buses');
      }, 3000);
      
    } catch (err) {
      setError('Cancellation failed: ' + err.message);
      console.error('Cancellation error:', err);
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" />
        <p>Preparing your booking...</p>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <h2 className="mb-4">Complete Your Payment</h2>
          
          {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}
          {success && <Alert variant="success" onClose={() => setSuccess('')} dismissible>{success}</Alert>}
          
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
                        isInvalid={formData.email && !formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)}
                      />
                      <Form.Control.Feedback type="invalid">
                        Please enter a valid email address
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
                        isInvalid={formData.cardNumber && formData.cardNumber.replace(/\s/g, '').length !== 16}
                      />
                      <Form.Control.Feedback type="invalid">
                        Please enter a valid 16-digit card number
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
                      />
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
                        isInvalid={formData.expiryDate && !formData.expiryDate.match(/^(0[1-9]|1[0-2])\/([0-9]{2})$/)}
                      />
                      <Form.Control.Feedback type="invalid">
                        Please enter valid expiry date (MM/YY)
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
                        isInvalid={formData.cvv && !formData.cvv.match(/^[0-9]{3,4}$/)}
                      />
                      <Form.Control.Feedback type="invalid">
                        Please enter valid CVV (3-4 digits)
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
          Are you sure you want to cancel this booking? 
          {payment ? ' A refund will be processed to your original payment method.' : ' This action cannot be undone.'}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCancelModal(false)} disabled={processing}>
            Go Back
          </Button>
          <Button variant="danger" onClick={handleCancel} disabled={processing}>
            {processing ? (
              <>
                <Spinner animation="border" size="sm" /> Cancelling...
              </>
            ) : (
              'Yes, Cancel Booking'
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Payment;
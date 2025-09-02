import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Alert, Spinner } from 'react-bootstrap';
import { seatService } from '../services/busService';

const Seats = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { bus, route, date } = location.state || {};
  
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!bus || !route) {
      navigate('/buses');
      return;
    }

    const fetchSeats = async () => {
      try {
        const seatsData = await seatService.getSeatsByBusId(bus.busId);
        setSeats(seatsData);
      } catch (err) {
        setError('Failed to load seat information');
        console.error('Error fetching seats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSeats();
  }, [bus, route, navigate]);

  const handleSeatSelect = (seat) => {
    if (seat.seatStatus === 'Booked') return;

    const isSelected = selectedSeats.some(s => s.seatId === seat.seatId);
    
    if (isSelected) {
      setSelectedSeats(selectedSeats.filter(s => s.seatId !== seat.seatId));
    } else {
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  const handleProceedToBooking = () => {
    if (selectedSeats.length === 0) {
      setError('Please select at least one seat');
      return;
    }

    // Navigate to booking page with selected data
    navigate('/booking', {
      state: {
        bus,
        route,
        date,
        selectedSeats,
        totalAmount: selectedSeats.length * parseFloat(route.fare)
      }
    });
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" />
        <p>Loading seat information...</p>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <Row>
        <Col>
          <h2 className="mb-4">Select Seats - {bus.busName}</h2>
          
          {error && <Alert variant="danger">{error}</Alert>}
          
          <Card className="mb-4">
            <Card.Header>
              <h5 className="mb-0">Journey Details</h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <p><strong>Route:</strong> {route.origin} to {route.destination}</p>
                  <p><strong>Date:</strong> {new Date(date).toLocaleDateString()}</p>
                </Col>
                <Col md={6}>
                  <p><strong>Departure:</strong> {new Date(route.departureTime).toLocaleTimeString()}</p>
                  <p><strong>Arrival:</strong> {new Date(route.arrivalTime).toLocaleTimeString()}</p>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          <Card>
            <Card.Header>
              <h5 className="mb-0">Available Seats</h5>
            </Card.Header>
            <Card.Body>
              <div className="bus-layout mb-4">
                <div className="driver-section text-center mb-3">
                  <div className="driver-placeholder">Driver</div>
                </div>
                
                <Row className="justify-content-center">
                  {seats.map(seat => (
                    <Col key={seat.seatId} xs={2} className="mb-2">
                      <Button
                        variant={
                          seat.seatStatus === 'Booked' ? 'secondary' :
                          selectedSeats.some(s => s.seatId === seat.seatId) ? 'success' : 'outline-primary'
                        }
                        className="w-100"
                        disabled={seat.seatStatus === 'Booked'}
                        onClick={() => handleSeatSelect(seat)}
                      >
                        {seat.seatNumber}
                        <br />
                        <small>{seat.seatType}</small>
                      </Button>
                    </Col>
                  ))}
                </Row>
              </div>

              <div className="seat-legend mb-3">
                <div className="d-flex justify-content-center gap-3">
                  <div className="d-flex align-items-center">
                    <div className="legend-box available me-2"></div>
                    <span>Available</span>
                  </div>
                  <div className="d-flex align-items-center">
                    <div className="legend-box selected me-2"></div>
                    <span>Selected</span>
                  </div>
                  <div className="d-flex align-items-center">
                    <div className="legend-box booked me-2"></div>
                    <span>Booked</span>
                  </div>
                </div>
              </div>

              {selectedSeats.length > 0 && (
                <div className="text-center">
                  <h5>Selected Seats: {selectedSeats.map(s => s.seatNumber).join(', ')}</h5>
                  <h5>Total Amount: ₹{selectedSeats.length * parseFloat(route.fare)}</h5>
                  <Button 
                    variant="primary" 
                    size="lg"
                    onClick={handleProceedToBooking}
                  >
                    Proceed to Booking
                  </Button>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Seats;
import React from 'react';
import { Card, Row, Col, Button, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const BusList = ({ buses, searchData }) => {
  const navigate = useNavigate();

  const handleBookSeat = (bus, route) => {
    // Navigate to seats page with bus, route, and date information
    navigate('/seats', { 
      state: { 
        bus, 
        route, 
        date: searchData.date 
      } 
    });
  };

  const formatTime = (dateTime) => {
    return new Date(dateTime).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDuration = (departure, arrival) => {
    const dep = new Date(departure);
    const arr = new Date(arrival);
    const diffMs = arr - dep;
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  return (
    <div>
      {buses.map((route, index) => (
        <Card key={index} className="mb-3 shadow-sm">
          <Card.Body>
            <Row className="align-items-center">
              <Col md={3}>
                <h5>{route.bus.busName}</h5>
                <p className="text-muted mb-0">{route.bus.busNumber}</p>
                <Badge bg="secondary" className="mt-1">
                  {route.bus.busType}
                </Badge>
              </Col>
              
              <Col md={3}>
                <div className="text-center">
                  <h5>{formatTime(route.departureTime)}</h5>
                  <p className="text-muted mb-0">{route.origin}</p>
                </div>
              </Col>
              
              <Col md={2}>
                <div className="text-center">
                  <p className="mb-0">
                    {formatDuration(route.departureTime, route.arrivalTime)}
                  </p>
                  <div className="border-top mx-auto my-1" style={{width: '50px'}}></div>
                  <p className="text-muted mb-0">Direct</p>
                </div>
              </Col>
              
              <Col md={2}>
                <div className="text-center">
                  <h5>{formatTime(route.arrivalTime)}</h5>
                  <p className="text-muted mb-0">{route.destination}</p>
                </div>
              </Col>
              
              <Col md={2}>
                <div className="text-center">
                  <h4 className="text-primary">₹{route.fare}</h4>
                  <p className="text-muted mb-1">per seat</p>
                  <Button 
                    variant="primary" 
                    size="sm"
                    onClick={() => handleBookSeat(route.bus, route)}
                  >
                    Book Seats
                  </Button>
                </div>
              </Col>
            </Row>
            
            <Row className="mt-3">
              <Col>
                <small className="text-muted">
                  <strong>Amenities:</strong> {route.bus.amenities || 'Not specified'} • 
                  <strong> Seats Available:</strong> {route.bus.totalSeats}
                </small>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      ))}
    </div>
  );
};

export default BusList;
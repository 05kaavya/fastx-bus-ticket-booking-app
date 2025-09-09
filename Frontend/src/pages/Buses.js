import React, { useEffect, useState } from "react";
import { Card, Container, Row, Col, Spinner, Alert, Badge, Button } from "react-bootstrap";
import { busService, routeService } from "../services/busService";
import { FaBus, FaRoute, FaClock, FaMapMarkerAlt, FaMoneyBillWave, FaChair } from "react-icons/fa";

const Buses = () => {
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedBus, setExpandedBus] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const busesData = await busService.getAllBuses();
      const routesData = await routeService.getAllRoutes();

      // Merge routes into buses
      const merged = busesData.map((bus) => {
        const busRoutes = routesData.filter(
          (r) => r.bus && r.bus.busId === bus.busId
        );
        return { ...bus, routes: busRoutes };
      });

      setBuses(merged);
    } catch (err) {
      setError("Failed to load buses and routes data");
      console.error("Error loading buses/routes", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpandBus = (busId) => {
    if (expandedBus === busId) {
      setExpandedBus(null);
    } else {
      setExpandedBus(busId);
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <Container className="text-center mt-5 py-5">
        <Spinner animation="border" variant="primary" className="mb-3" style={{ width: '3rem', height: '3rem' }} />
        <h5>Loading buses...</h5>
        <p className="text-muted">Please wait while we fetch the latest information</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger" className="text-center">
          <Alert.Heading>Oops! Something went wrong</Alert.Heading>
          <p>{error}</p>
          <Button variant="outline-danger" onClick={loadData}>Try Again</Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <div className="text-center mb-5">
        <h1 className="display-5 fw-bold text-primary mb-3">
          <FaBus className="me-2" />
          Available Buses
        </h1>
        <p className="lead text-muted">Browse our fleet of comfortable buses with various routes</p>
      </div>
      
      <Row>
        {buses.length > 0 ? (
          buses.map((bus) => (
            <Col lg={6} key={bus.busId} className="mb-4">
              <Card className={`shadow-sm h-100 bus-card ${expandedBus === bus.busId ? 'expanded' : ''}`}>
                <Card.Body className="p-4">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div>
                      <Card.Title className="mb-1 fw-bold text-dark">{bus.busName}</Card.Title>
                      <Card.Subtitle className="text-muted">
                        <Badge bg="secondary" className="me-2">{bus.busType}</Badge>
                        <Badge bg="light" text="dark" className="me-2">
                          <FaChair className="me-1" />
                          {bus.totalSeats} Seats
                        </Badge>
                      </Card.Subtitle>
                    </div>
                    <Badge bg="primary" className="fs-6 px-3 py-2">#{bus.busNumber}</Badge>
                  </div>

                  {bus.amenities && (
                    <div className="mb-3">
                      <h6 className="fw-semibold mb-2">Amenities:</h6>
                      <div className="d-flex flex-wrap gap-2">
                        {bus.amenities.split(',').map((amenity, index) => (
                          <Badge key={index} bg="outline-primary" className="text-primary fw-normal">
                            {amenity.trim()}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {bus.routes && bus.routes.length > 0 ? (
                    <div>
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <h6 className="fw-semibold mb-0">
                          <FaRoute className="me-2 text-primary" />
                          Available Routes ({bus.routes.length})
                        </h6>
                        <Button 
                          variant="outline-primary" 
                          size="sm"
                          onClick={() => toggleExpandBus(bus.busId)}
                        >
                          {expandedBus === bus.busId ? 'Show Less' : 'Show All'}
                        </Button>
                      </div>
                      
                      {(expandedBus === bus.busId ? bus.routes : bus.routes.slice(0, 2)).map((route) => (
                        <Card key={route.routeId} className="mb-3 route-card">
                          <Card.Body className="p-3">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                              <div className="d-flex align-items-center">
                                <FaMapMarkerAlt className="text-success me-2" />
                                <span className="fw-semibold">{route.origin}</span>
                                <span className="mx-2">→</span>
                                <FaMapMarkerAlt className="text-danger me-2" />
                                <span className="fw-semibold">{route.destination}</span>
                              </div>
                              <Badge bg="success" className="fs-6">
                                ₹{route.fare}
                              </Badge>
                            </div>
                            
                            <div className="d-flex justify-content-between">
                              <div>
                                <small className="text-muted">Departure</small>
                                <div className="d-flex align-items-center">
                                  <FaClock className="me-1 text-primary" />
                                  <span className="fw-semibold">{formatTime(route.departureTime)}</span>
                                </div>
                                <small>{formatDate(route.departureTime)}</small>
                              </div>
                              
                              <div className="text-end">
                                <small className="text-muted">Arrival</small>
                                <div className="d-flex align-items-center justify-content-end">
                                  <FaClock className="me-1 text-primary" />
                                  <span className="fw-semibold">{formatTime(route.arrivalTime)}</span>
                                </div>
                                <small>{formatDate(route.arrivalTime)}</small>
                              </div>
                            </div>
                          </Card.Body>
                        </Card>
                      ))}
                      
                      {bus.routes.length > 2 && expandedBus !== bus.busId && (
                        <div className="text-center mt-2">
                          <small className="text-muted">
                            +{bus.routes.length - 2} more routes available
                          </small>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-3">
                      <FaRoute size={32} className="text-muted mb-2" />
                      <p className="text-muted mb-0">No routes available for this bus</p>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <Col>
            <Alert variant="info" className="text-center py-4">
              <FaBus size={48} className="text-info mb-3" />
              <h4>No buses available at the moment</h4>
              <p className="mb-0">Please check back later for available buses and routes</p>
            </Alert>
          </Col>
        )}
      </Row>
      
      <style>{`
        .bus-card {
          border-radius: 12px;
          transition: all 0.3s ease;
          border: 1px solid #e9ecef;
        }
        .bus-card:hover {
          box-shadow: 0 0.5rem 1.5rem rgba(0, 0, 0, 0.1) !important;
          transform: translateY(-2px);
        }
        .bus-card.expanded {
          box-shadow: 0 0.5rem 1.5rem rgba(0, 0, 0, 0.1) !important;
        }
        .route-card {
          border-radius: 8px;
          border: 1px solid #e9ecef;
          transition: all 0.2s ease;
        }
        .route-card:hover {
          border-color: #86b7fe;
          background-color: #f8f9fa;
        }
        .badge.bg-outline-primary {
          background-color: transparent;
          border: 1px solid #0d6efd;
          color: #0d6efd;
        }
      `}</style>
    </Container>
  );
};

export default Buses;



// import React, { useEffect, useState } from "react";
// import { Card, Container, Row, Col, Spinner, Alert } from "react-bootstrap";
// import { busService, routeService } from "../services/busService";

// const Buses = () => {
//   const [buses, setBuses] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     loadData();
//   }, []);

//   const loadData = async () => {
//     try {
//       setLoading(true);
//       const busesData = await busService.getAllBuses();
//       const routesData = await routeService.getAllRoutes();

//       // Merge routes into buses
//       const merged = busesData.map((bus) => {
//         const busRoutes = routesData.filter(
//           (r) => r.bus && r.bus.busId === bus.busId
//         );
//         return { ...bus, routes: busRoutes };
//       });

//       setBuses(merged);
//     } catch (err) {
//       setError("Failed to load buses and routes data");
//       console.error("Error loading buses/routes", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) {
//     return (
//       <Container className="text-center mt-5">
//         <Spinner animation="border" />
//         <p>Loading buses...</p>
//       </Container>
//     );
//   }

//   if (error) {
//     return (
//       <Container className="mt-5">
//         <Alert variant="danger">{error}</Alert>
//       </Container>
//     );
//   }

//   return (
//     <Container className="mt-5">
//       <h2 className="mb-4">Available Buses</h2>
//       <Row>
//         {buses.length > 0 ? (
//           buses.map((bus) => (
//             <Col md={6} key={bus.busId} className="mb-4">
//               <Card className="shadow-sm h-100">
//                 <Card.Body>
//                   <Card.Title>{bus.busName}</Card.Title>
//                   <Card.Subtitle className="mb-2 text-muted">
//                     {bus.busType} | {bus.totalSeats} Seats
//                   </Card.Subtitle>
//                   <Card.Text>
//                     <strong>Bus Number:</strong> {bus.busNumber} <br />
//                     <strong>Amenities:</strong> {bus.amenities || "N/A"}
//                   </Card.Text>

//                   {bus.routes && bus.routes.length > 0 ? (
//                     <div>
//                       <h6>Available Routes:</h6>
//                       {bus.routes.map((route) => (
//                         <Card key={route.routeId} className="mb-2 p-2 bg-light">
//                           <Card.Text className="mb-1">
//                             <strong>Route:</strong> {route.origin} → {route.destination}
//                           </Card.Text>
//                           <Card.Text className="mb-1">
//                             <strong>Departure:</strong>{" "}
//                             {new Date(route.departureTime).toLocaleString()}
//                           </Card.Text>
//                           <Card.Text className="mb-1">
//                             <strong>Arrival:</strong>{" "}
//                             {new Date(route.arrivalTime).toLocaleString()}
//                           </Card.Text>
//                           <Card.Text className="mb-2">
//                             <strong>Fare:</strong> ₹{route.fare}
//                           </Card.Text>
//                         </Card>
//                       ))}
//                     </div>
//                   ) : (
//                     <p className="text-muted">No routes available for this bus</p>
//                   )}
//                 </Card.Body>
//               </Card>
//             </Col>
//           ))
//         ) : (
//           <Col>
//             <Alert variant="info">No buses available at the moment.</Alert>
//           </Col>
//         )}
//       </Row>
//     </Container>
//   );
// };

// export default Buses;

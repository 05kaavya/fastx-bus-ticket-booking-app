import React, { useEffect, useState } from "react";
import { Card, Container, Row, Col, Spinner, Alert } from "react-bootstrap";
import { busService, routeService } from "../services/busService";

const Buses = () => {
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" />
        <p>Loading buses...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      <h2 className="mb-4">Available Buses</h2>
      <Row>
        {buses.length > 0 ? (
          buses.map((bus) => (
            <Col md={6} key={bus.busId} className="mb-4">
              <Card className="shadow-sm h-100">
                <Card.Body>
                  <Card.Title>{bus.busName}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">
                    {bus.busType} | {bus.totalSeats} Seats
                  </Card.Subtitle>
                  <Card.Text>
                    <strong>Bus Number:</strong> {bus.busNumber} <br />
                    <strong>Amenities:</strong> {bus.amenities || "N/A"}
                  </Card.Text>

                  {bus.routes && bus.routes.length > 0 ? (
                    <div>
                      <h6>Available Routes:</h6>
                      {bus.routes.map((route) => (
                        <Card key={route.routeId} className="mb-2 p-2 bg-light">
                          <Card.Text className="mb-1">
                            <strong>Route:</strong> {route.origin} → {route.destination}
                          </Card.Text>
                          <Card.Text className="mb-1">
                            <strong>Departure:</strong>{" "}
                            {new Date(route.departureTime).toLocaleString()}
                          </Card.Text>
                          <Card.Text className="mb-1">
                            <strong>Arrival:</strong>{" "}
                            {new Date(route.arrivalTime).toLocaleString()}
                          </Card.Text>
                          <Card.Text className="mb-2">
                            <strong>Fare:</strong> ₹{route.fare}
                          </Card.Text>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted">No routes available for this bus</p>
                  )}
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <Col>
            <Alert variant="info">No buses available at the moment.</Alert>
          </Col>
        )}
      </Row>
    </Container>
  );
};

export default Buses;

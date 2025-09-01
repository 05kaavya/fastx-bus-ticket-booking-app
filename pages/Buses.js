import React, { useEffect, useState } from "react";
import { Card, Button, Container, Row, Col } from "react-bootstrap";
import { getAllBuses } from "../services/busService";
import { getAllRoutes } from "../services/routeService";
import { useNavigate } from "react-router-dom";

const Buses = () => {
  const [buses, setBuses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const busesRes = await getAllBuses();
      const routesRes = await getAllRoutes();

      // merge routes into buses
      const merged = busesRes.data.map((bus) => {
        const busRoutes = routesRes.data.filter(
          (r) => r.bus.busId === bus.busId
        );
        return { ...bus, routes: busRoutes };
      });

      setBuses(merged);
    } catch (err) {
      console.error("Error loading buses/routes", err);
    }
  };

  return (
    <Container className="mt-5">
      <h2 className="mb-4">Available Buses</h2>
      <Row>
        {buses.length > 0 ? (
          buses.map((bus) => (
            <Col md={6} key={bus.busId} className="mb-4">
              <Card className="shadow-sm">
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
                    bus.routes.map((route) => (
                      <Card key={route.routeId} className="mb-2 p-2">
                        <Card.Text>
                          <strong>Route:</strong> {route.origin} →{" "}
                          {route.destination} <br />
                          <strong>Departure:</strong>{" "}
                          {new Date(route.departureTime).toLocaleString()} <br />
                          <strong>Arrival:</strong>{" "}
                          {new Date(route.arrivalTime).toLocaleString()} <br />
                          <strong>Fare:</strong> ₹{route.fare}
                        </Card.Text>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() =>
                            navigate(
                              `/bookings/add?busId=${bus.busId}&routeId=${route.routeId}`
                            )
                          }
                        >
                          Book Seat
                        </Button>
                      </Card>
                    ))
                  ) : (
                    <p>No routes available for this bus</p>
                  )}
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <p>No buses available at the moment.</p>
        )}
      </Row>
    </Container>
  );
};

export default Buses;

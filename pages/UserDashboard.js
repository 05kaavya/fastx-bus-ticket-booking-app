// src/pages/UserDashboard.js
import React, { useEffect, useState } from "react";
import { Card, Button, Row, Col, Container, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const UserDashboard = () => {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // ✅ Fetch logged-in user details
        const userRes = await axios.get("http://localhost:8080/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(userRes.data);

        // ✅ Fetch bookings for logged-in user
        const bookingsRes = await axios.get("http://localhost:8080/api/bookings/my", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBookings(bookingsRes.data);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" />
        <p>Loading your dashboard...</p>
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      <h2 className="mb-4">Welcome, {user?.name} 👋</h2>

      {/* Quick Links Section */}
      <Row className="mb-4 g-3">
        <Col xs={6} md={3}>
          <Card className="shadow-sm text-center h-100">
            <Card.Body>
              <Card.Title>Book a Bus</Card.Title>
              <Button variant="primary" className="w-100" onClick={() => navigate("/buses")}>
                Search Buses
              </Button>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={6} md={3}>
          <Card className="shadow-sm text-center h-100">
            <Card.Body>
              <Card.Title>My Bookings</Card.Title>
              <Button variant="success" className="w-100" onClick={() => navigate("/bookings")}>
                View Bookings
              </Button>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={6} md={3}>
          <Card className="shadow-sm text-center h-100">
            <Card.Body>
              <Card.Title>Payments</Card.Title>
              <Button variant="warning" className="w-100" onClick={() => navigate("/payments")}>
                View Payments
              </Button>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={6} md={3}>
          <Card className="shadow-sm text-center h-100">
            <Card.Body>
              <Card.Title>Profile</Card.Title>
              <Button variant="info" className="w-100" onClick={() => navigate("/profile")}>
                View Profile
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Recent Bookings Section */}
      <h4 className="mb-3">Recent Bookings</h4>
      <Row>
        {bookings.length > 0 ? (
          bookings.map((b) => (
            <Col md={6} key={b.id} className="mb-3">
              <Card className="shadow-sm">
                <Card.Body>
                  <Card.Title>{b.bus?.busName || "Bus"}</Card.Title>
                  <Card.Text>
                    <strong>Route:</strong> {b.route?.origin} → {b.route?.destination} <br />
                    <strong>Date:</strong> {b.date}
                  </Card.Text>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    className="w-100"
                    onClick={() => navigate(`/bookings/${b.id}`)} // ✅ View Ticket
                  >
                    View Ticket
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <p>No bookings yet. Start by booking your first trip!</p>
        )}
      </Row>
    </Container>
  );
};

export default UserDashboard;

// src/pages/UserDashboard.js
import React, { useEffect, useState } from "react";
import { Card, Button, Row, Col, Container, Spinner, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const UserDashboard = () => {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // ✅ Fetch logged-in user
        const userRes = await axios.get("http://localhost:8080/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(userRes.data);

        // ✅ Fetch user bookings
        const bookingsRes = await axios.get("http://localhost:8080/api/bookings/my", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBookings(Array.isArray(bookingsRes.data) ? bookingsRes.data : []);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard. Please try again.");
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
      {error && <Alert variant="danger">{error}</Alert>}

      {/* Quick Links */}
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

      {/* Recent Bookings */}
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
                    <strong>Date:</strong>{" "}
                    {b.date ? new Date(b.date).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    }) : "N/A"}
                  </Card.Text>
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

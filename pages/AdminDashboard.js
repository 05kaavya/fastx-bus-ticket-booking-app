// src/pages/AdminDashboard.js
import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <Container className="mt-5">
      <h2 className="mb-4 text-center">Admin Dashboard 🛠️</h2>
      <Row className="g-4">
        {/* Manage Buses */}
        <Col md={4}>
          <Card className="shadow-sm text-center h-100">
            <Card.Body className="d-flex flex-column">
              <Card.Title>Manage Buses</Card.Title>
              <Card.Text>Add, update, delete and view all buses</Card.Text>
              <div className="mt-auto">
                <Button variant="primary" onClick={() => navigate("/admin/buses")}>
                  Go to Buses
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Manage Routes */}
        <Col md={4}>
          <Card className="shadow-sm text-center h-100">
            <Card.Body className="d-flex flex-column">
              <Card.Title>Manage Routes</Card.Title>
              <Card.Text>Create and manage routes for buses</Card.Text>
              <div className="mt-auto">
                <Button variant="success" onClick={() => navigate("/admin/routes")}>
                  Go to Routes
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Manage Bookings */}
        <Col md={4}>
          <Card className="shadow-sm text-center h-100">
            <Card.Body className="d-flex flex-column">
              <Card.Title>Manage Bookings</Card.Title>
              <Card.Text>View all user bookings</Card.Text>
              <div className="mt-auto">
                <Button variant="warning" onClick={() => navigate("/admin/bookings")}>
                  Go to Bookings
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Manage Users */}
        <Col md={4}>
          <Card className="shadow-sm text-center h-100">
            <Card.Body className="d-flex flex-column">
              <Card.Title>Manage Users</Card.Title>
              <Card.Text>View and delete registered users</Card.Text>
              <div className="mt-auto">
                <Button variant="info" onClick={() => navigate("/admin/users")}>
                  Go to Users
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Manage Operators */}
        <Col md={4}>
          <Card className="shadow-sm text-center h-100">
            <Card.Body className="d-flex flex-column">
              <Card.Title>Manage Operators</Card.Title>
              <Card.Text>View and manage bus operators</Card.Text>
              <div className="mt-auto">
                <Button variant="dark" onClick={() => navigate("/admin/operators")}>
                  Go to Operators
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Manage Seats */}
        <Col md={4}>
          <Card className="shadow-sm text-center h-100">
            <Card.Body className="d-flex flex-column">
              <Card.Title>Manage Seats</Card.Title>
              <Card.Text>Add or update bus seat information</Card.Text>
              <div className="mt-auto">
                <Button variant="danger" onClick={() => navigate("/admin/seats")}>
                  Go to Seats
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminDashboard;
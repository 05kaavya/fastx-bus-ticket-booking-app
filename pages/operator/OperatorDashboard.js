// src/pages/operator/OperatorDashboard.js
import React from "react";
import { Container, Row, Col, Card, Button, Badge } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaBus, FaRoute, FaChair, FaCalendarCheck } from "react-icons/fa"; // Importing icons

export default function OperatorDashboard() {
  const cardData = [
    { 
      title: "Manage Buses", 
      text: "Manage your bus fleet", 
      icon: <FaBus size={30} className="mb-3 text-primary" />,
      link: "/operator/editbuses",
      variant: "primary"
    },
    { 
      title: "Manage Routes", 
      text: "Manage your bus routes", 
      icon: <FaRoute size={30} className="mb-3 text-success" />,
      link: "/operator/editroutes",
      variant: "success"
    },
    { 
      title: "Manage Seats", 
      text: "Configure seats for your buses", 
      icon: <FaChair size={30} className="mb-3 text-info" />,
      link: "/operator/editseats",
      variant: "info"
    },
    { 
      title: "View Bookings", 
      text: "See all bookings made by users", 
      icon: <FaCalendarCheck size={30} className="mb-3 text-warning" />,
      link: "/operator/viewbookings",
      variant: "warning"
    },
  ];

  return (
    <Container className="my-5">
      <div className="d-flex justify-content-between align-items-center mb-5">
        <h2>Operator Dashboard 🚌</h2>
        <Badge bg="success" className="fs-6 p-2 rounded-pill">OPERATOR</Badge>
      </div>

      <Row xs={1} md={2} lg={3} className="g-4">
        {cardData.map((card, index) => (
          <Col key={index}>
            <Card className="text-center h-100 shadow-sm custom-card-hover">
              <Card.Body className="d-flex flex-column justify-content-center align-items-center">
                {card.icon}
                <Card.Title className="fw-bold">{card.title}</Card.Title>
                <Card.Text className="text-muted flex-grow-1">{card.text}</Card.Text>
                <Button 
                  as={Link} 
                  to={card.link} 
                  variant={`outline-${card.variant}`} 
                  className="mt-3"
                >
                  {card.title}
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}
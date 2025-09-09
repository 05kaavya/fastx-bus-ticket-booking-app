// src/pages/AdminDashboard.js
import React from "react";
import { Container, Row, Col, Card, Button, Badge } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { 
  FaBus, 
  FaRoute, 
  FaTicketAlt, 
  FaUsers, 
  FaUserCog
} from "react-icons/fa";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const adminCards = [
    {
      title: "Manage Buses",
      description: "Add, update, delete and view all buses",
      icon: <FaBus size={30} />,
      variant: "primary",
      path: "/admin/buses"
    },
    {
      title: "Manage Routes",
      description: "Create and manage routes for buses",
      icon: <FaRoute size={30} />,
      variant: "success",
      path: "/admin/routes"
    },
    {
      title: "Manage Bookings",
      description: "View all user bookings and transactions",
      icon: <FaTicketAlt size={30} />,
      variant: "warning",
      path: "/admin/bookings"
    },
    {
      title: "Manage Users",
      description: "View and manage registered users",
      icon: <FaUsers size={30} />,
      variant: "info",
      path: "/admin/users"
    },
    {
      title: "Manage Operators",
      description: "View and manage bus operators",
      icon: <FaUserCog size={30} />,
      variant: "dark",
      path: "/admin/operators"
    }
  ];

  return (
    <Container className="my-5">
      <div className="text-center mb-5">
        <h2 className="fw-bold">Admin Dashboard 🛠️</h2>
        <Badge bg="secondary" className="fs-6 p-2 mt-2">ADMINISTRATOR</Badge>
        <p className="text-muted mt-3">Manage all aspects of the bus reservation system</p>
      </div>
      
      <Row className="g-4 justify-content-center">
        {adminCards.map((card, index) => (
          <Col key={index} xs={12} md={6} lg={4}>
            <Card className="text-center h-100 shadow-sm admin-card">
              <Card.Body className="d-flex flex-column p-4">
                <div className={`icon-wrapper mb-3 bg-${card.variant} bg-opacity-10`}>
                  <span className={`text-${card.variant}`}>
                    {card.icon}
                  </span>
                </div>
                <Card.Title className="fw-bold">{card.title}</Card.Title>
                <Card.Text className="text-muted flex-grow-1">
                  {card.description}
                </Card.Text>
                <div className="mt-auto">
                  <Button 
                    variant={`outline-${card.variant}`} 
                    onClick={() => navigate(card.path)}
                    className="w-100"
                  >
                    Manage {card.title.split(" ")[1]}
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default AdminDashboard;
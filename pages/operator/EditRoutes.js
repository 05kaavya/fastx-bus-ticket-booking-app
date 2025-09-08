// src/pages/operator/EditRoutes.js
import { useEffect, useState } from "react";
import operatorService from "../../services/operatorService";
import { Table, Button, Form, Container, Row, Col, Alert } from "react-bootstrap";

export default function EditRoutes() {
  const [routes, setRoutes] = useState([]);
  const [form, setForm] = useState({
    routeId: "",
    busId: "",
    origin: "",
    destination: "",
    departureTime: "",
    arrivalTime: "",
    distance: "",
    fare: "",
  });
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    loadRoutes();
  }, []);

  const loadRoutes = async () => {
    try {
      const res = await operatorService.getMyRoutes();
      console.log("Routes response:", res);
      // Handle both array and object responses safely
      if (Array.isArray(res)) {
        setRoutes(res);
      } else if (res && Array.isArray(res.routes)) {
        setRoutes(res.routes);
      } else {
        setRoutes([]);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch routes");
      setRoutes([]);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await operatorService.updateMyRoute(form);
      } else {
        await operatorService.addMyRoute(form);
      }
      setForm({
        routeId: "",
        busId: "",
        origin: "",
        destination: "",
        departureTime: "",
        arrivalTime: "",
        distance: "",
        fare: "",
      });
      setEditing(false);
      loadRoutes();
    } catch (err) {
      console.error(err);
      setError("Error saving route");
    }
  };

  const handleEdit = (route) => {
    setForm({
      ...route,
      departureTime: route.departureTime?.slice(0, 16) || "",
      arrivalTime: route.arrivalTime?.slice(0, 16) || "",
    });
    setEditing(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this route?")) return;
    try {
      await operatorService.deleteMyRoute(id);
      loadRoutes();
    } catch (err) {
      console.error(err);
      setError("Failed to delete route");
    }
  };

  return (
    <Container className="mt-4">
      <h2 className="mb-4 text-center">Manage Routes</h2>

      {error && <Alert variant="danger">{error}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Row className="mb-3">
          <Col md={2}>
            <Form.Control
              type="number"
              name="busId"
              placeholder="Bus ID"
              value={form.busId}
              onChange={handleChange}
              required
            />
          </Col>
          <Col md={2}>
            <Form.Control
              type="text"
              name="origin"
              placeholder="Origin"
              value={form.origin}
              onChange={handleChange}
              required
            />
          </Col>
          <Col md={2}>
            <Form.Control
              type="text"
              name="destination"
              placeholder="Destination"
              value={form.destination}
              onChange={handleChange}
              required
            />
          </Col>
          <Col md={2}>
            <Form.Control
              type="datetime-local"
              name="departureTime"
              value={form.departureTime}
              onChange={handleChange}
              required
            />
          </Col>
          <Col md={2}>
            <Form.Control
              type="datetime-local"
              name="arrivalTime"
              value={form.arrivalTime}
              onChange={handleChange}
              required
            />
          </Col>
          <Col md={1}>
            <Form.Control
              type="number"
              name="distance"
              placeholder="Km"
              value={form.distance}
              onChange={handleChange}
              required
            />
          </Col>
          <Col md={1}>
            <Form.Control
              type="number"
              name="fare"
              placeholder="Fare"
              value={form.fare}
              onChange={handleChange}
              required
            />
          </Col>
        </Row>
        <div className="text-center">
          <Button type="submit" variant={editing ? "warning" : "primary"}>
            {editing ? "Update Route" : "Add Route"}
          </Button>
          {editing && (
            <Button
              variant="secondary"
              className="ms-2"
              onClick={() => {
                setForm({
                  routeId: "",
                  busId: "",
                  origin: "",
                  destination: "",
                  departureTime: "",
                  arrivalTime: "",
                  distance: "",
                  fare: "",
                });
                setEditing(false);
              }}
            >
              Cancel
            </Button>
          )}
        </div>
      </Form>

      <h3 className="mt-5">Existing Routes</h3>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Bus</th>
            <th>Origin</th>
            <th>Destination</th>
            <th>Departure</th>
            <th>Arrival</th>
            <th>Distance</th>
            <th>Fare</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {routes?.map((route) => (
            <tr key={route.routeId}>
              <td>{route.routeId}</td>
              <td>{route.bus?.busName || route.busId}</td>
              <td>{route.origin}</td>
              <td>{route.destination}</td>
              <td>{route.departureTime ? new Date(route.departureTime).toLocaleString() : ""}</td>
              <td>{route.arrivalTime ? new Date(route.arrivalTime).toLocaleString() : ""}</td>
              <td>{route.distance} km</td>
              <td>₹{route.fare}</td>
              <td>
                <Button
                  variant="warning"
                  size="sm"
                  className="me-2"
                  onClick={() => handleEdit(route)}
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(route.routeId)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}


// src/pages/Routes.js
import React, { useEffect, useState } from "react";
import { getAllRoutes, addRoute, deleteRoute } from "../services/routeService";
import { Table, Button, Container, Form } from "react-bootstrap";

export default function RoutesPage() {
  const [routes, setRoutes] = useState([]);
  const [form, setForm] = useState({ origin: "", destination: "", fare: "" });

  useEffect(() => {
    loadRoutes();
  }, []);

  const loadRoutes = async () => {
    const res = await getAllRoutes();
    setRoutes(res.data);
  };

  const handleAdd = async () => {
    await addRoute(form);
    loadRoutes();
  };

  const handleDelete = async (id) => {
    await deleteRoute(id);
    loadRoutes();
  };

  return (
    <Container className="mt-4">
      <h2>Manage Routes</h2>
      <Form>
        <Form.Control
          placeholder="Origin"
          onChange={(e) => setForm({ ...form, origin: e.target.value })}
        />
        <Form.Control
          placeholder="Destination"
          onChange={(e) => setForm({ ...form, destination: e.target.value })}
        />
        <Form.Control
          placeholder="Fare"
          type="number"
          onChange={(e) => setForm({ ...form, fare: e.target.value })}
        />
        <Button className="mt-2" onClick={handleAdd}>Add Route</Button>
      </Form>
      <Table striped bordered hover className="mt-4">
        <thead>
          <tr>
            <th>ID</th>
            <th>Origin</th>
            <th>Destination</th>
            <th>Fare</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {routes.map((r) => (
            <tr key={r.routeId}>
              <td>{r.routeId}</td>
              <td>{r.origin}</td>
              <td>{r.destination}</td>
              <td>{r.fare}</td>
              <td>
                <Button variant="danger" onClick={() => handleDelete(r.routeId)}>
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

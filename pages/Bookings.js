// src/pages/Bookings.js
import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Container, Row, Col, Alert } from "react-bootstrap";
import {
  getMyBookings,
  addBooking,
  updateBooking,
  deleteBooking,
  getAllBookings,
  getBookingById,
} from "../services/bookingService";

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ bookingId: "", routeId: "", bookingDate: "", totalAmount: "", status: "Pending" });
  const [role] = useState(localStorage.getItem("role")); // fixed: removed setRole
  const [searchId, setSearchId] = useState("");
  const [error, setError] = useState("");

  // Fetch bookings based on role
  useEffect(() => {
    if (role === "ADMIN") {
      loadAllBookings();
    } else {
      loadMyBookings();
    }
  }, [role]);

  const loadMyBookings = async () => {
    const res = await getMyBookings();
    setBookings(res.data);
  };

  const loadAllBookings = async () => {
    const res = await getAllBookings();
    setBookings(res.data);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ Validation before submit
  const validateForm = () => {
    const today = new Date().toISOString().split("T")[0];

    if (!form.routeId || form.routeId <= 0) {
      return "Route ID must be greater than 0.";
    }
    if (!form.bookingDate || form.bookingDate <= today) {
      return "Booking date must be in the future.";
    }
    if (!form.totalAmount || form.totalAmount <= 0) {
      return "Total amount must be greater than 0.";
    }
    if (!["Confirmed", "Cancelled", "Pending"].includes(form.status)) {
      return "Invalid status selected.";
    }
    return null;
  };

  const handleSubmit = async () => {
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      if (form.bookingId) {
        await updateBooking(form);
      } else {
        await addBooking(form);
      }
      setShowModal(false);
      setError("");
      role === "ADMIN" ? loadAllBookings() : loadMyBookings();
    } catch (err) {
      console.error(err);
      setError("Error while saving booking");
    }
  };

  const handleDelete = async (id) => {
    await deleteBooking(id);
    loadMyBookings();
  };

  const handleSearchById = async () => {
    if (!searchId) return;
    const res = await getBookingById(searchId);
    setBookings(res.data ? [res.data] : []);
  };

  return (
    <Container className="mt-4">
      <h2>{role === "ADMIN" ? "All Bookings (Admin)" : "My Bookings"}</h2>

      {/* ADMIN Search by Booking ID */}
      {role === "ADMIN" && (
        <Row className="mb-3">
          <Col md={4}>
            <Form.Control
              type="number"
              placeholder="Enter Booking ID"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
            />
          </Col>
          <Col>
            <Button onClick={handleSearchById}>Search</Button>
            <Button className="ms-2" variant="secondary" onClick={loadAllBookings}>
              Reset
            </Button>
          </Col>
        </Row>
      )}

      {/* USER Add booking button */}
      {role === "USER" && (
        <Button className="mb-3" onClick={() => { setForm({}); setShowModal(true); }}>
          + Add Booking
        </Button>
      )}

      {/* Table */}
      <Table bordered hover responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Route</th>
            <th>Date</th>
            <th>Total Amount</th>
            <th>Status</th>
            {role === "USER" && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {bookings.map((b) => (
            <tr key={b.bookingId}>
              <td>{b.bookingId}</td>
              <td>{b.route?.origin} → {b.route?.destination}</td>
              <td>{new Date(b.bookingDate).toLocaleDateString()}</td>
              <td>₹{b.totalAmount}</td>
              <td>{b.status}</td>
              {role === "USER" && (
                <td>
                  <Button size="sm" variant="info" onClick={() => { setForm(b); setShowModal(true); }}>
                    Edit
                  </Button>{" "}
                  <Button size="sm" variant="danger" onClick={() => handleDelete(b.bookingId)}>
                    Delete
                  </Button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal for Add/Edit */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{form.bookingId ? "Update Booking" : "Add Booking"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>Route ID</Form.Label>
              <Form.Control type="number" name="routeId" value={form.routeId || ""} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Booking Date</Form.Label>
              <Form.Control type="date" name="bookingDate" value={form.bookingDate?.substring(0,10) || ""} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Total Amount</Form.Label>
              <Form.Control type="number" name="totalAmount" value={form.totalAmount || ""} onChange={handleChange} required />
            </Form.Group>
            <Form.Group>
              <Form.Label>Status</Form.Label>
              <Form.Select name="status" value={form.status || "Pending"} onChange={handleChange}>
                <option>Confirmed</option>
                <option>Cancelled</option>
                <option>Pending</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleSubmit}>{form.bookingId ? "Update" : "Add"}</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

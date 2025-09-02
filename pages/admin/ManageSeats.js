import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Card, Button, Table, Modal, Form, Alert, Spinner, Badge } from 'react-bootstrap';
import { adminService } from '../../services/adminService';

const ManageSeats = () => {
  const [seats, setSeats] = useState([]);
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSeat, setEditingSeat] = useState(null);
  const [formData, setFormData] = useState({
    busId: 0,
    seatNumber: '',
    seatType: 'Normal',
    seatStatus: 'Available'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Use useCallback to memoize the loadData function
  const loadData = useCallback(async () => {
    try {
      const [busesRes] = await Promise.all([
        adminService.getAllBuses()
      ]);
      setBuses(busesRes.data);
      // Load seats for the first bus by default
      if (busesRes.data.length > 0) {
        loadSeatsForBus(busesRes.data[0].busId);
        setFormData(prev => ({ ...prev, busId: busesRes.data[0].busId }));
      }
    } catch (err) {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadSeatsForBus = async (busId) => {
    try {
      const response = await adminService.getSeatsByBusId(busId);
      setSeats(response.data);
    } catch (err) {
      setError('Failed to load seats');
    }
  };

  useEffect(() => {
    loadData();
  }, [loadData]); // Now loadData is included in dependencies

  const handleBusChange = (busId) => {
    const busIdNum = parseInt(busId);
    setFormData({ ...formData, busId: busIdNum });
    loadSeatsForBus(busIdNum);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingSeat) {
        await adminService.updateSeat({ ...formData, seatId: editingSeat.seatId });
        setSuccess('Seat updated successfully');
      } else {
        await adminService.addSeat(formData);
        setSuccess('Seat added successfully');
      }
      setShowModal(false);
      setEditingSeat(null);
      setFormData({
        busId: formData.busId, // Keep the same bus selected
        seatNumber: '',
        seatType: 'Normal',
        seatStatus: 'Available'
      });
      loadSeatsForBus(formData.busId);
    } catch (err) {
      setError('Failed to save seat');
    }
  };

  const handleEdit = (seat) => {
    setEditingSeat(seat);
    setFormData({
      busId: seat.busId,
      seatNumber: seat.seatNumber,
      seatType: seat.seatType,
      seatStatus: seat.seatStatus
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this seat?')) {
      try {
        await adminService.deleteSeat(id);
        setSuccess('Seat deleted successfully');
        loadSeatsForBus(formData.busId);
      } catch (err) {
        setError('Failed to delete seat');
      }
    }
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" />
        <p>Loading seats...</p>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <Row className="mb-4">
        <Col>
          <h2>Manage Seats</h2>
          <div className="d-flex gap-2 mb-3">
            <Form.Select
              style={{ width: '300px' }}
              value={formData.busId}
              onChange={(e) => handleBusChange(e.target.value)}
            >
              {buses.map((bus) => (
                <option key={bus.busId} value={bus.busId}>
                  {bus.busName} ({bus.busNumber})
                </option>
              ))}
            </Form.Select>
            <Button onClick={() => setShowModal(true)}>Add New Seat</Button>
          </div>
        </Col>
      </Row>

      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <Row>
        <Col>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Seats for Selected Bus</h5>
            </Card.Header>
            <Card.Body>
              <Table responsive striped>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Seat Number</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {seats.map((seat) => (
                    <tr key={seat.seatId}>
                      <td>{seat.seatId}</td>
                      <td>{seat.seatNumber}</td>
                      <td>{seat.seatType}</td>
                      <td>
                        <Badge bg={seat.seatStatus === 'Available' ? 'success' : 'danger'}>
                          {seat.seatStatus}
                        </Badge>
                      </td>
                      <td>
                        <Button variant="outline-primary" size="sm" onClick={() => handleEdit(seat)} className="me-2">
                          Edit
                        </Button>
                        <Button variant="outline-danger" size="sm" onClick={() => handleDelete(seat.seatId)}>
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editingSeat ? 'Edit Seat' : 'Add New Seat'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Seat Number</Form.Label>
              <Form.Control
                type="text"
                value={formData.seatNumber}
                onChange={(e) => setFormData({ ...formData, seatNumber: e.target.value })}
                placeholder="A1, B2, etc."
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Seat Type</Form.Label>
              <Form.Select
                value={formData.seatType}
                onChange={(e) => setFormData({ ...formData, seatType: e.target.value })}
              >
                <option value="Normal">Normal</option>
                <option value="Window">Window</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Seat Status</Form.Label>
              <Form.Select
                value={formData.seatStatus}
                onChange={(e) => setFormData({ ...formData, seatStatus: e.target.value })}
              >
                <option value="Available">Available</option>
                <option value="Booked">Booked</option>
              </Form.Select>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              {editingSeat ? 'Update' : 'Add'} Seat
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default ManageSeats;
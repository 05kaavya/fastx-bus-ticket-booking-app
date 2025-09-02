import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Modal, Form, Alert, Spinner } from 'react-bootstrap';
import { adminService } from '../../services/adminService';

const ManageBuses = () => {
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBus, setEditingBus] = useState(null);
  const [formData, setFormData] = useState({
    busName: '',
    busNumber: '',
    busType: 'Sleeper',
    totalSeats: 0,
    amenities: '',
    operatorId: 0
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadBuses();
  }, []);

  const loadBuses = async () => {
    try {
      const response = await adminService.getAllBuses();
      setBuses(response.data);
    } catch (err) {
      setError('Failed to load buses');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingBus) {
        await adminService.updateBus({ ...formData, busId: editingBus.busId });
        setSuccess('Bus updated successfully');
      } else {
        await adminService.addBus(formData);
        setSuccess('Bus added successfully');
      }
      setShowModal(false);
      setEditingBus(null);
      setFormData({
        busName: '',
        busNumber: '',
        busType: 'Sleeper',
        totalSeats: 0,
        amenities: '',
        operatorId: 0
      });
      loadBuses();
    } catch (err) {
      setError('Failed to save bus');
    }
  };

  const handleEdit = (bus) => {
    setEditingBus(bus);
    setFormData({
      busName: bus.busName,
      busNumber: bus.busNumber,
      busType: bus.busType,
      totalSeats: bus.totalSeats,
      amenities: bus.amenities || '',
      operatorId: bus.operator?.operatorId || 0
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this bus?')) {
      try {
        await adminService.deleteBus(id);
        setSuccess('Bus deleted successfully');
        loadBuses();
      } catch (err) {
        setError('Failed to delete bus');
      }
    }
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" />
        <p>Loading buses...</p>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <Row className="mb-4">
        <Col>
          <h2>Manage Buses</h2>
          <Button onClick={() => setShowModal(true)}>Add New Bus</Button>
        </Col>
      </Row>

      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <Row>
        <Col>
          <Card>
            <Card.Header>
              <h5 className="mb-0">All Buses</h5>
            </Card.Header>
            <Card.Body>
              <Table responsive striped>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Number</th>
                    <th>Type</th>
                    <th>Seats</th>
                    <th>Amenities</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {buses.map((bus) => (
                    <tr key={bus.busId}>
                      <td>{bus.busId}</td>
                      <td>{bus.busName}</td>
                      <td>{bus.busNumber}</td>
                      <td>{bus.busType}</td>
                      <td>{bus.totalSeats}</td>
                      <td>{bus.amenities || 'N/A'}</td>
                      <td>
                        <Button variant="outline-primary" size="sm" onClick={() => handleEdit(bus)} className="me-2">
                          Edit
                        </Button>
                        <Button variant="outline-danger" size="sm" onClick={() => handleDelete(bus.busId)}>
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
          <Modal.Title>{editingBus ? 'Edit Bus' : 'Add New Bus'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Bus Name</Form.Label>
              <Form.Control
                type="text"
                value={formData.busName}
                onChange={(e) => setFormData({ ...formData, busName: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Bus Number</Form.Label>
              <Form.Control
                type="text"
                value={formData.busNumber}
                onChange={(e) => setFormData({ ...formData, busNumber: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Bus Type</Form.Label>
              <Form.Select
                value={formData.busType}
                onChange={(e) => setFormData({ ...formData, busType: e.target.value })}
              >
                <option value="Sleeper">Sleeper</option>
                <option value="A/C">A/C</option>
                <option value="Non-A/C">Non-A/C</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Total Seats</Form.Label>
              <Form.Control
                type="number"
                value={formData.totalSeats}
                onChange={(e) => setFormData({ ...formData, totalSeats: parseInt(e.target.value) })}
                required
                min="1"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Amenities</Form.Label>
              <Form.Control
                type="text"
                value={formData.amenities}
                onChange={(e) => setFormData({ ...formData, amenities: e.target.value })}
                placeholder="Water bottle, Blanket, Charging point, TV"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Operator ID</Form.Label>
              <Form.Control
                type="number"
                value={formData.operatorId}
                onChange={(e) => setFormData({ ...formData, operatorId: parseInt(e.target.value) })}
                required
                min="1"
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              {editingBus ? 'Update' : 'Add'} Bus
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default ManageBuses;
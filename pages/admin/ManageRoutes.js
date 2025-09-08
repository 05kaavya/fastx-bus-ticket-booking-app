import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Modal, Alert, Spinner } from 'react-bootstrap';
import { adminService } from '../../services/adminService';

const ManageRoutes = () => {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [routeToDelete, setRouteToDelete] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const routesRes = await adminService.getAllRoutes();
      setRoutes(routesRes.data);
    } catch (err) {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await adminService.deleteRoute(id);
      setSuccess('Route deleted successfully');
      setShowDeleteModal(false);
      setRouteToDelete(null);
      loadData();
    } catch (err) {
      setError('Failed to delete route');
    }
  };

  const confirmDelete = (route) => {
    setRouteToDelete(route);
    setShowDeleteModal(true);
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" />
        <p>Loading routes...</p>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <Row className="mb-4">
        <Col>
          <h2>Manage Routes</h2>
          <p className="text-muted">Admin can view and delete routes only</p>
        </Col>
      </Row>

      {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}
      {success && <Alert variant="success" onClose={() => setSuccess('')} dismissible>{success}</Alert>}

      <Row>
        <Col>
          <Card>
            <Card.Header>
              <h5 className="mb-0">All Routes</h5>
            </Card.Header>
            <Card.Body>
              {routes.length === 0 ? (
                <div className="text-center py-4">
                  <p>No routes found</p>
                </div>
              ) : (
                <Table responsive striped>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Origin</th>
                      <th>Destination</th>
                      <th>Bus</th>
                      <th>Bus Number</th>
                      <th>Departure</th>
                      <th>Arrival</th>
                      <th>Distance</th>
                      <th>Fare</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {routes.map((route) => (
                      <tr key={route.routeId}>
                        <td>{route.routeId}</td>
                        <td>{route.origin}</td>
                        <td>{route.destination}</td>
                        <td>{route.bus?.busName || 'N/A'}</td>
                        <td>{route.bus?.busNumber || 'N/A'}</td>
                        <td>{new Date(route.departureTime).toLocaleString()}</td>
                        <td>{new Date(route.arrivalTime).toLocaleString()}</td>
                        <td>{route.distance} km</td>
                        <td>₹{route.fare}</td>
                        <td>
                          <Button 
                            variant="outline-danger" 
                            size="sm" 
                            onClick={() => confirmDelete(route)}
                          >
                            Delete
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {routeToDelete && (
            <div>
              <p>Are you sure you want to delete this route?</p>
              <p><strong>Route:</strong> {routeToDelete.origin} → {routeToDelete.destination}</p>
              <p><strong>Bus:</strong> {routeToDelete.bus?.busName || 'N/A'} ({routeToDelete.bus?.busNumber || 'N/A'})</p>
              <p><strong>Departure:</strong> {new Date(routeToDelete.departureTime).toLocaleString()}</p>
              <p className="text-danger">
                <strong>Warning:</strong> This action cannot be undone. Deleting this route may affect existing bookings and schedules.
              </p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button 
            variant="danger" 
            onClick={() => handleDelete(routeToDelete?.routeId)}
          >
            Delete Route
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ManageRoutes;

// import React, { useState, useEffect } from 'react';
// import { Container, Row, Col, Card, Button, Table, Modal, Form, Alert, Spinner } from 'react-bootstrap';
// import { adminService } from '../../services/adminService';

// const ManageRoutes = () => {
//   const [routes, setRoutes] = useState([]);
//   const [buses, setBuses] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showModal, setShowModal] = useState(false);
//   const [formData, setFormData] = useState({
//     origin: '',
//     destination: '',
//     departureTime: '',
//     arrivalTime: '',
//     distance: 0,
//     fare: 0,
//     busId: 0
//   });
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');

//   useEffect(() => {
//     loadData();
//   }, []);

//   const loadData = async () => {
//     try {
//       const [routesRes, busesRes] = await Promise.all([
//         adminService.getAllRoutes(),
//         adminService.getAllBuses()
//       ]);
//       setRoutes(routesRes.data);
//       setBuses(busesRes.data);
//     } catch (err) {
//       setError('Failed to load data');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await adminService.addRoute(formData);
//       setSuccess('Route added successfully');
//       setShowModal(false);
//       setFormData({
//         origin: '',
//         destination: '',
//         departureTime: '',
//         arrivalTime: '',
//         distance: 0,
//         fare: 0,
//         busId: 0
//       });
//       loadData();
//     } catch (err) {
//       setError('Failed to add route');
//     }
//   };

//   const handleDelete = async (id) => {
//     if (window.confirm('Are you sure you want to delete this route?')) {
//       try {
//         await adminService.deleteRoute(id);
//         setSuccess('Route deleted successfully');
//         loadData();
//       } catch (err) {
//         setError('Failed to delete route');
//       }
//     }
//   };

//   if (loading) {
//     return (
//       <Container className="text-center mt-5">
//         <Spinner animation="border" />
//         <p>Loading routes...</p>
//       </Container>
//     );
//   }

//   return (
//     <Container className="mt-4">
//       <Row className="mb-4">
//         <Col>
//           <h2>Manage Routes</h2>
//           <Button onClick={() => setShowModal(true)}>Add New Route</Button>
//         </Col>
//       </Row>

//       {error && <Alert variant="danger">{error}</Alert>}
//       {success && <Alert variant="success">{success}</Alert>}

//       <Row>
//         <Col>
//           <Card>
//             <Card.Header>
//               <h5 className="mb-0">All Routes</h5>
//             </Card.Header>
//             <Card.Body>
//               <Table responsive striped>
//                 <thead>
//                   <tr>
//                     <th>ID</th>
//                     <th>Origin</th>
//                     <th>Destination</th>
//                     <th>Bus</th>
//                     <th>Departure</th>
//                     <th>Arrival</th>
//                     <th>Fare</th>
//                     <th>Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {routes.map((route) => (
//                     <tr key={route.routeId}>
//                       <td>{route.routeId}</td>
//                       <td>{route.origin}</td>
//                       <td>{route.destination}</td>
//                       <td>{route.bus?.busName || 'N/A'}</td>
//                       <td>{new Date(route.departureTime).toLocaleString()}</td>
//                       <td>{new Date(route.arrivalTime).toLocaleString()}</td>
//                       <td>₹{route.fare}</td>
//                       <td>
//                         <Button variant="outline-danger" size="sm" onClick={() => handleDelete(route.routeId)}>
//                           Delete
//                         </Button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </Table>
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>

//       <Modal show={showModal} onHide={() => setShowModal(false)}>
//         <Modal.Header closeButton>
//           <Modal.Title>Add New Route</Modal.Title>
//         </Modal.Header>
//         <Form onSubmit={handleSubmit}>
//           <Modal.Body>
//             <Form.Group className="mb-3">
//               <Form.Label>Origin</Form.Label>
//               <Form.Control
//                 type="text"
//                 value={formData.origin}
//                 onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
//                 required
//               />
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>Destination</Form.Label>
//               <Form.Control
//                 type="text"
//                 value={formData.destination}
//                 onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
//                 required
//               />
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>Bus</Form.Label>
//               <Form.Select
//                 value={formData.busId}
//                 onChange={(e) => setFormData({ ...formData, busId: parseInt(e.target.value) })}
//                 required
//               >
//                 <option value={0}>Select Bus</option>
//                 {buses.map((bus) => (
//                   <option key={bus.busId} value={bus.busId}>
//                     {bus.busName} ({bus.busNumber})
//                   </option>
//                 ))}
//               </Form.Select>
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>Departure Time</Form.Label>
//               <Form.Control
//                 type="datetime-local"
//                 value={formData.departureTime}
//                 onChange={(e) => setFormData({ ...formData, departureTime: e.target.value })}
//                 required
//               />
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>Arrival Time</Form.Label>
//               <Form.Control
//                 type="datetime-local"
//                 value={formData.arrivalTime}
//                 onChange={(e) => setFormData({ ...formData, arrivalTime: e.target.value })}
//                 required
//               />
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>Distance (km)</Form.Label>
//               <Form.Control
//                 type="number"
//                 step="0.1"
//                 value={formData.distance}
//                 onChange={(e) => setFormData({ ...formData, distance: parseFloat(e.target.value) })}
//                 required
//                 min="0.1"
//               />
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>Fare (₹)</Form.Label>
//               <Form.Control
//                 type="number"
//                 step="0.01"
//                 value={formData.fare}
//                 onChange={(e) => setFormData({ ...formData, fare: parseFloat(e.target.value) })}
//                 required
//                 min="0.01"
//               />
//             </Form.Group>
//           </Modal.Body>
//           <Modal.Footer>
//             <Button variant="secondary" onClick={() => setShowModal(false)}>
//               Cancel
//             </Button>
//             <Button variant="primary" type="submit">
//               Add Route
//             </Button>
//           </Modal.Footer>
//         </Form>
//       </Modal>
//     </Container>
//   );
// };

// export default ManageRoutes;
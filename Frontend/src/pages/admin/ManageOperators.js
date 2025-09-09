import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Modal, Alert, Spinner } from 'react-bootstrap';
import { adminService } from '../../services/adminService';

const ManageOperators = () => {
  const [operators, setOperators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [operatorToDelete, setOperatorToDelete] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadOperators();
  }, []);

  const loadOperators = async () => {
    try {
      const response = await adminService.getAllOperators();
      setOperators(response.data);
    } catch (err) {
      if (err.response?.status === 403) {
        setError('Access denied: You do not have permission to view operators');
      } else {
        setError('Failed to load operators');
      }
      console.error('Error loading operators:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await adminService.deleteOperator(id);
      setSuccess('Operator deleted successfully');
      setShowDeleteModal(false);
      setOperatorToDelete(null);
      loadOperators();
    } catch (err) {
      if (err.response?.status === 403) {
        setError('Access denied: You do not have permission to delete operators');
      } else {
        setError('Failed to delete operator');
      }
      console.error('Error deleting operator:', err);
    }
  };

  const confirmDelete = (operator) => {
    setOperatorToDelete(operator);
    setShowDeleteModal(true);
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" />
        <p>Loading operators...</p>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <Row className="mb-4">
        <Col>
          <h2>Manage Operators</h2>
          <p className="text-muted">Admin can view and delete operators only</p>
        </Col>
      </Row>

      {error && (
        <Alert variant="danger" onClose={() => setError('')} dismissible>
          {error}
        </Alert>
      )}
      {success && (
        <Alert variant="success" onClose={() => setSuccess('')} dismissible>
          {success}
        </Alert>
      )}

      <Row>
        <Col>
          <Card>
            <Card.Header>
              <h5 className="mb-0">All Operators</h5>
            </Card.Header>
            <Card.Body>
              {operators.length === 0 ? (
                <div className="text-center py-4">
                  <p>No operators found or access denied</p>
                </div>
              ) : (
                <Table responsive striped>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Contact</th>
                      <th>Address</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {operators.map((operator) => (
                      <tr key={operator.operatorId}>
                        <td>{operator.operatorId}</td>
                        <td>{operator.operatorName}</td>
                        <td>{operator.email}</td>
                        <td>{operator.contactNumber}</td>
                        <td>{operator.address || 'N/A'}</td>
                        <td>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => confirmDelete(operator)}
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
          {operatorToDelete && (
            <div>
              <p>Are you sure you want to delete this operator?</p>
              <p><strong>Name:</strong> {operatorToDelete.operatorName}</p>
              <p><strong>Email:</strong> {operatorToDelete.email}</p>
              <p className="text-danger">
                <strong>Warning:</strong> This action cannot be undone. Deleting this operator may affect associated buses and routes.
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
            onClick={() => handleDelete(operatorToDelete?.operatorId)}
          >
            Delete Operator
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ManageOperators;

// import React, { useState, useEffect } from 'react';
// import { Container, Row, Col, Card, Button, Table, Modal, Form, Alert, Spinner } from 'react-bootstrap';
// import { adminService } from '../../services/adminService';

// const ManageOperators = () => {
//   const [operators, setOperators] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showModal, setShowModal] = useState(false);
//   const [formData, setFormData] = useState({
//     operatorName: '',
//     email: '',
//     contactNumber: '',
//     address: '',
//     password: ''
//   });
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');

//   useEffect(() => {
//     loadOperators();
//   }, []);

//   const loadOperators = async () => {
//     try {
//       const response = await adminService.getAllOperators();
//       setOperators(response.data);
//     } catch (err) {
//       setError('Failed to load operators');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await adminService.addOperator(formData);
//       setSuccess('Operator added successfully');
//       setShowModal(false);
//       setFormData({
//         operatorName: '',
//         email: '',
//         contactNumber: '',
//         address: '',
//         password: ''
//       });
//       loadOperators();
//     } catch (err) {
//       setError('Failed to add operator');
//     }
//   };

//   const handleDelete = async (id) => {
//     if (window.confirm('Are you sure you want to delete this operator?')) {
//       try {
//         await adminService.deleteOperator(id);
//         setSuccess('Operator deleted successfully');
//         loadOperators();
//       } catch (err) {
//         setError('Failed to delete operator');
//       }
//     }
//   };

//   if (loading) {
//     return (
//       <Container className="text-center mt-5">
//         <Spinner animation="border" />
//         <p>Loading operators...</p>
//       </Container>
//     );
//   }

//   return (
//     <Container className="mt-4">
//       <Row className="mb-4">
//         <Col>
//           <h2>Manage Operators</h2>
//           <Button onClick={() => setShowModal(true)}>Add New Operator</Button>
//         </Col>
//       </Row>

//       {error && <Alert variant="danger">{error}</Alert>}
//       {success && <Alert variant="success">{success}</Alert>}

//       <Row>
//         <Col>
//           <Card>
//             <Card.Header>
//               <h5 className="mb-0">All Operators</h5>
//             </Card.Header>
//             <Card.Body>
//               <Table responsive striped>
//                 <thead>
//                   <tr>
//                     <th>ID</th>
//                     <th>Name</th>
//                     <th>Email</th>
//                     <th>Contact</th>
//                     <th>Address</th>
//                     <th>Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {operators.map((operator) => (
//                     <tr key={operator.operatorId}>
//                       <td>{operator.operatorId}</td>
//                       <td>{operator.operatorName}</td>
//                       <td>{operator.email}</td>
//                       <td>{operator.contactNumber}</td>
//                       <td>{operator.address || 'N/A'}</td>
//                       <td>
//                         <Button variant="outline-danger" size="sm" onClick={() => handleDelete(operator.operatorId)}>
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
//           <Modal.Title>Add New Operator</Modal.Title>
//         </Modal.Header>
//         <Form onSubmit={handleSubmit}>
//           <Modal.Body>
//             <Form.Group className="mb-3">
//               <Form.Label>Operator Name</Form.Label>
//               <Form.Control
//                 type="text"
//                 value={formData.operatorName}
//                 onChange={(e) => setFormData({ ...formData, operatorName: e.target.value })}
//                 required
//               />
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>Email</Form.Label>
//               <Form.Control
//                 type="email"
//                 value={formData.email}
//                 onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//                 required
//               />
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>Contact Number</Form.Label>
//               <Form.Control
//                 type="text"
//                 value={formData.contactNumber}
//                 onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
//                 required
//               />
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>Address</Form.Label>
//               <Form.Control
//                 as="textarea"
//                 rows={3}
//                 value={formData.address}
//                 onChange={(e) => setFormData({ ...formData, address: e.target.value })}
//               />
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>Password</Form.Label>
//               <Form.Control
//                 type="password"
//                 value={formData.password}
//                 onChange={(e) => setFormData({ ...formData, password: e.target.value })}
//                 required
//               />
//             </Form.Group>
//           </Modal.Body>
//           <Modal.Footer>
//             <Button variant="secondary" onClick={() => setShowModal(false)}>
//               Cancel
//             </Button>
//             <Button variant="primary" type="submit">
//               Add Operator
//             </Button>
//           </Modal.Footer>
//         </Form>
//       </Modal>
//     </Container>
//   );
// };

// export default ManageOperators;
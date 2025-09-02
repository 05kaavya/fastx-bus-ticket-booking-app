import { useEffect, useState } from "react";
import {
  getAllOperators,
  deleteOperator,
} from "../services/operatorService";
import { Table, Button, Container } from "react-bootstrap";

export default function OperatorsPage() {
  const [operators, setOperators] = useState([]);

  const loadOperators = async () => {
    try {
      const res = await getAllOperators();
      setOperators(res.data);
    } catch (err) {
      console.error("Error loading operators", err);
    }
  };

  useEffect(() => {
    loadOperators();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteOperator(id);
      loadOperators();
    } catch (err) {
      console.error("Error deleting operator", err);
    }
  };

  return (
    <Container className="mt-4">
      <h2>Manage Bus Operators</h2>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Contact</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {operators.length > 0 ? (
            operators.map((op) => (
              <tr key={op.operatorId}>
                <td>{op.operatorId}</td>
                <td>{op.name}</td>
                <td>{op.contact}</td>
                <td>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(op.operatorId)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="text-center">
                No operators found
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </Container>
  );
}

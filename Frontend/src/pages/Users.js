import { useEffect, useState } from "react";
import { getAllUsers, deleteUser } from "../services/userService";
import { Table, Button, Container } from "react-bootstrap";

export default function UsersPage() {
  const [users, setUsers] = useState([]);

  const loadUsers = async () => {
    try {
      const res = await getAllUsers();
      setUsers(res.data);
    } catch (err) {
      console.error("Error loading users", err);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteUser(id);
      loadUsers();
    } catch (err) {
      console.error("Error deleting user", err);
    }
  };

  return (
    <Container className="mt-4">
      <h2>Manage Users</h2>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((u) => (
              <tr key={u.userId}>
                <td>{u.userId}</td>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(u.userId)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="text-center">
                No users found
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </Container>
  );
}

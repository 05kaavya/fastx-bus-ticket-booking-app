import { useState } from "react";
import { registerAdmin } from "../services/authService";
import { useNavigate } from "react-router-dom";
import { Form, Button, Container, Alert } from "react-bootstrap";

export default function AdminRegister() {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "ADMIN" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerAdmin(form);
      alert("Admin registered successfully! Please login.");
      navigate("/admin/login");
    } catch (err) {
      setError(err.response?.data || "Registration failed");
    }
  };

  return (
    <Container className="mt-4">
      <h2>Admin Registration</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>Name</Form.Label>
          <Form.Control name="name" onChange={handleChange} required />
        </Form.Group>
        <Form.Group>
          <Form.Label>Email</Form.Label>
          <Form.Control type="email" name="email" onChange={handleChange} required />
        </Form.Group>
        <Form.Group>
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" name="password" onChange={handleChange} required />
        </Form.Group>
        <Button type="submit" className="mt-3">Register</Button>
      </Form>
    </Container>
  );
}

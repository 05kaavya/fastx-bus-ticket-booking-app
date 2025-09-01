import { useState } from "react";
import { loginUser } from "../services/authService";
import { useNavigate } from "react-router-dom";
import { Form, Button, Container, Alert } from "react-bootstrap";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await loginUser(form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", "USER");

      // ✅ Navigate to route, not file
      navigate("/dashboard");
    } catch (err) {
      setError("Invalid credentials");
    }
  };

  return (
    <Container className="mt-4">
      <h2>User Login</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>Email</Form.Label>
          <Form.Control type="email" name="email" onChange={handleChange} required />
        </Form.Group>
        <Form.Group>
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" name="password" onChange={handleChange} required />
        </Form.Group>
        <Button type="submit" className="mt-3">Login</Button>
      </Form>
    </Container>
  );
}

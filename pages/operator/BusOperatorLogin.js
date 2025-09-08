// src/pages/BusOperatorLogin.js
import { useState } from "react";
import { loginBusOperator } from "../../services/authService";
import { useNavigate, Link } from "react-router-dom";
import { Form, Button, Container, Alert, Card, Row, Col } from "react-bootstrap";

export default function BusOperatorLogin() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    // Clear error when user starts typing
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const res = await loginBusOperator(form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", "OPERATOR");
      localStorage.setItem("username", form.email.split('@')[0]);
      localStorage.setItem("operatorId", res.data.operatorId); // Store operator ID for API calls
      
      // Show success message in session storage to display on the next page
      sessionStorage.setItem("loginSuccess", "Bus operator login successful!");
      
      navigate("/operator/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container fluid className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
      <Row className="w-100 justify-content-center">
        <Col xs={12} sm={8} md={6} lg={4}>
          <Card className="shadow-lg border-0 rounded-3">
            <Card.Body className="p-5">
              <div className="text-center mb-4">
                <i className="fas fa-bus fa-3x text-primary mb-3"></i>
                <h2 className="fw-bold">Bus Operator Login</h2>
                <p className="text-muted">Access your bus operator dashboard</p>
              </div>
              
              {error && (
                <Alert variant="danger" className="py-2">
                  <i className="fas fa-exclamation-circle me-2"></i>
                  {error}
                </Alert>
              )}
              
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-medium">Email Address</Form.Label>
                  <Form.Control 
                    type="email" 
                    name="email" 
                    value={form.email}
                    onChange={handleChange} 
                    required 
                    placeholder="Enter your operator email"
                    className="py-2"
                  />
                </Form.Group>
                
                <Form.Group className="mb-4">
                  <Form.Label className="fw-medium">Password</Form.Label>
                  <Form.Control 
                    type="password" 
                    name="password" 
                    value={form.password}
                    onChange={handleChange} 
                    required 
                    placeholder="Enter your password"
                    className="py-2"
                  />
                </Form.Group>
                
                <div className="d-grid gap-2">
                  <Button 
                    type="submit" 
                    variant="primary" 
                    size="lg" 
                    disabled={loading}
                    className="py-2 fw-semibold"
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Logging in...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-sign-in-alt me-2"></i>
                        Login
                      </>
                    )}
                  </Button>
                </div>
                
                <div className="text-center mt-4">
                  <p className="mb-0">
                    Don't have an operator account? 
                    <Button 
                      variant="link" 
                      className="p-0 ms-1 text-decoration-none"
                      onClick={() => navigate("/operator/register")}
                    >
                      Register Here
                    </Button>
                  </p>
                  
                  <hr className="my-4" />
                  
                  <Link to="/" className="text-decoration-none">
                    <i className="fas fa-arrow-left me-1"></i>
                    Back to Home
                  </Link>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
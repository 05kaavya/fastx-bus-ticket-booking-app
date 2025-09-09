import { useState } from "react";
import { loginAdmin } from "../services/authService";
import { useNavigate, Link } from "react-router-dom";
import { Form, Button, Container, Alert, Card, Row, Col } from "react-bootstrap";

export default function AdminLogin() {
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
      const res = await loginAdmin(form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", "ADMIN");
      localStorage.setItem("username", form.email.split('@')[0]);
      
      // Show success message in session storage to display on the next page
      sessionStorage.setItem("loginSuccess", "Admin login successful!");
      
      navigate("/admin/dashboard");
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
                <i className="fas fa-user-shield fa-3x text-primary mb-3"></i>
                <h2 className="fw-bold">Admin Login</h2>
                <p className="text-muted">Access the admin dashboard</p>
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
                    placeholder="Enter your admin email"
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
                    Don't have an admin account? 
                    <Button 
                      variant="link" 
                      className="p-0 ms-1 text-decoration-none"
                      onClick={() => alert("Please contact system administrator to create an admin account.")}
                    >
                      Request Access
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

// import { useState } from "react";
// import { loginAdmin } from "../services/authService";
// import { useNavigate } from "react-router-dom";
// import { Form, Button, Container, Alert } from "react-bootstrap";

// export default function AdminLogin() {
//   const [form, setForm] = useState({ email: "", password: "" });
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await loginAdmin(form);
//       localStorage.setItem("token", res.data.token);
//       localStorage.setItem("role", "ADMIN");
//       navigate("/admin/dashboard");
//     } catch (err) {
//       setError("Invalid credentials");
//     }
//   };

//   return (
//     <Container className="mt-4">
//       <h2>Admin Login</h2>
//       {error && <Alert variant="danger">{error}</Alert>}
//       <Form onSubmit={handleSubmit}>
//         <Form.Group>
//           <Form.Label>Email</Form.Label>
//           <Form.Control type="email" name="email" onChange={handleChange} required />
//         </Form.Group>
//         <Form.Group>
//           <Form.Label>Password</Form.Label>
//           <Form.Control type="password" name="password" onChange={handleChange} required />
//         </Form.Group>
//         <Button type="submit" className="mt-3">Login</Button>
//       </Form>
//     </Container>
//   );
// }

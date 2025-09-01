import { useState } from "react";
import { registerUser } from "../services/authService";
import { useNavigate } from "react-router-dom";
import { Form, Button, Container, Alert } from "react-bootstrap";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    gender: "",
    contactNumber: "",
    address: "",
    role: "USER"
  });
  const [error, setError] = useState("");
  const [validationErrors, setValidationErrors] = useState({});
  const navigate = useNavigate();

  const validateField = (name, value) => {
    let error = "";
    
    switch (name) {
      case "name":
        if (!value.trim()) {
          error = "Name cannot be blank";
        } else if (!/^[A-Za-z ]+$/.test(value)) {
          error = "Name must contain only letters and spaces";
        }
        break;
        
      case "email":
        if (!value.trim()) {
          error = "Email cannot be blank";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = "Email should be valid";
        }
        break;
        
      case "password":
        if (!/^(?=.{8,20}$)(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/.test(value)) {
          error = "Password must be 8-20 chars, include upper & lower case letters, a digit and a special character";
        }
        break;
        
      case "contactNumber":
        if (!value.trim()) {
          error = "Contact number cannot be blank";
        } else if (!/^[6-9]\d{9}$/.test(value)) {
          error = "Invalid contact number";
        }
        break;
        
      default:
        break;
    }
    
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    
    // Clear previous error for this field
    if (validationErrors[name]) {
      const newErrors = { ...validationErrors };
      delete newErrors[name];
      setValidationErrors(newErrors);
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    
    if (error) {
      setValidationErrors({
        ...validationErrors,
        [name]: error
      });
    }
  };

  const validateForm = () => {
    const errors = {};
    
    // Validate all fields
    Object.keys(form).forEach(key => {
      if (key !== "gender" && key !== "address" && key !== "role") {
        const error = validateField(key, form[key]);
        if (error) {
          errors[key] = error;
        }
      }
    });
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      await registerUser(form);
      alert("Registration successful! Please login.");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data || "Registration failed");
    }
  };

  return (
    <Container className="mt-4" style={{ maxWidth: "600px" }}>
      <div className="card shadow">
        <div className="card-header bg-primary text-white">
          <h2 className="mb-0">User Registration</h2>
        </div>
        <div className="card-body">
          {error && <Alert variant="danger">{error}</Alert>}
          
          <Form onSubmit={handleSubmit} noValidate>
            <Form.Group className="mb-3">
              <Form.Label>Name *</Form.Label>
              <Form.Control 
                name="name" 
                value={form.name}
                onChange={handleChange}
                onBlur={handleBlur}
                isInvalid={!!validationErrors.name}
                required 
              />
              <Form.Control.Feedback type="invalid">
                {validationErrors.name}
              </Form.Control.Feedback>
              <Form.Text className="text-muted">
                Must contain only letters and spaces
              </Form.Text>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Email *</Form.Label>
              <Form.Control 
                type="email" 
                name="email" 
                value={form.email}
                onChange={handleChange}
                onBlur={handleBlur}
                isInvalid={!!validationErrors.email}
                required 
              />
              <Form.Control.Feedback type="invalid">
                {validationErrors.email}
              </Form.Control.Feedback>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Password *</Form.Label>
              <Form.Control 
                type="password" 
                name="password" 
                value={form.password}
                onChange={handleChange}
                onBlur={handleBlur}
                isInvalid={!!validationErrors.password}
                required 
              />
              <Form.Control.Feedback type="invalid">
                {validationErrors.password}
              </Form.Control.Feedback>
              <Form.Text className="text-muted">
                8-20 characters, must include uppercase, lowercase, number, and special character
              </Form.Text>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Gender</Form.Label>
              <Form.Select 
                name="gender" 
                value={form.gender}
                onChange={handleChange}
              >
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </Form.Select>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Contact Number *</Form.Label>
              <Form.Control 
                name="contactNumber" 
                value={form.contactNumber}
                onChange={handleChange}
                onBlur={handleBlur}
                isInvalid={!!validationErrors.contactNumber}
                required 
              />
              <Form.Control.Feedback type="invalid">
                {validationErrors.contactNumber}
              </Form.Control.Feedback>
              <Form.Text className="text-muted">
                Must be a valid 10-digit Indian mobile number starting with 6-9
              </Form.Text>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Address</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={2} 
                name="address" 
                value={form.address}
                onChange={handleChange}
              />
            </Form.Group>
            
            <div className="d-grid">
              <Button 
                type="submit" 
                variant="primary" 
                size="lg"
              >
                Register
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </Container>
  );
}
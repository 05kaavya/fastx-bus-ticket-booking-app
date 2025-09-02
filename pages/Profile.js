import React, { useEffect, useState } from "react";
import { Container, Card, Spinner, Button, Alert, Form } from "react-bootstrap";
import axios from "axios";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editMode, setEditMode] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("Failed to load profile. Please log in again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      setError("");
      setSuccess("");
      const res = await axios.put(
        "http://localhost:8080/api/users/update",
        user,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUser(res.data);
      setSuccess("Profile updated successfully ✅");
      setEditMode(false);
    } catch (err) {
      console.error("Error updating profile:", err);
      setError("Failed to update profile. Try again.");
    }
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" />
        <p>Loading profile...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-5" style={{ maxWidth: "600px" }}>
      <Card className="shadow-sm">
        <Card.Body>
          <Card.Title className="mb-3">👤 My Profile</Card.Title>

          {success && <Alert variant="success">{success}</Alert>}
          {error && <Alert variant="danger">{error}</Alert>}

          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={user?.name || ""}
                onChange={handleChange}
                disabled={!editMode}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" value={user?.email || ""} disabled />
            </Form.Group>

            <Form.Group className="mb-3">
  <Form.Label>Phone Number</Form.Label>
  <Form.Control
    type="text"
    name="phone"
    value={user?.phone || ""}
    onChange={handleChange}
    disabled={!editMode}   // 👈 visible always, editable only in editMode
  />
</Form.Group>


            <Form.Group className="mb-3">
              <Form.Label>Role</Form.Label>
              <Form.Control type="text" value={user?.role || ""} disabled />
            </Form.Group>

            {!editMode ? (
              <Button variant="secondary" className="w-100" onClick={() => setEditMode(true)}>
                Edit Profile
              </Button>
            ) : (
              <Button variant="primary" className="w-100" onClick={handleSave}>
                Save Changes
              </Button>
            )}
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Profile;

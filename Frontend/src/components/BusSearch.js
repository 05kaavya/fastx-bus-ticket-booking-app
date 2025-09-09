import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { busService } from '../services/busService';
import BusList from './BusList';

const BusSearch = () => {
  const [searchData, setSearchData] = useState({
    origin: '',
    destination: '',
    date: ''
  });
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchData({
      ...searchData,
      [name]: value
    });
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSearched(true);

    try {
      const results = await busService.searchBuses(
        searchData.origin,
        searchData.destination,
        searchData.date
      );
      setBuses(results);
    } catch (err) {
      setError('Failed to search buses. Please try again.');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="shadow">
            <Card.Header className="bg-primary text-white">
              <h3 className="mb-0">Search Buses</h3>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleSearch}>
                <Row>
                  <Col md={5}>
                    <Form.Group className="mb-3">
                      <Form.Label>From</Form.Label>
                      <Form.Control
                        type="text"
                        name="origin"
                        value={searchData.origin}
                        onChange={handleInputChange}
                        placeholder="Enter origin city"
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={5}>
                    <Form.Group className="mb-3">
                      <Form.Label>To</Form.Label>
                      <Form.Control
                        type="text"
                        name="destination"
                        value={searchData.destination}
                        onChange={handleInputChange}
                        placeholder="Enter destination city"
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={2}>
                    <Form.Group className="mb-3">
                      <Form.Label>Date</Form.Label>
                      <Form.Control
                        type="date"
                        name="date"
                        value={searchData.date}
                        onChange={handleInputChange}
                        required
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <div className="text-center">
                  <Button 
                    variant="primary" 
                    type="submit" 
                    disabled={loading}
                    className="px-5"
                  >
                    {loading ? <Spinner animation="border" size="sm" /> : 'Search Buses'}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>

          {error && (
            <Alert variant="danger" className="mt-3">
              {error}
            </Alert>
          )}

          {searched && !loading && (
            <div className="mt-4">
              <h4>Available Buses</h4>
              {buses.length > 0 ? (
                <BusList buses={buses} searchData={searchData} />
              ) : (
                <Alert variant="info">
                  No buses found for your search criteria.
                </Alert>
              )}
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default BusSearch;
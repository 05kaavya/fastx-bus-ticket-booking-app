// src/pages/operator/EditBuses.js
import React, { useEffect, useState, useCallback } from "react";
import { Container, Table, Button, Form, Row, Col, Alert } from "react-bootstrap";
import operatorService from "../../services/operatorService";

export default function EditBuses() {
  const [buses, setBuses] = useState([]);
  const [form, setForm] = useState({
    busId: null,
    busName: "",
    busNumber: "",
    busType: "Sleeper",
    totalSeats: 40,
    amenities: "Water bottle",
    operatorId: 0,
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Wrap fetchBuses in useCallback
  const fetchBuses = useCallback(async () => {
    try {
      setLoading(true);
      const res = await operatorService.getMyBuses();
      setBuses(res); // operatorService already returns response.data
    } catch (err) {
      console.error("Failed to load buses:", err);
      setError("Failed to load buses");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBuses();
  }, [fetchBuses]); // ✅ ESLint warning fixed

  const handleBusSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      if (form.busId) {
        await operatorService.updateBus(form);
        setSuccess("Bus updated successfully");
      } else {
        await operatorService.addBus(form);
        setSuccess("Bus added successfully");
      }

      setForm({
        busId: null,
        busName: "",
        busNumber: "",
        busType: "Sleeper",
        totalSeats: 40,
        amenities: "Water bottle",
        operatorId: 0,
      });

      fetchBuses();
    } catch (err) {
      console.error("Failed to save bus:", err);
      setError("Failed to save bus: " + err.message);
    }
  };

  const handleBusEdit = (bus) => {
    setForm({
      busId: bus.busId,
      busName: bus.busName,
      busNumber: bus.busNumber,
      busType: bus.busType,
      totalSeats: bus.totalSeats,
      amenities: bus.amenities,
      operatorId: bus.operator?.operatorId || 0,
    });
  };

  const handleBusDelete = async (busId) => {
    if (!window.confirm("Are you sure you want to delete this bus?")) return;

    try {
      await operatorService.deleteBus(busId);
      setSuccess("Bus deleted successfully");
      fetchBuses();
    } catch (err) {
      console.error("Failed to delete bus:", err);
      setError("Failed to delete bus: " + err.message);
    }
  };

  return (
    <Container className="mt-4">
      <h2 className="mb-4 text-center">Manage My Buses</h2>

      {error && (
        <Alert variant="danger" onClose={() => setError("")} dismissible>
          {error}
        </Alert>
      )}
      {success && (
        <Alert variant="success" onClose={() => setSuccess("")} dismissible>
          {success}
        </Alert>
      )}

      {/* Bus Form */}
      <Form onSubmit={handleBusSubmit} className="mb-4 p-3 border rounded">
        <h4>{form.busId ? "Edit Bus" : "Add New Bus"}</h4>
        <Row className="mb-2">
          <Col md={4}>
            <Form.Label>Bus Name</Form.Label>
            <Form.Control
              placeholder="Bus Name"
              value={form.busName}
              onChange={(e) => setForm({ ...form, busName: e.target.value })}
              required
            />
          </Col>
          <Col md={4}>
            <Form.Label>Bus Number</Form.Label>
            <Form.Control
              placeholder="Bus Number"
              value={form.busNumber}
              onChange={(e) => setForm({ ...form, busNumber: e.target.value })}
              required
            />
          </Col>
          <Col md={4}>
            <Form.Label>Bus Type</Form.Label>
            <Form.Select
              value={form.busType}
              onChange={(e) => setForm({ ...form, busType: e.target.value })}
            >
              <option value="Sleeper">Sleeper</option>
              <option value="A/C">A/C</option>
              <option value="Non-A/C">Non-A/C</option>
            </Form.Select>
          </Col>
        </Row>
        <Row className="mb-2">
          <Col md={4}>
            <Form.Label>Total Seats</Form.Label>
            <Form.Control
              type="number"
              placeholder="Total Seats"
              value={form.totalSeats}
              onChange={(e) => {
                const value = parseInt(e.target.value, 10);
                setForm({ ...form, totalSeats: isNaN(value) ? "" : value });
              }}
              min="1"
              max="100"
              required
            />
          </Col>
          <Col md={4}>
            <Form.Label>Amenities</Form.Label>
            <Form.Select
              value={form.amenities}
              onChange={(e) => setForm({ ...form, amenities: e.target.value })}
            >
              <option value="Water bottle">Water bottle</option>
              <option value="Blanket">Blanket</option>
              <option value="Charging point">Charging point</option>
              <option value="Tv">TV</option>
            </Form.Select>
          </Col>
          <Col md={4} className="d-flex align-items-end">
            <Button type="submit" variant={form.busId ? "warning" : "success"} className="me-2">
              {form.busId ? "Update Bus" : "Add Bus"}
            </Button>
            {form.busId && (
              <Button
                variant="secondary"
                onClick={() =>
                  setForm({
                    busId: null,
                    busName: "",
                    busNumber: "",
                    busType: "Sleeper",
                    totalSeats: 40,
                    amenities: "Water bottle",
                    operatorId: 0,
                  })
                }
              >
                Cancel
              </Button>
            )}
          </Col>
        </Row>
      </Form>

      {/* Bus List */}
      <h4 className="mb-3">Your Buses</h4>

      {loading ? (
        <p>Loading buses...</p>
      ) : buses.length === 0 ? (
        <Alert variant="info" className="text-center">
          You don’t have any buses yet. Add your first bus using the form above.
        </Alert>
      ) : (
        <Table bordered hover size="sm">
          <thead className="table-dark">
            <tr>
              <th>Bus Name</th>
              <th>Number</th>
              <th>Type</th>
              <th>Total Seats</th>
              <th>Amenities</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {buses.map((bus) => (
              <tr key={bus.busId}>
                <td>{bus.busName}</td>
                <td>{bus.busNumber}</td>
                <td>{bus.busType}</td>
                <td>{bus.totalSeats}</td>
                <td>{bus.amenities}</td>
                <td>
                  <Button
                    size="sm"
                    variant="outline-warning"
                    className="me-2"
                    onClick={() => handleBusEdit(bus)}
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline-danger"
                    onClick={() => handleBusDelete(bus.busId)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
}



// // src/pages/operator/BusSeatManagement.js
// import React, { useEffect, useState } from "react";
// import { Container, Table, Button, Form, Row, Col, Alert, Accordion, Card } from "react-bootstrap";
// import operatorService from "../../services/operatorService";

// export default function BusSeatManagement() {
//   const [buses, setBuses] = useState([]);
//   const [form, setForm] = useState({
//     busId: null,
//     busName: "",
//     busNumber: "",
//     busType: "Sleeper",
//     totalSeats: 40,
//     amenities: "Water bottle",
//     operatorId: 0,
//   });
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
//   const [seatForms, setSeatForms] = useState({});

//   useEffect(() => {
//     fetchBuses();
//   }, [selectedDate]); // Refetch when date changes

//   const fetchBuses = async () => {
//     try {
//       setLoading(true);
//       const res = await operatorService.getMyBuses();
      
//       const busesWithSeats = await Promise.all(
//         res.data.map(async (bus) => {
//           try {
//             // Get seats for the selected date
//             const seatsRes = await operatorService.getSeatsByBusIdAndDate(bus.busId, selectedDate);
//             return { ...bus, seats: seatsRes.data };
//           } catch (err) {
//             console.warn(`Could not load seats for bus ${bus.busId}:`, err.message);
//             return { ...bus, seats: [] };
//           }
//         })
//       );
//       setBuses(busesWithSeats);
//     } catch (err) {
//       console.error("Failed to load buses:", err);
//       setError("Failed to load buses");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleBusSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setSuccess("");
    
//     try {
//       let newBus;
//       if (form.busId) {
//         await operatorService.updateBus(form);
//         setSuccess("Bus updated successfully");
//       } else {
//         newBus = await operatorService.addBus(form);
//         setSuccess("Bus added successfully");
        
//         // Auto-generate seats for new bus
//         try {
//           const generatedSeats = generateAllSeats(form.totalSeats);
//           await operatorService.bulkUpdateSeats(newBus.data.busId, generatedSeats);
//           setSuccess(prev => prev + " and seats generated successfully");
//         } catch (seatErr) {
//           console.error('Failed to generate seats:', seatErr);
//           setSuccess(prev => prev + " (seats can be added manually)");
//         }
//       }
      
//       setForm({
//         busId: null,
//         busName: "",
//         busNumber: "",
//         busType: "Sleeper",
//         totalSeats: 40,
//         amenities: "Water bottle",
//         operatorId: 0,
//       });
//       fetchBuses();
//     } catch (err) {
//       console.error("Failed to save bus:", err);
//       setError("Failed to save bus: " + (err.response?.data?.message || err.message));
//     }
//   };

//   const handleBusEdit = (bus) => {
//     setForm({
//       busId: bus.busId,
//       busName: bus.busName,
//       busNumber: bus.busNumber,
//       busType: bus.busType,
//       totalSeats: bus.totalSeats,
//       amenities: bus.amenities,
//       operatorId: bus.operator?.operatorId || 0,
//     });
//   };

//   const handleBusDelete = async (busId) => {
//     if (!window.confirm("Are you sure you want to delete this bus? This will also delete all associated seats and bookings.")) return;
    
//     try {
//       await operatorService.deleteBus(busId);
//       setSuccess("Bus deleted successfully");
//       fetchBuses();
//     } catch (err) {
//       console.error("Failed to delete bus:", err);
//       setError("Failed to delete bus: " + (err.response?.data?.message || err.message));
//     }
//   };

//   // Generate all seats for a bus based on totalSeats count
//   const generateAllSeats = (totalSeats) => {
//     const seatsPerRow = 4;
//     const rows = Math.ceil(totalSeats / seatsPerRow);
//     let seatCount = 0;
//     const seats = [];

//     for (let r = 0; r < rows; r++) {
//       const rowLetter = String.fromCharCode(65 + r);
//       for (let s = 1; s <= seatsPerRow && seatCount < totalSeats; s++) {
//         const seatNumber = `${rowLetter}${s}`;
//         let seatType = s === 1 || s === seatsPerRow ? "Window" : "Normal";
//         seats.push({
//           seatNumber,
//           seatType,
//           seatStatus: "Available",
//         });
//         seatCount++;
//       }
//     }
//     return seats;
//   };

//   const handleSeatChange = (busId, e) => {
//     setSeatForms({
//       ...seatForms,
//       [busId]: { ...seatForms[busId], [e.target.name]: e.target.value },
//     });
//   };

//   const handleSeatSubmit = async (busId) => {
//     const seatForm = seatForms[busId];
//     if (!seatForm || !seatForm.seatNumber) return;

//     try {
//       if (seatForm.editing && seatForm.seatId) {
//         await operatorService.updateSeat({ ...seatForm, busId });
//         setSuccess("Seat updated successfully");
//       } else {
//         await operatorService.addSeat({ ...seatForm, busId });
//         setSuccess("Seat added successfully");
//       }
//       setSeatForms({ ...seatForms, [busId]: {} });
//       fetchBuses();
//     } catch (err) {
//       console.error("Failed to save seat:", err);
//       setError("Failed to save seat: " + (err.response?.data?.message || err.message));
//     }
//   };

//   const handleSeatEdit = (busId, seat) => {
//     setSeatForms({
//       ...seatForms,
//       [busId]: { 
//         seatNumber: seat.seatNumber, 
//         seatType: seat.seatType, 
//         seatStatus: seat.seatStatus, 
//         seatId: seat.seatId,
//         editing: true 
//       },
//     });
//   };

//   const handleSeatDelete = async (busId, seatId, seatStatus) => {
//     if (seatStatus === "Booked") {
//       setError("Cannot delete a booked seat");
//       return;
//     }
    
//     if (!window.confirm("Delete this seat?")) return;
    
//     try {
//       await operatorService.deleteSeat(seatId);
//       setSuccess("Seat deleted successfully");
//       fetchBuses();
//     } catch (err) {
//       console.error("Failed to delete seat:", err);
//       setError("Failed to delete seat: " + (err.response?.data?.message || err.message));
//     }
//   };

//   if (loading) {
//     return (
//       <Container className="mt-4 text-center">
//         <div className="d-flex justify-content-center align-items-center" style={{ height: "50vh" }}>
//           <div>
//             <div className="spinner-border text-primary" role="status">
//               <span className="visually-hidden">Loading...</span>
//             </div>
//             <p className="mt-3">Loading buses...</p>
//           </div>
//         </div>
//       </Container>
//     );
//   }

//   return (
//     <Container className="mt-4">
//       <h2 className="mb-4 text-center">Bus & Seat Management</h2>

//       {error && <Alert variant="danger" onClose={() => setError("")} dismissible>{error}</Alert>}
//       {success && <Alert variant="success" onClose={() => setSuccess("")} dismissible>{success}</Alert>}

//       {/* Date Selection */}
//       <Row className="mb-3">
//         <Col md={4}>
//           <Form.Label>View Seat Status for Date:</Form.Label>
//           <Form.Control
//             type="date"
//             value={selectedDate}
//             onChange={(e) => setSelectedDate(e.target.value)}
//           />
//           <Form.Text className="text-muted">
//             Select a date to see real-time booking status
//           </Form.Text>
//         </Col>
//       </Row>

//       {/* Bus Form */}
//       <Form onSubmit={handleBusSubmit} className="mb-4 p-3 border rounded">
//         <h4>{form.busId ? "Edit Bus" : "Add New Bus"}</h4>
//         <Row className="mb-2">
//           <Col md={4}>
//             <Form.Label>Bus Name</Form.Label>
//             <Form.Control
//               placeholder="Bus Name"
//               value={form.busName}
//               onChange={(e) => setForm({ ...form, busName: e.target.value })}
//               required
//             />
//           </Col>
//           <Col md={4}>
//             <Form.Label>Bus Number</Form.Label>
//             <Form.Control
//               placeholder="Bus Number"
//               value={form.busNumber}
//               onChange={(e) => setForm({ ...form, busNumber: e.target.value })}
//               required
//             />
//           </Col>
//           <Col md={4}>
//             <Form.Label>Bus Type</Form.Label>
//             <Form.Select
//               value={form.busType}
//               onChange={(e) => setForm({ ...form, busType: e.target.value })}
//             >
//               <option value="Sleeper">Sleeper</option>
//               <option value="A/C">A/C</option>
//               <option value="Non-A/C">Non-A/C</option>
//             </Form.Select>
//           </Col>
//         </Row>
//         <Row className="mb-2">
//           <Col md={4}>
//             <Form.Label>Total Seats</Form.Label>
//             <Form.Control
//               type="number"
//               placeholder="Total Seats"
//               value={form.totalSeats}
//               onChange={(e) => {
//                 const value = parseInt(e.target.value, 10);
//                 setForm({ ...form, totalSeats: isNaN(value) ? "" : value });
//               }}
//               min="1"
//               max="100"
//               required
//             />
//           </Col>
//           <Col md={4}>
//             <Form.Label>Amenities</Form.Label>
//             <Form.Select
//               value={form.amenities}
//               onChange={(e) => setForm({ ...form, amenities: e.target.value })}
//             >
//               <option value="Water bottle">Water bottle</option>
//               <option value="Blanket">Blanket</option>
//               <option value="Charging point">Charging point</option>
//               <option value="Tv">TV</option>
//             </Form.Select>
//           </Col>
//           <Col md={4} className="d-flex align-items-end">
//             <Button type="submit" variant={form.busId ? "warning" : "success"} className="me-2">
//               {form.busId ? "Update Bus" : "Add Bus"}
//             </Button>
//             {form.busId && (
//               <Button
//                 variant="secondary"
//                 onClick={() =>
//                   setForm({
//                     busId: null,
//                     busName: "",
//                     busNumber: "",
//                     busType: "Sleeper",
//                     totalSeats: 40,
//                     amenities: "Water bottle",
//                     operatorId: 0,
//                   })
//                 }
//               >
//                 Cancel
//               </Button>
//             )}
//           </Col>
//         </Row>
//       </Form>

//       {/* Bus List with Seat Management */}
//       <h4 className="mb-3">Your Buses - Showing status for {new Date(selectedDate).toLocaleDateString()}</h4>
      
//       {buses.length === 0 ? (
//         <Alert variant="info" className="text-center">
//           You don't have any buses yet. Add your first bus using the form above.
//         </Alert>
//       ) : (
//         <Accordion>
//           {buses.map((bus) => (
//             <Card key={bus.busId}>
//               <Accordion.Item eventKey={bus.busId.toString()}>
//                 <Accordion.Header>
//                   <div className="d-flex justify-content-between w-100 me-3">
//                     <span>
//                       <strong>{bus.busName}</strong> ({bus.busNumber}) - {bus.busType} - {bus.totalSeats} seats
//                     </span>
//                     <Button
//                       variant="outline-primary"
//                       size="sm"
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         handleBusEdit(bus);
//                       }}
//                     >
//                       Edit Bus
//                     </Button>
//                   </div>
//                 </Accordion.Header>
//                 <Accordion.Body>
//                   <div className="d-flex justify-content-between align-items-center mb-3">
//                     <h5>Seat Management for {new Date(selectedDate).toLocaleDateString()}</h5>
//                     <Button
//                       variant="danger"
//                       size="sm"
//                       onClick={() => handleBusDelete(bus.busId)}
//                     >
//                       Delete Bus
//                     </Button>
//                   </div>

//                   {/* Seats Table */}
//                   <Table bordered hover size="sm" className="mb-4">
//                     <thead className="table-dark">
//                       <tr>
//                         <th>Seat Number</th>
//                         <th>Type</th>
//                         <th>Status</th>
//                         <th>Actions</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {(bus.seats && bus.seats.length > 0 
//                         ? bus.seats 
//                         : generateAllSeats(bus.totalSeats)
//                       ).map((seat) => (
//                         <tr key={seat.seatNumber}>
//                           <td>{seat.seatNumber}</td>
//                           <td>{seat.seatType}</td>
//                           <td
//                             className={
//                               seat.seatStatus === "Booked" 
//                                 ? "text-danger fw-bold" 
//                                 : "text-success fw-bold"
//                             }
//                           >
//                             {seat.seatStatus}
//                           </td>
//                           <td>
//                             <Button
//                               size="sm"
//                               variant="outline-warning"
//                               className="me-2"
//                               disabled={seat.seatStatus === "Booked"}
//                               onClick={() => handleSeatEdit(bus.busId, seat)}
//                             >
//                               Edit
//                             </Button>
//                             <Button
//                               size="sm"
//                               variant="outline-danger"
//                               disabled={seat.seatStatus === "Booked"}
//                               onClick={() =>
//                                 handleSeatDelete(bus.busId, seat.seatId, seat.seatStatus)
//                               }
//                             >
//                               Delete
//                             </Button>
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </Table>

//                   {/* Seat Add/Edit Form */}
//                   <h6>{seatForms[bus.busId]?.editing ? "Edit Seat" : "Add New Seat"}</h6>
//                   <Form
//                     onSubmit={(e) => {
//                       e.preventDefault();
//                       handleSeatSubmit(bus.busId);
//                     }}
//                     className="p-3 border rounded"
//                   >
//                     <Row className="mb-2">
//                       <Col md={3}>
//                         <Form.Label>Seat Number</Form.Label>
//                         <Form.Control
//                           type="text"
//                           placeholder="e.g., A1"
//                           name="seatNumber"
//                           value={seatForms[bus.busId]?.seatNumber || ""}
//                           onChange={(e) => handleSeatChange(bus.busId, e)}
//                           required
//                         />
//                       </Col>
//                       <Col md={3}>
//                         <Form.Label>Seat Type</Form.Label>
//                         <Form.Select
//                           name="seatType"
//                           value={seatForms[bus.busId]?.seatType || "Normal"}
//                           onChange={(e) => handleSeatChange(bus.busId, e)}
//                         >
//                           <option value="Normal">Normal</option>
//                           <option value="Window">Window</option>
//                         </Form.Select>
//                       </Col>
//                       <Col md={3}>
//                         <Form.Label>Status</Form.Label>
//                         <Form.Select
//                           name="seatStatus"
//                           value={seatForms[bus.busId]?.seatStatus || "Available"}
//                           onChange={(e) => handleSeatChange(bus.busId, e)}
//                         >
//                           <option value="Available">Available</option>
//                           <option value="Booked">Booked</option>
//                         </Form.Select>
//                       </Col>
//                       <Col md={3} className="d-flex align-items-end">
//                         <Button type="submit" variant="primary" className="me-2">
//                           {seatForms[bus.busId]?.editing ? "Update Seat" : "Add Seat"}
//                         </Button>
//                         {seatForms[bus.busId]?.editing && (
//                           <Button
//                             variant="secondary"
//                             onClick={() =>
//                               setSeatForms({ ...seatForms, [bus.busId]: {} })
//                             }
//                           >
//                             Cancel
//                           </Button>
//                         )}
//                       </Col>
//                     </Row>
//                   </Form>
//                 </Accordion.Body>
//               </Accordion.Item>
//             </Card>
//           ))}
//         </Accordion>
//       )}
//     </Container>
//   );
// }


// // src/pages/operator/BusSeatManagement.js
// import React, { useEffect, useState } from "react";
// import { Container, Table, Button, Form, Row, Col, Alert, Accordion, Card } from "react-bootstrap";
// import operatorService from "../../services/operatorService";

// export default function BusSeatManagement() {
//   const [buses, setBuses] = useState([]);
//   const [form, setForm] = useState({
//     busId: null,
//     busName: "",
//     busNumber: "",
//     busType: "Sleeper",
//     totalSeats: 40,
//     amenities: "Water bottle",
//     operatorId: 0,
//   });
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   useEffect(() => {
//     fetchBuses();
//   }, []);

//   const fetchBuses = async () => {
//     try {
//       const res = await operatorService.getMyBuses();
//       // Load seats for each bus
//       const busesWithSeats = await Promise.all(
//         res.data.map(async (bus) => {
//           try {
//             const seatsRes = await operatorService.getSeatsByBusId(bus.busId);
//             return { ...bus, seats: seatsRes.data };
//           } catch (err) {
//             // If seats endpoint doesn't exist or returns error, use empty array
//             console.warn(`Could not load seats for bus ${bus.busId}:`, err.message);
//             return { ...bus, seats: [] };
//           }
//         })
//       );
//       setBuses(busesWithSeats);
//     } catch (err) {
//       console.error("Failed to load buses:", err);
//       setError("Failed to load buses");
//     }
//   };

//   const handleBusSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setSuccess("");
    
//     try {
//       if (form.busId) {
//         await operatorService.updateBus(form);
//         setSuccess("Bus updated successfully");
//       } else {
//         await operatorService.addBus(form);
//         setSuccess("Bus added successfully");
//       }
//       setForm({
//         busId: null,
//         busName: "",
//         busNumber: "",
//         busType: "Sleeper",
//         totalSeats: 40,
//         amenities: "Water bottle",
//         operatorId: 0,
//       });
//       fetchBuses();
//     } catch (err) {
//       console.error("Failed to save bus:", err);
//       setError("Failed to save bus: " + (err.response?.data?.message || err.message));
//     }
//   };

//   const handleBusEdit = (bus) => {
//     setForm({
//       busId: bus.busId,
//       busName: bus.busName,
//       busNumber: bus.busNumber,
//       busType: bus.busType,
//       totalSeats: bus.totalSeats,
//       amenities: bus.amenities,
//       operatorId: bus.operator?.operatorId || 0,
//     });
//   };

//   const handleBusDelete = async (busId) => {
//     if (!window.confirm("Are you sure you want to delete this bus? This will also delete all associated seats.")) return;
    
//     try {
//       await operatorService.deleteBus(busId);
//       setSuccess("Bus deleted successfully");
//       fetchBuses();
//     } catch (err) {
//       console.error("Failed to delete bus:", err);
//       setError("Failed to delete bus: " + (err.response?.data?.message || err.message));
//     }
//   };

//   // -------------------
//   // Seats Handling
//   // -------------------

//   const [seatForms, setSeatForms] = useState({}); // { busId: {seatNumber, seatType, seatStatus, editing, seatId} }

//   const mergeSeats = (existingSeats, totalSeats) => {
//     if (!existingSeats || existingSeats.length === 0) {
//       // Generate all seats if none exist
//       return generateAllSeats(totalSeats);
//     }
    
//     const seatMap = {};
//     existingSeats.forEach((seat) => (seatMap[seat.seatNumber] = seat));

//     const seatsPerRow = 4;
//     const rows = Math.ceil(totalSeats / seatsPerRow);
//     let seatCount = 0;
//     const finalSeats = [...existingSeats];

//     for (let r = 0; r < rows; r++) {
//       const rowLetter = String.fromCharCode(65 + r);
//       for (let s = 1; s <= seatsPerRow && seatCount < totalSeats; s++) {
//         const seatNumber = `${rowLetter}${s}`;
//         if (!seatMap[seatNumber]) {
//           let seatType = s === 1 || s === seatsPerRow ? "Window" : "Normal";
//           finalSeats.push({
//             seatNumber,
//             seatType,
//             seatStatus: "Available",
//             isTemporary: true // Mark as temporary (not in DB)
//           });
//         }
//         seatCount++;
//       }
//     }
//     return finalSeats;
//   };

//   const generateAllSeats = (totalSeats) => {
//     const seatsPerRow = 4;
//     const rows = Math.ceil(totalSeats / seatsPerRow);
//     let seatCount = 0;
//     const seats = [];

//     for (let r = 0; r < rows; r++) {
//       const rowLetter = String.fromCharCode(65 + r);
//       for (let s = 1; s <= seatsPerRow && seatCount < totalSeats; s++) {
//         const seatNumber = `${rowLetter}${s}`;
//         let seatType = s === 1 || s === seatsPerRow ? "Window" : "Normal";
//         seats.push({
//           seatNumber,
//           seatType,
//           seatStatus: "Available",
//           isTemporary: true // Mark as temporary (not in DB)
//         });
//         seatCount++;
//       }
//     }
//     return seats;
//   };

//   const handleSeatChange = (busId, e) => {
//     setSeatForms({
//       ...seatForms,
//       [busId]: { ...seatForms[busId], [e.target.name]: e.target.value },
//     });
//   };

//   const handleSeatSubmit = async (busId) => {
//     const seatForm = seatForms[busId];
//     if (!seatForm || !seatForm.seatNumber) return;

//     try {
//       if (seatForm.editing && seatForm.seatId) {
//         await operatorService.updateSeat({ ...seatForm, busId });
//         setSuccess("Seat updated successfully");
//       } else {
//         await operatorService.addSeat({ ...seatForm, busId });
//         setSuccess("Seat added successfully");
//       }
//       setSeatForms({ ...seatForms, [busId]: {} });
//       loadSeats(busId);
//     } catch (err) {
//       console.error("Failed to save seat:", err);
//       setError("Failed to save seat: " + (err.response?.data?.message || err.message));
//     }
//   };

//   const loadSeats = async (busId) => {
//     try {
//       const bus = buses.find((b) => b.busId === busId);
//       if (!bus) return;
      
//       const res = await operatorService.getSeatsByBusId(busId);
//       const merged = mergeSeats(res.data, bus.totalSeats);
//       setBuses(
//         buses.map((b) => (b.busId === busId ? { ...b, seats: merged } : b))
//       );
//     } catch (err) {
//       console.error("Failed to load seats:", err);
//       // Don't show error if endpoint doesn't exist
//       if (err.response?.status !== 404) {
//         setError("Failed to load seats");
//       }
//     }
//   };

//   const handleSeatEdit = (busId, seat) => {
//     setSeatForms({
//       ...seatForms,
//       [busId]: { 
//         seatNumber: seat.seatNumber, 
//         seatType: seat.seatType, 
//         seatStatus: seat.seatStatus, 
//         seatId: seat.seatId,
//         editing: true 
//       },
//     });
//   };

//   const handleSeatDelete = async (busId, seatId, seatStatus) => {
//     if (seatStatus === "Booked") {
//       setError("Cannot delete a booked seat");
//       return;
//     }
    
//     if (!window.confirm("Delete this seat?")) return;
    
//     try {
//       // Check if it's a temporary seat (not in DB)
//       if (!seatId || seatId.toString().startsWith('temp-')) {
//         // Just remove from local state
//         const bus = buses.find(b => b.busId === busId);
//         if (bus) {
//           setBuses(buses.map(b => 
//             b.busId === busId 
//               ? {...b, seats: bus.seats.filter(s => s.seatNumber !== seatForms[busId]?.seatNumber)}
//               : b
//           ));
//         }
//         setSuccess("Seat removed successfully");
//       } else {
//         await operatorService.deleteSeat(seatId);
//         setSuccess("Seat deleted successfully");
//         loadSeats(busId);
//       }
//     } catch (err) {
//       console.error("Failed to delete seat:", err);
//       setError("Failed to delete seat: " + (err.response?.data?.message || err.message));
//     }
//   };

//   return (
//     <Container className="mt-4">
//       <h2 className="mb-4 text-center">Bus & Seat Management</h2>

//       {error && <Alert variant="danger" onClose={() => setError("")} dismissible>{error}</Alert>}
//       {success && <Alert variant="success" onClose={() => setSuccess("")} dismissible>{success}</Alert>}

//       {/* Bus Form */}
//       <Form onSubmit={handleBusSubmit} className="mb-4 p-3 border rounded">
//         <h4>{form.busId ? "Edit Bus" : "Add New Bus"}</h4>
//         <Row className="mb-2">
//           <Col md={4}>
//             <Form.Label>Bus Name</Form.Label>
//             <Form.Control
//               placeholder="Bus Name"
//               value={form.busName}
//               onChange={(e) => setForm({ ...form, busName: e.target.value })}
//               required
//             />
//           </Col>
//           <Col md={4}>
//             <Form.Label>Bus Number</Form.Label>
//             <Form.Control
//               placeholder="Bus Number"
//               value={form.busNumber}
//               onChange={(e) => setForm({ ...form, busNumber: e.target.value })}
//               required
//             />
//           </Col>
//           <Col md={4}>
//             <Form.Label>Bus Type</Form.Label>
//             <Form.Select
//               value={form.busType}
//               onChange={(e) => setForm({ ...form, busType: e.target.value })}
//             >
//               <option value="Sleeper">Sleeper</option>
//               <option value="A/C">A/C</option>
//               <option value="Non-A/C">Non-A/C</option>
//             </Form.Select>
//           </Col>
//         </Row>
//         <Row className="mb-2">
//           <Col md={4}>
//             <Form.Label>Total Seats</Form.Label>
//             <Form.Control
//               type="number"
//               placeholder="Total Seats"
//               value={form.totalSeats}
//               onChange={(e) => {
//                 const value = parseInt(e.target.value, 10);
//                 setForm({ ...form, totalSeats: isNaN(value) ? "" : value });
//               }}
//               min="1"
//               max="100"
//               required
//             />
//           </Col>
//           <Col md={4}>
//             <Form.Label>Amenities</Form.Label>
//             <Form.Select
//               value={form.amenities}
//               onChange={(e) => setForm({ ...form, amenities: e.target.value })}
//             >
//               <option value="Water bottle">Water bottle</option>
//               <option value="Blanket">Blanket</option>
//               <option value="Charging point">Charging point</option>
//               <option value="Tv">TV</option>
//             </Form.Select>
//           </Col>
//           <Col md={4} className="d-flex align-items-end">
//             <Button type="submit" variant={form.busId ? "warning" : "success"} className="me-2">
//               {form.busId ? "Update Bus" : "Add Bus"}
//             </Button>
//             {form.busId && (
//               <Button
//                 variant="secondary"
//                 onClick={() =>
//                   setForm({
//                     busId: null,
//                     busName: "",
//                     busNumber: "",
//                     busType: "Sleeper",
//                     totalSeats: 40,
//                     amenities: "Water bottle",
//                     operatorId: 0,
//                   })
//                 }
//               >
//                 Cancel
//               </Button>
//             )}
//           </Col>
//         </Row>
//       </Form>

//       {/* Bus List with Seat Management */}
//       <h4 className="mb-3">Your Buses</h4>
      
//       {buses.length === 0 ? (
//         <Alert variant="info" className="text-center">
//           You don't have any buses yet. Add your first bus using the form above.
//         </Alert>
//       ) : (
//         <Accordion>
//           {buses.map((bus) => (
//             <Card key={bus.busId}>
//               <Accordion.Item eventKey={bus.busId.toString()}>
//                 <Accordion.Header>
//                   <div className="d-flex justify-content-between w-100 me-3">
//                     <span>
//                       <strong>{bus.busName}</strong> ({bus.busNumber}) - {bus.busType} - {bus.totalSeats} seats
//                     </span>
//                     <Button
//                       variant="outline-primary"
//                       size="sm"
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         handleBusEdit(bus);
//                       }}
//                     >
//                       Edit Bus
//                     </Button>
//                   </div>
//                 </Accordion.Header>
//                 <Accordion.Body>
//                   <div className="d-flex justify-content-between align-items-center mb-3">
//                     <h5>Seat Management</h5>
//                     <Button
//                       variant="danger"
//                       size="sm"
//                       onClick={() => handleBusDelete(bus.busId)}
//                     >
//                       Delete Bus
//                     </Button>
//                   </div>

//                   {/* Seats Table */}
//                   <Table bordered hover size="sm" className="mb-4">
//                     <thead className="table-dark">
//                       <tr>
//                         <th>Seat Number</th>
//                         <th>Type</th>
//                         <th>Status</th>
//                         <th>Actions</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {mergeSeats(bus.seats || [], bus.totalSeats).map((seat) => (
//                         <tr key={seat.seatNumber}>
//                           <td>{seat.seatNumber}</td>
//                           <td>{seat.seatType}</td>
//                           <td
//                             className={
//                               seat.seatStatus === "Booked" 
//                                 ? "text-danger fw-bold" 
//                                 : "text-success fw-bold"
//                             }
//                           >
//                             {seat.seatStatus}
//                           </td>
//                           <td>
//                             <Button
//                               size="sm"
//                               variant="outline-warning"
//                               className="me-2"
//                               disabled={seat.seatStatus === "Booked"}
//                               onClick={() => handleSeatEdit(bus.busId, seat)}
//                             >
//                               Edit
//                             </Button>
//                             <Button
//                               size="sm"
//                               variant="outline-danger"
//                               disabled={seat.seatStatus === "Booked"}
//                               onClick={() =>
//                                 handleSeatDelete(bus.busId, seat.seatId, seat.seatStatus)
//                               }
//                             >
//                               Delete
//                             </Button>
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </Table>

//                   {/* Seat Add/Edit Form */}
//                   <h6>{seatForms[bus.busId]?.editing ? "Edit Seat" : "Add New Seat"}</h6>
//                   <Form
//                     onSubmit={(e) => {
//                       e.preventDefault();
//                       handleSeatSubmit(bus.busId);
//                     }}
//                     className="p-3 border rounded"
//                   >
//                     <Row className="mb-2">
//                       <Col md={3}>
//                         <Form.Label>Seat Number</Form.Label>
//                         <Form.Control
//                           type="text"
//                           placeholder="e.g., A1"
//                           name="seatNumber"
//                           value={seatForms[bus.busId]?.seatNumber || ""}
//                           onChange={(e) => handleSeatChange(bus.busId, e)}
//                           required
//                         />
//                       </Col>
//                       <Col md={3}>
//                         <Form.Label>Seat Type</Form.Label>
//                         <Form.Select
//                           name="seatType"
//                           value={seatForms[bus.busId]?.seatType || "Normal"}
//                           onChange={(e) => handleSeatChange(bus.busId, e)}
//                         >
//                           <option value="Normal">Normal</option>
//                           <option value="Window">Window</option>
//                         </Form.Select>
//                       </Col>
//                       <Col md={3}>
//                         <Form.Label>Status</Form.Label>
//                         <Form.Select
//                           name="seatStatus"
//                           value={seatForms[bus.busId]?.seatStatus || "Available"}
//                           onChange={(e) => handleSeatChange(bus.busId, e)}
//                         >
//                           <option value="Available">Available</option>
//                           <option value="Booked">Booked</option>
//                         </Form.Select>
//                       </Col>
//                       <Col md={3} className="d-flex align-items-end">
//                         <Button type="submit" variant="primary" className="me-2">
//                           {seatForms[bus.busId]?.editing ? "Update Seat" : "Add Seat"}
//                         </Button>
//                         {seatForms[bus.busId]?.editing && (
//                           <Button
//                             variant="secondary"
//                             onClick={() =>
//                               setSeatForms({ ...seatForms, [bus.busId]: {} })
//                             }
//                           >
//                             Cancel
//                           </Button>
//                         )}
//                       </Col>
//                     </Row>
//                   </Form>
//                 </Accordion.Body>
//               </Accordion.Item>
//             </Card>
//           ))}
//         </Accordion>
//       )}
//     </Container>
//   );
// }


// // src/pages/operator/BusManagement.js
// import React, { useEffect, useState } from "react";
// import { Container, Table, Button, Form, Row, Col } from "react-bootstrap";
// import operatorService from "../../services/operatorService";

// function BusManagement() {
//   const [buses, setBuses] = useState([]);
//   const [form, setForm] = useState({
//     busId: null,
//     busName: "",
//     busNumber: "",
//     busType: "Sleeper",
//     totalSeats: 40,
//     amenities: "Water bottle",
//     operatorId: 0, // ✅ set from backend (or JWT)
//   });

//   const fetchBuses = async () => {
//     try {
//       const res = await operatorService.getMyBuses();
//       setBuses(res.data);
//     } catch (err) {
//       console.error("Error fetching buses", err);
//     }
//   };

//   useEffect(() => {
//     fetchBuses();
//   }, []);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       if (form.busId) {
//         // ✅ Update existing bus
//         await operatorService.updateBus(form);
//       } else {
//         // ✅ Add new bus
//         await operatorService.addBus(form);
//       }

//       // Reset form
//       setForm({
//         busId: null,
//         busName: "",
//         busNumber: "",
//         busType: "Sleeper",
//         totalSeats: 40,
//         amenities: "Water bottle",
//         operatorId: 0,
//       });

//       fetchBuses();
//     } catch (err) {
//       console.error("Error saving bus", err);
//     }
//   };

//   const handleDelete = async (id) => {
//     try {
//       await operatorService.deleteBus(id);
//       fetchBuses();
//     } catch (err) {
//       console.error("Error deleting bus", err);
//     }
//   };

//   const handleEdit = (bus) => {
//     setForm({
//       busId: bus.busId,
//       busName: bus.busName,
//       busNumber: bus.busNumber,
//       busType: bus.busType,
//       totalSeats: bus.totalSeats,
//       amenities: bus.amenities,
//       operatorId: bus.operator?.operatorId || 0,
//     });
//   };

//   return (
//     <Container className="mt-4">
//       <h2>Bus Management</h2>
//       <Form onSubmit={handleSubmit} className="mb-4">
//         <Row className="mb-2">
//           <Col>
//             <Form.Control
//               placeholder="Bus Name"
//               value={form.busName}
//               onChange={(e) => setForm({ ...form, busName: e.target.value })}
//               required
//             />
//           </Col>
//           <Col>
//             <Form.Control
//               placeholder="Bus Number (e.g., TN01AB1234)"
//               value={form.busNumber}
//               onChange={(e) => setForm({ ...form, busNumber: e.target.value })}
//               required
//             />
//           </Col>
//           <Col>
//             <Form.Select
//               value={form.busType}
//               onChange={(e) => setForm({ ...form, busType: e.target.value })}
//             >
//               <option value="Sleeper">Sleeper</option>
//               <option value="A/C">A/C</option>
//               <option value="Non-A/C">Non-A/C</option>
//             </Form.Select>
//           </Col>
//         </Row>
//         <Row>
//           <Col>
//             <Form.Control
//               type="number"
//               placeholder="Total Seats"
//               value={form.totalSeats}
//               onChange={(e) =>
//                 setForm({ ...form, totalSeats: parseInt(e.target.value, 10) })
//               }
//               required
//             />
//           </Col>
//           <Col>
//             <Form.Select
//               value={form.amenities}
//               onChange={(e) => setForm({ ...form, amenities: e.target.value })}
//             >
//               <option value="Water bottle">Water bottle</option>
//               <option value="Blanket">Blanket</option>
//               <option value="Charging point">Charging point</option>
//               <option value="Tv">Tv</option>
//             </Form.Select>
//           </Col>
//           <Col>
//             <Button type="submit" variant={form.busId ? "warning" : "success"}>
//               {form.busId ? "Update Bus" : "Add Bus"}
//             </Button>
//             {form.busId && (
//               <Button
//                 variant="secondary"
//                 className="ms-2"
//                 onClick={() =>
//                   setForm({
//                     busId: null,
//                     busName: "",
//                     busNumber: "",
//                     busType: "Sleeper",
//                     totalSeats: 40,
//                     amenities: "Water bottle",
//                     operatorId: 0,
//                   })
//                 }
//               >
//                 Cancel
//               </Button>
//             )}
//           </Col>
//         </Row>
//       </Form>

//       <Table bordered hover>
//         <thead>
//           <tr>
//             <th>ID</th>
//             <th>Bus Name</th>
//             <th>Bus Number</th>
//             <th>Type</th>
//             <th>Total Seats</th>
//             <th>Amenities</th>
//             <th>Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {buses.map((bus) => (
//             <tr key={bus.busId}>
//               <td>{bus.busId}</td>
//               <td>{bus.busName}</td>
//               <td>{bus.busNumber}</td>
//               <td>{bus.busType}</td>
//               <td>{bus.totalSeats}</td>
//               <td>{bus.amenities}</td>
//               <td>
//                 <Button
//                   variant="info"
//                   size="sm"
//                   className="me-2"
//                   onClick={() => handleEdit(bus)}
//                 >
//                   Edit
//                 </Button>
//                 <Button
//                   variant="danger"
//                   size="sm"
//                   onClick={() => handleDelete(bus.busId)}
//                 >
//                   Delete
//                 </Button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </Table>
//     </Container>
//   );
// }

// export default BusManagement;





// // src/pages/operator/ManageBuses.js
// import React, { useState, useEffect } from 'react';
// import { Container, Row, Col, Card, Button, Table, Modal, Alert, Spinner, Badge, Tabs, Tab } from 'react-bootstrap';
// import { operatorService } from '../../services/operatorService';

// const EditBuses = () => {
//   // State for Buses and Routes
//   const [buses, setBuses] = useState([]);
//   const [routes, setRoutes] = useState([]);
//   const [passengers, setPassengers] = useState([]);
//   const [bookings, setBookings] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [activeTab, setActiveTab] = useState('buses');
  
//   // Modals state
//   const [showBusModal, setShowBusModal] = useState(false);
//   const [showRouteModal, setShowRouteModal] = useState(false);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
  
//   // Editing state
//   const [editingBus, setEditingBus] = useState(null);
//   const [editingRoute, setEditingRoute] = useState(null);
//   const [itemToDelete, setItemToDelete] = useState(null);
//   const [deleteType, setDeleteType] = useState(''); // 'bus' or 'route'

//   // Form data
//   const [busFormData, setBusFormData] = useState({
//     busName: '',
//     busNumber: '',
//     busType: 'Sleeper',
//     totalSeats: '',
//     amenities: ''
//   });

//   const [routeFormData, setRouteFormData] = useState({
//     origin: '',
//     destination: '',
//     departureTime: '',
//     arrivalTime: '',
//     distance: '',
//     fare: '',
//     busId: ''
//   });

//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');

//   useEffect(() => {
//     loadData();
//   }, []);

//   const loadData = async () => {
//     try {
//       const [busesRes, routesRes, passengersRes, bookingsRes] = await Promise.all([
//         operatorService.getMyBuses(),
//         operatorService.getMyRoutes(),
//         operatorService.getMyPassengers(),
//         operatorService.getMyBookings()
//       ]);
//       setBuses(busesRes.data);
//       setRoutes(routesRes.data);
//       setPassengers(passengersRes.data);
//       setBookings(bookingsRes.data);
//     } catch (err) {
//       setError('Failed to load data: ' + (err.response?.data?.message || err.message));
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Bus handlers
//   const handleBusSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const submitData = {
//         ...busFormData,
//         totalSeats: parseInt(busFormData.totalSeats) || 0
//       };
      
//       if (editingBus) {
//         await operatorService.updateBus({ ...submitData, busId: editingBus.busId });
//         setSuccess('Bus updated successfully');
//       } else {
//         await operatorService.addBus(submitData);
//         setSuccess('Bus added successfully');
//       }
//       setShowBusModal(false);
//       setEditingBus(null);
//       setBusFormData({
//         busName: '',
//         busNumber: '',
//         busType: 'Sleeper',
//         totalSeats: '',
//         amenities: ''
//       });
//       loadData();
//     } catch (err) {
//       setError('Failed to save bus: ' + (err.response?.data?.message || err.message));
//     }
//   };

//   const handleBusEdit = (bus) => {
//     setEditingBus(bus);
//     setBusFormData({
//       busName: bus.busName,
//       busNumber: bus.busNumber,
//       busType: bus.busType,
//       totalSeats: bus.totalSeats.toString(),
//       amenities: bus.amenities || ''
//     });
//     setShowBusModal(true);
//   };

//   // Route handlers
//   const handleRouteSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const submitData = {
//         ...routeFormData,
//         busId: parseInt(routeFormData.busId) || 0,
//         distance: parseFloat(routeFormData.distance) || 0,
//         fare: parseFloat(routeFormData.fare) || 0
//       };
      
//       if (editingRoute) {
//         await operatorService.updateRoute({ ...submitData, routeId: editingRoute.routeId });
//         setSuccess('Route updated successfully');
//       } else {
//         await operatorService.addRoute(submitData);
//         setSuccess('Route added successfully');
//       }
//       setShowRouteModal(false);
//       setEditingRoute(null);
//       setRouteFormData({
//         origin: '',
//         destination: '',
//         departureTime: '',
//         arrivalTime: '',
//         distance: '',
//         fare: '',
//         busId: ''
//       });
//       loadData();
//     } catch (err) {
//       setError('Failed to save route: ' + (err.response?.data?.message || err.message));
//     }
//   };

//   const handleRouteEdit = (route) => {
//     setEditingRoute(route);
//     setRouteFormData({
//       origin: route.origin,
//       destination: route.destination,
//       departureTime: route.departureTime.substring(0, 16),
//       arrivalTime: route.arrivalTime.substring(0, 16),
//       distance: route.distance.toString(),
//       fare: route.fare.toString(),
//       busId: route.bus?.busId?.toString() || ''
//     });
//     setShowRouteModal(true);
//   };

//   // Delete handler
//   const handleDelete = async () => {
//     try {
//       if (deleteType === 'bus') {
//         await operatorService.deleteBus(itemToDelete.busId);
//         setSuccess('Bus deleted successfully');
//       } else {
//         await operatorService.deleteRoute(itemToDelete.routeId);
//         setSuccess('Route deleted successfully');
//       }
//       setShowDeleteModal(false);
//       setItemToDelete(null);
//       setDeleteType('');
//       loadData();
//     } catch (err) {
//       setError(`Failed to delete ${deleteType}: ` + (err.response?.data?.message || err.message));
//     }
//   };

//   const confirmDelete = (item, type) => {
//     setItemToDelete(item);
//     setDeleteType(type);
//     setShowDeleteModal(true);
//   };

//   if (loading) {
//     return (
//       <Container className="text-center mt-5">
//         <Spinner animation="border" />
//         <p>Loading data...</p>
//       </Container>
//     );
//   }

//   return (
//     <Container className="mt-4">
//       <Row className="mb-4">
//         <Col>
//           <h2>Manage My Buses & Routes</h2>
//           <p className="text-muted">Operator can manage their own buses and routes</p>
//         </Col>
//       </Row>

//       {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}
//       {success && <Alert variant="success" onClose={() => setSuccess('')} dismissible>{success}</Alert>}

//       <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className="mb-3">
//         {/* Buses Tab */}
//         <Tab eventKey="buses" title="My Buses">
//           <div className="d-flex justify-content-between align-items-center mb-3">
//             <h4>My Bus Management</h4>
//             <Button onClick={() => setShowBusModal(true)}>+ Add New Bus</Button>
//           </div>

//           <Card>
//             <Card.Header>
//               <h5 className="mb-0">My Buses ({buses.length})</h5>
//             </Card.Header>
//             <Card.Body>
//               {buses.length === 0 ? (
//                 <div className="text-center py-4">
//                   <p>No buses found. Add your first bus to get started.</p>
//                 </div>
//               ) : (
//                 <Table responsive striped>
//                   <thead>
//                     <tr>
//                       <th>ID</th>
//                       <th>Name</th>
//                       <th>Number</th>
//                       <th>Type</th>
//                       <th>Seats</th>
//                       <th>Amenities</th>
//                       <th>Status</th>
//                       <th>Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {buses.map((bus) => (
//                       <tr key={bus.busId}>
//                         <td>{bus.busId}</td>
//                         <td>{bus.busName}</td>
//                         <td>{bus.busNumber}</td>
//                         <td>{bus.busType}</td>
//                         <td>{bus.totalSeats}</td>
//                         <td>{bus.amenities || 'N/A'}</td>
//                         <td>
//                           <Badge bg={bus.isActive ? 'success' : 'danger'}>
//                             {bus.isActive ? 'Active' : 'Inactive'}
//                           </Badge>
//                         </td>
//                         <td>
//                           <Button 
//                             variant="outline-primary" 
//                             size="sm" 
//                             onClick={() => handleBusEdit(bus)}
//                             className="me-2"
//                           >
//                             Edit
//                           </Button>
//                           <Button 
//                             variant="outline-danger" 
//                             size="sm" 
//                             onClick={() => confirmDelete(bus, 'bus')}
//                           >
//                             Delete
//                           </Button>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </Table>
//               )}
//             </Card.Body>
//           </Card>
//         </Tab>

//         {/* Routes Tab */}
//         <Tab eventKey="routes" title="My Routes">
//           <div className="d-flex justify-content-between align-items-center mb-3">
//             <h4>My Route Management</h4>
//             <Button onClick={() => setShowRouteModal(true)}>+ Add New Route</Button>
//           </div>

//           <Card>
//             <Card.Header>
//               <h5 className="mb-0">My Routes ({routes.length})</h5>
//             </Card.Header>
//             <Card.Body>
//               {routes.length === 0 ? (
//                 <div className="text-center py-4">
//                   <p>No routes found. Add your first route to get started.</p>
//                 </div>
//               ) : (
//                 <Table responsive striped>
//                   <thead>
//                     <tr>
//                       <th>ID</th>
//                       <th>Origin</th>
//                       <th>Destination</th>
//                       <th>Bus</th>
//                       <th>Departure</th>
//                       <th>Arrival</th>
//                       <th>Distance</th>
//                       <th>Fare</th>
//                       <th>Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {routes.map((route) => (
//                       <tr key={route.routeId}>
//                         <td>{route.routeId}</td>
//                         <td>{route.origin}</td>
//                         <td>{route.destination}</td>
//                         <td>{route.bus?.busName || 'N/A'} ({route.bus?.busNumber || 'N/A'})</td>
//                         <td>{new Date(route.departureTime).toLocaleString()}</td>
//                         <td>{new Date(route.arrivalTime).toLocaleString()}</td>
//                         <td>{route.distance} km</td>
//                         <td>₹{route.fare}</td>
//                         <td>
//                           <Button 
//                             variant="outline-primary" 
//                             size="sm" 
//                             onClick={() => handleRouteEdit(route)}
//                             className="me-2"
//                           >
//                             Edit
//                           </Button>
//                           <Button 
//                             variant="outline-danger" 
//                             size="sm" 
//                             onClick={() => confirmDelete(route, 'route')}
//                           >
//                             Delete
//                           </Button>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </Table>
//               )}
//             </Card.Body>
//           </Card>
//         </Tab>

//         {/* Passengers Tab */}
//         <Tab eventKey="passengers" title="My Passengers">
//           <div className="d-flex justify-content-between align-items-center mb-3">
//             <h4>My Passengers</h4>
//             <Badge bg="info">{passengers.length} Passengers</Badge>
//           </div>

//           <Card>
//             <Card.Header>
//               <h5 className="mb-0">Passengers Who Traveled on My Buses</h5>
//             </Card.Header>
//             <Card.Body>
//               {passengers.length === 0 ? (
//                 <div className="text-center py-4">
//                   <p>No passengers found yet. Bookings will appear here when customers book your routes.</p>
//                 </div>
//               ) : (
//                 <Table responsive striped>
//                   <thead>
//                     <tr>
//                       <th>User ID</th>
//                       <th>Name</th>
//                       <th>Email</th>
//                       <th>Phone</th>
//                       <th>Total Bookings</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {passengers.map((passenger) => {
//                       const userBookings = bookings.filter(booking => 
//                         booking.user?.userId === passenger.userId
//                       );
//                       return (
//                         <tr key={passenger.userId}>
//                           <td>{passenger.userId}</td>
//                           <td>{passenger.firstName} {passenger.lastName}</td>
//                           <td>{passenger.email}</td>
//                           <td>{passenger.phoneNumber || 'N/A'}</td>
//                           <td>
//                             <Badge bg="primary">{userBookings.length}</Badge>
//                           </td>
//                         </tr>
//                       );
//                     })}
//                   </tbody>
//                 </Table>
//               )}
//             </Card.Body>
//           </Card>
//         </Tab>
//       </Tabs>

//       {/* Add/Edit Bus Modal */}
//       <Modal show={showBusModal} onHide={() => setShowBusModal(false)} size="lg">
//         <Modal.Header closeButton>
//           <Modal.Title>{editingBus ? 'Edit Bus' : 'Add New Bus'}</Modal.Title>
//         </Modal.Header>
//         <form onSubmit={handleBusSubmit}>
//           <Modal.Body>
//             <div className="mb-3">
//               <label className="form-label">Bus Name</label>
//               <input
//                 type="text"
//                 className="form-control"
//                 value={busFormData.busName}
//                 onChange={(e) => setBusFormData({ ...busFormData, busName: e.target.value })}
//                 required
//               />
//             </div>
//             <div className="mb-3">
//               <label className="form-label">Bus Number</label>
//               <input
//                 type="text"
//                 className="form-control"
//                 value={busFormData.busNumber}
//                 onChange={(e) => setBusFormData({ ...busFormData, busNumber: e.target.value })}
//                 required
//               />
//             </div>
//             <div className="mb-3">
//               <label className="form-label">Bus Type</label>
//               <select
//                 className="form-select"
//                 value={busFormData.busType}
//                 onChange={(e) => setBusFormData({ ...busFormData, busType: e.target.value })}
//               >
//                 <option value="Sleeper">Sleeper</option>
//                 <option value="A/C">A/C</option>
//                 <option value="Non-A/C">Non-A/C</option>
//               </select>
//             </div>
//             <div className="mb-3">
//               <label className="form-label">Total Seats</label>
//               <input
//                 type="number"
//                 className="form-control"
//                 value={busFormData.totalSeats}
//                 onChange={(e) => setBusFormData({ ...busFormData, totalSeats: e.target.value })}
//                 required
//                 min="1"
//               />
//             </div>
//             <div className="mb-3">
//               <label className="form-label">Amenities</label>
//               <input
//                 type="text"
//                 className="form-control"
//                 value={busFormData.amenities}
//                 onChange={(e) => setBusFormData({ ...busFormData, amenities: e.target.value })}
//                 placeholder="Water bottle, Blanket, Charging point, TV"
//               />
//             </div>
//           </Modal.Body>
//           <Modal.Footer>
//             <Button variant="secondary" onClick={() => setShowBusModal(false)}>
//               Cancel
//             </Button>
//             <Button variant="primary" type="submit">
//               {editingBus ? 'Update' : 'Add'} Bus
//             </Button>
//           </Modal.Footer>
//         </form>
//       </Modal>

//       {/* Add/Edit Route Modal */}
//       <Modal show={showRouteModal} onHide={() => setShowRouteModal(false)} size="lg">
//         <Modal.Header closeButton>
//           <Modal.Title>{editingRoute ? 'Edit Route' : 'Add New Route'}</Modal.Title>
//         </Modal.Header>
//         <form onSubmit={handleRouteSubmit}>
//           <Modal.Body>
//             <div className="mb-3">
//               <label className="form-label">Origin</label>
//               <input
//                 type="text"
//                 className="form-control"
//                 value={routeFormData.origin}
//                 onChange={(e) => setRouteFormData({ ...routeFormData, origin: e.target.value })}
//                 required
//               />
//             </div>
//             <div className="mb-3">
//               <label className="form-label">Destination</label>
//               <input
//                 type="text"
//                 className="form-control"
//                 value={routeFormData.destination}
//                 onChange={(e) => setRouteFormData({ ...routeFormData, destination: e.target.value })}
//                 required
//               />
//             </div>
//             <div className="mb-3">
//               <label className="form-label">Bus</label>
//               <select
//                 className="form-select"
//                 value={routeFormData.busId}
//                 onChange={(e) => setRouteFormData({ ...routeFormData, busId: e.target.value })}
//                 required
//               >
//                 <option value="">Select Bus</option>
//                 {buses.map((bus) => (
//                   <option key={bus.busId} value={bus.busId}>
//                     {bus.busName} ({bus.busNumber})
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div className="mb-3">
//               <label className="form-label">Departure Time</label>
//               <input
//                 type="datetime-local"
//                 className="form-control"
//                 value={routeFormData.departureTime}
//                 onChange={(e) => setRouteFormData({ ...routeFormData, departureTime: e.target.value })}
//                 required
//               />
//             </div>
//             <div className="mb-3">
//               <label className="form-label">Arrival Time</label>
//               <input
//                 type="datetime-local"
//                 className="form-control"
//                 value={routeFormData.arrivalTime}
//                 onChange={(e) => setRouteFormData({ ...routeFormData, arrivalTime: e.target.value })}
//                 required
//               />
//             </div>
//             <div className="mb-3">
//               <label className="form-label">Distance (km)</label>
//               <input
//                 type="number"
//                 step="0.1"
//                 className="form-control"
//                 value={routeFormData.distance}
//                 onChange={(e) => setRouteFormData({ ...routeFormData, distance: e.target.value })}
//                 required
//                 min="0.1"
//               />
//             </div>
//             <div className="mb-3">
//               <label className="form-label">Fare (₹)</label>
//               <input
//                 type="number"
//                 step="0.01"
//                 className="form-control"
//                 value={routeFormData.fare}
//                 onChange={(e) => setRouteFormData({ ...routeFormData, fare: e.target.value })}
//                 required
//                 min="0.01"
//               />
//             </div>
//           </Modal.Body>
//           <Modal.Footer>
//             <Button variant="secondary" onClick={() => setShowRouteModal(false)}>
//               Cancel
//             </Button>
//             <Button variant="primary" type="submit">
//               {editingRoute ? 'Update' : 'Add'} Route
//             </Button>
//           </Modal.Footer>
//         </form>
//       </Modal>

//       {/* Delete Confirmation Modal */}
//       <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
//         <Modal.Header closeButton>
//           <Modal.Title>Confirm Delete</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           {itemToDelete && (
//             <div>
//               <p>Are you sure you want to delete this {deleteType}?</p>
//               {deleteType === 'bus' ? (
//                 <>
//                   <p><strong>Bus Name:</strong> {itemToDelete.busName}</p>
//                   <p><strong>Bus Number:</strong> {itemToDelete.busNumber}</p>
//                 </>
//               ) : (
//                 <>
//                   <p><strong>Route:</strong> {itemToDelete.origin} → {itemToDelete.destination}</p>
//                   <p><strong>Bus:</strong> {itemToDelete.bus?.busName || 'N/A'} ({itemToDelete.bus?.busNumber || 'N/A'})</p>
//                 </>
//               )}
//               <p className="text-danger">
//                 <strong>Warning:</strong> This action cannot be undone. Deleting this {deleteType} may affect existing bookings and schedules.
//               </p>
//             </div>
//           )}
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
//             Cancel
//           </Button>
//           <Button 
//             variant="danger" 
//             onClick={handleDelete}
//           >
//             Delete {deleteType.charAt(0).toUpperCase() + deleteType.slice(1)}
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </Container>
//   );
// };

// export default EditBuses;

// // src/pages/operator/ManageBuses.js
// import React, { useState, useEffect } from 'react';
// import { Container, Row, Col, Card, Button, Table, Modal, Form, Alert, Spinner, Badge, Tabs, Tab } from 'react-bootstrap';
// import { operatorService } from '../../services/operatorService';

// const EditBuses = () => {
//   // State for Buses
//   const [buses, setBuses] = useState([]);
//   const [routes, setRoutes] = useState([]);
//   const [allBuses, setAllBuses] = useState([]); // For route form bus selection
//   const [loading, setLoading] = useState(true);
//   const [activeTab, setActiveTab] = useState('buses');
  
//   // Modals state
//   const [showBusModal, setShowBusModal] = useState(false);
//   const [showRouteModal, setShowRouteModal] = useState(false);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
  
//   // Editing state
//   const [editingBus, setEditingBus] = useState(null);
//   const [editingRoute, setEditingRoute] = useState(null);
//   const [itemToDelete, setItemToDelete] = useState(null);
//   const [deleteType, setDeleteType] = useState(''); // 'bus' or 'route'

//   // Form data
//   const [busFormData, setBusFormData] = useState({
//     busName: '',
//     busNumber: '',
//     busType: 'Sleeper',
//     totalSeats: 0,
//     amenities: ''
//   });

//   const [routeFormData, setRouteFormData] = useState({
//     origin: '',
//     destination: '',
//     departureTime: '',
//     arrivalTime: '',
//     distance: 0,
//     fare: 0,
//     busId: 0
//   });

//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');

//   useEffect(() => {
//     loadData();
//   }, []);

//   const loadData = async () => {
//     try {
//       const [busesRes, routesRes] = await Promise.all([
//         operatorService.getAllBuses(),
//         operatorService.getAllRoutes()
//       ]);
//       setBuses(busesRes.data);
//       setRoutes(routesRes.data);
//       setAllBuses(busesRes.data); // Store all buses for route form
//     } catch (err) {
//       setError('Failed to load data');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Bus handlers
//   const handleBusSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       if (editingBus) {
//         await operatorService.updateBus({ ...busFormData, busId: editingBus.busId });
//         setSuccess('Bus updated successfully');
//       } else {
//         await operatorService.addBus(busFormData);
//         setSuccess('Bus added successfully');
//       }
//       setShowBusModal(false);
//       setEditingBus(null);
//       setBusFormData({
//         busName: '',
//         busNumber: '',
//         busType: 'Sleeper',
//         totalSeats: 0,
//         amenities: ''
//       });
//       loadData();
//     } catch (err) {
//       setError('Failed to save bus');
//     }
//   };

//   const handleBusEdit = (bus) => {
//     setEditingBus(bus);
//     setBusFormData({
//       busName: bus.busName,
//       busNumber: bus.busNumber,
//       busType: bus.busType,
//       totalSeats: bus.totalSeats,
//       amenities: bus.amenities || ''
//     });
//     setShowBusModal(true);
//   };

//   // Route handlers
//   const handleRouteSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       if (editingRoute) {
//         await operatorService.updateRoute({ ...routeFormData, routeId: editingRoute.routeId });
//         setSuccess('Route updated successfully');
//       } else {
//         await operatorService.addRoute(routeFormData);
//         setSuccess('Route added successfully');
//       }
//       setShowRouteModal(false);
//       setEditingRoute(null);
//       setRouteFormData({
//         origin: '',
//         destination: '',
//         departureTime: '',
//         arrivalTime: '',
//         distance: 0,
//         fare: 0,
//         busId: allBuses.length > 0 ? allBuses[0].busId : 0
//       });
//       loadData();
//     } catch (err) {
//       setError('Failed to save route');
//     }
//   };

//   const handleRouteEdit = (route) => {
//     setEditingRoute(route);
//     setRouteFormData({
//       origin: route.origin,
//       destination: route.destination,
//       departureTime: route.departureTime.substring(0, 16),
//       arrivalTime: route.arrivalTime.substring(0, 16),
//       distance: route.distance,
//       fare: route.fare,
//       busId: route.bus?.busId || 0
//     });
//     setShowRouteModal(true);
//   };

//   // Delete handler
//   const handleDelete = async () => {
//     try {
//       if (deleteType === 'bus') {
//         await operatorService.deleteBus(itemToDelete.busId);
//         setSuccess('Bus deleted successfully');
//       } else {
//         await operatorService.deleteRoute(itemToDelete.routeId);
//         setSuccess('Route deleted successfully');
//       }
//       setShowDeleteModal(false);
//       setItemToDelete(null);
//       setDeleteType('');
//       loadData();
//     } catch (err) {
//       setError(`Failed to delete ${deleteType}`);
//     }
//   };

//   const confirmDelete = (item, type) => {
//     setItemToDelete(item);
//     setDeleteType(type);
//     setShowDeleteModal(true);
//   };

//   if (loading) {
//     return (
//       <Container className="text-center mt-5">
//         <Spinner animation="border" />
//         <p>Loading data...</p>
//       </Container>
//     );
//   }

//   return (
//     <Container className="mt-4">
//       <Row className="mb-4">
//         <Col>
//           <h2>Manage Buses & Routes</h2>
//           <p className="text-muted">Operator can manage buses and routes</p>
//         </Col>
//       </Row>

//       {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}
//       {success && <Alert variant="success" onClose={() => setSuccess('')} dismissible>{success}</Alert>}

//       <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className="mb-3">
//         {/* Buses Tab */}
//         <Tab eventKey="buses" title="Buses">
//           <div className="d-flex justify-content-between align-items-center mb-3">
//             <h4>Bus Management</h4>
//             <Button onClick={() => setShowBusModal(true)}>+ Add New Bus</Button>
//           </div>

//           <Card>
//             <Card.Header>
//               <h5 className="mb-0">All Buses</h5>
//             </Card.Header>
//             <Card.Body>
//               {buses.length === 0 ? (
//                 <div className="text-center py-4">
//                   <p>No buses found</p>
//                 </div>
//               ) : (
//                 <Table responsive striped>
//                   <thead>
//                     <tr>
//                       <th>ID</th>
//                       <th>Name</th>
//                       <th>Number</th>
//                       <th>Type</th>
//                       <th>Seats</th>
//                       <th>Amenities</th>
//                       <th>Status</th>
//                       <th>Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {buses.map((bus) => (
//                       <tr key={bus.busId}>
//                         <td>{bus.busId}</td>
//                         <td>{bus.busName}</td>
//                         <td>{bus.busNumber}</td>
//                         <td>{bus.busType}</td>
//                         <td>{bus.totalSeats}</td>
//                         <td>{bus.amenities || 'N/A'}</td>
//                         <td>
//                           <Badge bg={bus.isActive ? 'success' : 'danger'}>
//                             {bus.isActive ? 'Active' : 'Inactive'}
//                           </Badge>
//                         </td>
//                         <td>
//                           <Button 
//                             variant="outline-primary" 
//                             size="sm" 
//                             onClick={() => handleBusEdit(bus)}
//                             className="me-2"
//                           >
//                             Edit
//                           </Button>
//                           <Button 
//                             variant="outline-danger" 
//                             size="sm" 
//                             onClick={() => confirmDelete(bus, 'bus')}
//                           >
//                             Delete
//                           </Button>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </Table>
//               )}
//             </Card.Body>
//           </Card>
//         </Tab>

//         {/* Routes Tab */}
//         <Tab eventKey="routes" title="Routes">
//           <div className="d-flex justify-content-between align-items-center mb-3">
//             <h4>Route Management</h4>
//             <Button onClick={() => setShowRouteModal(true)}>+ Add New Route</Button>
//           </div>

//           <Card>
//             <Card.Header>
//               <h5 className="mb-0">All Routes</h5>
//             </Card.Header>
//             <Card.Body>
//               {routes.length === 0 ? (
//                 <div className="text-center py-4">
//                   <p>No routes found</p>
//                 </div>
//               ) : (
//                 <Table responsive striped>
//                   <thead>
//                     <tr>
//                       <th>ID</th>
//                       <th>Origin</th>
//                       <th>Destination</th>
//                       <th>Bus</th>
//                       <th>Departure</th>
//                       <th>Arrival</th>
//                       <th>Distance</th>
//                       <th>Fare</th>
//                       <th>Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {routes.map((route) => (
//                       <tr key={route.routeId}>
//                         <td>{route.routeId}</td>
//                         <td>{route.origin}</td>
//                         <td>{route.destination}</td>
//                         <td>{route.bus?.busName || 'N/A'} ({route.bus?.busNumber || 'N/A'})</td>
//                         <td>{new Date(route.departureTime).toLocaleString()}</td>
//                         <td>{new Date(route.arrivalTime).toLocaleString()}</td>
//                         <td>{route.distance} km</td>
//                         <td>₹{route.fare}</td>
//                         <td>
//                           <Button 
//                             variant="outline-primary" 
//                             size="sm" 
//                             onClick={() => handleRouteEdit(route)}
//                             className="me-2"
//                           >
//                             Edit
//                           </Button>
//                           <Button 
//                             variant="outline-danger" 
//                             size="sm" 
//                             onClick={() => confirmDelete(route, 'route')}
//                           >
//                             Delete
//                           </Button>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </Table>
//               )}
//             </Card.Body>
//           </Card>
//         </Tab>
//       </Tabs>

//       {/* Add/Edit Bus Modal */}
//       <Modal show={showBusModal} onHide={() => setShowBusModal(false)} size="lg">
//         <Modal.Header closeButton>
//           <Modal.Title>{editingBus ? 'Edit Bus' : 'Add New Bus'}</Modal.Title>
//         </Modal.Header>
//         <Form onSubmit={handleBusSubmit}>
//           <Modal.Body>
//             <Form.Group className="mb-3">
//               <Form.Label>Bus Name</Form.Label>
//               <Form.Control
//                 type="text"
//                 value={busFormData.busName}
//                 onChange={(e) => setBusFormData({ ...busFormData, busName: e.target.value })}
//                 required
//               />
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>Bus Number</Form.Label>
//               <Form.Control
//                 type="text"
//                 value={busFormData.busNumber}
//                 onChange={(e) => setBusFormData({ ...busFormData, busNumber: e.target.value })}
//                 required
//               />
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>Bus Type</Form.Label>
//               <Form.Select
//                 value={busFormData.busType}
//                 onChange={(e) => setBusFormData({ ...busFormData, busType: e.target.value })}
//               >
//                 <option value="Sleeper">Sleeper</option>
//                 <option value="A/C">A/C</option>
//                 <option value="Non-A/C">Non-A/C</option>
//               </Form.Select>
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>Total Seats</Form.Label>
//               <Form.Control
//                 type="number"
//                 value={busFormData.totalSeats}
//                 onChange={(e) => setBusFormData({ ...busFormData, totalSeats: parseInt(e.target.value) })}
//                 required
//                 min="1"
//               />
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>Amenities</Form.Label>
//               <Form.Control
//                 type="text"
//                 value={busFormData.amenities}
//                 onChange={(e) => setBusFormData({ ...busFormData, amenities: e.target.value })}
//                 placeholder="Water bottle, Blanket, Charging point, TV"
//               />
//             </Form.Group>
//           </Modal.Body>
//           <Modal.Footer>
//             <Button variant="secondary" onClick={() => setShowBusModal(false)}>
//               Cancel
//             </Button>
//             <Button variant="primary" type="submit">
//               {editingBus ? 'Update' : 'Add'} Bus
//             </Button>
//           </Modal.Footer>
//         </Form>
//       </Modal>

//       {/* Add/Edit Route Modal */}
//       <Modal show={showRouteModal} onHide={() => setShowRouteModal(false)} size="lg">
//         <Modal.Header closeButton>
//           <Modal.Title>{editingRoute ? 'Edit Route' : 'Add New Route'}</Modal.Title>
//         </Modal.Header>
//         <Form onSubmit={handleRouteSubmit}>
//           <Modal.Body>
//             <Form.Group className="mb-3">
//               <Form.Label>Origin</Form.Label>
//               <Form.Control
//                 type="text"
//                 value={routeFormData.origin}
//                 onChange={(e) => setRouteFormData({ ...routeFormData, origin: e.target.value })}
//                 required
//               />
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>Destination</Form.Label>
//               <Form.Control
//                 type="text"
//                 value={routeFormData.destination}
//                 onChange={(e) => setRouteFormData({ ...routeFormData, destination: e.target.value })}
//                 required
//               />
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>Bus</Form.Label>
//               <Form.Select
//                 value={routeFormData.busId}
//                 onChange={(e) => setRouteFormData({ ...routeFormData, busId: parseInt(e.target.value) })}
//                 required
//               >
//                 <option value={0}>Select Bus</option>
//                 {allBuses.map((bus) => (
//                   <option key={bus.busId} value={bus.busId}>
//                     {bus.busName} ({bus.busNumber})
//                   </option>
//                 ))}
//               </Form.Select>
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>Departure Time</Form.Label>
//               <Form.Control
//                 type="datetime-local"
//                 value={routeFormData.departureTime}
//                 onChange={(e) => setRouteFormData({ ...routeFormData, departureTime: e.target.value })}
//                 required
//               />
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>Arrival Time</Form.Label>
//               <Form.Control
//                 type="datetime-local"
//                 value={routeFormData.arrivalTime}
//                 onChange={(e) => setRouteFormData({ ...routeFormData, arrivalTime: e.target.value })}
//                 required
//               />
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>Distance (km)</Form.Label>
//               <Form.Control
//                 type="number"
//                 step="0.1"
//                 value={routeFormData.distance}
//                 onChange={(e) => setRouteFormData({ ...routeFormData, distance: parseFloat(e.target.value) })}
//                 required
//                 min="0.1"
//               />
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>Fare (₹)</Form.Label>
//               <Form.Control
//                 type="number"
//                 step="0.01"
//                 value={routeFormData.fare}
//                 onChange={(e) => setRouteFormData({ ...routeFormData, fare: parseFloat(e.target.value) })}
//                 required
//                 min="0.01"
//               />
//             </Form.Group>
//           </Modal.Body>
//           <Modal.Footer>
//             <Button variant="secondary" onClick={() => setShowRouteModal(false)}>
//               Cancel
//             </Button>
//             <Button variant="primary" type="submit">
//               {editingRoute ? 'Update' : 'Add'} Route
//             </Button>
//           </Modal.Footer>
//         </Form>
//       </Modal>

//       {/* Delete Confirmation Modal */}
//       <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
//         <Modal.Header closeButton>
//           <Modal.Title>Confirm Delete</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           {itemToDelete && (
//             <div>
//               <p>Are you sure you want to delete this {deleteType}?</p>
//               {deleteType === 'bus' ? (
//                 <>
//                   <p><strong>Bus Name:</strong> {itemToDelete.busName}</p>
//                   <p><strong>Bus Number:</strong> {itemToDelete.busNumber}</p>
//                 </>
//               ) : (
//                 <>
//                   <p><strong>Route:</strong> {itemToDelete.origin} → {itemToDelete.destination}</p>
//                   <p><strong>Bus:</strong> {itemToDelete.bus?.busName || 'N/A'} ({itemToDelete.bus?.busNumber || 'N/A'})</p>
//                 </>
//               )}
//               <p className="text-danger">
//                 <strong>Warning:</strong> This action cannot be undone. Deleting this {deleteType} may affect existing bookings and schedules.
//               </p>
//             </div>
//           )}
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
//             Cancel
//           </Button>
//           <Button 
//             variant="danger" 
//             onClick={handleDelete}
//           >
//             Delete {deleteType.charAt(0).toUpperCase() + deleteType.slice(1)}
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </Container>
//   );
// };

// export default EditBuses;
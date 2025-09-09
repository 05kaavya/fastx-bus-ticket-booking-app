
import { useEffect, useState } from "react";
import { Container, Row, Col, Button, Alert, Form } from "react-bootstrap";
import operatorService from "../../services/operatorService";

export default function EditSeats() {
  const [busId, setBusId] = useState("");
  const [seats, setSeats] = useState([]);
  const [form, setForm] = useState({
    seatId: "",
    seatNumber: "",
    seatType: "Normal",
    seatStatus: "Available",
  });
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false);

  // Load seats when busId is entered and searched
  const handleSearchBus = async (e) => {
    e.preventDefault();
    if (!busId) {
      setError("Please enter a Bus ID");
      return;
    }
    loadSeats(busId);
  };

  const loadSeats = async (busId) => {
    try {
      const today = new Date().toISOString().split("T")[0];
      const seatsData = await operatorService.getSeatsByBusIdAndDate(busId, today);

      const updatedSeats = seatsData.map((seat) => ({
        ...seat,
        seatStatus: seat.seatStatus || "Available",
      }));

      setSeats(updatedSeats);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to fetch seats");
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!busId) {
        setError("Please enter a Bus ID first");
        return;
      }
      if (editing) {
        await operatorService.updateSeat({ ...form, busId });
      } else {
        await operatorService.addSeat({ ...form, busId });
      }
      resetForm();
      loadSeats(busId);
    } catch (err) {
      console.error(err);
      setError("Error saving seat");
    }
  };

  const handleEdit = (seat) => {
    setForm({
      seatId: seat.seatId,
      seatNumber: seat.seatNumber,
      seatType: seat.seatType,
      seatStatus: seat.seatStatus,
    });
    setEditing(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this seat?")) return;
    try {
      await operatorService.deleteSeat(id);
      loadSeats(busId);
    } catch (err) {
      console.error(err);
      setError("Failed to delete seat");
    }
  };

  const resetForm = () => {
    setForm({
      seatId: "",
      seatNumber: "",
      seatType: "Normal",
      seatStatus: "Available",
    });
    setEditing(false);
  };

  // Organize seats into rows
  const organizeSeatsIntoRows = (seats) => {
    if (!Array.isArray(seats) || seats.length === 0) return [];
    const rows = {};
    seats.forEach((seat) => {
      const rowLetter = seat.seatNumber.charAt(0);
      if (!rows[rowLetter]) rows[rowLetter] = [];
      rows[rowLetter].push(seat);
    });

    Object.keys(rows).forEach((row) => {
      rows[row].sort(
        (a, b) =>
          parseInt(a.seatNumber.substring(1)) -
          parseInt(b.seatNumber.substring(1))
      );
    });

    return Object.values(rows);
  };

  const seatLayout = organizeSeatsIntoRows(seats);

  return (
    <Container className="mt-4">
      <h2 className="mb-4 text-center">Manage Seats</h2>

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      {/* Bus ID Search */}
      <Form onSubmit={handleSearchBus} className="mb-4">
        <Row>
          <Col md={4}>
            <Form.Control
              type="number"
              placeholder="Enter Bus ID"
              value={busId}
              onChange={(e) => setBusId(e.target.value)}
              required
            />
          </Col>
          <Col md={2}>
            <Button type="submit" variant="primary">
              Search Bus
            </Button>
          </Col>
        </Row>
      </Form>

      {busId && (
        <>
          {/* Seat Form */}
          <form onSubmit={handleSubmit} className="mb-4">
            <Row className="mb-3">
              <Col md={3}>
                <input
                  type="text"
                  name="seatNumber"
                  placeholder="Seat Number (e.g., A1)"
                  value={form.seatNumber}
                  onChange={handleChange}
                  required
                  className="form-control"
                />
              </Col>
              <Col md={3}>
                <select
                  name="seatType"
                  value={form.seatType}
                  onChange={handleChange}
                  required
                  className="form-select"
                >
                  <option value="Normal">Normal</option>
                  <option value="Window">Window</option>
                </select>
              </Col>
              <Col md={3}>
                <select
                  name="seatStatus"
                  value={form.seatStatus}
                  onChange={handleChange}
                  required
                  className="form-select"
                >
                  <option value="Available">Available</option>
                  <option value="Booked">Booked</option>
                </select>
              </Col>
              <Col md={3}>
                <Button type="submit" variant={editing ? "warning" : "primary"}>
                  {editing ? "Update Seat" : "Add Seat"}
                </Button>
                {editing && (
                  <Button
                    variant="secondary"
                    className="ms-2"
                    onClick={resetForm}
                  >
                    Cancel
                  </Button>
                )}
              </Col>
            </Row>
          </form>

          {/* Seat grid */}
          <h3 className="mb-3">Existing Seats</h3>
          <div className="bus-layout mb-4">
            {seatLayout.map((row, rowIndex) => (
              <Row key={`row-${rowIndex}`} className="justify-content-center mb-2">
                {row.map((seat) => (
                  <Col key={`seat-${seat.seatId}`} xs={3} className="mb-2">
                    <Button
                      variant={
                        seat.seatStatus === "Booked"
                          ? "secondary"
                          : "outline-primary"
                      }
                      className="w-100"
                      disabled={seat.seatStatus === "Booked"}
                      onClick={() => handleEdit(seat)}
                    >
                      {seat.seatNumber}
                      <br />
                      <small>{seat.seatType}</small>
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      className="mt-1 w-100"
                      onClick={() => handleDelete(seat.seatId)}
                      disabled={seat.seatStatus === "Booked"}
                    >
                      Delete
                    </Button>
                  </Col>
                ))}
              </Row>
            ))}
          </div>
        </>
      )}
    </Container>
  );
}



// import { useEffect, useState } from "react";
// import { Container, Row, Col, Card, Button, Alert } from "react-bootstrap";
// import operatorService from "../../services/operatorService";

// export default function EditSeats({ busId }) {
//   const [seats, setSeats] = useState([]);
//   const [form, setForm] = useState({
//     seatId: "",
//     seatNumber: "",
//     seatType: "Normal",
//     seatStatus: "Available",
//   });
//   const [error, setError] = useState("");
//   const [editing, setEditing] = useState(false);
//   const [selectedSeats, setSelectedSeats] = useState([]);

//   // Load seats on busId change
//   useEffect(() => {
//     if (busId) loadSeats(busId);
//   }, [busId]);

//   const loadSeats = async (busId) => {
//     try {
//       const today = new Date().toISOString().split("T")[0];
//       const seatsData = await operatorService.getSeatsByBusIdAndDate(busId, today);

//       console.log("Fetched seats:", seatsData); // debug

//       const updatedSeats = seatsData.map((seat) => ({
//         ...seat,
//         seatStatus: seat.seatStatus || "Available",
//       }));

//       setSeats(updatedSeats);
//     } catch (err) {
//       console.error(err);
//       setError("Failed to fetch seats");
//     }
//   };

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       if (editing) {
//         await operatorService.updateSeat({ ...form, busId });
//       } else {
//         await operatorService.addSeat({ ...form, busId });
//       }
//       resetForm();
//       loadSeats(busId);
//     } catch (err) {
//       console.error(err);
//       setError("Error saving seat");
//     }
//   };

//   const handleEdit = (seat) => {
//     setForm({
//       seatId: seat.seatId,
//       seatNumber: seat.seatNumber,
//       seatType: seat.seatType,
//       seatStatus: seat.seatStatus,
//     });
//     setEditing(true);
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this seat?")) return;
//     try {
//       await operatorService.deleteSeat(id);
//       loadSeats(busId);
//     } catch (err) {
//       console.error(err);
//       setError("Failed to delete seat");
//     }
//   };

//   const resetForm = () => {
//     setForm({
//       seatId: "",
//       seatNumber: "",
//       seatType: "Normal",
//       seatStatus: "Available",
//     });
//     setEditing(false);
//   };

//   // Organize seats into rows by row letter
//   const organizeSeatsIntoRows = (seats) => {
//     if (!Array.isArray(seats) || seats.length === 0) return [];

//     const rows = {};
//     seats.forEach((seat) => {
//       const rowLetter = seat.seatNumber.charAt(0);
//       if (!rows[rowLetter]) rows[rowLetter] = [];
//       rows[rowLetter].push(seat);
//     });

//     Object.keys(rows).forEach((row) => {
//       rows[row].sort(
//         (a, b) =>
//           parseInt(a.seatNumber.substring(1)) -
//           parseInt(b.seatNumber.substring(1))
//       );
//     });

//     return Object.values(rows);
//   };

//   const seatLayout = organizeSeatsIntoRows(seats);

//   return (
//     <Container className="mt-4">
//       <h2 className="mb-4 text-center">Manage Seats (Bus {busId})</h2>

//       {error && (
//         <Alert variant="danger" dismissible onClose={() => setError("")}>
//           {error}
//         </Alert>
//       )}

//       {/* Seat form */}
//       <form onSubmit={handleSubmit} className="mb-4">
//         <Row className="mb-3">
//           <Col md={3}>
//             <input
//               type="text"
//               name="seatNumber"
//               placeholder="Seat Number (e.g., A1)"
//               value={form.seatNumber}
//               onChange={handleChange}
//               required
//               className="form-control"
//             />
//           </Col>
//           <Col md={3}>
//             <select
//               name="seatType"
//               value={form.seatType}
//               onChange={handleChange}
//               required
//               className="form-select"
//             >
//               <option value="Normal">Normal</option>
//               <option value="Window">Window</option>
//             </select>
//           </Col>
//           <Col md={3}>
//             <select
//               name="seatStatus"
//               value={form.seatStatus}
//               onChange={handleChange}
//               required
//               className="form-select"
//             >
//               <option value="Available">Available</option>
//               <option value="Booked">Booked</option>
//             </select>
//           </Col>
//           <Col md={3}>
//             <Button type="submit" variant={editing ? "warning" : "primary"}>
//               {editing ? "Update Seat" : "Add Seat"}
//             </Button>
//             {editing && (
//               <Button
//                 variant="secondary"
//                 className="ms-2"
//                 onClick={resetForm}
//               >
//                 Cancel
//               </Button>
//             )}
//           </Col>
//         </Row>
//       </form>

//       {/* Seat grid */}
//       <h3 className="mb-3">Existing Seats</h3>
//       <div className="bus-layout mb-4">
//         {seatLayout.map((row, rowIndex) => (
//           <Row key={`row-${rowIndex}`} className="justify-content-center mb-2">
//             {row.map((seat) => (
//               <Col key={`seat-${seat.seatId}`} xs={3} className="mb-2">
//                 <Button
//                   variant={
//                     seat.seatStatus === "Booked"
//                       ? "secondary"
//                       : "outline-primary"
//                   }
//                   className="w-100"
//                   disabled={seat.seatStatus === "Booked"}
//                   onClick={() => handleEdit(seat)}
//                 >
//                   {seat.seatNumber}
//                   <br />
//                   <small>{seat.seatType}</small>
//                 </Button>
//                 <Button
//                   variant="danger"
//                   size="sm"
//                   className="mt-1 w-100"
//                   onClick={() => handleDelete(seat.seatId)}
//                   disabled={seat.seatStatus === "Booked"}
//                 >
//                   Delete
//                 </Button>
//               </Col>
//             ))}
//           </Row>
//         ))}
//       </div>
//     </Container>
//   );
// }


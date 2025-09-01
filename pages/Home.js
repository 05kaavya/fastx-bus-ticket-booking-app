// Home.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Home.css';


const Home = () => {
  const [searchData, setSearchData] = useState({
    from: '',
    to: '',
    date: ''
  });

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchData({
      ...searchData,
      [name]: value
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Search data:', searchData);

    // Navigate to buses page with query params
    navigate(`/buses?from=${searchData.from}&to=${searchData.to}&date=${searchData.date}`);
  };

  return (
    <div className="home-container">
      {/* Hero Section */}
      <div className="hero-section">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8 text-center">
              <h1 className="display-4 fw-bold mb-4">Book Your Bus Journey</h1>
              <p className="lead mb-5">Travel across the country with comfort and ease</p>

              {/* Booking Form */}
              <div className="booking-card card shadow">
                <div className="card-body p-4">
                  <h3 className="card-title text-center mb-4">Find Your Bus</h3>
                  <form onSubmit={handleSearch}>
                    <div className="row g-3">
                      <div className="col-md-4">
                        <div className="form-floating">
                          <input
                            type="text"
                            className="form-control"
                            id="from"
                            name="from"
                            placeholder="Enter origin"
                            value={searchData.from}
                            onChange={handleInputChange}
                            required
                          />
                          <label htmlFor="from">From</label>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="form-floating">
                          <input
                            type="text"
                            className="form-control"
                            id="to"
                            name="to"
                            placeholder="Enter destination"
                            value={searchData.to}
                            onChange={handleInputChange}
                            required
                          />
                          <label htmlFor="to">To</label>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="form-floating">
                          <input
                            type="date"
                            className="form-control"
                            id="date"
                            name="date"
                            value={searchData.date}
                            onChange={handleInputChange}
                            required
                          />
                          <label htmlFor="date">Travel Date</label>
                        </div>
                      </div>
                    </div>
                    <div className="text-center mt-4">
                      <button type="submit" className="btn btn-primary btn-lg">
                        <i className="fas fa-search me-2"></i>Search Buses
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section className="features py-5">
        <div className="container">
          <div className="row text-center">
            <div className="col-md-4 mb-4">
              <div className="feature-item p-4">
                <i className="fas fa-ticket-alt fa-3x mb-3"></i>
                <h4>Easy Booking</h4>
                <p>Book your tickets in just a few clicks</p>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="feature-item p-4">
                <i className="fas fa-shield-alt fa-3x mb-3"></i>
                <h4>Safe Travel</h4>
                <p>Your safety is our top priority</p>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="feature-item p-4">
                <i className="fas fa-headset fa-3x mb-3"></i>
                <h4>24/7 Support</h4>
                <p>We're here to help you anytime</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer py-4">
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <p>&copy; 2025 FastX. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;



// // Home.js
// import React, { useState } from 'react';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import './Home.css';

// const Home = () => {
//   const [searchData, setSearchData] = useState({
//     from: '',
//     to: '',
//     date: ''
//   });

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setSearchData({
//       ...searchData,
//       [name]: value
//     });
//   };

//   const handleSearch = (e) => {
//     e.preventDefault();
//     console.log('Search data:', searchData);
//     // Here you would typically handle the search logic
//   };

//   return (
//     <div className="home-container">
//       {/* Navigation Bar */}
//       <nav className="navbar navbar-expand-lg navbar-dark">
//         <div className="container">
//           {/* <a className="navbar-brand" href="./Home.js">
//             <i className="fas fa-bus me-2"></i>SwiftBus
//           </a> */}
//           <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
//             <span className="navbar-toggler-icon"></span>
//           </button>
//           <div className="collapse navbar-collapse" id="navbarNav">
//             <ul className="navbar-nav ms-auto">
//               <li className="nav-item">
//                 <a className="nav-link" href="./Login.js"><i className="fas fa-user me-1"></i> User Login</a>
//               </li>
//               <li className="nav-item">
//                 <a className="nav-link" href="./AdminLogin.js"><i className="fas fa-user-cog me-1"></i> Admin Login</a>
//               </li>
//               <li className="nav-item">
//                 <a className="nav-link" href="./Register.js"><i className="fas fa-user-plus me-1"></i> Register</a>
//               </li>
//             </ul>
//           </div>
//         </div>
//       </nav>

//       {/* Hero Section */}
//       <div className="hero-section">
//         <div className="container">
//           <div className="row justify-content-center">
//             <div className="col-lg-8 text-center">
//               <h1 className="display-4 fw-bold mb-4">Book Your Bus Journey</h1>
//               <p className="lead mb-5">Travel across the country with comfort and ease</p>
              
//               {/* Booking Form */}
//               <div className="booking-card card shadow">
//                 <div className="card-body p-4">
//                   <h3 className="card-title text-center mb-4">Find Your Bus</h3>
//                   <form onSubmit={handleSearch}>
//                     <div className="row g-3">
//                       <div className="col-md-4">
//                         <div className="form-floating">
//                           <select 
//                             className="form-select" 
//                             id="from" 
//                             name="from"
//                             value={searchData.from}
//                             onChange={handleInputChange}
//                             required
//                           >
//                             <option value="">Select origin</option>
//                             <option value="new-york">New York</option>
//                             <option value="los-angeles">Los Angeles</option>
//                             <option value="chicago">Chicago</option>
//                             <option value="houston">Houston</option>
//                             <option value="miami">Miami</option>
//                           </select>
//                           <label htmlFor="from">From</label>
//                         </div>
//                       </div>
//                       <div className="col-md-4">
//                         <div className="form-floating">
//                           <select 
//                             className="form-select" 
//                             id="to" 
//                             name="to"
//                             value={searchData.to}
//                             onChange={handleInputChange}
//                             required
//                           >
//                             <option value="">Select destination</option>
//                             <option value="new-york">New York</option>
//                             <option value="los-angeles">Los Angeles</option>
//                             <option value="chicago">Chicago</option>
//                             <option value="houston">Houston</option>
//                             <option value="miami">Miami</option>
//                           </select>
//                           <label htmlFor="to">To</label>
//                         </div>
//                       </div>
//                       <div className="col-md-4">
//                         <div className="form-floating">
//                           <input 
//                             type="date" 
//                             className="form-control" 
//                             id="date" 
//                             name="date"
//                             value={searchData.date}
//                             onChange={handleInputChange}
//                             required
//                           />
//                           <label htmlFor="date">Travel Date</label>
//                         </div>
//                       </div>
//                     </div>
//                     <div className="text-center mt-4">
//                       <button type="submit" className="btn btn-primary btn-lg">
//                         <i className="fas fa-search me-2"></i>Search Buses
//                       </button>
//                     </div>
//                   </form>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Features Section */}
//       <section className="features py-5">
//         <div className="container">
//           <div className="row text-center">
//             <div className="col-md-4 mb-4">
//               <div className="feature-item p-4">
//                 <i className="fas fa-ticket-alt fa-3x mb-3"></i>
//                 <h4>Easy Booking</h4>
//                 <p>Book your tickets in just a few clicks</p>
//               </div>
//             </div>
//             <div className="col-md-4 mb-4">
//               <div className="feature-item p-4">
//                 <i className="fas fa-shield-alt fa-3x mb-3"></i>
//                 <h4>Safe Travel</h4>
//                 <p>Your safety is our top priority</p>
//               </div>
//             </div>
//             <div className="col-md-4 mb-4">
//               <div className="feature-item p-4">
//                 <i className="fas fa-headset fa-3x mb-3"></i>
//                 <h4>24/7 Support</h4>
//                 <p>We're here to help you anytime</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Footer */}
//       <footer className="footer py-4">
//         <div className="container">
//           <div className="row">
//             <div className="col-md-6">
//               <p>&copy; 2023 SwiftBus. All rights reserved.</p>
//             </div>
//             {/* <div className="col-md-6 text-md-end">
//               <a href="#" className="text-light me-3">Terms of Service</a>
//               <a href="#" className="text-light me-3">Privacy Policy</a>
//               <a href="#" className="text-light">Contact Us</a>
//             </div> */}
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// };

// export default Home;
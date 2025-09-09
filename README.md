# 🚌 FastX Bus Ticket Booking System
📌 Project Description

FastX is a full-stack bus ticket booking system that allows users to search buses, view routes, select seats, make bookings, complete payments, and manage cancellations/refunds. It provides a smooth and real-time booking experience for both users and administrators.

The project follows a layered architecture with a React + React-Bootstrap frontend, a Spring Boot backend, and a MySQL database.


Features
# 👤 User Features

🔑 User authentication & role-based access

🔍 Search buses by route and date

💺 Select available seats with real-time seat availability check

💳 Proceed to payment and confirm booking

📜 View booking history

❌ Cancel bookings & request refunds (80% refund policy)

# 🛠️ Admin Features

👨‍💼 View buses, routes, users and operators

📊 View all bookings across the platform

🔎 Search bookings by booking ID

🔐 Role-based restricted access

# 🚌 Bus Operator Features

👨‍💼 Manage buses, routes and seats

📊 View all bookings across the platform and refund

🔎 Search bookings by booking ID

🔐 Role-based restricted access


# 🏗️ Tech Stack
# Frontend (React + React Bootstrap)
React.js

React Router DOM

React Bootstrap (UI components)

Axios (API calls)

# Backend (Spring Boot)
Spring Boot (REST API)

Spring Data JPA & Hibernate

Spring Security (JWT authentication & role management)

Lombok (Boilerplate reduction)

# Database
MySQL

Relationships with foreign key constraints

Tables: users, buses, routes, seats, bookings, booking_seats, payments, cancellations, admins, bus_operators

```
fastx-frontend/
 ├── src/
 │   ├── components/        # Reusable UI components
 │   ├── pages/             # Screens (Login, Register, Bookings, Seats, Payment etc.)
 │   ├── services/          # Axios services for API calls
 │   ├── App.js             # Route configuration
 │   └── index.js           # App entry point 

fastx-backend/
 ├── src/main/java/com/hexaware/fastx/
 │   ├── entities/          # JPA Entities (User, Bus, Booking, etc.)
 │   ├── repositories/      # Spring Data JPA Repositories
 │   ├── services/          # Business logic
 │   ├── controllers/       # REST APIs
 │   ├── config/            # Security & CORS configuration
 │   └── FastxApplication.java
 ├── src/main/resources/
 │   ├── application.properties
 │   └── schema.sql & data.sql (if required)
```

# 🔮 Future Enhancements

🏷️ Discount coupons & promo codes

📱 Mobile app (React Native)

🔔 Email & SMS notifications

📍 GPS-based bus tracking

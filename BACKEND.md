# BACKEND.md

# Movie-Ticketing-System – Backend Documentation

## Table of Contents
- [Introduction](#introduction)
- [Project Structure Overview](#project-structure-overview)
- [Setup & Environment](#setup--environment)
- [Backend Directory Structure](#backend-directory-structure)
- [Server Entry Point: `index.js`](#server-entry-point-indexjs)
- [Model Descriptions](#model-descriptions)
  - [User Model](#user-model)
  - [Movie Model](#movie-model)
  - [Showtime Model](#showtime-model)
  - [Booking Model](#booking-model)
- [Controllers Explained](#controllers-explained)
  - [authController.js](#authcontrollerjs)
  - [movieController.js](#moviecontrollerjs)
  - [showtimeController.js](#showtimecontrollerjs)
  - [bookingController.js](#bookingcontrollerjs)
- [Routes & API Endpoints](#routes--api-endpoints)
- [Middlewares](#middlewares)
- [Business Logic Deep Dive](#business-logic-deep-dive)
- [Database Layer (MongoDB + Mongoose)](#database-layer-mongodb--mongoose)
- [Common Patterns & Practices](#common-patterns--practices)
---

## Introduction

The backend of the Movie-Ticketing-System is a **Node.js** RESTful API built with **Express.js** and **Mongoose** (for MongoDB). Its role is to securely store all application data and provide APIs for managing users, movies, showtimes, and bookings.

## Project Structure Overview

```txt
backend/
│
├── index.js                  # Main entry to backend server
├── server/
│   ├── config/               # Configuration files (e.g., DB connection)
│   ├── controllers/          # Logic for each resource (auth, movies...)
│   ├── middleware/           # Functions used between request & response
│   ├── models/               # MongoDB models (schemas)
│   ├── routes/               # REST API endpoints
│   └── index.js              # Sometimes a local server entry/file router
│
├── package.json              # Node dependencies/commands
└── .env                      # Environment variables (not in repo, but needed)
```

## Setup & Environment

### Dependencies
- **Node.js** with Express
- **Mongoose** for MongoDB
- **dotenv** for environment configs
- **bcryptjs** for password hashing
- **jsonwebtoken** for authentication

### Environment variables needed (`.env`)
```env
PORT=3000
MONGO_URI=mongodb://<your_mongo_db_url>
JWT_SECRET=yourSuperSecretKey
```

## Backend Directory Structure

- **controllers/**: Each controller file relates to a domain object (movie, user, booking, showtime) – handles the logic of requests.
- **models/**: Each `.js` file here defines a *schema* (think: a recipe) for what a User, Movie, Booking, Showtime looks like in the database.
- **middleware/**: Functions that check requests: authentication, validation, etc.
- **routes/**: Each file connects HTTP endpoints to controller actions.

## Server Entry Point: `index.js`

Location: `backend/index.js`

```js
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import movieRoutes from "./routes/movieRoutes.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use("/api/movies", movieRoutes);
// MongoDB connection left
```

**Explanation:**
- Loads dependencies, including config from `.env`.
- Creates an Express app.
- Sets middlewares: parses JSON.
- Mounts all movie-related routes at `/api/movies`.
- **(ToDo):** MongoDB connection (missing/marked as "left" in code, must complete).

## Model Descriptions

### User Model

File: `server/models/User.js`

Defines how a user is saved in the database.
```js
import mongoose from "mongoose";
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: [true, 'please enter your password'], minlength: 6 },
    role: { type: String, enum: ["user", "admin"], default: "user" },
  },
  { timestamps: true }
);
const User = mongoose.model("User", userSchema);
export default User;
```
- **Fields:** name, email (unique), password (hashed!), role (user/admin).
- **`timestamps: true`**: automatically adds `createdAt` and `updatedAt`.

### Movie Model

File: `server/models/Movie.js`
```js
import mongoose from "mongoose";
const movieSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    releaseDate: { type: Date, required: true },
    genre: { type: String, required: true },
    language: { type: String, required: true },
    posterUrl: { type: String, required: true },
    duration: { type: Number, required: true },
    availableseats: { type: Number, required: true }
  },
  { timestamps: true }
);
const Movie = mongoose.model("Movie", movieSchema);
export default Movie;
```
- **Fields:** descriptive details and available seats for each movie.

### Showtime Model

File: `server/models/Showtime.js`
```js
const mongoose = require('mongoose');
const showtimeSchema = new mongoose.Schema({
  movie: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
  theater: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  seats: { type: Number, required: true },
  availableSeats: { type: Number, required: true }
}, { timestamps: true });
module.exports = mongoose.model('Showtime', showtimeSchema);
```
- **Links** each showtime to a Movie via a foreign key.
- Saves location, available seats, and time details for each show.

### Booking Model

File: `server/models/Booking.js`
```js
const mongoose = require('mongoose');
const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  showtime: { type: mongoose.Schema.Types.ObjectId, ref: 'Showtime', required: true },
  seats: { type: Number, required: true },
  status: { type: String, default: 'booked' }
}, { timestamps: true });
module.exports = mongoose.model('Booking', bookingSchema);
```
- Tracks who booked which showtime and their seat count.

## Controllers Explained

Each controller handles logic for a domain.

### authController.js

Handles user registration and login.

**Signup:**
- Receives name, email, password from request.
- Checks if the email exists.
- Hashes password with bcrypt.
- Saves user to DB.
- Generates JWT token (for authentication).

**Login:**
- Receives email, password.
- Verifies credentials and compares password hash.
- Issues JWT if successful.

### movieController.js

CRUD (Create, Read, Update, Delete) for movies.

- **Create**: Receive movie info → Save in DB.
- **Read (getMovies)**: Fetches all movies.
- **Read by ID (getMovieById)**: Retrieve one movie.
- **Update**: Find movie by ID, apply changes.
- **Delete**: Remove a movie from DB.

### showtimeController.js

CRUD for showtimes:
- **Create**: Require movieId, theater, date/time, etc.
- **Get All**: Optional filters (movie, date, theater).
- **Get by ID**: Gets one showtime.
- **Update/Delete**: Admin features.
- **Update available seats**: Booking system decrements available seats.

### bookingController.js

Handles the booking logic.
- **Create**: User books seats for a showtime.
- **Get**: List all bookings (with filters).
- **Get by ID**: Individual booking detail.
- **Update/Delete**: Admin or cancellation flows.
- **Stats**: Total bookings, revenue, by status.

## Routes & API Endpoints

Each resource (movies, users, bookings, showtimes) has a dedicated set of endpoints:
- `/api/auth/` - User registration, login, etc.
- `/api/movies/` - Movie CRUD
- `/api/showtimes/` - Showtimes CRUD and seat updates
- `/api/bookings/` - Seat booking CRUD

Routes are connected to corresponding controller functions and use middlewares for request validation or authentication.

## Middlewares

- **Authentication**: Checks headers for the JWT token, decodes user info.
- **Validation**: Ensures data provided in requests match expected fields.
- **Error Handling**: Catches & returns human-readable error messages.

## Business Logic Deep Dive

#### Booking Flow Example
1. User requests a booking (provides user ID, showtime ID, seats).
2. Controller checks if enough seats are available.
3. If yes, subtracts those seats from the showtime and creates a Booking entry.
4. Returns confirmation/details to the user.

**Prevents overbooking by always checking current seat availability in DB.**

## Database Layer (MongoDB + Mongoose)
- All data is stored as collections in MongoDB.
- `mongoose.Schema` defines structure.
- `ref:` enables relationships (e.g. Bookings store user & showtime IDs to reference users and shows).

## Common Patterns & Practices
- **Modularization**: Separation of logic into models, controllers, routes keeps code organized.
- **Validation**: Always validate user input to block malformed requests.
- **Atomic Updates**: For seats/booking transactions, always check the DB just before final save.
- **Authentication**: Secure actions with JWT and middleware.

## Conclusion

This backend is flexible and easy to extend:
- Add new fields to schemas as needed.
- Create new controllers/routes for added features (e.g. payments, notifications).
- Use robust middlewares for authentication/validation.
- Test endpoints with Postman or similar tools before deploying.

*End of BACKEND.md*

# devSphere Frontend

Frontend application for **devSphere**, a developer networking platform
inspired by swipe-based matching. It helps developers connect,
collaborate, and discover projects based on skills, interests, and tech
stack compatibility.

## Overview

This frontend is built using **React (Vite)** and **Tailwind CSS**,
integrating with a Node.js backend API for authentication, feed
management, and connection requests.

The application focuses on a responsive UI with swipe-based interactions
adapted for developer collaboration.

## Tech Stack

-   React (Vite)
-   Tailwind CSS
-   React Router DOM
-   Axios
-   JWT Authentication

## Features

### Authentication

-   Login and signup with JWT-based authentication
-   Form validation and secure credential handling
-   Protected routes with automatic redirection

### Developer Feed

-   Swipe-based developer discovery interface
-   Send “interested” or “ignored” connection requests
-   Profile cards displaying photo, bio, skills, and basic info
-   Interactive drag/swipe animations

### User Experience

-   Responsive mobile-first layout
-   Smooth transitions and loading states
-   Persistent login using localStorage

## Installation

### Prerequisites

-   Node.js (v14 or higher)
-   npm or yarn
-   Backend server running locally or remotely

### Setup

Clone the repository:

git clone <repo-url> cd devSphere-frontend

Install dependencies:

npm install

Run development server:

npm run dev

## Backend Integration

Expected API endpoints:

Authentication:

POST /api/auth/signup  
POST /api/auth/login

Feed & Requests:

GET /api/feed?page=1&limit=20  
POST /api/request/send/:status/:toUserId

JWT tokens are stored in localStorage and sent in headers:

Authorization: Bearer <token>

## Project Structure

src/ ├── App.jsx ├── Login.jsx ├── Signup.jsx ├── Feed.jsx ├──
components/ └── index.css

## Notes

-   Ensure backend CORS configuration is correct.
-   Update API URLs if backend runs on a different port.
-   Place static assets in the public directory.


## License

This project is intended for learning and development purposes.

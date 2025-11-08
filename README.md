<<<<<<< HEAD
Criminal Face Recognition System (MERN Stack)

This is a full-stack web application for a criminal face recognition system built using the MERN (MongoDB, Express.js, React, Node.js) stack.

Features

Dashboard: View statistics and recently added criminals.

Criminal Registration: Add new criminals to the database with personal details and multiple face images.

Criminal Detection: Upload an image to identify potential criminals from the database.

Video Surveillance: (Simulated) Real-time video feed scanning for known criminals.

User Authentication: Secure login and registration for authorized personnel.

Tech Stack

Frontend: React, Vite, Tailwind CSS, Axios, React Router

Backend: Node.js, Express.js

Database: MongoDB (with Mongoose)

Authentication: JSON Web Tokens (JWT)

Getting Started

Prerequisites

Node.js (v18 or later)

npm

MongoDB (local installation or a cloud service like MongoDB Atlas)

Installation & Setup

Clone the repository:

git clone <repository-url>
cd criminal-face-recognition-system


Install root dependencies:

npm install


Setup Backend:

Navigate to the backend directory: cd backend

Install backend dependencies: npm install

Create a .env file in the backend directory and add the following variables:

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000


Go back to the root directory: cd ..

Setup Frontend:

Navigate to the frontend directory: cd frontend

Install frontend dependencies: npm install

Go back to the root directory: cd ..

Running the Application

From the root directory, run the following command to start both the backend and frontend servers concurrently:

npm run dev


The React frontend will be available at http://localhost:5173.

The Node.js backend server will be running on http://localhost:5000.
=======
# Criminal-Investigation
>>>>>>> 5a078d34ba7ec132a540bdfb3c5389defd1b7826

# Setup Instructions for Food Ordering Platform

## Prerequisites

Before you begin, ensure you have the following installed on your machine:

- Node.js (version 14 or higher)
- npm (Node Package Manager)
- MongoDB (local installation or a cloud instance)

## Project Structure

The project is divided into two main parts: the frontend and the backend.

```
food-ordering-platform
├── frontend          # React application
└── backend           # Node.js and Express application
```

## Setting Up the Backend

1. **Navigate to the backend directory:**
   ```bash
   cd food-ordering-platform/backend
   ```

2. **Install the backend dependencies:**
   ```bash
   npm install
   ```

3. **Configure the database:**
   - Open `src/config/database.js` and update the MongoDB connection string with your database credentials.

4. **Start the backend server:**
   ```bash
   npm start
   ```
   The server will run on `http://localhost:5000` by default.

## Setting Up the Frontend

1. **Navigate to the frontend directory:**
   ```bash
   cd food-ordering-platform/frontend
   ```

2. **Install the frontend dependencies:**
   ```bash
   npm install
   ```

3. **Start the frontend application:**
   ```bash
   npm run dev
   ```
   The application will run on `http://localhost:3000` by default.

## Accessing the Application

- Open your web browser and go to `http://localhost:3000` to access the food ordering platform.

## Additional Notes

- Ensure that both the frontend and backend servers are running simultaneously for the application to function correctly.
- You can use tools like Postman to test the backend API endpoints.

## Troubleshooting

- If you encounter issues, check the console for error messages and ensure that all services are running.
- Verify that your MongoDB instance is accessible and that the connection string is correct.

## Conclusion

You are now set up to use the food ordering platform. Enjoy browsing and ordering your favorite food items!
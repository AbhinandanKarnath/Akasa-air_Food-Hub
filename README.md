# Food Ordering Platform

## Overview
The Food Ordering Platform is a web application that allows users to browse food items, add them to a cart, and place orders. The platform supports user registration and authentication, inventory management, and order tracking.

## Features
- **User Registration and Authentication**: Users can create accounts and log in securely.
- **Browse Item Inventory**: Users can view food items categorized by type (e.g., Fruits, Vegetables, Non-veg).
- **Selection Basket/Cart**: Users can add items to their cart, adjust quantities, and proceed to checkout.
- **Checkout Process**: Users can view a summary of their order before confirming, with notifications for item availability.
- **Order History**: Users can view their past orders and track delivery status.
- **Responsive Design**: The application is designed to be user-friendly and accessible on various devices.

## Technology Stack
- **Frontend**: React.js, Vite, Tailwind CSS, DaisyUI
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Session Management**: JSON session manager

## Project Structure
```
food-ordering-platform
├── frontend
│   ├── src
│   │   ├── components
│   │   ├── pages
│   │   ├── services
│   │   ├── utils
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
├── backend
│   ├── src
│   │   ├── controllers
│   │   ├── models
│   │   ├── routes
│   │   ├── middleware
│   │   ├── config
│   │   └── server.js
│   └── package.json
├── docs
│   ├── setup.md
│   └── api-documentation.md
└── README.md
```

## Setup Instructions
1. **Clone the Repository**:
   ```
   git clone <repository-url>
   cd food-ordering-platform
   ```

2. **Frontend Setup**:
   - Navigate to the `frontend` directory:
     ```
     cd frontend
     ```
   - Install dependencies:
     ```
     npm install
     ```
   - Start the development server:
     ```
     npm run dev
     ```

3. **Backend Setup**:
   - Navigate to the `backend` directory:
     ```
     cd ../backend
     ```
   - Install dependencies:
     ```
     npm install
     ```
   - Start the server:
     ```
     npm start
     ```

4. **Access the Application**:
   - Open your browser and go to `http://localhost:3000` for the frontend and `http://localhost:5000` for the backend API.

## Additional Features
If given more time, the following features could be considered:
- **Real-time Order Tracking**: Implement WebSocket for real-time updates on order status.
- **User Reviews and Ratings**: Allow users to leave reviews and ratings for food items.
- **Admin Dashboard**: Create an admin interface for managing inventory and orders.
- **Payment Integration**: Implement a payment gateway for processing transactions.

## License
This project is licensed under the MIT License.
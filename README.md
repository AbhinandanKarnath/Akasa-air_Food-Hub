# 🍕 FoodHub - Food Ordering Platform

A modern, full-stack food ordering platform built with React, Node.js, Express, and MongoDB. Features user authentication, shopping cart functionality, real-time search, and a beautiful modern UI with glass morphism effects.

## ✨ Features

### 🔐 Authentication & User Management
- User registration and login
- JWT-based authentication
- Password strength validation
- Secure password hashing with bcrypt

### 🛒 Shopping Experience
- Interactive shopping cart with real-time updates
- Add/remove items with quantity controls
- Cart persistence using localStorage
- Elegant confirmation modals with blur effects

### 🔍 Search & Browse
- Real-time search functionality
- Category-based filtering (Fruits, Vegetables, Non-veg, Breads)
- Item cards with ratings and stock information
- Responsive grid layout

### 🎨 Modern UI/UX
- Glass morphism design with backdrop blur effects
- Smooth animations and transitions
- Mobile-responsive design
- Toast notifications for user feedback
- Loading states and error handling

### 📦 Order Management
- Order tracking and history
- Detailed order information
- Status updates and notifications

## 🚀 Quick Start (For Evaluators)

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn package manager


## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **cors** - Cross-origin resource sharing
- **dotenv** - Environment variable management

### Frontend
- **React 18** - UI library
- **Vite** - Fast build tool and dev server
- **React Router DOM** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icon library
- **React Hot Toast** - Elegant notifications
- **Context API** - State management for cart

## 📂 Project Structure

```
food-ordering-platform/
├── backend/
│   ├── src/
│   │   ├── models/
│   │   │   ├── User.js          # User schema
│   │   │   └── Item.js          # Food item schema
│   │   ├── routes/
│   │   │   ├── auth.js          # Authentication routes
│   │   │   └── items.js         # Item CRUD routes
│   │   ├── middleware/
│   │   │   └── auth.js          # JWT middleware
│   │   ├── scripts/
│   │   │   └── seedData.js      # Database seeding
│   │   └── server.js            # Main server file
│   ├── .env                     # Demo environment config
│   ├── .env.production.example  # Production template
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Auth/
│   │   │   │   ├── Login.jsx    # Login component
│   │   │   │   └── Register.jsx # Registration component
│   │   │   ├── Common/
│   │   │   │   └── ConfirmationModal.jsx # Reusable modal
│   │   │   ├── Inventory/
│   │   │   │   ├── ItemCard.jsx       # Food item card
│   │   │   │   └── CategoryFilter.jsx # Category filter
│   │   │   └── Orders/
│   │   │       └── OrderDetails.jsx  # Order information
│   │   ├── pages/
│   │   │   ├── HomePage.jsx     # Main landing page
│   │   │   └── CartPage.jsx     # Shopping cart page
│   │   ├── hooks/
│   │   │   └── useCart.jsx      # Cart context and logic
│   │   ├── services/
│   │   │   └── api.js           # API service functions
│   │   ├── utils/
│   │   │   └── auth.js          # Auth utility functions
│   │   └── App.jsx              # Main app component
│   ├── tailwind.config.js       # Tailwind configuration
│   └── package.json
├── .gitignore
└── README.md
```
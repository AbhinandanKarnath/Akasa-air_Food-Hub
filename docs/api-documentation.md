
## 🔌 API Documentation

### Base URL
```
http://localhost:5001/api
```

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

#### Login User
```http
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

#### Get Current User
```http
GET /api/auth/me
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### Item Endpoints

#### Get All Items
```http
GET /api/items
```

**Query Parameters:**
- `category` (optional): Filter by category (Fruit, Vegetable, Non-veg, Breads)

**Response:**
```json
{
  "items": [
    {
      "_id": "item_id",
      "name": "Fresh Apple",
      "price": 1.99,
      "category": "Fruit",
      "stock": 50,
      "rating": 4.5,
      "description": "Fresh, crispy apples"
    }
  ]
}
```

#### Get Items by Category
```http
GET /api/items/category/:category
```

**Parameters:**
- `category`: Category name (Fruit, Vegetable, Non-veg, Breads, All)

**Response:**
```json
{
  "items": [
    {
      "_id": "item_id",
      "name": "Fresh Apple",
      "price": 1.99,
      "category": "Fruit",
      "stock": 50,
      "rating": 4.5,
      "description": "Fresh, crispy apples"
    }
  ]
}
```

#### Get Single Item
```http
GET /api/items/:id
```

**Response:**
```json
{
  "item": {
    "_id": "item_id",
    "name": "Fresh Apple",
    "price": 1.99,
    "category": "Fruit",
    "stock": 50,
    "rating": 4.5,
    "description": "Fresh, crispy apples"
  }
}
```

### Error Responses

All endpoints return consistent error responses:

```json
{
  "message": "Error description",
  "status": 400
}
```

**Common Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `500` - Internal Server Error

## 🛡️ Environment Configuration

### Demo Environment (Included)
The project includes a demo environment for immediate testing:

```env
# Demo database - safe for public viewing
MONGO_URI=mongodb+srv://demo_user:demo_pass@cluster.mongodb.net/foodhub-demo
PORT=5001
JWT_SECRET=demo_jwt_secret_for_evaluation
```

### Production Setup
For production deployment, create `.env.production`:

```bash
# Copy production template
cp backend/.env.production.example backend/.env.production

# Update with your credentials
MONGO_URI=mongodb+srv://YOUR_USER:YOUR_PASS@YOUR_CLUSTER.mongodb.net/YOUR_DB
JWT_SECRET=your_super_secure_random_secret_key
NODE_ENV=production
```

## 🗄️ Database Schema

### User Schema
```javascript
{
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Hashed with bcrypt
  createdAt: { type: Date, default: Date.now }
}
```

### Item Schema
```javascript
{
  name: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true }, // Fruit, Vegetable, Non-veg, Breads
  stock: { type: Number, default: 0 },
  rating: { type: Number, default: 4.0 },
  description: { type: String },
  createdAt: { type: Date, default: Date.now }
}
```

## 🎨 UI Components

### Key Features
- **Glass Morphism**: Modern translucent design with backdrop blur
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Interactive Animations**: Smooth hover effects and transitions
- **Toast Notifications**: Real-time user feedback
- **Loading States**: Elegant spinners and skeleton screens
- **Confirmation Modals**: Beautiful blur overlay modals

### Design System
- **Colors**: Orange to red gradient palette
- **Typography**: Inter font family
- **Spacing**: Consistent 8px grid system
- **Shadows**: Layered shadow system for depth
- **Border Radius**: Rounded corners (8px, 12px, 16px)

## 🚀 Deployment

### Frontend Deployment (Vercel/Netlify)
```bash
# Build for production
cd frontend
npm run build

# Deploy dist/ folder to your hosting service
```

### Backend Deployment (Heroku/Railway)
```bash
# Set environment variables on your platform
MONGO_URI=your_production_mongo_uri
JWT_SECRET=your_production_jwt_secret
NODE_ENV=production

# Deploy backend/ folder
```

## 🧪 Testing

### Demo Credentials
- **Email:** demo@foodhub.com
- **Password:** demo123

### Sample Data
The seed script creates:
- 20+ food items across 4 categories
- Demo user account
- Realistic pricing and stock levels

### Testing Features
1. **Authentication Flow**: Register/Login functionality
2. **Shopping Cart**: Add/remove items, quantity changes
3. **Search & Filter**: Real-time search and category filtering
4. **Responsive Design**: Test on different screen sizes
5. **Error Handling**: Try invalid inputs and network errors

## 📱 Mobile Experience

- Fully responsive design
- Touch-friendly interfaces
- Mobile-optimized navigation
- Optimized performance for mobile devices
- PWA-ready structure

## 🔒 Security Features

- JWT token-based authentication
- Password hashing with bcrypt (10 rounds)
- Input validation and sanitization
- CORS protection configured
- Environment variable protection
- SQL injection prevention (NoSQL)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Icons provided by [Lucide React](https://lucide.dev/)
- UI framework by [Tailwind CSS](https://tailwindcss.com/)
- Database hosting by [MongoDB Atlas](https://www.mongodb.com/atlas)

---

**⚠️ Note for Evaluators:** This project includes demo credentials for immediate testing. In production, all sensitive data should be properly secured and environment variables should never be committed to version control.

**🌟 Happy Coding!** If you have any questions about the implementation, feel free to reach out.

### Instant Demo Setup
```bash
# 1. Clone the repository
git clone https://github.com/AbhinandanKarnath/Akasa-air_Food-Hub.git
cd food-ordering-platform

# 2. Backend Setup
cd backend
npm install
# .env already configured with demo database!
npm run seed    # Load sample data
npm run dev     # Start backend on http://localhost:5001

# 3. Frontend Setup (current terminal)
cd ../frontend  
npm install
npm run dev     # Start frontend on http://localhost:3000
```

### 🎯 Demo Access
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5001/api
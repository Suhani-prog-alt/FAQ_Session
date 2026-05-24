# Authentication Setup Guide

## Files Created:
1. ✅ **backend/config/passport.js** - Passport strategies (Local + Google OAuth)
2. ✅ **backend/models/User.js** - User schema with password hashing
3. ✅ **backend/routes/auth.js** - Authentication routes

## Installation Steps:

### 1. Install Required Packages:
```bash
npm install passport passport-local passport-google-oauth20 bcryptjs jsonwebtoken
```

### 2. Update your main server file (e.g., `server.js` or `app.js`):

```javascript
const express = require('express');
const passport = require('passport');
const session = require('express-session');
require('dotenv').config();

// Import your auth routes
const authRoutes = require('./backend/routes/auth');
const passportConfig = require('./backend/config/passport');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration (required for Passport)
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-session-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // Set to true in production with HTTPS
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/auth', authRoutes);

// Connect to MongoDB (or your database)
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

app.listen(5000, () => {
  console.log('Server running on port 5000');
});
```

### 3. Update your `.env` file:

```env
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
MONGODB_URI=mongodb://localhost:27017/faq_session
JWT_SECRET=your-jwt-secret-key
SESSION_SECRET=your-session-secret
```

### 4. Test the endpoints:

#### Register New User (Email/Password):
```bash
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Registration successful!",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "email": "user@example.com",
    "name": "John Doe",
    "role": "student"
  }
}
```

**Error Responses:**
- `400` - Missing fields or password < 6 characters
- `409` - Email already registered

#### Login with Email/Password:
```bash
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Login successful!",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": { ... }
}
```

**Error Responses:**
- `401` - User not found / Wrong password
- `400` - Missing email or password

#### Google OAuth Login:
```
GET /auth/google
```
- Redirects user to Google login
- After successful login, redirects to `/dashboard?token=...`

#### Get Current User:
```bash
GET /auth/me
Authorization: Bearer <token>
```

#### Logout:
```bash
POST /auth/logout
```

## Error Messages Shown to Users:

| Error | Message |
|-------|---------|
| Email not found | "User not found. Please check your email or sign up." |
| Wrong password | "Wrong password. Please try again or reset your password." |
| Email already exists | "Email already registered. Please login or use a different email." |
| Google-only account | "This account uses Google login. Please use Google Sign-In instead." |
| Weak password | "Password must be at least 6 characters long" |
| Missing fields | "Please provide email, password, and name" |

## Next Steps:

1. **Setup Google OAuth:**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create OAuth 2.0 credentials
   - Add authorized redirect URI: `http://localhost:5000/auth/google/callback`

2. **Frontend Integration:**
   - Send requests to `/auth/register`, `/auth/login`, `/auth/google`
   - Store JWT token in localStorage
   - Send token in Authorization header for protected routes

3. **Protected Routes Middleware:**
```javascript
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Token required' });
  }
  // Verify token...
  next();
};
```

Done! ✨ All files are ready to use!

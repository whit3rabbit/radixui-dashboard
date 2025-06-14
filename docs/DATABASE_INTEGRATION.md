# Database Integration Guide

This guide explains how to connect a database to enable real user authentication in the Radix UI Dashboard.

## Table of Contents
- [Current Authentication System](#current-authentication-system)
- [Database Options](#database-options)
- [Implementation Steps](#implementation-steps)
- [API Endpoints](#api-endpoints)
- [Security Considerations](#security-considerations)
- [Testing](#testing)

## Current Authentication System

### Development Mode (Default)
By default, the dashboard runs in **bypass mode** for easy development:

```typescript
// src/lib/auth-context.tsx
const BYPASS_AUTH = true; // Set to false to enable real authentication
```

In bypass mode:
- No login required
- Mock user "Demo User" is automatically logged in
- All auth features work with mock data
- Perfect for UI development and testing

### Switching to Real Authentication
To enable real authentication:
1. Set `BYPASS_AUTH = false` in `src/lib/auth-context.tsx`
2. Implement the database and API endpoints (see below)

## Database Options

### Option 1: Supabase (Recommended for Quick Setup)

```bash
npm install @supabase/supabase-js
```

```typescript
// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

### Option 2: Firebase

```bash
npm install firebase
```

```typescript
// src/lib/firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  // Your config
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
```

### Option 3: Custom Backend (Node.js + PostgreSQL Example)

```javascript
// backend/models/User.js
const bcrypt = require('bcrypt');
const pool = require('../db');

class User {
  static async create({ email, password, name }) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (email, password, name) VALUES ($1, $2, $3) RETURNING *',
      [email, hashedPassword, name]
    );
    return result.rows[0];
  }

  static async findByEmail(email) {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0];
  }

  static async verifyPassword(plainPassword, hashedPassword) {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
}
```

## Implementation Steps

### 1. Update Auth Context

Replace the mock functions in `src/lib/auth-context.tsx`:

```typescript
// Example with Supabase
const login = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    if (data.user) {
      const user: User = {
        id: data.user.id,
        email: data.user.email!,
        name: data.user.user_metadata.name || email.split('@')[0],
      };
      
      setUser(user);
      localStorage.setItem('user', JSON.stringify(user));
      return { success: true };
    }

    return { success: false, error: 'Login failed' };
  } catch (error) {
    return { success: false, error: 'An unexpected error occurred' };
  }
};

const register = async (email: string, password: string, name: string) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name }
      }
    });

    if (error) {
      return { success: false, error: error.message };
    }

    if (data.user) {
      const user: User = {
        id: data.user.id,
        email: data.user.email!,
        name: name,
      };
      
      setUser(user);
      localStorage.setItem('user', JSON.stringify(user));
      return { success: true };
    }

    return { success: false, error: 'Registration failed' };
  } catch (error) {
    return { success: false, error: 'An unexpected error occurred' };
  }
};
```

### 2. Add Session Management

```typescript
// Check session on app load
useEffect(() => {
  const checkSession = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session?.user) {
      const user: User = {
        id: session.user.id,
        email: session.user.email!,
        name: session.user.user_metadata.name || session.user.email!.split('@')[0],
      };
      setUser(user);
    }
    
    setIsLoading(false);
  };

  checkSession();

  // Listen for auth changes
  const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
    if (session?.user) {
      const user: User = {
        id: session.user.id,
        email: session.user.email!,
        name: session.user.user_metadata.name || session.user.email!.split('@')[0],
      };
      setUser(user);
    } else {
      setUser(null);
    }
  });

  return () => subscription.unsubscribe();
}, []);
```

### 3. Database Schema

#### PostgreSQL
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  avatar_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE password_reset_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  token VARCHAR(255) UNIQUE NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### MongoDB
```javascript
// User Schema
{
  _id: ObjectId,
  email: String,
  name: String,
  passwordHash: String,
  avatar: String,
  emailVerified: Boolean,
  createdAt: Date,
  updatedAt: Date
}

// Password Reset Token Schema
{
  _id: ObjectId,
  userId: ObjectId,
  token: String,
  expiresAt: Date,
  used: Boolean,
  createdAt: Date
}
```

## API Endpoints

### Required Endpoints

```typescript
// POST /api/auth/login
{
  email: string;
  password: string;
}
// Returns: { token: string; user: User }

// POST /api/auth/register
{
  email: string;
  password: string;
  name: string;
}
// Returns: { token: string; user: User }

// POST /api/auth/logout
// Headers: { Authorization: "Bearer <token>" }

// GET /api/auth/me
// Headers: { Authorization: "Bearer <token>" }
// Returns: { user: User }

// POST /api/auth/forgot-password
{
  email: string;
}

// POST /api/auth/reset-password
{
  token: string;
  password: string;
}

// PUT /api/users/profile
// Headers: { Authorization: "Bearer <token>" }
{
  name?: string;
  email?: string;
  avatar?: string;
}
```

### Example Express.js Implementation

```javascript
// backend/routes/auth.js
const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValid = await User.verifyPassword(password, user.password_hash);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar_url
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});
```

## Security Considerations

### 1. Password Security
- Use bcrypt with salt rounds >= 10
- Implement password strength requirements
- Never store plain text passwords

### 2. Token Management
```typescript
// Use HTTP-only cookies for tokens (more secure)
res.cookie('authToken', token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
});
```

### 3. Rate Limiting
```javascript
const rateLimit = require('express-rate-limit');

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per window
  message: 'Too many login attempts, please try again later'
});

router.post('/login', authLimiter, loginHandler);
```

### 4. Environment Variables
```env
# .env.local
VITE_API_URL=http://localhost:3001
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

# Backend .env
DATABASE_URL=postgresql://user:password@localhost:5432/mydb
JWT_SECRET=your-super-secret-jwt-key
SMTP_HOST=smtp.gmail.com
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

### 5. CORS Configuration
```javascript
// backend/server.js
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
```

## Testing

### 1. Test User Creation
```sql
-- Create test users
INSERT INTO users (email, name, password_hash) VALUES
('test@example.com', 'Test User', '$2b$10$...'), -- password: test123
('admin@example.com', 'Admin User', '$2b$10$...'); -- password: admin123
```

### 2. API Testing with cURL
```bash
# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'

# Get profile
curl http://localhost:3001/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 3. Frontend Testing
```typescript
// src/lib/auth-context.test.tsx
import { renderHook, act } from '@testing-library/react-hooks';
import { useAuth } from './auth-context';

test('login with valid credentials', async () => {
  const { result } = renderHook(() => useAuth());
  
  await act(async () => {
    const response = await result.current.login('test@example.com', 'test123');
    expect(response.success).toBe(true);
    expect(result.current.user?.email).toBe('test@example.com');
  });
});
```

## Migration Checklist

- [ ] Set `BYPASS_AUTH = false` in auth-context.tsx
- [ ] Choose and set up database
- [ ] Create database schema
- [ ] Implement API endpoints
- [ ] Update auth-context.tsx with real API calls
- [ ] Set up environment variables
- [ ] Configure CORS
- [ ] Add rate limiting
- [ ] Test all auth flows
- [ ] Deploy database and backend
- [ ] Update frontend API URLs
- [ ] Test in production

## Support

For questions or issues with database integration:
1. Check the [Issues](https://github.com/your-repo/issues) page
2. Review the example implementations in `/examples` directory
3. Consult the documentation for your chosen database

Remember to never commit sensitive information like API keys or database credentials to version control!
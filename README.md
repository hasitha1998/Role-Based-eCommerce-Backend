# eCommerce Admin Backend API

A robust, role-based eCommerce backend API built with Node.js, Express, Sequelize, and PostgreSQL, featuring AdminJS for database management.

## 🚀 Live Demo

**Deployed API:** [https://role-based-ecommerce-backend-production.up.railway.app](https://role-based-ecommerce-backend-production.up.railway.app)

**AdminJS Panel:** [https://role-based-ecommerce-backend-production.up.railway.app/admin](https://role-based-ecommerce-backend-production.up.railway.app/admin)

**Health Check:** [https://role-based-ecommerce-backend-production.up.railway.app/health](https://role-based-ecommerce-backend-production.up.railway.app/health)

## 📋 Features

### Authentication & Security
- ✅ JWT-based authentication with bcrypt password hashing
- ✅ Role-based access control (Admin/User)
- ✅ Google OAuth 2.0 integration
- ✅ Secure password storage with bcrypt
- ✅ Token-based session management
- ✅ CORS configuration for cross-origin requests

### API Endpoints
- 🔐 **Auth:** Login, Register, Google OAuth
- 👥 **Users:** CRUD operations with role-based access
- 📁 **Categories:** Manage product categories
- 🛍️ **Products:** Full product management with images
- 📦 **Orders:** Order processing and management
- 📝 **Order Items:** Line item details
- ⚙️ **Settings:** Application configuration

### Database Management
- 🎛️ **AdminJS Panel:** Web-based database administration
- 📊 **Model Relationships:** Properly configured associations
- 🔒 **Security:** Password fields hidden in AdminJS
- 🔄 **Auto-sync:** Database schema synchronization
- 📝 **Seed Scripts:** Sample data generation

## 🛠️ Tech Stack

- **Runtime:** Node.js 18+
- **Framework:** Express.js
- **Database:** PostgreSQL (Neon)
- **ORM:** Sequelize
- **Authentication:** JWT + Passport.js
- **Password Hashing:** bcrypt
- **Admin Panel:** AdminJS
- **Validation:** Express Validator
- **Deployment:** Railway

## 📁 Project Structure
```
backend/
├── src/
│   ├── config/
│   │   ├── adminjs.js       # AdminJS configuration
│   │   ├── database.js      # Sequelize setup
│   │   └── passport.js      # Passport strategies
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── productController.js
│   │   ├── orderController.js
│   │   └── categoryController.js
│   ├── middleware/
│   │   ├── auth.js          # JWT authentication
│   │   └── rbac.js          # Role-based access control
│   ├── models/
│   │   ├── index.js         # Model associations
│   │   ├── User.js
│   │   ├── Category.js
│   │   ├── Product.js
│   │   ├── Order.js
│   │   ├── OrderItem.js
│   │   └── Setting.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── users.js
│   │   ├── products.js
│   │   ├── orders.js
│   │   └── categories.js
│   ├── scripts/
│   │   ├── seedCategories.js
│   │   └── seedOrders.js
│   ├── services/
│   │   └── dashboardService.js
│   └── server.js            # Application entry point
├── .env.example
├── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 14+ (or Neon account)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**

Create a `.env` file in the root directory:
```env
# Database
DATABASE_URL=postgresql://user:password@host:5432/database

# JWT
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
JWT_EXPIRES_IN=7d

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# Application
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# AdminJS
ADMIN_JS_COOKIE_PASSWORD=your-admin-cookie-secret-min-32-chars
```

4. **Start the server**
```bash
npm run dev
```

The API will be available at `http://localhost:5000`

## 📜 Available Scripts
```bash
# Development
npm run dev              # Start with nodemon (auto-reload)
npm start                # Start production server

# Database
npm run seed:categories  # Seed categories
npm run seed:orders      # Seed orders with items
npm run seed:all         # Seed all data

# Utilities
npm run lint             # Run ESLint
```

## 🔑 Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `DATABASE_URL` | PostgreSQL connection string | Yes | - |
| `JWT_SECRET` | Secret key for JWT signing | Yes | - |
| `JWT_EXPIRES_IN` | JWT expiration time | No | `7d` |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | No | - |
| `GOOGLE_CLIENT_SECRET` | Google OAuth secret | No | - |
| `GOOGLE_CALLBACK_URL` | OAuth callback URL | No | - |
| `PORT` | Server port | No | `5000` |
| `NODE_ENV` | Environment | No | `development` |
| `FRONTEND_URL` | Frontend URL for CORS | Yes | - |
| `ADMIN_JS_COOKIE_PASSWORD` | AdminJS session secret | No | - |

## 📚 API Documentation

### Base URL
```
Development: http://localhost:5000/api
Production: https://role-based-ecommerce-backend-production.up.railway.app/api
```

### Authentication Endpoints

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "token": "jwt-token",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "role": "user"
  }
}
```

#### Google OAuth
```http
GET /api/auth/google
```

### Protected Endpoints

All protected endpoints require JWT token in Authorization header:
```http
Authorization: Bearer <jwt-token>
```

### Products
```http
# Get all products
GET /api/products?page=1&limit=10

# Get single product
GET /api/products/:id

# Create product (Admin only)
POST /api/products
{
  "name": "Product Name",
  "description": "Description",
  "price": 99.99,
  "stock": 50,
  "categoryId": "category-uuid"
}

# Update product (Admin only)
PUT /api/products/:id

# Delete product (Admin only)
DELETE /api/products/:id
```

### Categories
```http
# Get all categories
GET /api/categories

# Create category (Admin only)
POST /api/categories
{
  "name": "Electronics",
  "slug": "electronics"
}
```

### Orders
```http
# Get all orders
GET /api/orders

# Get single order
GET /api/orders/:id

# Update order status (Admin only)
PUT /api/orders/:id
{
  "status": "shipped"
}
```

### Users (Admin only)
```http
# Get all users
GET /api/users

# Get single user
GET /api/users/:id

# Update user
PUT /api/users/:id

# Delete user
DELETE /api/users/:id
```

## 🗄️ Database Models

### User
```javascript
{
  id: UUID,
  email: STRING (unique),
  password: STRING (hashed),
  firstName: STRING,
  lastName: STRING,
  role: ENUM('admin', 'user'),
  googleId: STRING,
  profilePicture: STRING,
  isActive: BOOLEAN
}
```

### Category
```javascript
{
  id: UUID,
  name: STRING,
  slug: STRING (unique),
  description: TEXT,
  image: STRING,
  isActive: BOOLEAN
}
```

### Product
```javascript
{
  id: UUID,
  name: STRING,
  slug: STRING (unique),
  description: TEXT,
  price: DECIMAL,
  comparePrice: DECIMAL,
  costPrice: DECIMAL,
  sku: STRING,
  stock: INTEGER,
  images: JSON,
  categoryId: UUID (FK),
  isActive: BOOLEAN,
  isFeatured: BOOLEAN
}
```

### Order
```javascript
{
  id: UUID,
  orderNumber: STRING (unique),
  userId: UUID (FK),
  status: ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled'),
  totalAmount: DECIMAL,
  shippingAddress: JSON,
  billingAddress: JSON,
  paymentMethod: STRING,
  paymentStatus: ENUM('pending', 'paid', 'failed', 'refunded'),
  notes: TEXT
}
```

### OrderItem
```javascript
{
  id: UUID,
  orderId: UUID (FK),
  productId: UUID (FK),
  quantity: INTEGER,
  price: DECIMAL,
  subtotal: DECIMAL
}
```

### Setting
```javascript
{
  id: UUID,
  key: STRING (unique),
  value: TEXT,
  type: ENUM('string', 'number', 'boolean', 'json'),
  description: TEXT,
  isPublic: BOOLEAN
}
```

## 🎛️ AdminJS Panel

Access the AdminJS panel at `/admin` to manage the database through a web interface.

**Features:**
- View and edit all database records
- Create new records
- Delete records
- Search and filter
- View relationships between models
- Password fields hidden for security

## 🔐 Role-Based Access Control

### Admin Permissions
- Full access to all endpoints
- Can create, read, update, delete all resources
- Access to user management
- Access to settings

### User Permissions
- Can view own orders
- Can update own profile
- Cannot access admin endpoints
- Cannot manage other users

**Middleware Example:**
```javascript
// routes/products.js
router.post('/',
  authenticateToken,           // Verify JWT
  requirePermission('products', 'create'),  // Check role
  createProduct
);
```

## 🌱 Seeding Data

### Seed Categories
```bash
npm run seed:categories
```

Creates:
- Electronics
- Clothing  
- Books
- Home & Garden
- Sports

### Seed Orders
```bash
npm run seed:orders
```

Creates:
- 5 sample orders
- Random products per order
- Order items with quantities
- Various statuses and payment methods

## 🚀 Deployment

### Deploy to Railway

1. **Create Railway account** at [railway.app](https://railway.app)

2. **Create new project** from GitHub repo

3. **Add PostgreSQL database**
   - Click "New" → "Database" → "Add PostgreSQL"
   - Railway provides `DATABASE_URL` automatically

4. **Set environment variables**
   - Go to project → Variables
   - Add all variables from `.env.example`

5. **Deploy**
   - Railway auto-deploys on push to main branch

### Deploy to Render

1. Create account at [render.com](https://render.com)
2. New → Web Service
3. Connect GitHub repository
4. Configure:
   - Build Command: `npm install`
   - Start Command: `npm start`
5. Add environment variables
6. Create service

## 🧪 Testing
```bash
# Run tests
npm test

# Run with coverage
npm run test:coverage
```

## 🐛 Troubleshooting

### Database Connection Issues
```bash
# Verify DATABASE_URL format
postgresql://user:password@host:port/database

# Test connection
node -e "require('./src/config/database.js').authenticate()"
```

### JWT Token Issues
```bash
# Verify JWT_SECRET is at least 32 characters
echo $JWT_SECRET | wc -c
```

### AdminJS Login Issues
- Ensure `ADMIN_JS_COOKIE_PASSWORD` is set
- Check user exists in database
- Verify password is hashed correctly

## 📝 License

This project is licensed under the MIT License.

## 👤 Author

**Your Name**
- GitHub: [@hasitha1998](https://github.com/hasitha1998)

## 🙏 Acknowledgments

- Express.js team
- Sequelize team
- AdminJS team
- PostgreSQL community

---

**Frontend Repository:** [Link to frontend repo]
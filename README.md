# Mama's Dumplings - E-commerce Backend

A Node.js/Express backend API for the Mama's Dumplings e-commerce website, featuring product management, order processing, user authentication, and more.

## 🚀 Features

- **Product Management**: CRUD operations for dumpling products with categories and filtering
- **Order Processing**: Complete order lifecycle from creation to delivery
- **User Authentication**: JWT-based authentication with registration and login
- **User Management**: Profile management and preferences
- **API Security**: Helmet, CORS, and input validation
- **Error Handling**: Comprehensive error handling and logging

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn package manager

## 🛠️ Installation

1. **Clone the repository** (if applicable) or navigate to your project directory

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Create environment variables**:
   Create a `.env` file in the root directory with the following variables:
   ```env
   NODE_ENV=development
   PORT=3000
   JWT_SECRET=your-super-secret-jwt-key
   CORS_ORIGIN=http://localhost:3000
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```

5. **Start the production server**:
   ```bash
   npm start
   ```

## 📡 API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `GET /api/products/category/:category` - Get products by category
- `GET /api/products/subcategory/:subcategory` - Get products by subcategory
- `GET /api/products/search/:query` - Search products

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get all orders (admin)
- `GET /api/orders/:id` - Get order by ID
- `GET /api/orders/customer/:email` - Get customer orders
- `PATCH /api/orders/:id/status` - Update order status
- `PATCH /api/orders/:id/cancel` - Cancel order
- `GET /api/orders/stats/overview` - Get order statistics

### Users
- `POST /api/users/register` - Register new user
- `GET /api/users/profile/:id` - Get user profile
- `PATCH /api/users/profile/:id` - Update user profile
- `PATCH /api/users/profile/:id/password` - Change password

### Authentication
- `POST /api/auth/login` - User login
- `GET /api/auth/verify` - Verify JWT token
- `POST /api/auth/logout` - User logout

## 🏗️ Project Structure

```
├── server.js              # Main server file
├── package.json           # Dependencies and scripts
├── config/
│   └── config.js         # Configuration settings
├── middleware/
│   ├── errorHandler.js   # Error handling middleware
│   └── validate.js       # Request validation middleware
├── routes/
│   ├── products.js       # Product routes
│   ├── orders.js         # Order routes
│   ├── users.js          # User routes
│   └── auth.js           # Authentication routes
├── css/                  # Frontend styles
├── js/                   # Frontend scripts
├── images/               # Product images
└── *.html               # Frontend pages
```

## 🔧 Configuration

The application uses a configuration file (`config/config.js`) that loads settings from environment variables. Key configuration options include:

- **Server**: Port, environment
- **JWT**: Secret key, expiration time
- **CORS**: Allowed origins
- **Database**: Connection string (for future use)
- **Email**: SMTP settings (for future use)
- **Payment**: Stripe keys (for future use)

## 🛡️ Security Features

- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing
- **Input Validation**: Request data validation
- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for password security
- **Error Handling**: Secure error responses

## 📊 Sample Data

The API includes sample product data with 6 different dumpling varieties:
- Pork & Cabbage Dumplings
- Chicken & Mushroom Dumplings
- Shrimp & Chive Dumplings
- Spicy Beef Dumplings
- Vegetable & Tofu Dumplings
- Kimchi & Pork Dumplings

Each product includes:
- Detailed information (ingredients, allergens, nutrition)
- Pricing in Euros (€)
- Stock status and ratings
- High-quality images

## 🔄 Development Workflow

1. **Start development server**: `npm run dev`
2. **API testing**: Use tools like Postman or curl
3. **Frontend integration**: Connect your HTML/CSS/JS frontend
4. **Database integration**: Replace sample data with database queries
5. **Deployment**: Configure for production environment

## 🚀 Future Enhancements

- **Database Integration**: MongoDB/PostgreSQL integration
- **Payment Processing**: Stripe integration
- **Email Notifications**: Order confirmations and updates
- **File Upload**: Product image management
- **Admin Dashboard**: Order management interface
- **Inventory Management**: Stock tracking
- **Analytics**: Sales and customer analytics

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For support or questions, please contact the development team or create an issue in the repository.

---

**Mama's Dumplings** - Bringing authentic Chinese dumplings to Germany since 2024 🥟 
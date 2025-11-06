# Blog App - Full Stack Application

A full-stack blog application with user authentication and admin panel, built with Next.js and Express.js.

## Features

- **User Authentication**: Register, login, logout functionality with JWT tokens
- **Blog Posts**: Create, read, update, delete blog posts
- **Admin Panel**: Manage posts and users with role-based access control
- **User Management**: Admin can promote/demote users to admin role
- **Responsive Design**: Modern, mobile-friendly interface with Tailwind CSS
- **Password Visibility Toggle**: Show/hide password fields with eye icon
- **Secure API**: Protected routes and input validation

## Tech Stack

### Frontend
- **Next.js 16** - React framework with App Router
- **React 19** - UI library
- **Tailwind CSS 4** - Utility-first CSS framework
- **Axios** - HTTP client
- **Lucide React** - Icon library
- **Context API** - State management for authentication

### Backend
- **Express.js 5** - Web framework
- **Sequelize** - ORM for PostgreSQL
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **PostgreSQL** - Database
- **express-validator** - Input validation

## Project Structure

```
blog-test/
├── backend/                 # Express.js backend
│   ├── config/             # Database configuration
│   ├── controllers/        # Route controllers
│   │   ├── authController.js
│   │   ├── postsController.js
│   │   └── usersController.js
│   ├── middleware/         # Authentication & validation middleware
│   │   ├── auth.js
│   │   └── validation.js
│   ├── models/            # Sequelize models
│   │   ├── User.js
│   │   ├── Post.js
│   │   └── index.js
│   ├── routes/            # API routes
│   │   ├── authRoutes.js
│   │   ├── postsRoutes.js
│   │   └── usersRoutes.js
│   ├── scripts/           # Database setup scripts
│   │   ├── init-db.js
│   │   └── seed-admin.js
│   └── server.js          # Main server file
├── frontend/               # Next.js frontend
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── app/           # Next.js App Router pages
│   │   │   ├── admin/     # Admin panel page
│   │   │   ├── login/     # Login page
│   │   │   ├── register/  # Registration page
│   │   │   ├── posts/     # Post detail pages
│   │   │   ├── layout.js  # Root layout
│   │   │   └── page.js    # Home page
│   │   ├── components/    # React components
│   │   │   ├── Navbar.js
│   │   │   ├── PostModal.js
│   │   │   └── Tabs.js
│   │   ├── context/       # React Context
│   │   │   └── AuthContext.js
│   │   ├── lib/           # Utility functions
│   │   │   └── api.js     # API client
│   │   └── globals.css    # Global styles
│   └── package.json
└── README.md
```

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL database
- npm or yarn package manager

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory with the following variables:
```env
NODE_ENV=development
PORT=5000
JWT_SECRET=your-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
DB_HOST=localhost
DB_PORT=5432
DB_NAME=blog_app
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_DIALECT=postgres
FRONTEND_URL=http://localhost:3000
```

4. Initialize the database:
```bash
npm run init-db
```

**Note**: The init script will:
- Connect to PostgreSQL using your credentials
- Create the database specified in `DB_NAME` if it doesn't exist
- Create all necessary tables (users, posts) using Sequelize
- Optionally seed an admin user (check `scripts/seed-admin.js`)

5. Start the backend server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the frontend directory (optional, defaults are used):
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

### Running the Application

1. Make sure PostgreSQL is running
2. Start the backend server: `cd backend && npm run dev`
3. Start the frontend: `cd frontend && npm run dev`
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user info (protected)

### Posts
- `GET /api/posts` - Get all posts (protected)
- `GET /api/posts/:id` - Get single post by ID (protected)
- `POST /api/posts` - Create new post (admin only)
- `PUT /api/posts/:id` - Update post (admin only)
- `DELETE /api/posts/:id` - Delete post (admin only)

### Users
- `GET /api/users` - Get all users (admin only)
- `PUT /api/users/:id/role` - Update user role (admin only)

## Available Scripts

### Backend
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run init-db` - Initialize database

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Features Overview

### Authentication
- Secure password hashing with bcryptjs
- JWT token-based authentication
- Protected routes on both frontend and backend
- Automatic token refresh handling

### Blog Posts
- View all posts on the home page
- Click on a post to view full details
- Admin can create, edit, and delete posts
- Posts display author information and creation date

### Admin Panel
- **Posts Management**: Create, edit, and delete blog posts
- **Users Management**: View all users and manage admin roles
- Tab-based interface for easy navigation
- Modal dialogs for creating/editing posts

### UI/UX
- Modern, clean design with Tailwind CSS
- Responsive layout for all screen sizes
- Smooth animations and transitions
- Password visibility toggle with eye icon
- Loading states and error handling
- Empty states with helpful messages

## Security Features

- Password hashing with bcryptjs
- JWT token authentication
- Protected API routes with middleware
- Input validation with express-validator
- CORS configuration
- Role-based access control (admin/user)



# Task Management Application

A modern, responsive, and beautiful full‑stack Task Management web application designed for creating, updating, tracking, and filtering tasks.

## Key Features

1. **User Authentication & Authorization**: Secure sign‑up and login powered by JSON Web Tokens (JWT) and `bcryptjs` password hashing.
2. **Dashboard Overview**:
   - Total Tasks counter
   - Completed Tasks counter
   - Pending Tasks counter
   - Overdue Tasks counter (automatically computed)
3. **Task CRUD Operations**:
   - Create new tasks with title, description, priority, status, and due date.
   - Update existing tasks.
   - Toggle task completion directly from the Dashboard.
   - Delete tasks securely.
4. **Search & Filters**:
   - Real-time search by task title.
   - Filter by status (Pending, In Progress, Completed).
   - Filter by priority (Low, Medium, High).
5. **Dark Mode Toggle**: A seamless one-click switch between light and dark themes using Tailwind CSS v4 class-based toggle.
6. **Responsive Web & Mobile Layout**: Clean UI built with Tailwind CSS, supporting mobile, tablet, and desktop screens.

---

## Tech Stack

- **Frontend**: React (Vite), Tailwind CSS v4, React Router v6
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose)
- **Auth**: Stateless JSON Web Tokens (JWT)

---

## Getting Started

### Prerequisites

- Node.js (v16+ recommended)
- MongoDB running locally (`mongodb://localhost:27017`) or a MongoDB Atlas connection string.

### 1. Database & Server Setup

1. Navigate to the `server` folder:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Verify your configuration in the `.env` file:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/taskmanager
   JWT_SECRET=supersecretjwtkey1234567890!
   CLIENT_URL=http://localhost:5173
   ```
4. Start the backend server:
   ```bash
   npm run dev
   ```

### 2. Frontend Setup

1. Navigate to the `client` folder:
   ```bash
   cd ../client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Verify the API endpoint in the `.env` file:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```
4. Start the frontend Vite development server:
   ```bash
   npm run dev
   ```

---

## API Endpoints

### Authentication
- `POST /api/auth/register` - Create user and receive JWT.
- `POST /api/auth/login` - Validate user credentials and receive JWT.

### Tasks (Protected)
- `GET /api/tasks` - Get user tasks with query parameters:
  - `search`: title search query (case-insensitive)
  - `status`: Filter by status (`Pending`, `In Progress`, `Completed`)
  - `priority`: Filter by priority (`Low`, `Medium`, `High`)
- `POST /api/tasks` - Create a new task.
- `PUT /api/tasks/:id` - Update a task.
- `DELETE /api/tasks/:id` - Delete a task.

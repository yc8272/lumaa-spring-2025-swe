# Task Management Application

A full-stack application built with React + TypeScript (frontend), Node.js with Express (backend), and PostgreSQL (database).

## Features

- User authentication (register, login)
- Task management (create, read, update, delete)
- Responsive design

## Prerequisites

- Node.js (v14 or later)
- PostgreSQL (v12 or later)
- npm (v6 or later)

## Setup Instructions

### Database Setup

1. Create a PostgreSQL database:

```sql
CREATE DATABASE task_management;
```

2. The application will automatically create the required tables on startup, but you can use these queries if needed:

```sql
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS tasks (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  is_complete BOOLEAN DEFAULT FALSE,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE
);
```

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

```
PORT=5000
DATABASE_URL=postgres://username:password@localhost:5432/task_management
JWT_SECRET=your_secret_key_here
```

Replace `username` and `password` with your PostgreSQL credentials.

4. Build and start the server:

```bash
# For development:
npm run dev

# For production:
npm run build
npm start
```

The backend server will run on http://localhost:5000.

### Frontend Setup

1. Navigate to the frontend directory:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the frontend directory with:

```
REACT_APP_API_URL=http://localhost:5001
```

4. Start the development server:

```bash
npm start
```

The frontend application will run on http://localhost:3000.

## Project Structure

### Backend

- `src/index.ts`: Main server file with all routes and middleware
- Authentication uses JWT tokens

### Frontend

- `src/App.tsx`: Main application component with routing
- `src/context/AuthContext.tsx`: Authentication context provider
- `src/services/api.ts`: API service for backend communication
- `src/components/`: React components for different features

## Usage

1. Register a new user account
2. Log in with your credentials
3. Create, edit, complete, and delete tasks

## Notes on Testing

- No automated tests are included in this minimal implementation
- To test authentication flow: try accessing `/tasks` route without logging in
- To test task CRUD operations: create, edit, and delete tasks after login

## Salary Expectations

$2500-3000 per month (30 per hour)

# Video Demo

https://drive.google.com/file/d/1S00oEvGyKIiyzzzfQpROtJTzo18W9spm/view?usp=sharing
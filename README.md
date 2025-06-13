# Mini Social Network

A social network application built with React, Node.js, Express.js, PostgreSQL, and GraphQL.

## Project Structure

- `frontend/`: React application
- `backend/`: Node.js/Express.js server with GraphQL API

## Tech Stack

### Frontend

- React
- Apollo Client (for GraphQL)
- TypeScript
- Tailwind CSS

### Backend

- Node.js
- Express.js
- Apollo Server
- PostgreSQL
- Prisma (ORM)
- TypeScript

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- PostgreSQL
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
4. Initialize Prisma:
   ```bash
   npx prisma init
   ```
5. After setting up your schema, run migrations:
   ```bash
   npx prisma migrate dev
   ```
6. Start the development server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```

## Development

- Backend runs on: http://localhost:4000
- Frontend runs on: http://localhost:5173
- GraphQL Playground: http://localhost:4000/graphql
- Prisma Studio: http://localhost:5555

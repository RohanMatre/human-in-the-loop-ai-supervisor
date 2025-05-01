# Human-in-the-Loop AI Supervisor

A system that integrates AI agents with human supervision for handling customer queries.

## Project Overview

This system simulates a customer service environment where an AI agent handles incoming calls/messages. When the AI encounters a query it can't answer, it routes the request to a human supervisor, learns from the response, and updates its knowledge base for future use.

### Key Features

- AI agent that handles incoming simulated calls
- Human supervisor interface for responding to AI requests for help
- Knowledge base management for storing learned answers
- Request lifecycle management (Pending → Resolved/Unresolved)

## Architecture

```
├── client/               # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/   # UI components
│   │   ├── pages/        # Page components
│   │   ├── hooks/        # Custom React hooks
│   │   ├── store/        # State management
│   │   ├── services/     # API client services
│   │   └── utils/        # Utility functions
│
├── server/               # Backend (Express + Node.js)
│   ├── src/
│   │   ├── controllers/  # Request handlers
│   │   ├── models/       # Data models
│   │   ├── routes/       # API routes
│   │   ├── services/     # Business logic
│   │   ├── utils/        # Utility functions
│   │   └── middleware/   # Express middleware
│
└── shared/               # Shared code between client and server
    ├── types/            # TypeScript interfaces
    └── constants/        # Shared constants
```

## Setup Instructions

1. Clone the repository
2. Install dependencies
   ```
   npm install
   cd client && npm install
   cd server && npm install
   ```
3. Set up environment variables
   - Create `.env` files in both client and server directories
   - See `.env.example` for required variables

4. Start development servers
   ```
   # In one terminal
   cd server && npm run dev
   
   # In another terminal
   cd client && npm run dev
   ```

## Technical Stack

- **Frontend**: React, Vite, TypeScript
- **Backend**: Node.js, Express, TypeScript
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth (if implemented)
- **Deployment**: Local with instructions for Vercel/Firebase hosting

## Request Lifecycle

1. AI agent receives a customer query
2. If the agent can answer, it responds directly
3. If the agent cannot answer:
   - Responds with "Let me check with my supervisor..."
   - Creates a pending help request in the database
   - Notifies the supervisor dashboard
4. Supervisor reviews the request and submits a response
5. System updates the knowledge base with the new information
6. Request status changes from pending to resolved

## Development Roadmap

1. Project setup and scaffolding
2. Basic AI agent simulation
3. Help request creation and storage
4. Supervisor dashboard implementation 
5. Knowledge base management
6. Request lifecycle implementation
7. UI refinement
8. Testing and documentation
9. Optional: Deployment 
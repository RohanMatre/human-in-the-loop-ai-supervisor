# Human-in-the-Loop AI Supervisor

A system where an AI agent handles customer queries and requests human supervisor help when needed.

## Project Structure

This is a monorepo containing both client and server components:

- **Client**: React/Vite application for the frontend
- **Server**: Express backend with TypeScript

## Flowchart
![Untitled](https://github.com/user-attachments/assets/0ffc59dc-5999-4879-ac4a-a9e9a09eff04)

## Features

- AI-powered customer service agent
- Human supervisor intervention system
- Knowledge base management
- Request tracking and analytics

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Firebase account for database

### Installation

1. Clone the repository:
```bash
git clone https://github.com/RohanMatre/human-in-the-loop-ai-supervisor.git
cd human-in-the-loop-ai-supervisor
```

2. Install dependencies:
```bash
# Install root dependencies
npm install

# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install
```

3. Set up environment variables:
   - Create `.env` file in the server directory
   - Create `.env` file in the client directory

4. Start development servers:
```bash
# Start server
cd server
npm run dev

# Start client (in another terminal)
cd client
npm run dev
```

## License

MIT 

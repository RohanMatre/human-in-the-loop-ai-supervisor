#!/bin/bash

# Colors for better output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}Starting Human-in-the-Loop AI Supervisor System${NC}"
echo -e "${YELLOW}==============================================${NC}"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "Error: npm is not installed. Please install Node.js and npm first."
    exit 1
fi

# Install dependencies
echo -e "${GREEN}Installing dependencies...${NC}"
npm install
if [ $? -ne 0 ]; then
    echo "Error: Failed to install root dependencies"
    exit 1
fi

# Install client dependencies
echo -e "${GREEN}Installing client dependencies...${NC}"
cd client && npm install
if [ $? -ne 0 ]; then
    echo "Error: Failed to install client dependencies"
    exit 1
fi
cd ..

# Install server dependencies
echo -e "${GREEN}Installing server dependencies...${NC}"
cd server && npm install
if [ $? -ne 0 ]; then
    echo "Error: Failed to install server dependencies"
    exit 1
fi
cd ..

# Create environment files if they don't exist
if [ ! -f "./server/.env" ]; then
    echo -e "${YELLOW}Creating server .env file...${NC}"
    cat > ./server/.env << EOF
# Server configuration
PORT=8000
NODE_ENV=development

# Firebase configuration
FIREBASE_API_KEY=your_api_key
FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
FIREBASE_APP_ID=your_app_id

# Emulator configuration
USE_FIREBASE_EMULATOR=true
EOF
    echo -e "${YELLOW}Please update the server/.env file with your Firebase configuration${NC}"
fi

if [ ! -f "./client/.env" ]; then
    echo -e "${YELLOW}Creating client .env file...${NC}"
    cat > ./client/.env << EOF
# API URL
VITE_API_URL=http://localhost:8000

# Firebase configuration
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
EOF
    echo -e "${YELLOW}Please update the client/.env file with your configuration${NC}"
fi

# Start the development server
echo -e "${GREEN}Starting development servers...${NC}"
echo -e "${YELLOW}Press Ctrl+C to stop the servers${NC}"
npm run dev 
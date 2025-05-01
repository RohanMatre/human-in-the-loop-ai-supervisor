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
    echo -e "${YELLOW}Creating server .env file from template...${NC}"
    cp ./server/env.example ./server/.env
    echo -e "${YELLOW}Please update the server/.env file with your Firebase configuration${NC}"
fi

if [ ! -f "./client/.env" ]; then
    echo -e "${YELLOW}Creating client .env file from template...${NC}"
    cp ./client/env.example ./client/.env
    echo -e "${YELLOW}Please update the client/.env file with your configuration${NC}"
fi

# Start the development server
echo -e "${GREEN}Starting development servers...${NC}"
echo -e "${YELLOW}Press Ctrl+C to stop the servers${NC}"
npm run dev 
#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}Setting up a virtual environment for the LiveKit Salon Agent${NC}"

# Check if Python 3 is installed
if ! command -v python3 &> /dev/null; then
    echo "Error: Python 3 is required but not installed."
    exit 1
fi

# Create a virtual environment
echo -e "${BLUE}Creating a virtual environment...${NC}"
python3 -m venv venv

# Check if venv was created successfully
if [ ! -d "venv" ]; then
    echo "Error: Failed to create virtual environment."
    echo "Try installing venv with: pip3 install virtualenv"
    exit 1
fi

# Activate the virtual environment
echo -e "${BLUE}Activating virtual environment...${NC}"
source venv/bin/activate

# Install dependencies
echo -e "${BLUE}Installing dependencies...${NC}"
pip install -r requirements.txt

echo -e "${GREEN}Setup complete!${NC}"
echo -e "To activate the virtual environment in the future, run: ${BLUE}source venv/bin/activate${NC}"
echo -e "Then run the agent with: ${BLUE}python start.py${NC}"
echo ""
echo -e "${GREEN}Would you like to run the agent now? (y/n)${NC}"
read answer
if [ "$answer" = "y" ] || [ "$answer" = "Y" ]; then
    python start.py
fi 
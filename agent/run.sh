#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if Python 3 is installed
if ! command -v python3 &> /dev/null; then
    echo "Error: Python 3 is required but not installed."
    exit 1
fi

# Check that required files exist
if [ ! -f salon_agent.py ] || [ ! -f test_client.py ] || [ ! -f requirements.txt ]; then
    echo "Error: Required files not found. Make sure you're running this from the agent directory."
    exit 1
fi

# Check if .env file exists
if [ ! -f .env ]; then
    echo -e "${BLUE}Notice: .env file not found. Creating from env.example...${NC}"
    if [ -f env.example ]; then
        cp env.example .env
        echo -e "${GREEN}Created .env file. Please edit it with your API keys before continuing.${NC}"
        echo "Would you like to edit the .env file now? (y/n)"
        read answer
        if [ "$answer" = "y" ] || [ "$answer" = "Y" ]; then
            if command -v nano &> /dev/null; then
                nano .env
            elif command -v vim &> /dev/null; then
                vim .env
            else
                echo "No text editor found. Please edit the .env file manually."
            fi
        fi
    else
        echo "Error: env.example not found. Please create a .env file with your API keys."
        exit 1
    fi
fi

# Check for dependencies
echo -e "${BLUE}Checking for dependencies...${NC}"
pip3 install -r requirements.txt

# Function to start the agent
start_agent() {
    local room_name=$1
    echo -e "${GREEN}Starting salon agent in room: $room_name${NC}"
    python3 salon_agent.py --rooms "$room_name"
}

# Function to start the test client
start_client() {
    local room_name=$1
    local auto_mode=$2
    
    echo -e "${GREEN}Starting test client for room: $room_name${NC}"
    if [ "$auto_mode" = "true" ]; then
        python3 test_client.py --room "$room_name" --auto
    else
        python3 test_client.py --room "$room_name"
    fi
}

# Main menu
echo -e "${GREEN}=== Beauty Bliss Salon AI Agent ===${NC}"
echo "1. Start agent only"
echo "2. Start test client only"
echo "3. Start both agent and client (auto test mode)"
echo "4. Start both agent and client (interactive mode)"
echo "5. Exit"

read -p "Select an option (1-5): " option

# Default room name
room_name="salon-test-room"

# Ask for custom room name
read -p "Enter room name (default: $room_name): " custom_room
if [ -n "$custom_room" ]; then
    room_name=$custom_room
fi

case $option in
    1)
        start_agent "$room_name"
        ;;
    2)
        read -p "Use auto testing mode? (y/n): " auto_answer
        if [ "$auto_answer" = "y" ] || [ "$auto_answer" = "Y" ]; then
            start_client "$room_name" "true"
        else
            start_client "$room_name" "false"
        fi
        ;;
    3)
        # Start agent in the background
        start_agent "$room_name" &
        agent_pid=$!
        
        # Wait a moment for the agent to initialize
        sleep 3
        
        # Start client in auto mode
        start_client "$room_name" "true"
        
        # Kill the agent process when client exits
        kill $agent_pid 2>/dev/null
        ;;
    4)
        # Start agent in the background
        start_agent "$room_name" &
        agent_pid=$!
        
        # Wait a moment for the agent to initialize
        sleep 3
        
        # Start client in interactive mode
        start_client "$room_name" "false"
        
        # Kill the agent process when client exits
        kill $agent_pid 2>/dev/null
        ;;
    5)
        echo "Exiting..."
        exit 0
        ;;
    *)
        echo "Invalid option. Exiting..."
        exit 1
        ;;
esac 
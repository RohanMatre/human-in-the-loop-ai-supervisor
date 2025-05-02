#!/usr/bin/env python3

import os
import sys
import subprocess
import platform
import time

def check_virtual_env():
    """Check if running in a virtual environment"""
    return hasattr(sys, 'real_prefix') or (hasattr(sys, 'base_prefix') and sys.base_prefix != sys.prefix)

def check_requirements():
    """Check that all required files exist"""
    required_files = ['salon_agent.py', 'test_client.py', 'requirements.txt']
    missing = [file for file in required_files if not os.path.exists(file)]
    
    if missing:
        print(f"Error: Required files not found: {', '.join(missing)}")
        print("Make sure you're running this from the agent directory.")
        return False
    
    return True

def check_env_file():
    """Check if .env file exists, create from template if not"""
    if not os.path.exists('.env'):
        print("Notice: .env file not found. Creating from env.example...")
        
        if os.path.exists('env.example'):
            with open('env.example', 'r') as src:
                with open('.env', 'w') as dest:
                    dest.write(src.read())
            
            print("Created .env file. Please edit it with your API keys before continuing.")
            print("You can edit it manually after this script completes.")
        else:
            print("Error: env.example not found. Please create a .env file with your API keys.")
            return False
    
    return True

def install_dependencies():
    """Install required Python packages"""
    # Check if we're in a virtual environment
    if not check_virtual_env():
        print("WARNING: Not running in a virtual environment!")
        print("It's recommended to use a virtual environment to avoid system package conflicts.")
        print("Run './setup_venv.sh' to create and activate a virtual environment.")
        
        choice = input("Continue anyway? (y/n): ")
        if choice.lower() != 'y':
            print("\nPlease run 'setup_venv.sh' to set up a virtual environment first.")
            return False
    
    print("Installing dependencies...")
    try:
        subprocess.check_call([sys.executable, '-m', 'pip', 'install', '-r', 'requirements.txt'])
        return True
    except subprocess.CalledProcessError as e:
        print(f"Error installing dependencies: {e}")
        print("\nPossible solutions:")
        print("1. Make sure you're running in a virtual environment: './setup_venv.sh'")
        print("2. Try installing manually: 'pip install -r requirements.txt'")
        print("3. If using system Python, try: 'pip install --user -r requirements.txt'")
        return False

def clear_screen():
    """Clear the terminal screen"""
    os.system('cls' if platform.system() == 'Windows' else 'clear')

def start_agent(room_name):
    """Start the salon agent"""
    print(f"Starting salon agent in room: {room_name}")
    return subprocess.Popen([sys.executable, 'salon_agent.py', '--rooms', room_name])

def start_client(room_name, auto_mode=False):
    """Start the test client"""
    cmd = [sys.executable, 'test_client.py', '--room', room_name]
    if auto_mode:
        cmd.append('--auto')
    
    print(f"Starting test client for room: {room_name}")
    return subprocess.run(cmd)

def main_menu():
    """Display the main menu and handle user choice"""
    clear_screen()
    print("=" * 50)
    print("      Beauty Bliss Salon AI Agent")
    print("=" * 50)
    
    # Check setup first
    if not check_requirements() or not check_env_file() or not install_dependencies():
        input("Press Enter to exit...")
        return
    
    print("\nPlease select an option:")
    print("1. Start agent only")
    print("2. Start test client only")
    print("3. Start both agent and client (auto test mode)")
    print("4. Start both agent and client (interactive mode)")
    print("5. Exit")
    
    try:
        option = int(input("\nSelect an option (1-5): "))
    except ValueError:
        print("Invalid option. Please enter a number.")
        time.sleep(2)
        return main_menu()
    
    # Default room name
    room_name = "salon-test-room"
    custom_room = input(f"Enter room name (default: {room_name}): ")
    if custom_room:
        room_name = custom_room
    
    if option == 1:
        # Start agent only
        agent_process = start_agent(room_name)
        print("\nPress Ctrl+C to stop the agent...")
        try:
            agent_process.wait()
        except KeyboardInterrupt:
            agent_process.terminate()
            print("\nAgent stopped.")
    
    elif option == 2:
        # Start client only
        auto_answer = input("Use auto testing mode? (y/n): ").lower()
        start_client(room_name, auto_answer == 'y')
    
    elif option == 3 or option == 4:
        # Start both agent and client
        agent_process = start_agent(room_name)
        
        # Wait for agent to initialize
        print("Waiting for agent to initialize...")
        time.sleep(3)
        
        # Start client
        try:
            start_client(room_name, option == 3)
        finally:
            # Kill agent process when client exits
            agent_process.terminate()
            print("Agent stopped.")
    
    elif option == 5:
        print("Exiting...")
        return
    
    else:
        print("Invalid option. Please try again.")
        time.sleep(2)
        return main_menu()
    
    # Return to menu after operation completes
    input("\nPress Enter to return to menu...")
    main_menu()

if __name__ == "__main__":
    try:
        main_menu()
    except KeyboardInterrupt:
        print("\nExiting...")
    except Exception as e:
        print(f"Error: {e}")
        input("Press Enter to exit...") 
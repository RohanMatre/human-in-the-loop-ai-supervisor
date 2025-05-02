# Salon AI Agent with LiveKit

A simple AI agent implementation for a salon business using LiveKit's voice agent capabilities. This agent can receive calls, respond to questions about salon services, and provide basic information about the salon.

## Features

- Answers customer calls for a fictional salon (Beauty Bliss)
- Provides information about salon services, hours, pricing, and policies
- Uses LiveKit for real-time communication
- Powered by OpenAI's language model and Deepgram speech recognition
- Can handle multiple incoming calls simultaneously

## Requirements

- Python 3.8+
- LiveKit account (free tier available)
- OpenAI API key
- Deepgram API key

## Setup

### Virtual Environment (Recommended)

To avoid conflicts with system packages, it's recommended to use a virtual environment:

1. Use the provided setup script to create and set up a virtual environment:
   ```bash
   ./setup_venv.sh
   ```

   This script will:
   - Create a virtual environment in the `venv` directory
   - Activate the virtual environment
   - Install required dependencies
   - Offer to run the agent immediately

2. In the future, activate the virtual environment before running:
   ```bash
   source venv/bin/activate
   ```

### Manual Setup

If you prefer to set up manually:

1. Create and activate a virtual environment:
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Create a `.env` file by copying the template:
   ```bash
   cp env.example .env
   ```

4. Update the `.env` file with your API keys:
   - Create a LiveKit account and set up a project at https://livekit.io/
   - Get an OpenAI API key from https://platform.openai.com/
   - Get a Deepgram API key from https://console.deepgram.com/

## Quick Start

There are two easy ways to start the application:

### Option 1: Python Script (recommended)

Run the Python startup script for a user-friendly interface:

```bash
python start.py
```

or

```bash
./start.py
```

This interactive menu will:
- Check and install dependencies
- Create a .env file if needed
- Let you start the agent, client, or both
- Provide clean process management

### Option 2: Shell Script

If you prefer shell scripts, use:

```bash
./run.sh
```

This script provides similar functionality to the Python version.

## Running the Agent Manually

Start the agent with default settings:
```bash
python salon_agent.py
```

Or specify which rooms to monitor:
```bash
python salon_agent.py --rooms salon-room-1 salon-room-2
```

The agent will connect to the specified LiveKit rooms and wait for incoming calls.

## Testing the Agent Manually

Use the included test client to connect to the agent:

```bash
python test_client.py
```

Options:
- `--room`: Room name to connect to (default: "salon-test-room")
- `--identity`: Your identity in the room (default: "test-caller")
- `--auto`: Run automatic test with sample questions
- `--delay`: Delay between questions in auto mode (seconds, default: 5)

Example:
```bash
python test_client.py --room my-test-room --auto --delay 10
```

## Customization

- Edit the `SALON_INFO` variable in `salon_agent.py` to change the business information
- Update the `SYSTEM_PROMPT` to modify the agent's behavior
- Change the TTS voice or AI model in the agent configuration
- Add or modify the sample questions in `test_client.py` to test different scenarios

## Advanced Configuration

- **Language Model**: The agent uses OpenAI's `gpt-4-turbo` by default. You can change to a different model by modifying the `model` parameter in the `OpenAILlm` constructor.
- **Voice**: The default voice is Silero's English voice (`en_1`). You can change this in the `TtsOptions` configuration.
- **Error Handling**: The agent includes basic error handling and environment variable checking. Error logs are printed to the console.

## Limitations

- This is a basic implementation for demonstration purposes
- In a production environment, you would want to:
  - Add more robust error handling and logging
  - Implement proper authentication and security measures
  - Set up monitoring and alerts
  - Consider scaling options for handling multiple concurrent calls 
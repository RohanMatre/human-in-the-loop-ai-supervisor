#!/usr/bin/env python3

import os
import asyncio
import sys
from typing import Optional, List
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Import LiveKit agent components
from livekit.agents import (
    Agent,
    AgentSession,
    JobContext,
    WorkerOptions,
    function_tool,
    cli,
)
# Remove the SileroTts import as it's not available
# Use OpenAI for both LLM and TTS
from livekit.plugins.openai import OpenAIPlugin, LLM, TTS
from livekit.plugins.deepgram import DeepgramPlugin, STT

# Salon business information
SALON_INFO = """
Beauty Bliss Salon Information:
- Business hours: Monday-Friday 9am-7pm, Saturday 10am-6pm, Sunday closed
- Services: Haircuts, color, styling, manicures, pedicures, facials, waxing
- Pricing: Haircuts $50-80, Color $90-150, Manicure $30, Pedicure $45, Facial $75, Waxing starts at $20
- Location: 123 Style Street, Fashion District
- Appointment booking: 24 hours notice preferred
- Cancellation policy: 24 hours notice required to avoid 50% charge
- Contact: (555) 123-4567 or beautybliss@example.com
"""

# System prompt for the AI agent
SYSTEM_PROMPT = f"""
You are a friendly and helpful receptionist for Beauty Bliss Salon.
Your job is to answer customer calls, provide information, and assist with basic inquiries.

{SALON_INFO}

When speaking with customers:
1. Be polite, professional, and concise
2. Answer questions about salon services, hours, and policies
3. Refer detailed inquiries or booking requests to the salon staff
4. Do not make up information that's not provided above
5. If you don't know something, politely say you'll have someone from the salon contact them

Always start the conversation by greeting the caller and identifying yourself as the Beauty Bliss Salon virtual assistant.
"""

def check_env_vars():
    """Check that all required environment variables are set"""
    required_vars = [
        "LIVEKIT_URL", 
        "LIVEKIT_API_KEY", 
        "LIVEKIT_API_SECRET",
        "OPENAI_API_KEY",
        "DEEPGRAM_API_KEY"
    ]
    
    missing = [var for var in required_vars if not os.getenv(var)]
    
    if missing:
        print(f"Error: Missing required environment variables: {', '.join(missing)}")
        print("Please create a .env file with these variables set. See env.example for format.")
        sys.exit(1)

@function_tool
async def get_salon_info(context):
    """Get detailed information about the salon."""
    return SALON_INFO

@function_tool
async def check_business_hours(context):
    """Get the salon's business hours."""
    return "Business hours: Monday-Friday 9am-7pm, Saturday 10am-6pm, Sunday closed"

async def entrypoint(ctx: JobContext):
    """Entrypoint for the agent job."""
    # Check required environment variables
    check_env_vars()
    
    # Connect to the room
    await ctx.connect()
    
    print(f"Connected to room: {ctx.room.name}")
    
    # Initialize OpenAI plugin
    openai_plugin = OpenAIPlugin(api_key=os.getenv("OPENAI_API_KEY"))
    
    # Set up language model
    llm = LLM(
        plugin=openai_plugin,
        model="gpt-4-turbo",
    )
    
    # Set up text-to-speech using OpenAI
    tts = TTS(
        plugin=openai_plugin,
        voice="alloy"  # Using OpenAI's default voice
    )
    
    # Initialize Deepgram plugin
    deepgram_plugin = DeepgramPlugin(api_key=os.getenv("DEEPGRAM_API_KEY"))
    
    # Set up speech recognition
    stt = STT(
        plugin=deepgram_plugin
    )
    
    # Create the agent
    agent = Agent(
        instructions=SYSTEM_PROMPT,
        tools=[get_salon_info, check_business_hours],
    )
    
    # Create a session to handle the call
    session = AgentSession(
        stt=stt,
        llm=llm,
        tts=tts,
    )
    
    # Start the session
    await session.start(agent=agent, room=ctx.room)
    
    # Generate initial greeting
    await session.generate_reply(instructions="Greet the caller and introduce yourself as the Beauty Bliss Salon virtual assistant.")
    
    # Keep the job alive until the room is closed
    try:
        # Wait until disconnected
        await ctx.room.wait_for_disconnect()
    except Exception as e:
        print(f"Error: {e}")
    finally:
        print(f"Call ended in room: {ctx.room.name}")

if __name__ == "__main__":
    # Use CLI to run the worker
    cli.run_app(
        WorkerOptions(
            entrypoint_fnc=entrypoint,
            ws_url=os.getenv("LIVEKIT_URL"),
            api_key=os.getenv("LIVEKIT_API_KEY"),
            api_secret=os.getenv("LIVEKIT_API_SECRET"),
        )
    ) 
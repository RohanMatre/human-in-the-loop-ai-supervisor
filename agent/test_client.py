#!/usr/bin/env python3

import os
import asyncio
import argparse
import time
from dotenv import load_dotenv

from livekit import rtc
from livekit.agents import (
    APIConnectOptions,
    JobContext,
    RoomIO,
    RoomInputOptions,
    RoomOutputOptions,
    WorkerOptions,
    cli,
)

# Load environment variables
load_dotenv()

# Sample questions to test the salon agent
SAMPLE_QUESTIONS = [
    "What are your business hours?",
    "How much does a haircut cost?",
    "Do you offer manicures and pedicures?",
    "What's your cancellation policy?",
    "Where is the salon located?",
    "Can I book an appointment for next week?"
]

class TestClient:
    def __init__(self, room_name, token):
        self.room = rtc.Room()
        self.room_name = room_name
        self.token = token
        self.local_participant = None
        self.local_audio_track = None
        self.remote_participants = {}
        self.agent = None
        self.text_stream = None

    async def connect(self):
        """Connect to the LiveKit room"""
        print(f"Connecting to room {self.room_name}...")
        await self.room.connect(
            os.environ.get("LIVEKIT_URL"),
            self.token,
            options=rtc.RoomOptions(auto_subscribe=True)
        )
        
        self.local_participant = self.room.local_participant
        
        # Set up event handlers
        self.room.on("participant_connected", self._on_participant_connected)
        self.room.on("participant_disconnected", self._on_participant_disconnected)
        
        # Wait for the agent to join
        print("Waiting for agent to join...")
        timer = 0
        while timer < 30:  # Wait up to 30 seconds
            for participant in self.room.remote_participants.values():
                if "agent" in participant.identity or "agent" in participant.attributes.get("role", ""):
                    print(f"Agent joined: {participant.identity}")
                    self.agent = participant
                    return
            await asyncio.sleep(1)
            timer += 1
            print(f"Waiting for agent... {timer}s")
        
        raise Exception("Timeout waiting for agent to join")

    def _on_participant_connected(self, participant):
        print(f"Participant connected: {participant.identity}")
        self.remote_participants[participant.identity] = participant
        
        # Listen for agent state changes
        participant.on("attributes_changed", self._on_attributes_changed)
        
        # Check if this is the agent
        if "agent" in participant.identity or "agent" in participant.attributes.get("role", ""):
            self.agent = participant
            print(f"Agent identified: {participant.identity}")

    def _on_participant_disconnected(self, participant):
        print(f"Participant disconnected: {participant.identity}")
        if participant.identity in self.remote_participants:
            del self.remote_participants[participant.identity]
        
        if self.agent and self.agent.identity == participant.identity:
            self.agent = None
            print("Agent disconnected")

    def _on_attributes_changed(self, participant, attributes):
        if participant.identity == self.agent.identity:
            agent_state = attributes.get("agent-state")
            if agent_state:
                print(f"Agent state changed: {agent_state}")

    async def send_text_message(self, message):
        """Send a text message to the agent"""
        if not self.agent:
            print("Cannot send message: No agent connected")
            return
        
        print(f"Sending message: {message}")
        # Use LiveKit's text stream to send the message
        if not self.text_stream:
            self.text_stream = await self.room.local_participant.create_text_stream("chat")
        
        await self.text_stream.send_string(message)

    async def run_test_conversation(self):
        """Run through sample questions to test the agent"""
        if not self.agent:
            print("Cannot test conversation: No agent connected")
            return
        
        for question in SAMPLE_QUESTIONS:
            print(f"\n--- Testing: {question} ---")
            await self.send_text_message(question)
            
            # Give the agent time to respond
            await asyncio.sleep(5)
    
    async def aclose(self):
        """Close the connection"""
        if self.room:
            await self.room.disconnect()

async def main():
    parser = argparse.ArgumentParser(description="Test client for salon agent")
    parser.add_argument("--room", type=str, required=True, help="Room name to join")
    args = parser.parse_args()
    
    # Create a token for the test client
    from livekit.api import AccessToken, VideoGrants
    token = (
        AccessToken(api_key=os.environ.get("LIVEKIT_API_KEY"), api_secret=os.environ.get("LIVEKIT_API_SECRET"))
        .with_identity("test-client")
        .with_name("Test Client")
        .with_grants(VideoGrants(room_join=True, room=args.room))
        .to_jwt()
    )
    
    client = TestClient(args.room, token)
    try:
        await client.connect()
        print("Connected to room, starting test conversation...")
        await client.run_test_conversation()
    except Exception as e:
        print(f"Error: {e}")
    finally:
        await client.aclose()

if __name__ == "__main__":
    asyncio.run(main()) 
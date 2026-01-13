#!/bin/bash

# Function to clean up background processes by name
cleanup() {
    echo ""
    echo "--- Shutting down all servers ---"
    # Use pkill to find and kill processes by their command string.
    # The `|| true` prevents the script from exiting if no processes are found.
    pkill -f "node server.js" || true
    pkill -f "vite" || true
    echo "--- All servers stopped ---"
}

# Trap the EXIT signal (e.g., from Ctrl+C) to run the cleanup function
trap cleanup EXIT

# --- Pre-run Cleanup ---
# Run the cleanup function once at the start to stop any old processes.
cleanup

# Exit immediately if a command exits with a non-zero status.
set -e

echo ""
echo "--- Setting up and starting all applications ---"
cd packages/
# --- API Server ---
echo "[1/3] Starting API server..."
cd api
npm install > /dev/null 2>&1 # Hide npm install output
npm start &
cd ..

# --- Vanilla App ---
echo "[2/3] Building and starting Vanilla chat app..."
cd vanilla
npm install > /dev/null 2>&1
npm run build > /dev/null 2>&1
npm start &
cd ..

# --- React App ---
echo "[3/3] Starting React chat app..."
cd react
npm install > /dev/null 2>&1
npm run dev &
cd ..

echo ""
echo "--- All applications are running! ---"
echo "API Server:       http://localhost:3000"
echo "Vanilla Chat App: http://localhost:3001"
echo "React Chat App:   http://localhost:5173"
echo ""
echo "Press Ctrl+C to stop all servers."

# Wait for all background jobs to finish.
# This keeps the script alive so it can catch the Ctrl+C signal.
wait

#!/bin/bash

# Start backend + public client on port 5000
npm run dev &

# Wait a bit for backend to initialize
sleep 3

# Start admin client on port 5001
vite --config admin-client/vite.config.ts &

# Wait for all background processes
wait

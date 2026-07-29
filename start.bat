@echo off
echo Starting MERN Stack Graph Visualizer...

echo Starting Backend Server...
start cmd /k "cd backend && node server.js"

echo Starting Frontend Server...
start cmd /k "cd frontend && npm run dev"

echo Both servers are starting up! Check the new command prompt windows.
echo A browser window should open automatically, or you can go to http://localhost:5173

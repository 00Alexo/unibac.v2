@echo off
echo Starting backend...
start cmd /k "cd backend && node index"
timeout /t 5

echo Starting frontend...
start cmd /k "cd frontend && npm run start"
timeout /t 5

echo Starting Trivia's frontend on port 3001...
start cmd /k "cd trivia && set PORT=3001 && npm run start"

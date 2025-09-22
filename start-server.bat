@echo off
set PATH=%PATH%;%CD%\nodejs-portable\node-v20.18.0-win-x64
set DATABASE_URL=file:./dev.db
npm run dev
pause

@echo off
title Sumo Robot Competition - Judges System (E-JUST HQ)
echo ===================================================
echo   SUMO ROBOT COMPETITION - JUDGES MANAGEMENT SYSTEM
echo   E-JUST HQ - October 30, 2026 (22 Teams)
echo ===================================================
echo.
echo Launching local server...
cd /d "C:\sumo-judging-system"
start "" http://localhost:3000
npm run dev
pause

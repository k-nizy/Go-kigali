#!/bin/bash

# KigaliGo Project Startup Script for Linux/macOS
# This script starts both the backend (Flask) and frontend (React) servers

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored messages
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_header() {
    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE}   KigaliGo Project Startup Script${NC}"
    echo -e "${BLUE}========================================${NC}"
    echo ""
}

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check if a port is in use
port_in_use() {
    lsof -i :"$1" >/dev/null 2>&1
}

# Function to kill process on port
kill_port() {
    local port=$1
    if port_in_use "$port"; then
        print_warning "Port $port is in use. Attempting to free it..."
        lsof -ti :"$port" | xargs kill -9 2>/dev/null || true
        sleep 1
    fi
}

# Cleanup function
cleanup() {
    print_info "Shutting down servers..."
    # Kill child processes
    jobs -p | xargs -r kill 2>/dev/null || true
    exit 0
}

# Set up trap to cleanup on script exit
trap cleanup EXIT INT TERM

# Print header
print_header

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$SCRIPT_DIR/backend"
FRONTEND_DIR="$SCRIPT_DIR/frontend"

# Step 1: Check prerequisites
print_info "Checking prerequisites..."

# Check Python
if ! command_exists python3; then
    print_error "Python 3 is not installed. Please install Python 3.8 or higher."
    exit 1
fi
print_success "Python 3 found: $(python3 --version)"

# Check pip
if ! command_exists pip3; then
    print_error "pip3 is not installed. Please install pip3."
    exit 1
fi
print_success "pip3 found"

# Check Node.js
if ! command_exists node; then
    print_error "Node.js is not installed. Please install Node.js 14 or higher."
    exit 1
fi
print_success "Node.js found: $(node --version)"

# Check npm
if ! command_exists npm; then
    print_error "npm is not installed. Please install npm."
    exit 1
fi
print_success "npm found: $(npm --version)"

echo ""

# Step 2: Install backend dependencies
print_info "Checking backend dependencies..."
cd "$BACKEND_DIR"

if [ ! -d "venv" ]; then
    print_info "Creating Python virtual environment..."
    python3 -m venv venv
    print_success "Virtual environment created"
fi

print_info "Activating virtual environment..."
source venv/bin/activate

print_info "Installing/updating backend dependencies..."
pip3 install -q -r requirements.txt
print_success "Backend dependencies installed"

echo ""

# Step 3: Install frontend dependencies
print_info "Checking frontend dependencies..."
cd "$FRONTEND_DIR"

if [ ! -d "node_modules" ]; then
    print_info "Installing frontend dependencies (this may take a few minutes)..."
    npm install
    print_success "Frontend dependencies installed"
else
    print_success "Frontend dependencies already installed"
fi

echo ""

# Step 4: Check and free ports if needed
print_info "Checking ports..."
kill_port 5000  # Backend port
kill_port 3000  # Frontend port
print_success "Ports are ready"

echo ""

# Step 5: Start backend server
print_info "Starting backend server..."
cd "$BACKEND_DIR"
source venv/bin/activate

# Start backend in background
python3 simple_app.py > backend.log 2>&1 &
BACKEND_PID=$!
print_success "Backend server started (PID: $BACKEND_PID)"

# Wait for backend to start
print_info "Waiting for backend to be ready..."
sleep 3

# Check if backend is running
if ! kill -0 $BACKEND_PID 2>/dev/null; then
    print_error "Backend failed to start. Check backend/backend.log for details."
    exit 1
fi

# Test backend health
if command_exists curl; then
    for i in {1..10}; do
        if curl -s http://localhost:5000/health >/dev/null 2>&1; then
            print_success "Backend is healthy and responding"
            break
        fi
        if [ $i -eq 10 ]; then
            print_warning "Backend may not be fully ready yet"
        fi
        sleep 1
    done
fi

echo ""

# Step 6: Start frontend server
print_info "Starting frontend server..."
cd "$FRONTEND_DIR"

# Start frontend in background
BROWSER=none npm start > frontend.log 2>&1 &
FRONTEND_PID=$!
print_success "Frontend server started (PID: $FRONTEND_PID)"

# Wait for frontend to start
print_info "Waiting for frontend to be ready..."
sleep 5

echo ""

# Step 7: Display information
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}   🎉 Project Started Successfully!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "${BLUE}🔗 Important URLs:${NC}"
echo -e "   ${GREEN}Frontend:${NC}        http://localhost:3000"
echo -e "   ${GREEN}Backend API:${NC}     http://localhost:5000"
echo -e "   ${GREEN}API Docs:${NC}        http://localhost:5000/api/v1/docs"
echo -e "   ${GREEN}Health Check:${NC}    http://localhost:5000/health"
echo ""
echo -e "${BLUE}📝 Logs:${NC}"
echo -e "   ${GREEN}Backend:${NC}         tail -f $BACKEND_DIR/backend.log"
echo -e "   ${GREEN}Frontend:${NC}        tail -f $FRONTEND_DIR/frontend.log"
echo ""
echo -e "${BLUE}⚙️  Process IDs:${NC}"
echo -e "   ${GREEN}Backend PID:${NC}     $BACKEND_PID"
echo -e "   ${GREEN}Frontend PID:${NC}    $FRONTEND_PID"
echo ""
echo -e "${YELLOW}Press Ctrl+C to stop all servers${NC}"
echo ""

# Open browser (optional - will open if xdg-open is available)
if command_exists xdg-open; then
    sleep 2
    print_info "Opening browser..."
    xdg-open http://localhost:3000 >/dev/null 2>&1 &
elif command_exists open; then
    sleep 2
    print_info "Opening browser..."
    open http://localhost:3000 >/dev/null 2>&1 &
fi

# Wait for processes to finish or Ctrl+C
wait

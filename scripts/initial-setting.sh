#!/bin/bash

###############################################################################
# Hololog Initial Setup Script
# This script automates the initial setup process for the Hololog project.
###############################################################################

set -e  # Exit on error

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functions
print_header() {
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
}

print_step() {
    echo -e "\n${GREEN}▶ $1${NC}"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

# Check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check version comparison
version_ge() {
    if [[ $1 == $2 ]]; then
        return 0
    fi
    local IFS=.
    local i ver1=($1) ver2=($2)
    for ((i=${#ver1[@]}; i<${#ver2[@]}; i++)); do
        ver1[i]=0
    done
    for ((i=0; i<${#ver1[@]}; i++)); do
        if [[ -z ${ver2[i]} ]]; then
            ver2[i]=0
        fi
        if ((10#${ver1[i]} > 10#${ver2[i]})); then
            return 0
        fi
        if ((10#${ver1[i]} < 10#${ver2[i]})); then
            return 1
        fi
    done
    return 0
}

###############################################################################
# Main Setup Process
###############################################################################

print_header "Hololog Initial Setup"

# Step 1: Check if we're in the project root
print_step "Checking project directory..."
if [[ ! -f "package.json" ]] || [[ ! -d "src" ]]; then
    print_error "This script must be run from the project root directory"
    echo "Please navigate to the hololog directory and run: bash scripts/initial-setting.sh"
    exit 1
fi
print_success "Project root directory confirmed"

# Step 2: Check Node.js version
print_step "Checking Node.js version..."
if ! command_exists node; then
    print_error "Node.js is not installed"
    echo "Please install Node.js LTS version from https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node -v | sed 's/v//')
REQUIRED_NODE_VERSION="18.0.0"

if version_ge "$NODE_VERSION" "$REQUIRED_NODE_VERSION"; then
    print_success "Node.js version: $NODE_VERSION (required: >= $REQUIRED_NODE_VERSION)"
else
    print_error "Node.js version $NODE_VERSION is too old (required: >= $REQUIRED_NODE_VERSION)"
    echo "Please upgrade Node.js to the LTS version"
    exit 1
fi

# Step 3: Check pnpm version
print_step "Checking pnpm..."
if ! command_exists pnpm; then
    print_error "pnpm is not installed"
    echo "Installing pnpm..."
    npm install -g pnpm@10.28.0
    print_success "pnpm 10.28.0 installed"
else
    PNPM_VERSION=$(pnpm -v)
    print_success "pnpm version: $PNPM_VERSION"
fi

# Step 4: Check Git initialization
print_step "Checking Git repository..."
if [[ ! -d ".git" ]]; then
    print_warning "Git repository not initialized"
    read -p "Would you like to initialize Git repository? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git init
        print_success "Git repository initialized"
    else
        print_warning "Skipping Git initialization"
    fi
else
    print_success "Git repository already initialized"
fi

# Step 5: Install dependencies
print_step "Installing dependencies..."
echo "This may take a few minutes..."
if pnpm install; then
    print_success "Dependencies installed successfully"
else
    print_error "Failed to install dependencies"
    exit 1
fi

# Step 6: Setup environment variables
print_step "Setting up environment variables..."
if [[ -f ".env.local" ]]; then
    print_warning ".env.local already exists, skipping..."
elif [[ -f ".env.example" ]]; then
    cp .env.example .env.local
    print_success ".env.local created from .env.example"
    echo "You may want to update .env.local with your configuration"
else
    print_warning "No .env.example file found, skipping environment setup"
fi

# Step 7: Setup Husky (Git hooks)
print_step "Setting up Git hooks..."
if [[ -d ".husky" ]]; then
    print_success "Husky already configured"
else
    if pnpm prepare; then
        print_success "Husky Git hooks configured"
    else
        print_warning "Failed to configure Husky hooks (non-critical)"
    fi
fi

# Step 8: Verify setup
print_step "Verifying setup..."
echo ""

# Check if node_modules exists
if [[ -d "node_modules" ]]; then
    print_success "Dependencies installed"
else
    print_error "Dependencies not found"
    exit 1
fi

# Check if .env.local exists (optional)
if [[ -f ".env.local" ]]; then
    print_success "Environment file configured"
else
    print_warning "No .env.local file (optional)"
fi

# Check if Husky is configured
if [[ -d ".husky" ]]; then
    print_success "Git hooks configured"
else
    print_warning "Git hooks not configured (optional)"
fi

# Final summary
print_header "Setup Complete!"
echo ""
echo -e "${GREEN}Your Hololog development environment is ready!${NC}"
echo ""
echo "Quick start:"
echo "  ${BLUE}pnpm dev${NC}         - Start development server"
echo "  ${BLUE}pnpm build${NC}       - Build for production"
echo "  ${BLUE}pnpm test${NC}        - Run tests"
echo "  ${BLUE}pnpm lint${NC}        - Run linters"
echo ""
echo "Documentation:"
echo "  ${BLUE}README.md${NC}        - Project overview and getting started"
echo "  ${BLUE}CLAUDE.md${NC}        - Development guidelines"
echo "  ${BLUE}docs/${NC}            - Detailed documentation"
echo ""
echo "Next steps:"
echo "  1. Review and update .env.local if needed"
echo "  2. Run 'pnpm dev' to start the development server"
echo "  3. Open http://localhost:3000 in your browser"
echo ""
echo -e "${YELLOW}Note: If this is a new project, don't forget to:${NC}"
echo "  - Set up your remote repository: git remote add origin <your-repo-url>"
echo "  - Create your first commit: git add . && git commit -m 'chore: initial setup'"
echo ""
echo -e "${BLUE}Happy coding! 🚀${NC}"

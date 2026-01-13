#!/bin/bash

###############################################################################
# Hololog SEO Checker Script
# This script performs automated SEO audits using Lighthouse and provides recommendations.
###############################################################################

set -e

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

print_info() {
    echo -e "${BLUE}ℹ $1${NC}"
}

# Configuration
DEFAULT_URL="http://localhost:3000"
OUTPUT_DIR=".seo-reports"
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
OUTPUT_FILE="$OUTPUT_DIR/seo-report-$TIMESTAMP.json"
HTML_FILE="$OUTPUT_DIR/seo-report-$TIMESTAMP.html"

# Check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

###############################################################################
# Main SEO Check Process
###############################################################################

print_header "Hololog SEO Checker"

# Check if URL parameter is provided
URL=${1:-$DEFAULT_URL}

# Check if dev server is running
if [[ "$URL" == "http://localhost:3000" ]]; then
    print_step "Checking if development server is running..."
    if curl -s --head "$URL" | head -n 1 | grep -q "HTTP/1.[01] [23].."; then
        print_success "Development server is running"
    else
        print_error "Development server is not running"
        echo "Please start the dev server first: yarn dev"
        echo "Or provide a different URL: bash scripts/seo-check.sh https://your-domain.com"
        exit 1
    fi
fi

# Check if Lighthouse is installed
print_step "Checking Lighthouse installation..."
if ! command_exists lighthouse; then
    print_error "Lighthouse is not installed"
    echo "Installing Lighthouse..."
    npm install -g lighthouse
    print_success "Lighthouse installed"
else
    print_success "Lighthouse is already installed"
fi

# Create output directory
print_step "Creating output directory..."
mkdir -p "$OUTPUT_DIR"
print_success "Output directory created: $OUTPUT_DIR"

# Run Lighthouse with SEO focus
print_step "Running Lighthouse SEO audit for: $URL"
print_info "This may take a minute..."

lighthouse "$URL" \
    --only-categories=seo \
    --output=json \
    --output=html \
    --output-path="$OUTPUT_FILE" \
    --chrome-flags="--headless" \
    --quiet

print_success "Lighthouse audit completed"

# Parse and display results
print_step "Analyzing SEO results..."

if [[ -f "$OUTPUT_FILE" ]]; then
    # Extract scores using jq
    if command_exists jq; then
        SEO_SCORE=$(jq -r '.categories.seo.score * 100' "$OUTPUT_FILE")
        echo ""
        print_header "SEO Score: ${SEO_SCORE}%"

        # Display score with color
        if (( $(echo "$SEO_SCORE >= 90" | bc -l) )); then
            print_success "Excellent SEO score!"
        elif (( $(echo "$SEO_SCORE >= 70" | bc -l) )); then
            print_warning "Good SEO score, but there's room for improvement"
        else
            print_error "SEO score needs improvement"
        fi

        # Extract and display audit results
        echo ""
        print_step "Detailed SEO Audit Results"

        # Get failed audits
        FAILED_AUDITS=$(jq -r '.categories.seo.auditRefs[] | select(.score != 1) | .id' "$OUTPUT_FILE")

        if [[ -n "$FAILED_AUDITS" ]]; then
            print_warning "Items that need attention:"
            echo ""

            # Get details for failed audits
            jq -r '.audits as $audits | .categories.seo.auditRefs[] | select(.score != 1) | .id as $id | $audits[$id] | "\(.title)\n  Score: \(.score)\n  Description: \(.description)\n"' "$OUTPUT_FILE" | while read -r line; do
                if [[ "$line" =~ ^Score: ]]; then
                    if [[ "$line" == *"1"* ]]; then
                        echo -e "  ${GREEN}$line${NC}"
                    else
                        echo -e "  ${RED}$line${NC}"
                    fi
                else
                    echo "$line"
                fi
            done
        else
            print_success "All SEO audits passed! 🎉"
        fi

        # Get passed audits
        PASSED_COUNT=$(jq -r '[.categories.seo.auditRefs[] | select(.score == 1)] | length' "$OUTPUT_FILE")
        TOTAL_COUNT=$(jq -r '.categories.seo.auditRefs | length' "$OUTPUT_FILE")
        echo ""
        print_info "Passed: $PASSED_COUNT/$TOTAL_COUNT audits"

    else
        print_warning "jq is not installed. Install jq for better output formatting:"
        echo "  brew install jq  # macOS"
        echo "  apt-get install jq  # Ubuntu/Debian"
        echo ""
        print_info "Raw results saved to: $OUTPUT_FILE"
    fi

    # Display recommendations
    echo ""
    print_step "SEO Recommendations"

    cat << 'EOF'

📋 Common SEO Improvements:

1. META DESCRIPTIONS
   - Ensure all pages have unique meta descriptions
   - Keep descriptions between 150-160 characters
   - Include relevant keywords naturally

2. TITLE TAGS
   - Use unique titles for each page
   - Keep titles under 60 characters
   - Put important keywords first

3. HEADING STRUCTURE
   - Use only one <h1> tag per page
   - Maintain proper heading hierarchy (h1 → h2 → h3)
   - Include keywords in headings

4. IMAGE OPTIMIZATION
   - Use descriptive alt text for all images
   - Optimize image file sizes
   - Use next/image for automatic optimization

5. STRUCTURED DATA
   - Implement JSON-LD structured data
   - Use Schema.org markup for rich results
   - Validate with Google's Rich Results Test

6. MOBILE OPTIMIZATION
   - Ensure responsive design
   - Use readable font sizes (16px+)
   - Provide adequate touch targets (48x48px min)

7. PAGE SPEED
   - Minimize CSS/JS
   - Use code splitting
   - Implement lazy loading for images

8. INTERNAL LINKING
   - Create a logical site structure
   - Use descriptive anchor text
   - Link to related content

9. CONTENT QUALITY
   - Publish original, valuable content
   - Update old content regularly
   - Use semantic HTML

10. TECHNICAL SEO
    - Submit sitemap to Google Search Console
    - Use canonical URLs
    - Implement proper redirects
    - Monitor crawl errors

EOF

fi

# Display output file locations
echo ""
print_step "Report Files"
echo "JSON Report: $OUTPUT_FILE"
echo "HTML Report: ${OUTPUT_FILE%.json}.html"
echo ""
print_info "Open the HTML report in your browser for detailed results:"
echo "  open ${HTML_FILE}"
echo ""

# Check if we should open the report automatically
read -p "Would you like to open the HTML report now? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    if [[ "$OSTYPE" == "darwin"* ]]; then
        open "$HTML_FILE"
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        xdg-open "$HTML_FILE"
    else
        print_warning "Cannot open browser automatically. Please open the file manually."
    fi
fi

print_header "SEO Check Complete!"
echo ""
echo "Next steps:"
echo "  1. Review the HTML report for detailed analysis"
echo "  2. Fix critical SEO issues identified"
echo "  3. Run this script regularly to track improvements"
echo "  4. Submit sitemap to Google Search Console"
echo "    URL: ${URL}/sitemap.xml"
echo ""
echo -e "${GREEN}Good luck with your SEO! 🚀${NC}"

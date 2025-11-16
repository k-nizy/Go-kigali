# Test Report API Script
# This script tests if the backend API is working correctly

Write-Host " Testing KigaliGo Report API..." -ForegroundColor Cyan
Write-Host ""

# Test 1: Health Check
Write-Host "Test 1: Health Check" -ForegroundColor Yellow
try {
    $health = Invoke-WebRequest -Uri "http://localhost:5000/health" -Method GET -ErrorAction Stop
    if ($health.StatusCode -eq 200) {
        Write-Host " Backend is running!" -ForegroundColor Green
        Write-Host "   Response: $($health.Content)" -ForegroundColor Gray
    }
} catch {
    Write-Host " Backend is NOT running!" -ForegroundColor Red
    Write-Host "   Error: $_" -ForegroundColor Red
    Write-Host ""
    Write-Host " Start the backend with:" -ForegroundColor Yellow
    Write-Host "   cd backend" -ForegroundColor White
    Write-Host "   python simple_app.py" -ForegroundColor White
    exit 1
}

Write-Host ""

# Test 2: Submit Report
Write-Host "Test 2: Submit Report" -ForegroundColor Yellow
$reportData = @{
    type = "overcharge"
    title = "Test Report"
    description = "This is a test report from PowerShell script"
    location = "Nyabugogo"
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "http://localhost:5000/api/v1/reports" `
        -Method POST `
        -ContentType "application/json" `
        -Body $reportData `
        -ErrorAction Stop
    
    if ($response.StatusCode -eq 201) {
        Write-Host " Report submitted successfully!" -ForegroundColor Green
        Write-Host "   Status Code: $($response.StatusCode)" -ForegroundColor Gray
        Write-Host "   Response: $($response.Content)" -ForegroundColor Gray
    }
} catch {
    Write-Host " Failed to submit report!" -ForegroundColor Red
    Write-Host "   Error: $_" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host " All tests passed! The API is working correctly." -ForegroundColor Green
Write-Host ""
Write-Host "Now try submitting a report from the web interface:" -ForegroundColor Cyan
Write-Host "   http://localhost:3000/reports" -ForegroundColor White

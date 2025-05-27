# Get the project root directory (parent of scripts directory)
$projectRoot = Split-Path -Parent $PSScriptRoot

# Create a directory for k6 if it doesn't exist
$k6Dir = [System.IO.Path]::Combine($projectRoot, "tools", "k6")
if (-not (Test-Path $k6Dir)) {
    New-Item -ItemType Directory -Path $k6Dir -Force | Out-Null
    Write-Host "Created directory: $k6Dir"
}

# Download k6
$k6Version = "v0.46.0"
$k6Url = "https://github.com/grafana/k6/releases/download/$k6Version/k6-$k6Version-windows-amd64.zip"
$zipPath = [System.IO.Path]::Combine($k6Dir, "k6.zip")
$extractPath = [System.IO.Path]::Combine($k6Dir, "k6-$k6Version-windows-amd64")

# Only download and extract if not already present
if (-not (Test-Path $extractPath)) {
    Write-Host "Downloading k6 $k6Version..."
    try {
        Invoke-WebRequest -Uri $k6Url -OutFile $zipPath -ErrorAction Stop
        Write-Host "Download completed successfully"
    }
    catch {
        Write-Error "Failed to download k6: $_"
        exit 1
    }

    # Extract k6
    Write-Host "Extracting k6..."
    try {
        Expand-Archive -Path $zipPath -DestinationPath $k6Dir -Force -ErrorAction Stop
        Write-Host "Extraction completed successfully"
    }
    catch {
        Write-Error "Failed to extract k6: $_"
        exit 1
    }

    # Clean up zip file
    Remove-Item $zipPath -Force
}
else {
    Write-Host "k6 $k6Version is already installed at: $extractPath"
}

# Verify k6 executable exists
$k6Exe = [System.IO.Path]::Combine($extractPath, "k6.exe")
if (-not (Test-Path $k6Exe)) {
    Write-Error "k6 executable not found at: $k6Exe"
    exit 1
}

Write-Host "k6 $k6Version is ready to use at: $k6Exe" 
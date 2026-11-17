Add-Type -AssemblyName System.Drawing

function Draw-ApexIcon($size, $outputPath, $isMaskable = $false) {
    $bmp = New-Object System.Drawing.Bitmap($size, $size)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAlias

    # Background
    $bgColor = [System.Drawing.Color]::FromArgb(13, 15, 18) # #0D0F12
    $bgBrush = New-Object System.Drawing.SolidBrush($bgColor)
    $g.FillRectangle($bgBrush, 0, 0, $size, $size)

    # Scale factors
    $scale = $size / 512.0
    $padding = if ($isMaskable) { 64.0 * $scale } else { 32.0 * $scale }
    $innerSize = $size - (2 * $padding)

    # Inner Card with rounded look
    $cardColor = [System.Drawing.Color]::FromArgb(28, 32, 40) # #1C2028
    $cardBrush = New-Object System.Drawing.SolidBrush($cardColor)
    $cardPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(60, 212, 255, 0), (2 * $scale))
    
    $corner = 36 * $scale
    $rect = New-Object System.Drawing.RectangleF($padding, $padding, $innerSize, $innerSize)
    $g.FillEllipse($cardBrush, $rect)
    $g.DrawEllipse($cardPen, $rect)

    # Draw Electric Lime Dumbbell (#D4FF00)
    $limeColor = [System.Drawing.Color]::FromArgb(212, 255, 0)
    $limeBrush = New-Object System.Drawing.SolidBrush($limeColor)
    $limePen = New-Object System.Drawing.Pen($limeColor, (18 * $scale))
    $limePen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
    $limePen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round

    # Center coordinates
    $cx = $size / 2.0
    $cy = ($size / 2.0) - (10 * $scale)

    # Connecting Bar
    $g.DrawLine($limePen, ($cx - (50 * $scale)), $cy, ($cx + (50 * $scale)), $cy)

    # Left Inner Plate
    $g.FillRectangle($limeBrush, ($cx - (65 * $scale)), ($cy - (40 * $scale)), (15 * $scale), (80 * $scale))
    # Left Outer Plate
    $g.FillRectangle($limeBrush, ($cx - (85 * $scale)), ($cy - (30 * $scale)), (14 * $scale), (60 * $scale))

    # Right Inner Plate
    $g.FillRectangle($limeBrush, ($cx + (50 * $scale)), ($cy - (40 * $scale)), (15 * $scale), (80 * $scale))
    # Right Outer Plate
    $g.FillRectangle($limeBrush, ($cx + (71 * $scale)), ($cy - (30 * $scale)), (14 * $scale), (60 * $scale))

    # Center Logo Text "APEX"
    if ($size -ge 128) {
        $font = New-Object System.Drawing.Font("Arial", (28 * $scale), [System.Drawing.FontStyle]::Bold)
        $textBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
        $format = New-Object System.Drawing.StringFormat
        $format.Alignment = [System.Drawing.StringAlignment]::Center
        $format.LineAlignment = [System.Drawing.StringAlignment]::Center
        $g.DrawString("APEX", $font, $textBrush, $cx, ($cy + (85 * $scale)), $format)
    }

    # Save
    $dir = [System.IO.Path]::GetDirectoryName($outputPath)
    if (-not (Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
    }
    $bmp.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $g.Dispose()
    $bmp.Dispose()
    Write-Host "Created $outputPath ($size x $size)"
}

function Draw-PlayStoreFeatureBanner($width, $height, $outputPath) {
    $bmp = New-Object System.Drawing.Bitmap($width, $height)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAlias

    # Background gradient
    $rect = New-Object System.Drawing.Rectangle(0, 0, $width, $height)
    $brush = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
        $rect,
        [System.Drawing.Color]::FromArgb(21, 24, 30),
        [System.Drawing.Color]::FromArgb(10, 12, 15),
        45.0
    )
    $g.FillRectangle($brush, $rect)

    # Accent glow line
    $limePen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(212, 255, 0), 4)
    $g.DrawLine($limePen, 80, 100, 240, 100)

    # Brand Title
    $titleFont = New-Object System.Drawing.Font("Arial", 52, [System.Drawing.FontStyle]::Bold)
    $titleBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
    $g.DrawString("APEX", $titleFont, $titleBrush, 80, 120)

    # Subtitle Pill
    $subFont = New-Object System.Drawing.Font("Arial", 18, [System.Drawing.FontStyle]::Bold)
    $limeBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(212, 255, 0))
    $g.DrawString("MINIMALIST WORKOUT OS", $subFont, $limeBrush, 80, 205)

    # Tagline
    $descFont = New-Object System.Drawing.Font("Arial", 20, [System.Drawing.FontStyle]::Regular)
    $grayBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(180, 185, 195))
    $g.DrawString("Track your workout in seconds, not minutes.", $descFont, $grayBrush, 80, 255)

    # Feature checklist pills
    $pillFont = New-Object System.Drawing.Font("Arial", 14, [System.Drawing.FontStyle]::Bold)
    $pillBg = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(35, 40, 50))
    $g.FillRectangle($pillBg, 80, 330, 220, 44)
    $g.DrawString("⚡ 1-3 Taps Logging", $pillFont, $titleBrush, 95, 342)

    $g.FillRectangle($pillBg, 320, 330, 220, 44)
    $g.DrawString("⏱️ Smart Rest Timer", $pillFont, $titleBrush, 335, 342)

    $g.FillRectangle($pillBg, 560, 330, 220, 44)
    $g.DrawString("📈 Strength & 1RM PRs", $pillFont, $titleBrush, 575, 342)

    # Right side decorative emblem
    $cx = 860
    $cy = 250
    $g.FillEllipse($pillBg, ($cx - 90), ($cy - 90), 180, 180)
    $emblemPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(212, 255, 0), 16)
    $emblemPen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
    $emblemPen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
    $g.DrawLine($emblemPen, ($cx - 45), $cy, ($cx + 45), $cy)
    $g.FillRectangle($limeBrush, ($cx - 60), ($cy - 35), 14, 70)
    $g.FillRectangle($limeBrush, ($cx + 46), ($cy - 35), 14, 70)

    $bmp.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $g.Dispose()
    $bmp.Dispose()
    Write-Host "Created $outputPath ($width x $height)"
}

$baseDir = "C:\Users\MIST\.gemini\antigravity\scratch\apex-workout-tracker"

# PWA & Web Icons
Draw-ApexIcon 512 "$baseDir\public\icon-512.png" $false
Draw-ApexIcon 512 "$baseDir\public\icon-maskable-512.png" $true
Draw-ApexIcon 192 "$baseDir\public\icon-192.png" $false

# Play Store Feature Graphic Banner (1024x500 mandatory for store listing)
Draw-PlayStoreFeatureBanner 1024 500 "$baseDir\public\feature-graphic-1024x500.png"
Draw-PlayStoreFeatureBanner 1024 500 "$baseDir\playstore-assets\feature-graphic-1024x500.png"

# Play Store Hi-Res Icon (512x512 mandatory for store listing)
Draw-ApexIcon 512 "$baseDir\playstore-assets\playstore-icon-512.png" $false

# Android Native Mipmap Icons
$resDir = "$baseDir\android\app\src\main\res"
Draw-ApexIcon 48 "$resDir\mipmap-mdpi\ic_launcher.png" $false
Draw-ApexIcon 48 "$resDir\mipmap-mdpi\ic_launcher_round.png" $true

Draw-ApexIcon 72 "$resDir\mipmap-hdpi\ic_launcher.png" $false
Draw-ApexIcon 72 "$resDir\mipmap-hdpi\ic_launcher_round.png" $true

Draw-ApexIcon 96 "$resDir\mipmap-xhdpi\ic_launcher.png" $false
Draw-ApexIcon 96 "$resDir\mipmap-xhdpi\ic_launcher_round.png" $true

Draw-ApexIcon 144 "$resDir\mipmap-xxhdpi\ic_launcher.png" $false
Draw-ApexIcon 144 "$resDir\mipmap-xxhdpi\ic_launcher_round.png" $true

Draw-ApexIcon 192 "$resDir\mipmap-xxxhdpi\ic_launcher.png" $false
Draw-ApexIcon 192 "$resDir\mipmap-xxxhdpi\ic_launcher_round.png" $true

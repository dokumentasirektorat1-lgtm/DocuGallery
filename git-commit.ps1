# Git Commit Script for DisplayDokumentasi

# AUTOMATED COMMIT SCRIPT
# This script adds all changes and commits with a descriptive message

Write-Host "🔄 Starting git commit process..." -ForegroundColor Cyan

# Add all changes
Write-Host "📦 Adding all changes..." -ForegroundColor Yellow
git add .

# Show status
Write-Host "`n📊 Git Status:" -ForegroundColor Yellow
git status --short

# Commit with message
$commitMessage = "feat: Add pagination, footer customization, and security improvements

- Add pagination to main gallery page with customizable items per page (10, 20, 50, 100, All)
- Implement editable footer text via admin settings
- Secure Firebase and Google Drive API credentials with environment variables
- Add auto-thumbnail feature with best visual picker (keyword, resolution, file size) 
- Fix Next.js image hostname configuration for external domains
- Add formatFaviconUrl to convert Drive preview links for favicons
- Update DynamicHead with real-time favicon and title updates
- Create comprehensive documentation (README, guides)
- Remove 'Powered by Next.js' from footer

Security:
- Move all API keys and Firebase config to environment variables
- Add .env.example template for deployment
- Update .gitignore to exclude .env.local

Ready for Vercel deployment with all sensitive data protected."

Write-Host "`n💬 Commit message:" -ForegroundColor Yellow
Write-Host $commitMessage -ForegroundColor Gray

git commit -m $commitMessage

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ Commit successful!" -ForegroundColor Green
    Write-Host "`n📤 To push to GitHub, run:" -ForegroundColor Cyan
    Write-Host "git push origin main" -ForegroundColor White
} else {
    Write-Host "`n❌ Commit failed! Error code: $LASTEXITCODE" -ForegroundColor Red
}

Write-Host "`n📋 Next steps:" -ForegroundColor Cyan
Write-Host "1. Push to GitHub: git push origin main" -ForegroundColor White
Write-Host "2. Deploy to Vercel: vercel --prod" -ForegroundColor White
Write-Host "3. Add environment variables in Vercel dashboard" -ForegroundColor White

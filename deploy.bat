@echo off
echo ========================================
echo Mama's Dumplings - Deployment Helper
echo ========================================
echo.

echo Step 1: Initializing Git repository...
git init
echo.

echo Step 2: Adding all files to Git...
git add .
echo.

echo Step 3: Making initial commit...
git commit -m "Initial commit - Mama's Dumplings website"
echo.

echo Step 4: Setting main branch...
git branch -M main
echo.

echo ========================================
echo ✅ Git repository initialized!
echo.
echo Next steps:
echo 1. Create a GitHub repository at github.com
echo 2. Run: git remote add origin YOUR_GITHUB_URL
echo 3. Run: git push -u origin main
echo 4. Deploy to Render.com or Heroku
echo.
echo See DEPLOYMENT.md for detailed instructions!
echo ========================================
pause 
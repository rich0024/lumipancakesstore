#!/bin/bash

# Lumi Pancakes Store Deployment Script
echo "🚀 Starting deployment process..."

# Check if git is clean
if [ -n "$(git status --porcelain)" ]; then
    echo "❌ Git working directory is not clean. Please commit or stash your changes first."
    exit 1
fi

# Push to GitHub
echo "📤 Pushing to GitHub..."
git push origin main

echo "✅ Code pushed to GitHub successfully!"
echo ""
echo "🔧 Next steps:"
echo "1. Deploy backend to Railway:"
echo "   - Go to https://railway.app"
echo "   - Create new project from GitHub repo"
echo "   - Select 'backend' folder as root directory"
echo "   - Set environment variables from backend/env.production"
echo ""
echo "2. Deploy frontend to Vercel:"
echo "   - Go to https://vercel.com"
echo "   - Import GitHub repository"
echo "   - Set root directory to 'frontend'"
echo "   - Set environment variables from frontend/env.production"
echo ""
echo "3. Update Google OAuth settings with production URLs"
echo ""
echo "📖 See DEPLOYMENT.md for detailed instructions"
echo "🎉 Happy deploying!"

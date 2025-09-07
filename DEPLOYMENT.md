# 🚀 Deployment Guide - Lumi Pancakes Store

This guide will help you deploy your Lumi Pancakes Store application using Vercel (frontend) + Railway (backend).

## 📋 Prerequisites

- GitHub account
- Vercel account (free)
- Railway account (free)
- Google OAuth credentials set up

## 🎯 Deployment Steps

### 1. Prepare Your Repository

1. Push your code to GitHub:
   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

### 2. Deploy Backend to Railway

1. Go to [Railway.app](https://railway.app) and sign in with GitHub
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Choose the `backend` folder as the root directory
5. Railway will automatically detect it's a Node.js app

#### Environment Variables for Railway:
Set these in Railway dashboard → Variables tab:
```
NODE_ENV=production
PORT=3001
FRONTEND_URL=https://your-app-name.vercel.app
JWT_SECRET=your-super-secure-jwt-secret
SESSION_SECRET=your-super-secure-session-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=https://your-railway-app.railway.app/auth/google/callback
```

### 3. Deploy Frontend to Vercel

1. Go to [Vercel.com](https://vercel.com) and sign in with GitHub
2. Click "New Project" → Import your repository
3. Set the root directory to `frontend`
4. Vercel will auto-detect Next.js

#### Environment Variables for Vercel:
Set these in Vercel dashboard → Settings → Environment Variables:
```
API_URL=https://your-railway-app.railway.app
FRONTEND_URL=https://your-app-name.vercel.app
NODE_ENV=production
```

### 4. Update Google OAuth Settings

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Navigate to APIs & Services → Credentials
3. Update your OAuth 2.0 client:
   - **Authorized JavaScript origins**: Add your Vercel domain
   - **Authorized redirect URIs**: Add your Railway callback URL

### 5. Test Your Deployment

1. Visit your Vercel frontend URL
2. Test the API health check: `https://your-railway-app.railway.app/api/health`
3. Test user authentication
4. Test admin functionality

## 🔧 Configuration Files

### Backend (Railway)
- `railway.json` - Railway deployment configuration
- `env.production` - Production environment template

### Frontend (Vercel)
- `vercel.json` - Vercel deployment configuration
- `next.config.js` - Next.js configuration with security headers

## 🛠️ Troubleshooting

### Common Issues:

1. **CORS Errors**
   - Ensure `FRONTEND_URL` in Railway matches your Vercel domain
   - Check that CORS configuration allows your domain

2. **Authentication Issues**
   - Verify Google OAuth callback URLs are correct
   - Check that session secrets are set properly

3. **File Upload Issues**
   - Currently using local storage (not recommended for production)
   - Consider migrating to cloud storage (AWS S3, Cloudinary)

4. **Database Issues**
   - Currently using JSON files (not recommended for production)
   - Consider migrating to PostgreSQL or MongoDB

## 📈 Production Recommendations

### Database Migration
Replace JSON files with a proper database:
- **PostgreSQL**: Use Railway's PostgreSQL addon
- **MongoDB**: Use MongoDB Atlas
- **Supabase**: Free PostgreSQL with real-time features

### File Storage
Replace local file uploads with cloud storage:
- **AWS S3**: Most popular option
- **Cloudinary**: Great for image optimization
- **Railway Volumes**: For persistent file storage

### Monitoring
- **Railway**: Built-in monitoring and logs
- **Vercel**: Built-in analytics and performance monitoring
- **Sentry**: Error tracking and performance monitoring

## 🔒 Security Checklist

- [ ] Generate secure JWT and session secrets
- [ ] Enable HTTPS (automatic with Vercel/Railway)
- [ ] Set up proper CORS configuration
- [ ] Configure Google OAuth for production domains
- [ ] Set up environment variable encryption
- [ ] Enable security headers
- [ ] Set up rate limiting (consider adding)
- [ ] Regular security updates

## 📞 Support

If you encounter issues:
1. Check Railway logs: Railway dashboard → Deployments → View logs
2. Check Vercel logs: Vercel dashboard → Functions → View logs
3. Check browser console for frontend errors
4. Verify environment variables are set correctly

## 🎉 Success!

Once deployed, your app will be available at:
- **Frontend**: `https://your-app-name.vercel.app`
- **Backend API**: `https://your-railway-app.railway.app`

Happy deploying! 🚀

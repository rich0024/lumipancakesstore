# 🌐 Custom Domain Setup Guide

This guide will help you configure your custom domain `lumipancakes.com` for your Lumi Pancakes Store.

## 📋 Prerequisites

- ✅ Custom domain: `lumipancakes.com`
- ✅ Vercel account (for frontend)
- ✅ Railway account (for backend)
- ✅ Cloudinary account (for images)

## 🎯 Domain Configuration

### **Frontend (lumipancakes.com)**
- **Platform:** Vercel
- **Domain:** `lumipancakes.com`
- **Subdomain:** `www.lumipancakes.com` (optional)

### **Backend API (api.lumipancakes.com)**
- **Platform:** Railway
- **Domain:** `api.lumipancakes.com`

## 🚀 Step 1: Configure Vercel Custom Domain

### 1.1 Add Domain to Vercel
1. Go to your Vercel dashboard
2. Click on your Lumi Pancakes Store project
3. Go to "Settings" → "Domains"
4. Click "Add Domain"
5. Enter: `lumipancakes.com`
6. Click "Add"

### 1.2 Configure DNS (if using external DNS)
Add these DNS records to your domain provider:

```
Type: A
Name: @
Value: 76.76.19.61

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

### 1.3 Update Environment Variables
In Vercel, add these environment variables:
```
NODE_ENV=production
API_URL=https://api.lumipancakes.com
FRONTEND_URL=https://lumipancakes.com
```

## 🔧 Step 2: Configure Railway Custom Domain

### 2.1 Add Domain to Railway
1. Go to your Railway project dashboard
2. Click on your backend service
3. Go to "Settings" → "Domains"
4. Click "Generate Domain"
5. Set custom domain: `api.lumipancakes.com`

### 2.2 Configure DNS
Add this DNS record to your domain provider:

```
Type: CNAME
Name: api
Value: [Railway provided CNAME]
```

### 2.3 Update Environment Variables
In Railway, update these environment variables:
```
FRONTEND_URL=https://lumipancakes.com
GOOGLE_CALLBACK_URL=https://api.lumipancakes.com/auth/google/callback
```

## 🖼️ Step 3: Upload Images to Cloudinary

### 3.1 Run Image Upload Script
```bash
cd backend
node scripts/upload-images.js
```

This will upload:
- ✅ Banner image
- ✅ Shop icon
- ✅ Placeholder image

### 3.2 Verify Images
Check that images are accessible at:
- Banner: `https://res.cloudinary.com/dx4biopst/image/upload/v1/lumipancakesstore/banner`
- Icon: `https://res.cloudinary.com/dx4biopst/image/upload/v1/lumipancakesstore/icon`

## 🔐 Step 4: Update Google OAuth

### 4.1 Google Cloud Console
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Navigate to "APIs & Services" → "Credentials"
3. Edit your OAuth 2.0 Client ID
4. Update "Authorized redirect URIs":
   ```
   https://api.lumipancakes.com/auth/google/callback
   ```
5. Update "Authorized JavaScript origins":
   ```
   https://lumipancakes.com
   https://www.lumipancakes.com
   ```

## ✅ Step 5: Test Your Setup

### 5.1 Test Frontend
- ✅ Visit: `https://lumipancakes.com`
- ✅ Check banner loads from Cloudinary
- ✅ Check shop icon loads from Cloudinary
- ✅ Test navigation and pages

### 5.2 Test Backend API
- ✅ Visit: `https://api.lumipancakes.com/api/health`
- ✅ Test image upload in admin panel
- ✅ Test Google OAuth login

### 5.3 Test Full Flow
- ✅ Login with Google OAuth
- ✅ Browse photocards and prints
- ✅ Add items to cart
- ✅ Place an order

## 🎯 Expected Results

After setup, your store will be accessible at:
- **Main Store:** `https://lumipancakes.com`
- **API:** `https://api.lumipancakes.com`
- **Images:** Served from Cloudinary CDN

## 🔧 Troubleshooting

### Domain Not Working
- Check DNS propagation (can take 24-48 hours)
- Verify DNS records are correct
- Check Vercel/Railway domain configuration

### Images Not Loading
- Verify Cloudinary upload completed
- Check image URLs in browser
- Verify Next.js image configuration

### OAuth Not Working
- Check Google OAuth redirect URIs
- Verify environment variables
- Check Railway logs for errors

## 🎉 Success!

Once everything is working:
- ✅ Professional custom domain
- ✅ Fast CDN image delivery
- ✅ Secure HTTPS everywhere
- ✅ Branded experience

Your Lumi Pancakes Store is now live at `lumipancakes.com`! 🚀

# 📊 Google Tag Manager Setup Guide

This guide will help you set up Google Tag Manager tracking for your Lumi Pancakes Store.

## 🚀 Quick Setup

### Step 1: Create Google Tag Manager Account

1. Go to [Google Tag Manager](https://tagmanager.google.com/)
2. Click "Create Account"
3. Create an account for your store
4. Set up a container for your website
5. Choose "Web" as your platform

### Step 2: Get Your Container ID

1. After creating your container, you'll see your **Container ID** (starts with `GTM-`)
2. Your Container ID is: **`GTM-PMWK3QFJ`** ✅ (Already configured!)

### Step 3: Add Container ID to Your App

#### Option A: Environment Variable (Recommended)

1. Create a `.env.local` file in your `frontend` directory:
```bash
# In frontend/.env.local
NEXT_PUBLIC_GTM_ID=GTM-PMWK3QFJ
```

#### Option B: Direct Configuration

The Container ID is already configured in:
- `frontend/src/app/layout.tsx` (line 24)
- `frontend/src/utils/analytics.ts` (line 3)

## 🎯 What's Being Tracked

Your Lumi Pancakes Store now tracks:

### 📄 **Page Views**
- Automatic tracking of all page visits
- Tracks navigation between pages
- Records page titles and URLs

### 🛒 **E-commerce Events**
- **View Item**: When users view photocard/print details
- **Add to Cart**: When items are added to cart
- **Remove from Cart**: When items are removed from cart
- **Purchase**: When orders are completed

### 📊 **Custom Events**
- User interactions with the store
- Cart modifications
- Navigation patterns

## 🔧 Files Modified

The following files have been updated to include Google Analytics:

### Core Tracking Files:
- `frontend/src/components/GoogleAnalytics.tsx` - Main GTM script loader
- `frontend/src/components/GTMNoScript.tsx` - GTM noscript fallback
- `frontend/src/components/PageTracker.tsx` - Page view tracking
- `frontend/src/utils/analytics.ts` - Analytics utility functions

### Updated Components:
- `frontend/src/app/layout.tsx` - Added GTM to main layout
- `frontend/src/components/Cart.tsx` - Purchase and remove tracking
- `frontend/src/components/MenuCard.tsx` - View and add to cart tracking
- `frontend/src/components/PrintCard.tsx` - View and add to cart tracking

## 🧪 Testing Your Setup

### 1. Check GTM Preview Mode
1. Go to your Google Tag Manager dashboard
2. Click **Preview** in the top right
3. Enter your website URL: `http://localhost:3000`
4. You should see the GTM preview window with your tags firing

### 2. Check Real-Time Reports (if GA is configured in GTM)
1. Go to your Google Analytics dashboard
2. Click **Reports** → **Realtime**
3. Visit your website at `http://localhost:3000`
4. You should see your visit appear in real-time

### 3. Test E-commerce Events
1. Add items to cart
2. Remove items from cart
3. Complete a purchase
4. Check **Events** in GTM preview mode or GA real-time reports

### 4. Verify Page Tracking
1. Navigate between different pages
2. Check that page views are recorded in GTM preview
3. Verify page titles and URLs are correct

## 🚀 Production Deployment

### For Vercel Deployment:
1. Add your environment variable in Vercel dashboard:
   - Go to your project settings
   - Add `NEXT_PUBLIC_GTM_ID` with your container ID: `GTM-PMWK3QFJ`

### For Other Platforms:
Make sure to set the `NEXT_PUBLIC_GTM_ID` environment variable in your deployment platform.

## 📈 Analytics Features Available

### Standard Reports:
- **Audience**: Who visits your store
- **Acquisition**: How users find your store
- **Behavior**: What users do on your store
- **Conversions**: Purchase tracking and goals

### E-commerce Reports:
- **Enhanced Ecommerce**: Detailed purchase tracking
- **Shopping Behavior**: Cart abandonment analysis
- **Product Performance**: Best-selling items
- **Sales Performance**: Revenue tracking

## 🔒 Privacy Considerations

- Google Analytics is GDPR compliant
- No personal data is collected by default
- Users can opt-out using browser extensions
- Consider adding a privacy policy

## 🆘 Troubleshooting

### Tracking Not Working?
1. Check your GTM container ID is correct (`GTM-PMWK3QFJ`)
2. Verify environment variable is set
3. Check browser console for errors
4. Use GTM preview mode to debug
5. Ensure ad blockers aren't blocking GTM

### No Data in Reports?
- Real-time data appears immediately
- Standard reports may take 24-48 hours
- Check your date range in reports

### Events Not Showing?
1. Verify the GTM code is loaded
2. Check browser network tab for GTM requests
3. Use GTM preview mode to see dataLayer events
4. Test in incognito mode (no extensions)

## 📞 Support

If you need help:
1. Check Google Tag Manager Help Center
2. Verify your container ID format (`GTM-XXXXXXX`)
3. Use GTM preview mode for debugging
4. Check browser developer tools for errors

## 🎉 Next Steps

Once Google Tag Manager is working:
1. Set up **Google Analytics** tags in GTM
2. Create **Custom Events** for your business
3. Set up **Triggers** for important actions
4. Add **Facebook Pixel** or other tracking codes through GTM

Your Lumi Pancakes Store is now ready to track customer behavior and optimize your business! 🥞📊

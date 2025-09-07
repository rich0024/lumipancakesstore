# Google OAuth Setup Guide

To enable Google OAuth authentication for the Lumi Pancakes Store, follow these steps:

## 1. Create Google OAuth Credentials

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google+ API" and enable it
4. Create OAuth 2.0 credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth 2.0 Client IDs"
   - Choose "Web application"
   - Add authorized redirect URIs:
     - `http://localhost:3001/auth/google/callback` (for development)
     - `https://yourdomain.com/auth/google/callback` (for production)

## 2. Configure Environment Variables

Create a `.env` file in the `backend` directory with your Google OAuth credentials:

```env
# Server Configuration
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production
SESSION_SECRET=your-session-secret-change-in-production

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id-here
GOOGLE_CLIENT_SECRET=your-google-client-secret-here
GOOGLE_CALLBACK_URL=http://localhost:3001/auth/google/callback
```

## 3. Create Admin User

After setting up OAuth, create an admin user by making a POST request to:

```bash
curl -X POST http://localhost:3001/auth/create-admin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "name": "Admin User",
    "password": "your-secure-password"
  }'
```

## 4. Test Authentication

1. Start the backend server: `npm run dev` (in backend directory)
2. Start the frontend: `npm run dev` (in frontend directory)
3. Visit `http://localhost:3000`
4. Click "Sign In" and test Google OAuth flow
5. Try accessing `/admin` - only admin users should be able to access it

## 5. Features Available

### For Regular Users:
- Sign in with Google OAuth
- Browse photocard collection
- Add items to cart
- Place orders (requires authentication)
- View order history in profile
- View user profile

### For Admin Users:
- All regular user features
- Access to admin panel (`/admin`)
- Add/edit/delete photocards
- Upload photocard images
- Manage inventory

## 6. Security Notes

- Change JWT_SECRET and SESSION_SECRET in production
- Use HTTPS in production
- Regularly rotate secrets
- Monitor authentication logs
- Consider implementing rate limiting

## 7. Troubleshooting

### Common Issues:

1. **"Invalid client" error**: Check that GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET are correct
2. **"Redirect URI mismatch"**: Ensure the callback URL in Google Console matches GOOGLE_CALLBACK_URL
3. **"Access denied" on admin routes**: Make sure the user has admin role in the database
4. **CORS errors**: Check that FRONTEND_URL is correctly set

### Debug Steps:

1. Check server logs for authentication errors
2. Verify environment variables are loaded correctly
3. Test OAuth flow step by step
4. Check database for user records

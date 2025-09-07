# Lumi Pancakes Store

A modern, full-stack pancake store application built with **Next.js** (frontend) and **Node.js** (backend API).

## 🥞 Features

- **Modern Frontend**: Built with Next.js 14, TypeScript, and Tailwind CSS
- **RESTful API**: Node.js/Express backend with proper error handling
- **Responsive Design**: Beautiful, mobile-first UI that works on all devices
- **Shopping Cart**: Add/remove items with real-time updates
- **Order Management**: Complete checkout flow with form validation
- **Type Safety**: Full TypeScript support throughout the application

## 🚀 Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **React Hooks** - State management and side effects

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **CORS** - Cross-origin resource sharing
- **Helmet** - Security middleware
- **Morgan** - HTTP request logger

## 📁 Project Structure

```
lumipancakesstore/
├── frontend/                 # Next.js frontend application
│   ├── src/
│   │   ├── app/             # Next.js App Router
│   │   ├── components/      # React components
│   │   ├── types/           # TypeScript type definitions
│   │   └── lib/             # Utility functions
│   ├── package.json
│   ├── next.config.js
│   ├── tailwind.config.js
│   └── tsconfig.json
├── backend/                  # Node.js backend API
│   ├── src/
│   │   ├── routes/          # API routes
│   │   ├── models/          # Data models
│   │   └── middleware/      # Custom middleware
│   ├── package.json
│   └── server.js
├── package.json              # Root package.json for scripts
└── README.md
```

## 🛠️ Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd lumipancakesstore
   ```

2. **Install all dependencies**
   ```bash
   npm run install:all
   ```
   
   This will install dependencies for:
   - Root project (concurrently for running both servers)
   - Frontend (Next.js, React, TypeScript, Tailwind CSS)
   - Backend (Express, CORS, Helmet, Morgan)

3. **Set up environment variables**
   ```bash
   cp env.example .env
   ```
   
   Edit the `.env` file if needed (defaults should work for development).

### Development

**Start both frontend and backend servers:**
```bash
npm run dev
```

This will start:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

**Or start them separately:**

Frontend only:
```bash
npm run dev:frontend
```

Backend only:
```bash
npm run dev:backend
```

### Production

**Build and start for production:**
```bash
npm run build
npm start
```

## 📱 Available Scripts

### Root Level
- `npm run dev` - Start both frontend and backend in development mode
- `npm run build` - Build the frontend application
- `npm start` - Start both frontend and backend in production mode
- `npm run install:all` - Install all dependencies

### Frontend (`/frontend`)
- `npm run dev` - Start Next.js development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

### Backend (`/backend`)
- `npm run dev` - Start with nodemon (auto-restart)
- `npm start` - Start production server
- `npm test` - Run tests

## 🎯 API Endpoints

### Health Check
- `GET /api/health` - Check API status

### Menu
- `GET /api/menu` - Get all menu items

### Orders
- `POST /api/orders` - Place a new order

## 🎨 UI Components

- **Header** - Navigation with cart indicator
- **MenuGrid** - Display all available pancakes
- **MenuCard** - Individual pancake item with add to cart
- **Cart** - Shopping cart with checkout functionality
- **CheckoutModal** - Order form with validation

## 🔧 Customization

### Adding New Pancake Items
Edit the menu array in `backend/server.js`:

```javascript
const menu = [
  {
    id: 7,
    name: 'Your New Pancake',
    description: 'Description here',
    price: 9.99,
    image: '/images/your-pancake.jpg',
    category: 'category',
    ingredients: ['ingredient1', 'ingredient2']
  }
];
```

### Styling
The app uses Tailwind CSS. Customize colors in `frontend/tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        // Your custom primary colors
      }
    }
  }
}
```

## 🚀 Deployment

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Set build command: `cd frontend && npm run build`
3. Set output directory: `frontend/.next`

### Backend (Railway, Heroku, etc.)
1. Set environment variables
2. Deploy the `backend` folder
3. Update `API_URL` in frontend environment

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Troubleshooting

### Node.js not found
If you get "command not found: node" or "command not found: npm":
1. Install Node.js from [nodejs.org](https://nodejs.org/)
2. Restart your terminal
3. Verify with `node --version` and `npm --version`

### Port already in use
If ports 3000 or 3001 are in use:
1. Kill the processes using those ports
2. Or change the ports in your `.env` file

### CORS errors
Make sure the `FRONTEND_URL` in your backend `.env` matches your frontend URL.

---

**Happy coding! 🥞✨**
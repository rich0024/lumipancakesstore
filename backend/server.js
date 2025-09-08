const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const session = require('express-session');
require('dotenv').config();

const database = require('./src/database');
const printsDatabase = require('./src/database-prints');
const passport = require('./src/config/passport');
const { authenticateToken, requireAdmin } = require('./src/middleware/auth');

const app = express();
const PORT = process.env.PORT || 3001;

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Use a local uploads directory in production
    const uploadDir = process.env.NODE_ENV === 'production' 
      ? path.join(__dirname, 'uploads')
      : path.join(__dirname, '../frontend/public/images/uploads');
    
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Middleware
app.use(helmet({
  contentSecurityPolicy: false, // Disable CSP for development
  crossOriginEmbedderPolicy: false
}));

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      process.env.FRONTEND_URL || 'http://localhost:3000',
      'http://localhost:3000',
      'https://localhost:3000'
    ];
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

app.use(cors(corsOptions));
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-session-secret-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Serve uploaded files in production
if (process.env.NODE_ENV === 'production') {
  app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
}

// Routes
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Lumi❤️Pancakes Photocard Store API is running!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    version: '1.0.0'
  });
});

// Root endpoint for Railway health checks
app.get('/', (req, res) => {
  res.json({ 
    message: 'Lumi❤️Pancakes Photocard Store API',
    status: 'running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    version: '1.0.0'
  });
});

// Simple health check for Railway
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK',
    timestamp: new Date().toISOString()
  });
});

// Upload image endpoint
app.post('/api/upload', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }
    
    // Use different paths for production vs development
    const imageUrl = process.env.NODE_ENV === 'production' 
      ? `/uploads/${req.file.filename}`
      : `/images/uploads/${req.file.filename}`;
    
    res.json({ url: imageUrl });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

// Get all photocards with optional sorting and filtering
app.get('/api/menu', (req, res) => {
  try {
    const { sortBy, sortOrder, group, rarity, age } = req.query;
    const photocards = database.getPhotocards({
      sortBy,
      sortOrder,
      group,
      rarity,
      age
    });
    
    // Filter out items with 0 quantity
    const availablePhotocards = photocards.filter(card => card.quantity > 0);
    
    res.json(availablePhotocards);
  } catch (error) {
    console.error('Error fetching menu:', error);
    res.status(500).json({ error: 'Failed to fetch menu' });
  }
});

// Get single photocard by ID
app.get('/api/photocards/:id', (req, res) => {
  try {
    const { id } = req.params;
    const photocard = database.getPhotocardById(id);
    
    if (!photocard) {
      return res.status(404).json({ error: 'Photocard not found' });
    }
    
    res.json(photocard);
  } catch (error) {
    console.error('Error fetching photocard:', error);
    res.status(500).json({ error: 'Failed to fetch photocard' });
  }
});

// Import route modules
const authRoutes = require('./src/routes/auth');
const orderRoutes = require('./src/routes/orders');

// Use route modules
app.use('/auth', authRoutes);
app.use('/api/orders', orderRoutes);

// Prints API routes
// Get all prints with optional sorting and filtering
app.get('/api/prints', (req, res) => {
  try {
    const { sortBy, sortOrder, search, minPrice, maxPrice } = req.query;
    const prints = printsDatabase.getPrints({
      sortBy,
      sortOrder,
      search,
      minPrice: minPrice ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined
    });
    
    // Filter out items with 0 quantity
    const availablePrints = prints.filter(print => print.quantity > 0);
    
    res.json(availablePrints);
  } catch (error) {
    console.error('Error fetching prints:', error);
    res.status(500).json({ error: 'Failed to fetch prints' });
  }
});

// Get single print by ID
app.get('/api/prints/:id', (req, res) => {
  try {
    const { id } = req.params;
    const print = printsDatabase.getPrintById(id);
    
    if (!print) {
      return res.status(404).json({ error: 'Print not found' });
    }
    
    res.json(print);
  } catch (error) {
    console.error('Error fetching print:', error);
    res.status(500).json({ error: 'Failed to fetch print' });
  }
});

// Admin routes (protected)
// Get all photocards for admin (with additional fields)
app.get('/api/admin/photocards', authenticateToken, requireAdmin, (req, res) => {
  try {
    const photocards = database.getAllPhotocards();
    res.json(photocards);
  } catch (error) {
    console.error('Error fetching admin photocards:', error);
    res.status(500).json({ error: 'Failed to fetch photocards' });
  }
});

// Create new photocard
app.post('/api/admin/photocards', authenticateToken, requireAdmin, (req, res) => {
  try {
    const { name, description, price, image, group, member, album, set, age, rarity, category } = req.body;
    
    // Validate required fields
    if (!name || !price || !group || !member || !album) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const newCard = database.addPhotocard({
      name,
      description: description || '',
      price: parseFloat(price),
      image: image || '/images/default-photocard.jpg',
      group,
      member,
      album,
      set: set || '',
      age: age || '',
      rarity: rarity || 'Album',
      category: category || group.toLowerCase()
    });
    
    res.status(201).json(newCard);
  } catch (error) {
    console.error('Error creating photocard:', error);
    res.status(500).json({ error: 'Failed to create photocard' });
  }
});

// Update photocard
app.put('/api/admin/photocards/:id', authenticateToken, requireAdmin, (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    // Convert price to number if provided
    if (updateData.price) {
      updateData.price = parseFloat(updateData.price);
    }
    
    const updatedCard = database.updatePhotocard(id, updateData);
    
    if (!updatedCard) {
      return res.status(404).json({ error: 'Photocard not found' });
    }
    
    res.json(updatedCard);
  } catch (error) {
    console.error('Error updating photocard:', error);
    res.status(500).json({ error: 'Failed to update photocard' });
  }
});

// Delete photocard
app.delete('/api/admin/photocards/:id', authenticateToken, requireAdmin, (req, res) => {
  try {
    const { id } = req.params;
    const deleted = database.deletePhotocard(id);
    
    if (!deleted) {
      return res.status(404).json({ error: 'Photocard not found' });
    }
    
    res.json({ message: 'Photocard deleted successfully' });
  } catch (error) {
    console.error('Error deleting photocard:', error);
    res.status(500).json({ error: 'Failed to delete photocard' });
  }
});

// Admin prints routes
// Get all prints for admin
app.get('/api/admin/prints', authenticateToken, requireAdmin, (req, res) => {
  try {
    const prints = printsDatabase.getAllPrints();
    res.json(prints);
  } catch (error) {
    console.error('Error fetching admin prints:', error);
    res.status(500).json({ error: 'Failed to fetch prints' });
  }
});

// Create new print
app.post('/api/admin/prints', authenticateToken, requireAdmin, (req, res) => {
  try {
    const { name, description, price, image, quantity } = req.body;
    
    // Validate required fields
    if (!name || !price) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const newPrint = printsDatabase.addPrint({
      name,
      description: description || '',
      price: parseFloat(price),
      image: image || '/images/default-print.jpg',
      quantity: parseInt(quantity) || 1
    });
    
    res.status(201).json(newPrint);
  } catch (error) {
    console.error('Error creating print:', error);
    res.status(500).json({ error: 'Failed to create print' });
  }
});

// Update print
app.put('/api/admin/prints/:id', authenticateToken, requireAdmin, (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, image, quantity } = req.body;
    
    const updatedPrint = printsDatabase.updatePrint(id, {
      name,
      description,
      price: price ? parseFloat(price) : undefined,
      image,
      quantity: quantity ? parseInt(quantity) : undefined
    });
    
    if (!updatedPrint) {
      return res.status(404).json({ error: 'Print not found' });
    }
    
    res.json(updatedPrint);
  } catch (error) {
    console.error('Error updating print:', error);
    res.status(500).json({ error: 'Failed to update print' });
  }
});

// Delete print
app.delete('/api/admin/prints/:id', authenticateToken, requireAdmin, (req, res) => {
  try {
    const { id } = req.params;
    const deleted = printsDatabase.deletePrint(id);
    
    if (!deleted) {
      return res.status(404).json({ error: 'Print not found' });
    }
    
    res.json({ message: 'Print deleted successfully' });
  } catch (error) {
    console.error('Error deleting print:', error);
    res.status(500).json({ error: 'Failed to delete print' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`📸 Lumi❤️Pancakes Photocard Store API server is running on port ${PORT}`);
  console.log(`🌐 API URL: http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔧 Environment: ${process.env.NODE_ENV}`);
  console.log(`🌍 Listening on all interfaces (0.0.0.0:${PORT})`);
});

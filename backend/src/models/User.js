const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const database = require('../database');
const printsDatabase = require('../database-prints');

const USERS_FILE = path.join(__dirname, '../../data/users.json');
const ORDERS_FILE = path.join(__dirname, '../../data/orders.json');

// Initialize users database
const initializeUsers = () => {
  if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, JSON.stringify([], null, 2));
  }
  if (!fs.existsSync(ORDERS_FILE)) {
    fs.writeFileSync(ORDERS_FILE, JSON.stringify([], null, 2));
  }
};

// Load users from database
const loadUsers = () => {
  try {
    const data = fs.readFileSync(USERS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading users:', error);
    return [];
  }
};

// Save users to database
const saveUsers = (users) => {
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
    return true;
  } catch (error) {
    console.error('Error saving users:', error);
    return false;
  }
};

// Load orders from database
const loadOrders = () => {
  try {
    const data = fs.readFileSync(ORDERS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading orders:', error);
    return [];
  }
};

// Save orders to database
const saveOrders = (orders) => {
  try {
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2));
    return true;
  } catch (error) {
    console.error('Error saving orders:', error);
    return false;
  }
};

// User operations
const createUser = async (userData) => {
  const users = loadUsers();
  const { email, name, googleId, password, role = 'user' } = userData;
  
  // Check if user already exists
  const existingUser = users.find(user => user.email === email || user.googleId === googleId);
  if (existingUser) {
    return { success: false, error: 'User already exists' };
  }

  const newUser = {
    id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
    email,
    name,
    googleId: googleId || null,
    password: password || null, // Store hashed password
    role,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  users.push(newUser);
  const saved = saveUsers(users);
  
  if (saved) {
    // Remove password from returned user object
    const { password: _, ...userWithoutPassword } = newUser;
    return { success: true, user: userWithoutPassword };
  } else {
    return { success: false, error: 'Failed to save user' };
  }
};

const findUserByEmail = (email) => {
  const users = loadUsers();
  return users.find(user => user.email === email);
};

const findUserByGoogleId = (googleId) => {
  const users = loadUsers();
  return users.find(user => user.googleId === googleId);
};

const findUserById = (id) => {
  const users = loadUsers();
  return users.find(user => user.id === parseInt(id));
};

const validatePassword = async (user, password) => {
  if (!user.password) {
    return false;
  }
  return await bcrypt.compare(password, user.password);
};

const updateUser = (id, updateData) => {
  const users = loadUsers();
  const userIndex = users.findIndex(user => user.id === parseInt(id));
  
  if (userIndex === -1) {
    return { success: false, error: 'User not found' };
  }

  users[userIndex] = {
    ...users[userIndex],
    ...updateData,
    updatedAt: new Date().toISOString()
  };

  const saved = saveUsers(users);
  if (saved) {
    return { success: true, user: users[userIndex] };
  } else {
    return { success: false, error: 'Failed to update user' };
  }
};

// Order operations
const createOrder = (orderData) => {
  const orders = loadOrders();
  const { userId, items, total, status = 'pending' } = orderData;
  
  // Decrease quantities for each item in the order
  for (const item of items) {
    try {
      // Try to find the item in photocards first
      const photocards = database.getAllPhotocards();
      const photocard = photocards.find(p => p.id === item.id);
      
      if (photocard) {
        // Update photocard quantity
        const updatedPhotocard = {
          ...photocard,
          quantity: Math.max(0, photocard.quantity - item.quantity)
        };
        database.updatePhotocard(item.id, updatedPhotocard);
      } else {
        // Try to find the item in prints
        const prints = printsDatabase.getAllPrints();
        const print = prints.find(p => p.id === item.id);
        
        if (print) {
          // Update print quantity
          const updatedPrint = {
            ...print,
            quantity: Math.max(0, print.quantity - item.quantity)
          };
          printsDatabase.updatePrint(item.id, updatedPrint);
        }
      }
    } catch (error) {
      console.error(`Error updating quantity for item ${item.id}:`, error);
      // Continue with other items even if one fails
    }
  }
  
  const newOrder = {
    id: orders.length > 0 ? Math.max(...orders.map(o => o.id)) + 1 : 1,
    userId: parseInt(userId),
    items,
    total,
    status,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  orders.push(newOrder);
  const saved = saveOrders(orders);
  
  if (saved) {
    return { success: true, order: newOrder };
  } else {
    return { success: false, error: 'Failed to save order' };
  }
};

const getOrdersByUserId = (userId) => {
  const orders = loadOrders();
  return orders.filter(order => order.userId === parseInt(userId));
};

const getAllOrders = () => {
  return loadOrders();
};

// Initialize the database
initializeUsers();

module.exports = {
  createUser,
  findUserByEmail,
  findUserByGoogleId,
  findUserById,
  updateUser,
  validatePassword,
  createOrder,
  getOrdersByUserId,
  getAllOrders
};

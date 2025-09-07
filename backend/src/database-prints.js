const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, '../data/prints.json');

// Ensure data directory exists
const dataDir = path.dirname(DB_FILE);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize database with sample data if it doesn't exist
const initializeDatabase = () => {
  if (!fs.existsSync(DB_FILE)) {
    const initialData = [
      {
        id: 1,
        name: 'BTS Group Photo Print',
        description: 'High-quality print of BTS group photo from Proof era',
        price: 15.99,
        image: '/images/placeholder.svg',
        quantity: 10,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 2,
        name: 'NewJeans Concept Print',
        description: 'Artistic print featuring NewJeans members in Get Up concept',
        price: 18.99,
        image: '/images/placeholder.svg',
        quantity: 8,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 3,
        name: 'LE SSERAFIM Performance Print',
        description: 'Dynamic performance shot of LE SSERAFIM from UNFORGIVEN era',
        price: 16.99,
        image: '/images/placeholder.svg',
        quantity: 12,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 4,
        name: 'aespa MY WORLD Print',
        description: 'Stunning print from aespa\'s MY WORLD concept photos',
        price: 19.99,
        image: '/images/placeholder.svg',
        quantity: 6,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 5,
        name: 'TWICE Group Shot Print',
        description: 'Beautiful group photo of TWICE from READY TO BE album',
        price: 14.99,
        image: '/images/placeholder.svg',
        quantity: 15,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
    
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2));
  }
};

// Get all prints
const getAllPrints = () => {
  try {
    const data = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading prints database:', error);
    return [];
  }
};

// Get print by ID
const getPrintById = (id) => {
  const prints = getAllPrints();
  return prints.find(print => print.id === parseInt(id));
};

// Add new print
const addPrint = (printData) => {
  const prints = getAllPrints();
  const newId = Math.max(...prints.map(p => p.id), 0) + 1;
  
  const newPrint = {
    id: newId,
    quantity: 1, // Default quantity
    ...printData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  prints.push(newPrint);
  fs.writeFileSync(DB_FILE, JSON.stringify(prints, null, 2));
  return newPrint;
};

// Update print
const updatePrint = (id, updateData) => {
  const prints = getAllPrints();
  const index = prints.findIndex(print => print.id === parseInt(id));
  
  if (index === -1) {
    return null;
  }
  
  prints[index] = {
    ...prints[index],
    ...updateData,
    updatedAt: new Date().toISOString()
  };
  
  fs.writeFileSync(DB_FILE, JSON.stringify(prints, null, 2));
  return prints[index];
};

// Delete print
const deletePrint = (id) => {
  const prints = getAllPrints();
  const filteredPrints = prints.filter(print => print.id !== parseInt(id));
  
  if (filteredPrints.length === prints.length) {
    return false; // Print not found
  }
  
  fs.writeFileSync(DB_FILE, JSON.stringify(filteredPrints, null, 2));
  return true;
};

// Get prints with filtering and sorting
const getPrints = (options = {}) => {
  let prints = getAllPrints();
  
  // Apply filters
  if (options.search) {
    const searchTerm = options.search.toLowerCase();
    prints = prints.filter(print => 
      print.name.toLowerCase().includes(searchTerm) ||
      print.description.toLowerCase().includes(searchTerm)
    );
  }
  
  if (options.minPrice !== undefined) {
    prints = prints.filter(print => print.price >= options.minPrice);
  }
  
  if (options.maxPrice !== undefined) {
    prints = prints.filter(print => print.price <= options.maxPrice);
  }
  
  // Apply sorting
  if (options.sortBy) {
    prints.sort((a, b) => {
      let aVal = a[options.sortBy];
      let bVal = b[options.sortBy];
      
      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }
      
      if (options.sortOrder === 'desc') {
        return bVal > aVal ? 1 : -1;
      } else {
        return aVal > bVal ? 1 : -1;
      }
    });
  }
  
  return prints;
};

// Initialize database on module load
initializeDatabase();

module.exports = {
  getAllPrints,
  getPrintById,
  addPrint,
  updatePrint,
  deletePrint,
  getPrints
};

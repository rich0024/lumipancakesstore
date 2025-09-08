const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, '../data/photocards.json');

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
        name: 'BTS - Jungkook Photocard',
        description: 'Official BTS Jungkook photocard from Proof album',
        price: 12.99,
        image: '/images/placeholder.svg',
        group: 'BTS',
        member: 'Jungkook',
        album: 'Proof',
        set: 'Proof Standard',
        age: '2022',
        rarity: 'Album',
        category: 'bts',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 2,
        name: 'NewJeans - Hanni Polaroid',
        description: 'Limited edition Hanni polaroid from Get Up era',
        price: 18.99,
        image: '/images/placeholder.svg',
        group: 'NewJeans',
        member: 'Hanni',
        album: 'Get Up',
        set: 'Get Up Limited',
        age: '2023',
        rarity: 'Preorder Benefit',
        category: 'newjeans',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 3,
        name: 'LE SSERAFIM - Chaewon Photocard',
        description: 'Chaewon photocard from UNFORGIVEN album',
        price: 14.99,
        image: '/images/placeholder.svg',
        group: 'LE SSERAFIM',
        member: 'Chaewon',
        album: 'UNFORGIVEN',
        set: 'UNFORGIVEN Standard',
        age: '2023',
        rarity: 'Album',
        category: 'lesserafim',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 4,
        name: 'aespa - Winter Polaroid',
        description: 'Exclusive Winter polaroid from MY WORLD',
        price: 22.99,
        image: '/images/placeholder.svg',
        group: 'aespa',
        member: 'Winter',
        album: 'MY WORLD',
        set: 'MY WORLD Special',
        age: '2023',
        rarity: 'Lucky Draw',
        category: 'aespa',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 5,
        name: 'TWICE - Sana Photocard',
        description: 'Sana photocard from READY TO BE album',
        price: 11.99,
        image: '/images/placeholder.svg',
        group: 'TWICE',
        member: 'Sana',
        album: 'READY TO BE',
        set: 'READY TO BE Standard',
        age: '2023',
        rarity: 'Album',
        category: 'twice',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 6,
        name: 'ITZY - Yeji Polaroid',
        description: 'Limited Yeji polaroid from KILL MY DOUBT',
        price: 19.99,
        image: '/images/placeholder.svg',
        group: 'ITZY',
        member: 'Yeji',
        album: 'KILL MY DOUBT',
        set: 'KILL MY DOUBT Limited',
        age: '2023',
        rarity: 'Preorder Benefit',
        category: 'itzy',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 7,
        name: 'Stray Kids - Felix Photocard',
        description: 'Felix photocard from 5-STAR album',
        price: 13.99,
        image: '/images/placeholder.svg',
        group: 'Stray Kids',
        member: 'Felix',
        album: '5-STAR',
        set: '5-STAR Standard',
        age: '2023',
        rarity: 'Album',
        category: 'straykids',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 8,
        name: 'IVE - Wonyoung Polaroid',
        description: 'Exclusive Wonyoung polaroid from I\'VE MINE',
        price: 21.99,
        image: '/images/placeholder.svg',
        group: 'IVE',
        member: 'Wonyoung',
        album: 'I\'VE MINE',
        set: 'I\'VE MINE Special',
        age: '2023',
        rarity: 'Lucky Draw',
        category: 'ive',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
    
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2));
  }
};

// Read all photocards
const getAllPhotocards = () => {
  try {
    const data = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading database:', error);
    return [];
  }
};

// Get photocard by ID
const getPhotocardById = (id) => {
  const photocards = getAllPhotocards();
  return photocards.find(card => card.id === parseInt(id));
};

// Add new photocard
const addPhotocard = (cardData) => {
  const photocards = getAllPhotocards();
  const newId = Math.max(...photocards.map(c => c.id), 0) + 1;
  
  const newCard = {
    id: newId,
    quantity: 1, // Default quantity
    ...cardData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  photocards.push(newCard);
  fs.writeFileSync(DB_FILE, JSON.stringify(photocards, null, 2));
  return newCard;
};

// Update photocard
const updatePhotocard = (id, cardData) => {
  const photocards = getAllPhotocards();
  const index = photocards.findIndex(card => card.id === parseInt(id));
  
  if (index === -1) {
    return null;
  }
  
  photocards[index] = {
    ...photocards[index],
    ...cardData,
    updatedAt: new Date().toISOString()
  };
  
  fs.writeFileSync(DB_FILE, JSON.stringify(photocards, null, 2));
  return photocards[index];
};

// Delete photocard
const deletePhotocard = (id) => {
  const photocards = getAllPhotocards();
  const filteredCards = photocards.filter(card => card.id !== parseInt(id));
  
  if (filteredCards.length === photocards.length) {
    return false; // Card not found
  }
  
  fs.writeFileSync(DB_FILE, JSON.stringify(filteredCards, null, 2));
  return true;
};

// Get photocards with sorting and filtering
const getPhotocards = (options = {}) => {
  let photocards = getAllPhotocards();
  
  // Filter by group if specified
  if (options.group) {
    photocards = photocards.filter(card => 
      card.group.toLowerCase().includes(options.group.toLowerCase())
    );
  }
  
  // Filter by rarity if specified
  if (options.rarity) {
    photocards = photocards.filter(card => 
      card.rarity.toLowerCase() === options.rarity.toLowerCase()
    );
  }
  
  // Filter by age if specified
  if (options.age) {
    photocards = photocards.filter(card => 
      card.age === options.age
    );
  }
  
  // Sort
  if (options.sortBy) {
    const sortField = options.sortBy;
    const sortOrder = options.sortOrder || 'asc';
    
    photocards.sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];
      
      // Handle numeric sorting for price and age
      if (sortField === 'price' || sortField === 'age') {
        aVal = parseFloat(aVal);
        bVal = parseFloat(bVal);
      }
      
      // Handle string sorting
      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }
      
      if (sortOrder === 'desc') {
        return bVal > aVal ? 1 : bVal < aVal ? -1 : 0;
      } else {
        return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
      }
    });
  }
  
  return photocards;
};

// Initialize database on module load
initializeDatabase();

module.exports = {
  getAllPhotocards,
  getPhotocardById,
  addPhotocard,
  updatePhotocard,
  deletePhotocard,
  getPhotocards
};

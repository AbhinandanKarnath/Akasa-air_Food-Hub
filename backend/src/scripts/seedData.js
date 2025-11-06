require('dotenv').config();
const mongoose = require('mongoose');
const Item = require('../models/Item');

const items = [
  {
    name: 'Fresh Apple',
    category: 'Fruit',
    price: 2.50,
    stock: 50,
    description: 'Crispy and sweet red apples',
    rating: 4.5,
    nutritionalInfo: { calories: 52, protein: 0.3, carbs: 14, fat: 0.2 }
  },
  {
    name: 'Ripe Banana',
    category: 'Fruit',
    price: 1.20,
    stock: 30,
    description: 'Sweet and creamy bananas',
    rating: 4.3,
    nutritionalInfo: { calories: 89, protein: 1.1, carbs: 23, fat: 0.3 }
  },
  {
    name: 'Organic Carrot',
    category: 'Vegetable',
    price: 1.80,
    stock: 25,
    description: 'Fresh organic carrots',
    rating: 4.4,
    nutritionalInfo: { calories: 41, protein: 0.9, carbs: 10, fat: 0.2 }
  },
  {
    name: 'Chicken Breast',
    category: 'Non-veg',
    price: 8.99,
    stock: 15,
    description: 'Premium quality chicken breast',
    rating: 4.7,
    nutritionalInfo: { calories: 165, protein: 31, carbs: 0, fat: 3.6 }
  },
  {
    name: 'Whole Wheat Bread',
    category: 'Breads',
    price: 2.99,
    stock: 20,
    description: 'Fresh whole wheat bread',
    rating: 4.2,
    nutritionalInfo: { calories: 80, protein: 4, carbs: 14, fat: 1 }
  },
  {
    name: 'Fresh Tomato',
    category: 'Vegetable',
    price: 3.50,
    stock: 40,
    description: 'Juicy red tomatoes',
    rating: 4.3,
    nutritionalInfo: { calories: 18, protein: 0.9, carbs: 3.9, fat: 0.2 }
  },
  {
    name: 'Orange',
    category: 'Fruit',
    price: 3.00,
    stock: 35,
    description: 'Fresh juicy oranges',
    rating: 4.4,
    nutritionalInfo: { calories: 47, protein: 0.9, carbs: 12, fat: 0.1 }
  },
  {
    name: 'Broccoli',
    category: 'Vegetable',
    price: 2.20,
    stock: 28,
    description: 'Fresh green broccoli',
    rating: 4.1,
    nutritionalInfo: { calories: 34, protein: 2.8, carbs: 7, fat: 0.4 }
  },
  {
    name: 'Salmon Fillet',
    category: 'Non-veg',
    price: 12.99,
    stock: 12,
    description: 'Premium Atlantic salmon',
    rating: 4.8,
    nutritionalInfo: { calories: 208, protein: 20, carbs: 0, fat: 13 }
  },
  {
    name: 'Sourdough Bread',
    category: 'Breads',
    price: 3.49,
    stock: 18,
    description: 'Artisan sourdough bread',
    rating: 4.6,
    nutritionalInfo: { calories: 93, protein: 3.8, carbs: 18, fat: 0.6 }
  }
];

const seedDatabase = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB successfully');
    
    console.log('Clearing existing items...');
    const deleteResult = await Item.deleteMany({});
    console.log(`Deleted ${deleteResult.deletedCount} existing items`);
    
    console.log('Inserting new items...');
    const insertResult = await Item.insertMany(items);
    console.log(`Successfully inserted ${insertResult.length} items:`);
    
    insertResult.forEach(item => {
      console.log(`- ${item.name} (${item.category}) - $${item.price}`);
    });
    
    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    console.error('Full error details:', error.message);
    process.exit(1);
  }
};

seedDatabase();
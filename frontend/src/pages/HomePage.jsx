import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { 
  ShoppingCart, 
  User, 
  Search, 
  Star, 
  Clock, 
  Truck,
  Heart,
  Menu,
  X
} from 'lucide-react';
import { useCart } from '../hooks/useCart';
import ItemCard from '../components/Inventory/ItemCard';
import CategoryFilter from '../components/Inventory/CategoryFilter';
import { fetchItemsByCategory } from '../services/api';
import { isAuthenticated, getUser } from '../utils/auth';

const HomePage = () => {
    const [items, setItems] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { getCartItemCount } = useCart();
    const navigate = useNavigate();
    const user = getUser();

    useEffect(() => {
        const loadItems = async () => {
            setLoading(true);
            try {
                const fetchedItems = await fetchItemsByCategory(selectedCategory);
                console.log('Fetched items in HomePage:', fetchedItems);
                setItems(fetchedItems);
            } catch (error) {
                toast.error('Failed to load items');
                console.error('Error loading items:', error);
            } finally {
                setLoading(false);
            }
        };
        loadItems();
    }, [selectedCategory]);

    // Enhanced filtering logic
    const filteredItems = items.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            item.category.toLowerCase().includes(searchTerm.toLowerCase());
        
        return matchesSearch;
    });

    const handleAuthAction = () => {
        if (isAuthenticated()) {
            navigate('/profile');
        } else {
            navigate('/login');
        }
    };

    // Clear search when category changes
    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
        setSearchTerm(''); // Clear search when changing category
    };

    // Handle search input change
    const handleSearchChange = (value) => {
        setSearchTerm(value);
        // If searching, show all categories
        if (value.trim()) {
            setSelectedCategory('All');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
            <Toaster 
                position="top-center"
                toastOptions={{
                    duration: 3000,
                    style: {
                        background: '#363636',
                        color: '#fff',
                    },
                }}
            />

            {/* Header/Navbar */}
            <header className="bg-white shadow-lg sticky top-0 z-50">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <div className="flex items-center space-x-2">
                            <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-2 rounded-lg">
                                <Truck className="h-6 w-6" />
                            </div>
                            <span className="text-xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                                FoodHub
                            </span>
                        </div>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center space-x-8">
                            <button className="text-gray-700 hover:text-orange-600 transition-colors font-medium">Home</button>
                            <button 
                                onClick={() => document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' })}
                                className="text-gray-700 hover:text-orange-600 transition-colors font-medium"
                            >
                                Menu
                            </button>
                            <button className="text-gray-700 hover:text-orange-600 transition-colors font-medium">About</button>
                            <button className="text-gray-700 hover:text-orange-600 transition-colors font-medium">Contact</button>
                        </nav>

                        {/* Right Side Actions */}
                        <div className="flex items-center space-x-4">
                            {/* Desktop Search */}
                            <div className="relative hidden sm:block">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 z-10" />
                                <input
                                    type="text"
                                    placeholder="Search food, category..."
                                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-gray-800 w-64"
                                    value={searchTerm}
                                    onChange={(e) => handleSearchChange(e.target.value)}
                                />
                                {/* Search Results Counter */}
                                {searchTerm && (
                                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                            {filteredItems.length}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Cart Button */}
                            <button
                                onClick={() => navigate('/cart')}
                                className="relative p-3 text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-full transition-all duration-200"
                            >
                                <ShoppingCart className="h-6 w-6" />
                                {getCartItemCount() > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                                        {getCartItemCount()}
                                    </span>
                                )}
                            </button>

                            {/* User Button */}
                            <button
                                onClick={handleAuthAction}
                                className="flex items-center space-x-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-4 py-2 rounded-full transition-all duration-200 shadow-md hover:shadow-lg font-medium"
                            >
                                <User className="h-4 w-4" />
                                <span className="hidden sm:inline font-semibold">
                                    {user ? user.name?.split(' ')[0] : 'Login'}
                                </span>
                            </button>

                            {/* Mobile Menu Button */}
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="md:hidden p-2 text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all duration-200"
                            >
                                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                            </button>
                        </div>
                    </div>

                    {/* Mobile Menu */}
                    {isMenuOpen && (
                        <div className="md:hidden border-t border-gray-200 py-4 bg-white">
                            <div className="flex flex-col space-y-4">
                                {/* Mobile Search */}
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 z-10" />
                                    <input
                                        type="text"
                                        placeholder="Search food, category..."
                                        className="w-full pl-10 pr-12 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white text-gray-800"
                                        value={searchTerm}
                                        onChange={(e) => handleSearchChange(e.target.value)}
                                    />
                                    {/* Mobile Search Results Counter */}
                                    {searchTerm && (
                                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                                {filteredItems.length}
                                            </span>
                                        </div>
                                    )}
                                </div>
                                
                                {/* Clear Search Button */}
                                {searchTerm && (
                                    <button
                                        onClick={() => handleSearchChange('')}
                                        className="text-sm text-orange-600 hover:text-orange-700 text-left px-4"
                                    >
                                        Clear search
                                    </button>
                                )}
                                
                                <nav className="flex flex-col space-y-2">
                                    <button className="text-left text-gray-700 hover:text-orange-600 py-2 px-4 hover:bg-orange-50 rounded-lg transition-colors font-medium">Home</button>
                                    <button 
                                        onClick={() => {
                                            document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' });
                                            setIsMenuOpen(false);
                                        }}
                                        className="text-left text-gray-700 hover:text-orange-600 py-2 px-4 hover:bg-orange-50 rounded-lg transition-colors font-medium"
                                    >
                                        Menu
                                    </button>
                                    <button className="text-left text-gray-700 hover:text-orange-600 py-2 px-4 hover:bg-orange-50 rounded-lg transition-colors font-medium">About</button>
                                    <button className="text-left text-gray-700 hover:text-orange-600 py-2 px-4 hover:bg-orange-50 rounded-lg transition-colors font-medium">Contact</button>
                                </nav>
                            </div>
                        </div>
                    )}
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative bg-gradient-to-r from-orange-500 to-red-500 text-white py-20">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6">
                        Delicious Food
                        <span className="block text-yellow-300">Delivered Fast</span>
                    </h1>
                    <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
                        Fresh ingredients, amazing flavors, and lightning-fast delivery. 
                        Order your favorite meals and enjoy restaurant-quality food at home.
                    </p>
                    <button 
                        onClick={() => document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' })}
                        className="bg-white text-orange-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 hover:text-orange-700 transition-all duration-200 shadow-lg hover:shadow-xl active:scale-95"
                    >
                        Order Now
                    </button>
                </div>
                
                {/* Floating Elements */}
                <div className="absolute top-20 left-10 opacity-20">
                    <div className="w-20 h-20 bg-white rounded-full"></div>
                </div>
                <div className="absolute bottom-20 right-10 opacity-20">
                    <div className="w-16 h-16 bg-yellow-300 rounded-full"></div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center group hover:scale-105 transition-transform duration-200">
                            <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-200 transition-colors">
                                <Clock className="h-8 w-8 text-orange-600" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2 text-gray-800">Fast Delivery</h3>
                            <p className="text-gray-600">Get your food delivered in 30 minutes or less</p>
                        </div>
                        <div className="text-center group hover:scale-105 transition-transform duration-200">
                            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors">
                                <Star className="h-8 w-8 text-green-600" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2 text-gray-800">Quality Food</h3>
                            <p className="text-gray-600">Fresh ingredients and top-rated recipes</p>
                        </div>
                        <div className="text-center group hover:scale-105 transition-transform duration-200">
                            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                                <Heart className="h-8 w-8 text-blue-600" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2 text-gray-800">Made with Love</h3>
                            <p className="text-gray-600">Every dish is prepared with care and passion</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Menu Section */}
            <section id="menu" className="py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                            Our Delicious Menu
                        </h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Choose from our wide variety of fresh, healthy, and delicious options
                        </p>
                    </div>

                    {/* Search Status */}
                    {searchTerm && (
                        <div className="mb-6 text-center">
                            <div className="inline-flex items-center space-x-2 bg-orange-100 text-orange-800 px-4 py-2 rounded-full">
                                <Search className="h-4 w-4" />
                                <span>Showing {filteredItems.length} results for "{searchTerm}"</span>
                                <button
                                    onClick={() => handleSearchChange('')}
                                    className="ml-2 text-orange-600 hover:text-orange-800"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Category Filter - Hide when searching */}
                    {!searchTerm && (
                        <div className="mb-8">
                            <CategoryFilter 
                                selectedCategory={selectedCategory} 
                                setSelectedCategory={handleCategoryChange} 
                            />
                        </div>
                    )}

                    {/* Loading State */}
                    {loading ? (
                        <div className="flex justify-center items-center py-20">
                            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500"></div>
                        </div>
                    ) : (
                        <>
                            {/* Items Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {filteredItems.length > 0 ? (
                                    filteredItems.map(item => (
                                        <ItemCard key={item.id || item._id} item={item} />
                                    ))
                                ) : (
                                    <div className="col-span-full text-center py-12">
                                        <div className="text-gray-400 text-6xl mb-4">
                                            {searchTerm ? '🔍' : '🍽️'}
                                        </div>
                                        <h3 className="text-xl font-semibold text-gray-600 mb-2">
                                            {searchTerm ? 'No results found' : 'No items found'}
                                        </h3>
                                        <p className="text-gray-500 mb-4">
                                            {searchTerm ? 
                                                `No items match "${searchTerm}". Try a different search term.` : 
                                                'No items available in this category'
                                            }
                                        </p>
                                        {searchTerm && (
                                            <button
                                                onClick={() => handleSearchChange('')}
                                                className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                                            >
                                                Clear Search
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-800 text-white py-12">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div>
                            <div className="flex items-center space-x-2 mb-4">
                                <div className="bg-orange-500 p-2 rounded-lg">
                                    <Truck className="h-6 w-6" />
                                </div>
                                <span className="text-xl font-bold">FoodHub</span>
                            </div>
                            <p className="text-gray-400">
                                Delivering happiness one meal at a time. Fresh, fast, and delicious!
                            </p>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4 text-white">Quick Links</h4>
                            <ul className="space-y-2">
                                <li><button className="text-gray-400 hover:text-white transition-colors text-left">Home</button></li>
                                <li><button 
                                    onClick={() => document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' })}
                                    className="text-gray-400 hover:text-white transition-colors text-left"
                                >Menu</button></li>
                                <li><button className="text-gray-400 hover:text-white transition-colors text-left">About</button></li>
                                <li><button className="text-gray-400 hover:text-white transition-colors text-left">Contact</button></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4 text-white">Categories</h4>
                            <ul className="space-y-2">
                                <li><button 
                                    onClick={() => handleCategoryChange('Fruit')}
                                    className="text-gray-400 hover:text-white transition-colors text-left"
                                >Fruits</button></li>
                                <li><button 
                                    onClick={() => handleCategoryChange('Vegetable')}
                                    className="text-gray-400 hover:text-white transition-colors text-left"
                                >Vegetables</button></li>
                                <li><button 
                                    onClick={() => handleCategoryChange('Non-veg')}
                                    className="text-gray-400 hover:text-white transition-colors text-left"
                                >Non-Veg</button></li>
                                <li><button 
                                    onClick={() => handleCategoryChange('Breads')}
                                    className="text-gray-400 hover:text-white transition-colors text-left"
                                >Breads</button></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4 text-white">Contact Info</h4>
                            <ul className="space-y-2 text-gray-400">
                                <li>📱 +91 7483746050</li>
                                <li>📧 abhinandankaranth52@gmail.com</li>
                                <li>📍 Christ University</li>
                                <li>⏰ 24/7 Service</li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
                        <p>&copy; 2024 FoodHub. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default HomePage;
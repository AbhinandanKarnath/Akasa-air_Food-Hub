import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { 
  Package, 
  Clock, 
  CheckCircle, 
  Truck, 
  RefreshCw, 
  Eye, 
  Calendar,
  ArrowLeft,
  User,
  MapPin,
  Star,
  Filter,
  Search
} from 'lucide-react';
import { getOrderHistory } from '../../services/api';
import { useCart } from '../../hooks/useCart';

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [reordering, setReordering] = useState(null);
    
    const { addToCart } = useCart();
    const navigate = useNavigate();

    useEffect(() => {
        fetchOrderHistory();
    }, []);

    useEffect(() => {
        filterOrders();
    }, [orders, searchTerm, statusFilter]);

    const fetchOrderHistory = async () => {
        try {
            const response = await getOrderHistory();
            setOrders(response.data);
        } catch (err) {
            setError('Failed to fetch order history');
        } finally {
            setLoading(false);
        }
    };

    const filterOrders = () => {
        let filtered = [...orders];

        // Filter by status
        if (statusFilter !== 'all') {
            filtered = filtered.filter(order => order.status === statusFilter);
        }

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(order => 
                order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.items.some(item => 
                    item.name.toLowerCase().includes(searchTerm.toLowerCase())
                )
            );
        }

        setFilteredOrders(filtered);
    };

    const handleReorder = async (order) => {
        setReordering(order.id);
        try {
            // Add all items from the order to cart
            order.items.forEach(item => {
                addToCart(item, item.quantity);
            });
            
            toast.success(`${order.items.length} items added to cart!`, {
                icon: '🛒',
            });
            
            // Navigate to cart page
            setTimeout(() => {
                navigate('/cart');
            }, 1000);
        } catch (error) {
            toast.error('Failed to add items to cart');
        } finally {
            setReordering(null);
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'pending':
                return <Clock className="h-4 w-4 text-yellow-500" />;
            case 'processing':
                return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />;
            case 'delivered':
                return <CheckCircle className="h-4 w-4 text-green-500" />;
            case 'cancelled':
                return <Package className="h-4 w-4 text-red-500" />;
            default:
                return <Package className="h-4 w-4 text-gray-500" />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'processing':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'delivered':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'cancelled':
                return 'bg-red-100 text-red-800 border-red-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                {/* Header */}
                <div className="bg-white shadow-sm border-b">
                    <div className="container mx-auto px-4 py-4">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => navigate('/')}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <ArrowLeft className="h-5 w-5" />
                            </button>
                            <h1 className="text-2xl font-bold text-gray-800">Order History</h1>
                        </div>
                    </div>
                </div>
                
                <div className="flex justify-center items-center min-h-[400px]">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500 mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading your orders...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="container mx-auto px-4 py-8">
                    <div className="text-center">
                        <div className="bg-red-100 p-8 rounded-2xl max-w-md mx-auto">
                            <Package className="h-16 w-16 text-red-500 mx-auto mb-4" />
                            <h2 className="text-xl font-semibold text-red-800 mb-2">Something went wrong</h2>
                            <p className="text-red-600 mb-4">{error}</p>
                            <button
                                onClick={fetchOrderHistory}
                                className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                            >
                                Try Again
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b sticky top-0 z-10">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => navigate('/')}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <ArrowLeft className="h-5 w-5" />
                            </button>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-800">Order History</h1>
                                <p className="text-gray-600">{orders.length} orders found</p>
                            </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => navigate('/profile')}
                                className="flex items-center space-x-2 px-4 py-2 bg-black hover:bg-gray-200 rounded-lg transition-colors"
                            >
                                <User className="h-4 w-4" />
                                <span className="hidden sm:inline">Profile</span>
                            </button>
                        </div>
                    </div>

                    {/* Search and Filter */}
                    <div className="mt-4 flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <input
                                type="text"
                                placeholder="Search orders or items..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-black"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        
                        <div className="flex items-center space-x-2">
                            <Filter className="h-4 w-4 text-gray-500" />
                            <select
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-black"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="all">All Orders</option>
                                <option value="pending">Pending</option>
                                <option value="processing">Processing</option>
                                <option value="delivered">Delivered</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-6">
                {filteredOrders.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="bg-white rounded-2xl p-8 max-w-md mx-auto shadow-sm">
                            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-600 mb-2">
                                {searchTerm || statusFilter !== 'all' ? 'No matching orders' : 'No orders yet'}
                            </h3>
                            <p className="text-gray-500 mb-6">
                                {searchTerm || statusFilter !== 'all' 
                                    ? 'Try adjusting your search or filters'
                                    : 'Start shopping to see your orders here'
                                }
                            </p>
                            <button
                                onClick={() => navigate('/')}
                                className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-all"
                            >
                                Start Shopping
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {filteredOrders.map(order => (
                            <div key={order.id} className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                                {/* Order Header */}
                                <div className="p-6 border-b border-gray-100">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                        <div className="flex items-center space-x-4">
                                            <div className="flex items-center space-x-2">
                                                {getStatusIcon(order.status)}
                                                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}>
                                                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                                </span>
                                            </div>
                                            
                                            <div>
                                                <h3 className="font-semibold text-gray-800">Order #{order.id}</h3>
                                                <div className="flex items-center text-sm text-gray-500 mt-1">
                                                    <Calendar className="h-4 w-4 mr-1" />
                                                    {new Date(order.date).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center space-x-4">
                                            <div className="text-right">
                                                <p className="text-2xl font-bold text-gray-800">${order.total.toFixed(2)}</p>
                                                <p className="text-sm text-gray-500">{order.items.length} items</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Order Items */}
                                <div className="p-6">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                                        {order.items.map(item => (
                                            <div key={item.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                                                <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-red-100 rounded-lg flex items-center justify-center">
                                                    <span className="text-2xl">
                                                        {item.name.includes('Apple') && '🍎'}
                                                        {item.name.includes('Banana') && '🍌'}
                                                        {item.name.includes('Carrot') && '🥕'}
                                                        {item.name.includes('Chicken') && '🍗'}
                                                        {item.name.includes('Bread') && '🍞'}
                                                        {item.name.includes('Tomato') && '🍅'}
                                                        {!['Apple', 'Banana', 'Carrot', 'Chicken', 'Bread', 'Tomato'].some(food => item.name.includes(food)) && '🍽️'}
                                                    </span>
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="font-medium text-gray-800">{item.name}</h4>
                                                    <p className="text-sm text-gray-500">
                                                        Qty: {item.quantity} × ${item.price.toFixed(2)}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-semibold text-gray-800">
                                                        ${(item.price * item.quantity).toFixed(2)}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Order Actions */}
                                    <div className="flex flex-col sm:flex-row gap-3">
                                        <button
                                            onClick={() => setSelectedOrder(selectedOrder === order.id ? null : order.id)}
                                            className="flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                        >
                                            <Eye className="h-4 w-4" />
                                            <span>{selectedOrder === order.id ? 'Hide Details' : 'View Details'}</span>
                                        </button>
                                        
                                        <button
                                            onClick={() => handleReorder(order)}
                                            disabled={reordering === order.id}
                                            className="flex items-center justify-center space-x-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {reordering === order.id ? (
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                            ) : (
                                                <RefreshCw className="h-4 w-4" />
                                            )}
                                            <span>{reordering === order.id ? 'Adding...' : 'Reorder'}</span>
                                        </button>
                                        
                                        <button
                                            onClick={() => toast.success('Feature coming soon!', { icon: '🚧' })}
                                            className="flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                        >
                                            <Star className="h-4 w-4" />
                                            <span>Rate Order</span>
                                        </button>
                                    </div>

                                    {/* Expanded Details */}
                                    {selectedOrder === order.id && (
                                        <div className="mt-6 p-4 bg-gray-50 rounded-lg border-l-4 border-orange-500">
                                            <h4 className="font-semibold text-gray-800 mb-3">Order Details</h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                                <div>
                                                    <p className="text-gray-600">Order ID: <span className="font-medium text-gray-800">{order.id}</span></p>
                                                    <p className="text-gray-600">Status: <span className="font-medium text-gray-800">{order.status}</span></p>
                                                    <p className="text-gray-600">Total Items: <span className="font-medium text-gray-800">{order.items.length}</span></p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-600">Order Date: <span className="font-medium text-gray-800">{new Date(order.date).toLocaleDateString()}</span></p>
                                                    <p className="text-gray-600">Total Amount: <span className="font-medium text-gray-800">${order.total.toFixed(2)}</span></p>
                                                    <p className="text-gray-600">Payment: <span className="font-medium text-gray-800">Paid</span></p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrderHistory;
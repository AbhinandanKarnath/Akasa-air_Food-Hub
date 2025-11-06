import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../services/api';

const OrderDetails = () => {
    const { orderId } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                const response = await api.get(`/orders/${orderId}`);
                setOrder(response.data);
            } catch (err) {
                setError('Failed to fetch order details');
            } finally {
                setLoading(false);
            }
        };

        fetchOrderDetails();
    }, [orderId]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="order-details">
            <h2>Order Details</h2>
            <p>Order ID: {order.id}</p>
            <p>Status: {order.status}</p>
            <h3>Items:</h3>
            <ul>
                {order.items.map(item => (
                    <li key={item.id}>
                        {item.name} - Quantity: {item.quantity} - Price: ${item.price}
                    </li>
                ))}
            </ul>
            <h3>Total: ${order.total}</h3>
            <p>Order Date: {new Date(order.createdAt).toLocaleString()}</p>
        </div>
    );
};

export default OrderDetails;
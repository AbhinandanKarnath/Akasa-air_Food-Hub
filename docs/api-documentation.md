# API Documentation for Food Ordering Platform

## Overview
This document provides an overview of the API endpoints available in the Food Ordering Platform backend. The API allows users to register, authenticate, browse inventory, manage their cart, and place orders.

## Base URL
The base URL for all API requests is:
```
http://localhost:5000/api
```

## Authentication

### Register User
- **Endpoint:** `POST /auth/register`
- **Request Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "yourpassword"
  }
  ```
- **Response:**
  - **201 Created**: User registered successfully.
  - **400 Bad Request**: Validation errors or user already exists.

### Login User
- **Endpoint:** `POST /auth/login`
- **Request Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "yourpassword"
  }
  ```
- **Response:**
  - **200 OK**: Login successful, returns user data and token.
  - **401 Unauthorized**: Invalid credentials.

## Inventory

### Get Items by Category
- **Endpoint:** `GET /inventory`
- **Query Parameters:**
  - `category`: (optional) Filter items by category.
- **Response:**
  - **200 OK**: Returns a list of items.
  - **404 Not Found**: No items found.

## Cart

### Add Item to Cart
- **Endpoint:** `POST /cart`
- **Request Body:**
  ```json
  {
    "itemId": "item_id_here",
    "quantity": 2
  }
  ```
- **Response:**
  - **200 OK**: Item added to cart.
  - **404 Not Found**: Item does not exist.

### Checkout Cart
- **Endpoint:** `POST /cart/checkout`
- **Response:**
  - **200 OK**: Checkout successful, returns order ID.
  - **400 Bad Request**: Items not available or other errors.

## Orders

### Get Order History
- **Endpoint:** `GET /orders`
- **Response:**
  - **200 OK**: Returns a list of past orders.
  - **401 Unauthorized**: User not authenticated.

### Get Order Details
- **Endpoint:** `GET /orders/:orderId`
- **Response:**
  - **200 OK**: Returns details of the specified order.
  - **404 Not Found**: Order does not exist.

## Error Handling
All endpoints will return appropriate HTTP status codes and error messages for various scenarios, including validation errors, unauthorized access, and resource not found.

## Conclusion
This API documentation provides a comprehensive overview of the endpoints available in the Food Ordering Platform. For further details on request and response formats, please refer to the individual endpoint descriptions.
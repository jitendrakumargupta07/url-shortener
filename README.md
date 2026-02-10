# URL Shortener 🔗

A backend-focused URL Shortener built with Node.js, Express, and MongoDB.

## Features
- Generate short URLs
- Redirect to original URL
- Track click count
- REST API based design

## Tech Stack
- Node.js
- Express.js
- MongoDB
- Mongoose

## API Endpoints

### Shorten URL
POST /shorten  
Body:
{
  "originalUrl": "https://example.com"
}

### Redirect
GET /:shortId

### Stats
GET /stats/:shortId

## How to Run
1. npm install
2. Add .env file
3. npm start

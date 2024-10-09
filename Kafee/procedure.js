const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware for CORS
const cors = (req, res, next) => {
    if (req.headers.origin) {
        res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        res.setHeader('Access-Control-Max-Age', '86400'); // Cache for 1 day
    }

    if (req.method === 'OPTIONS') {
        if (req.headers['access-control-request-method']) {
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        }
        if (req.headers['access-control-request-headers']) {
            res.setHeader('Access-Control-Allow-Headers', req.headers['access-control-request-headers']);
        }
        return res.status(204).end();
    }

    next();
};

// Middleware for Basic Authentication
const basicAuth = (req, res, next) => {
    const auth = req.headers['authorization'];

    if (!auth) {
        res.setHeader('WWW-Authenticate', 'Basic realm="Coffee"');
        return res.status(401).json({ msg: 'Unauthorized' });
    }

    const [user, pass] = Buffer.from(auth.split(' ')[1], 'base64').toString().split(':');

    if (user === 'coffe' && pass === 'kafe') {
        return next();
    }

    res.setHeader('WWW-Authenticate', 'Basic realm="Coffee"');
    return res.status(401).json({ msg: 'Unauthorized' });
};

// Apply middlewares
app.use(cors);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(basicAuth);

// Database connection (dummy function, replace with your actual DB connection)
const db = require('./db'); // Replace with your actual DB module
const Requests = require('./requests'); // Replace with your actual requests module

app.get('/api', (req, res) => {
    const requests = new Requests(db);
    // Add your request handling logic here
    res.json({ msg: 'API is working' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

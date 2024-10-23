
const mysql = require('mysql2');


const config = {
    host: 'localhost',  // Database host
    user: 'coffe.lmsoft.cz',  // Database username
    password: 'coffe',  // Database password
    database: 'coffe_lmsoft_cz'  // Database name
};

// Create a connection
const connection = mysql.createConnection(config);

// Check connection
connection.connect((err) => {
    if (err) {
        console.error('Connection failed:', err);
        process.exit(1); // Exit the process if the connection fails
    }
    console.log('Connected successfully to the database.');
});

module.exports = connection; // Export the connection for use in other modules

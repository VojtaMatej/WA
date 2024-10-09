const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

// Dummy service class for demonstration
class Service {
    constructor(conn) {
        // Initialize connection or any setup here
        this.conn = conn;
    }

    getPeopleList() {
        // Replace with actual DB retrieval logic
        return [
            { ID: 1, name: 'Alice' },
            { ID: 2, name: 'Bob' }
        ];
    }

    getTypesList() {
        // Replace with actual DB retrieval logic
        return [
            { ID: 1, typ: 'Coffee' },
            { ID: 2, typ: 'Tea' }
        ];
    }
}

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files from the "public" folder

// Serve HTML form
app.get('/', (req, res) => {
    const service = new Service(); // Instantiate your service here

    const peopleList = service.getPeopleList();
    const typesList = service.getTypesList();

    const generateOptions = (arr) => {
        return arr.map(item => `
            <label for="${item.ID}">${item.name}</label>
            <input type="radio" name="user" value="${item.ID}"><br>
        `).join('');
    };

    const generateCB = (arr) => {
        return arr.map(item => `
            <label for="${item.ID}">${item.typ}</label>
            <input type="number" name="type[]" value="0"><br>
        `).join('');
    };

    res.send(`
    <!DOCTYPE HTML>
    <html>
      <head>
        <meta http-equiv="content-type" content="text/html; charset=utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0"> 
        <title>Drink Submission</title>
        <style>
          #form { width: 100rem; }
          #form label { width: 10rem; display: inline-block; }
          #form input { width: 80rem; }
          #form label, #form input { height: 2rem; margin: 1rem 0; }
        </style>
      </head>
      <body>
        <form action="/api/requests" method="post">
          <div id="form">
            ${generateOptions(peopleList)}
            ${generateCB(typesList)}
            <button type="button">Uložit</button>
          </div>
          <input type="submit" value="odeslat">
        </form>
      </body>
    </html>
    `);
});

// Handle form submission
app.post('/api/requests', (req, res) => {
    // Handle the submitted data from the form
    console.log(req.body); // Log the submitted data
    res.json({ msg: 'Form submitted successfully!', data: req.body });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

const express = require('express');
const bodyParser = require('body-parser');

class RequestHandler {
    constructor(service) {
        this.service = service;
        this.router = express.Router();

        // Middleware to parse JSON and URL-encoded data
        this.router.use(bodyParser.json());
        this.router.use(bodyParser.urlencoded({ extended: true }));

        // Route handlers
        this.router.get('/cmd/:cmd?', (req, res) => this.controller(req.params.cmd, req.query));
        this.router.post('/cmd/saveDrinks', (req, res) => this.controller('saveDrinks', req.body));
        this.router.get('/cmd/listCmd', (req, res) => this.controller('listCmd', {}));
    }

    controller(cmd, data) {
        switch (cmd) {
            case 'getPeopleList':
                this.output(this.service.getPeopleList(), res);
                break;
            case 'getTypesList':
                this.output(this.service.getTypesList(), res);
                break;
            case 'saveDrinks':
                this.output(this.service.saveDrinks(data), res);
                break;
            case 'listCmd':
                this.output(['getPeopleList', 'getTypesList', 'saveDrinks', 'getSummaryOfDrinks'], res);
                break;
            case 'getSummaryOfDrinks':
                this.output(this.service.getSummaryOfDrinks(data), res);
                break;
            default:
                this.output("err", res);
        }
    }

    output(data, res) {
        if (!Array.isArray(data)) {
            res.json({ msg: data });
        } else {
            res.json(data);
        }
    }
}

// Example of usage
const app = express();
const service = new Service(); // Assume you have a Service class
const requestHandler = new RequestHandler(service);

app.use('/api', requestHandler.router);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

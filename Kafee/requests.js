const http = require('http');
const url = require('url');
const querystring = require('querystring');

class Service {
    constructor(conn) {
        this.conn = conn;
    }

    getPeopleList() {
        // Implementation here
    }

    getTypesList() {
        // Implementation here
    }

    saveDrinks(data) {
        // Implementation here
    }

    getSummaryOfDrinks(data) {
        // Implementation here
    }
}

class RequestHandler {
    constructor(conn) {
        this.ser = new Service(conn);
    }

    handleRequest(req, res) {
        const parsedUrl = url.parse(req.url, true);
        const cmd = parsedUrl.query.cmd || '';
        const method = req.method;
        let body = '';

        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            const POSTdata = querystring.parse(body);
            const GETdata = parsedUrl.query;

            switch (cmd) {
                case 'getPeopleList':
                    this.output(res, this.ser.getPeopleList());
                    break;
                case 'getTypesList':
                    this.output(res, this.ser.getTypesList());
                    break;
                case 'saveDrinks':
                    this.output(res, this.ser.saveDrinks(POSTdata));
                    break;
                case 'listCmd':
                    this.output(res, ["getPeopleList", "getTypesList", "saveDrinks", "getSummaryOfDrinks"]);
                    break;
                case 'getSummaryOfDrinks':
                    this.output(res, this.ser.getSummaryOfDrinks(GETdata));
                    break;
                default:
                    this.output(res, "err");
            }
        });
    }

    output(res, str) {
        res.setHeader('Content-Type', 'application/json');
        if (typeof str !== 'object') {
            res.end(JSON.stringify({ msg: str }));
        } else {
            res.end(JSON.stringify(str));
        }
    }
}

const hostname = '127.0.0.1';
const port = 3000;
const conn = {}; // Your database connection here

const requestHandler = new RequestHandler(conn);

const server = http.createServer((req, res) => {
    requestHandler.handleRequest(req, res);
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});

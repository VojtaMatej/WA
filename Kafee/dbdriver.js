const mysql = require('mysql2');

// Třída dbDriver v Node.js
class dbDriver {
    constructor(connection) {
        if (!connection) {
            throw new Error("No connection provided");
        }
        this.cn = connection;
    }

    // Funkce pro spuštění SQL dotazu a vrácení prvního řádku
    query(sql) {
        return new Promise((resolve, reject) => {
            this.cn.query(sql, (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results[0]);  // Vrací první záznam
            });
        });
    }

    // Funkce pro výběr z tabulky
    select(tab, colm) {
        return new Promise((resolve, reject) => {
            let columns = '*';
            if (Array.isArray(colm)) {
                columns = colm.join(', ');
            } else if (typeof colm === 'string') {
                columns = colm;
            }

            const sql = `SELECT ${columns} FROM ${tab}`;
            this.cn.query(sql, (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results);  // Vrací všechny výsledky
            });
        });
    }

    // Funkce pro vložení záznamu do tabulky "drinks"
    insertRow(arr) {
        return new Promise((resolve, reject) => {
            if (!Array.isArray(arr)) {
                return reject(new Error("Input must be an array"));
            }

            const values = arr.map(val => `'${val}'`).join(', ');
            const sql = `INSERT INTO drinks VALUES (NULL, ${values})`;  // "NULL" pro první auto increment sloupec

            this.cn.query(sql, (err, result) => {
                if (err) {
                    return reject(err);
                }
                resolve(result);  // Vrací výsledek vkládání
            });
        });
    }
}

// Příklad připojení k databázi MySQL
const connection = mysql.createConnection({
    host: 'localhost',  // Database host
    user: 'coffe.lmsoft.cz',  // Database username
    password: 'coffe',  // Database password
    database: 'coffe_lmsoft_cz'  // Database name
});

// Příklad použití třídy dbDriver
const db = new dbDriver(connection);

// Ukázka volání funkcí
db.select('drinks', ['name', 'price'])
    .then(results => console.log(results))
    .catch(err => console.error(err));

db.insertRow(['Coffee', '3.50'])
    .then(result => console.log('Inserted:', result))
    .catch(err => console.error(err));

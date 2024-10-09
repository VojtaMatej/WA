const mysql = require('mysql2');

class DbDriver {
    constructor(connection) {
        if (!connection) {
            throw new Error('Connection cannot be null');
        }
        this.cn = connection;
    }

    query(sql) {
        return new Promise((resolve, reject) => {
            this.cn.query(sql, (err, results) => {
                if (err) {
                    return reject(err);
                }
                // Return the first row of the result
                resolve(results[0]);
            });
        });
    }

    select(tab, colm) {
        const List = Array.isArray(colm) ? colm.join(', ') : colm;
        const sql = `SELECT ${List} FROM ${tab}`;

        return new Promise((resolve, reject) => {
            this.cn.query(sql, (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            });
        });
    }

    insertRow(arr) {
        if (!Array.isArray(arr)) return -1;

        const values = arr.map(value => `'${value}'`).join(', ');
        const sql = `INSERT INTO drinks VALUES (NULL, ${values})`; // Assuming the first column is an auto-increment ID

        return new Promise((resolve, reject) => {
            this.cn.query(sql, (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results.affectedRows);
            });
        });
    }

    selectQ(sql) {
        return new Promise((resolve, rej

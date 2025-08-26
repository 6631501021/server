// Install packages: npm install express, npm install mysql2, npm install bcrypt, npm install -g nodemon
// Run server: nodemon server_mobile.js

// ****Nook****
const con = require('./db');
const express = require('express');
const bcrypt = require('bcrypt');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// password generator
app.get('/password/:pass', (req, res) => {
    const password = req.params.pass;
    bcrypt.hash(password, 10, function(err, hash) {
        if(err) {
            return res.status(500).send('Hashing error');
        }
        res.send(hash);
    });
});

// login ****Nook****
app.post('/login', (req, res) => {
    const {username, password} = req.body;
    const sql = "SELECT id, password FROM users WHERE username = ?";
    con.query(sql, [username], function(err, results) {
        if(err) {
            return res.status(500).send("Database server error");
        }
        if(results.length != 1) {
            return res.status(401).send("Wrong username");
        }
        bcrypt.compare(password, results[0].password, function(err, same) {
            if(err) {
                return res.status(500).send("Hashing error");
            }
            if(same) {
                // Return user_id with success
                return res.json({ message: "Login OK", user_id: results[0].id });
            }
            return res.status(401).send("Wrong password");
        });
    });
});

// Get expenses by username (via user_id) ****Gus****
app.get('/expenses/:username', (req, res) => {
    const username = req.params.username;
    const sql = "SELECT e.id, e.item, e.paid, e.date FROM expense e JOIN users u ON e.user_id = u.id WHERE u.username = ?";
    con.query(sql, [username], function(err, results) {
        if(err) {
            return res.status(500).send("Database server error");
        }
        res.json(results);
    });
});

// Add new expense ****Bua****
app.post('/expense', (req, res) => {
    const { username, item, paid } = req.body;
    const sql = "INSERT INTO expense (user_id, item, paid, date) SELECT id, ?, ?, NOW() FROM users WHERE username = ?";
    con.query(sql, [item, paid, username], function(err, result) {
        if(err) {
            return res.status(500).send("Database error");
        }
        res.sendStatus(200);
    });
});

// Delete expense ****Bua****
app.delete('/expense/:id', (req, res) => {
    const id = req.params.id;
    const sql = "DELETE FROM expense WHERE id = ?";
    con.query(sql, [id], function(err, result) {
        if(err) {
            return res.status(500).send("Database err");
        }
        if(result.affectedRows > 0) {
            res.sendStatus(200);
        } else {
            res.status(404).send("Item not found");
        }
    });
});
// Server starts here ****Nook****
const PORT = 3000;
app.listen(PORT, () => {
    console.log('Server is running at ' + PORT);
});
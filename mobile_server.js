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

// Add new expense ****Bua****

// Delete expense ****Gus****

// Server starts here ****Nook****
const PORT = 3000;
app.listen(PORT, () => {
    console.log('Server is running at ' + PORT);
});
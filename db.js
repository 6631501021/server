// ****Nook****
const mysql = require("mysql2");
const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'mobile_project1'
});


module.exports = con;
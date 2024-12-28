const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', 
  database: 'firstss'
});

db.connect((err) => {
  if (err) throw err;
  console.log('Connected to database');
});

// सर्वर सेटअप
app.listen(1600, () => {
  console.log('Server running on port 1600');
});

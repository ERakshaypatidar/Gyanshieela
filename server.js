const express = require('express');
const path = require('path');
const app = express();

// Set up the port to 5455
const port = 5455;

// Serve static files from the 'D:/ECMS/ecommercehtml' directory
app.use(express.static('D:/ECMS/ecommercehtml'));

// Route to serve the main page (you can set any file as the default)
app.get('/', (req, res) => {
  res.sendFile(path.join('D:/ECMS/ecommercehtml'));
});

// Start the server on port 5455
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const app = express();
const PORT = 3040;

// Enable CORS for all origins
app.use(cors());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'Gyanshila'
});

// Connect to the database
db.connect(err => {
    if (err) {
        console.error('Database connection error:', err);
        return;
    }
    console.log('Connected to MySQL database.');
});

app.use(express.json());

// API endpoint to fetch projects by property type and project name
app.get('/projects/:propertyType', (req, res) => {
    const { propertyType } = req.params; // Get the property type from URL parameters
    const { projectName } = req.query;   // Get the project name from query parameters

    // If propertyType is not provided, return a 400 error
    if (!propertyType) {
        return res.status(400).json({ error: 'Property Type is required' });
    }

    // Construct query to fetch projects based on property type and project name (if provided)
    let query = 'SELECT `Project Name`, location, `Total Units`, `Available Units`, `Booked Units`, `Project Status`, pdf_path, `Price List`, `Amenities` FROM project WHERE `Project Type` = ?';
    let queryParams = [propertyType];

    // If a project name is provided, filter the results by project name
    if (projectName) {
        query += ' AND `Project Name` = ?';
        queryParams.push(projectName);
    }

    // Execute the query with the parameters
    db.query(query, queryParams, (err, results) => {
        if (err) {
            console.error('Error fetching projects:', err);
            return res.status(500).json({ error: 'Database error while fetching projects' });
        }

        // If no results are found, return a 404 error
        if (results.length === 0) {
            return res.status(404).json({ error: 'No projects found for this property type or project name' });
        }

        // Send the results back as JSON
        res.json(results);
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

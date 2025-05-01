import express from 'express';
import path from "path"
import fs from "fs";
const app= express()
// app.use(express.staticProvider("./templates/"));
const __dirname = "";

function getFilesInFolder(folderPath) {
    try {
      const files = fs.readdirSync(folderPath);
      return files;
    } catch (err) {
      console.error('Error reading folder:', err);
      return [];
    }
  }
// Set EJS as the view engine
app.set('view engine', 'ejs');

// Define the directory where your HTML files (views) are located
app.set('views', path.join(__dirname, 'views'));

// Optionally, you can define a static files directory (CSS, JS, images, etc.)
app.use(express.static(path.join(__dirname, 'public')));
const files = getFilesInFolder(path.join(__dirname, 'public'));
// Define a route to render the HTML file
app.get('/', (req, res) => {
    res.render("home") // Assuming you have an "index.ejs" file in the "views" directory
});
app.get('/files', (req, res) => {
    const dirPath = path.join(__dirname, 'public', req.query.path || '');

    fs.readdir(dirPath, { withFileTypes: true }, (err, files) => {
      if (err) {
        return res.status(500).send(err);
      }

      const fileData = files.map(file => ({
        name: file.name,
        path: path.join(req.query.path || '', file.name),
        isDirectory: file.isDirectory(),
      }));
      res.json(fileData);
    });
  });

// Start the server
app.listen(3000, () => {
  console.log('Server started on http://localhost:3000');
});
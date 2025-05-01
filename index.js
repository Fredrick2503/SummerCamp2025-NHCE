import express from 'express';
import path from "path";
import fs from "fs";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

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

// Define the directory where your EJS views are located
app.set('views', path.join(__dirname, 'views'));

// Define static assets directory
app.use(express.static(path.join(__dirname, 'public')));

// Load public files
const files = getFilesInFolder(path.join(__dirname, 'public'));

// Route to render home view
app.get('/', (req, res) => {
  res.render("home");
});

// Route to list files
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

// Start local server (won’t be used on Vercel, but safe to keep for dev)
app.listen(3000, () => {
  console.log('Server started on http://localhost:3000');
});

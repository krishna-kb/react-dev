const express = require('express');
const path = require('path');

const app = express();
const port = 3000;

// --- Static File Serving ---
// Serve static assets from 'src'
app.use(express.static(path.join(__dirname, 'src')));
// Serve the compiled JS from 'build'
app.use(express.static(path.join(__dirname, 'build')));


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'src', 'index.html'));
});

app.listen(port, () => {
  console.log(`
  =====================================================
  Development server running!
  Open your browser to http://localhost:${port}
  =====================================================
  `);
});
const express = require('express');
const cors = require('cors');
const app = express();
const port = 3003;

app.use(cors());
app.use(express.json());

const gibberish = [
    "Blork zorp flibbertigibbet.",
    "Glim-glam snoo-snoo.",
    "Floop dee-doop.",
    "Zibble-zabble wibble-wobble.",
    "Snicker-snack, a-flumph.",
    "Quibble-quabble, a-fizz.",
    "Zorp! Gloop. Bleep.",
    "Wobbledy-wobbledy, a-splat.",
];

app.post('/api/chat', (req, res) => {
    // We don't use the request body, just return a random gibberish response
    setTimeout(() => {
        const randomIndex = Math.floor(Math.random() * gibberish.length);
        res.json({ message: gibberish[randomIndex] });
    }, 500); // Simulate network delay
});

app.listen(port, () => {
  console.log(`Chat API server listening at http://localhost:${port}`);
});

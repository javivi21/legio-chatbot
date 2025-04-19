const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Cargamos el archivo de conocimiento
const conocimiento = fs.readFileSync('conocimiento_legio_final_completo.md', 'utf-8');

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname)); // Sirve index.html, widget.js, etc.

app.post('/chat', async (req, res) => {
  const userMessage = req.body.message;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4-turbo',
        messages: [
          {
            role: 'system',
            content: conocimiento
          },
          {
            role: 'user',
            content: userMessage
          }
        ]
      })
    });

    const data = await response.json();
    if (!response.ok || !data.choices?.length) {
      console.error('OpenAI API error:', data);
      const msg = data.error?.message || 'Respuesta no válida de la IA.';
      return res.status(500).json({ reply: `❌ Error IA: ${msg}` });
    }

    res.json({ reply: data.choices[0].message.content });
  } catch (err) {
    console.error('Fetch error:', err);
    res.status(500).json({ reply: `❌ Error de conexión: ${err.message}` });
  }
});

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));
app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));


const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

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
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `Eres el asistente oficial de la Academia Legio VII, una escuela de artes marciales en León, España...
(TODO el contenido de tu prompt va aquí como antes)`
          },
          { role: 'user', content: userMessage }
        ]
      })
    });

    const data = await response.json();

    // 👇 ESTA ES LA CLAVE
    if (data.choices && data.choices[0] && data.choices[0].message) {
      res.json({ reply: data.choices[0].message.content });
    } else {
      res.json({ reply: "😅 Lo siento, no entendí eso." });
    }

  } catch (error) {
    console.error('Error al llamar a la API de OpenAI:', error);
    res.status(500).json({ reply: '❌ Error al conectar con OpenAI.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});

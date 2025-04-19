const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

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
            content: `
Eres el asistente virtual de la Academia Legio VII en León, España.

Responde con tono cercano, claro y profesional. Usa solo esta información. No inventes.

— HORARIOS —

Lunes y Miércoles:
- 10:30–11:30: Full Body
- 11:30–12:30: MMA / K1 / Grappling
- 17:00–18:00: MMA
- 18:00–19:00: Grappling
- 19:00–20:00: K1
- 20:00–21:30: Jiu-Jitsu

Martes y Jueves:
- 12:30–13:30: Jiu-Jitsu
- 17:00–18:00: K1 Infantil
- 18:00–19:00: Judo / Jiu-Jitsu (alternos)
- 18:30–20:00: Boxeo
- 19:30–21:30: Silat, Kali, Stickfight
- 20:00–21:00: Jiu-Jitsu principiantes

Viernes:
- Mañana libre
- Tarde: Open Mat

Sábado:
- 11:00–13:00: Grappling competición
- 13:00–14:30: Jiu-Jitsu

— TARIFAS —

- Todo incluido: 61,80 €/mes
- Anual: 556,20 €
- Estudiantes: 55,62 €
- Niños: 1 act. → 41,20 € / 2 acts. → 51,50 €
- Full Body: 36,05 €
- Excedencia: 12,88 €

— RESPONSABLES —

- Javier Arias: Silat, Kali, Stickfight, Defensa personal
- Jonatan González: MMA, K1, Grappling, Jiu-Jitsu adultos
- Fran Robles: Boxeo y K1 infantil
- Sergio Patricio: Jiu-Jitsu principiantes
- Nikolay Dimitrov: Grappling competición
- Alejandro García: Judo infantil
- Fran Crego: Jiu-Jitsu infantil
- Alex Álvarez: Judo general

— CONTACTO —

- WhatsApp: +34 654 75 65 46
- Email: academialegio@gmail.com
- Web: www.academialegiovii.com
- Instagram: @academia_legiovii

Si no sabes algo, di que no está disponible.
`
          },
          { role: 'user', content: userMessage }
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

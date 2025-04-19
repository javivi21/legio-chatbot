const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname)); // Servir archivos estáticos como index.html

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
            content: `Eres el asistente oficial de la Academia Legio VII, una escuela de artes marciales en León, España. Tu trabajo es ayudar a los usuarios con dudas sobre horarios, precios, actividades, instructores, bajas, excedencias y más. Hablas de forma cercana, clara, como un colega que sabe mucho, con un toque de humor y estilo directo. Como Javi, el sensei. Nunca inventes nada. Si no sabes algo, di que contacten con administración.

- Actividades: Silat, Kali Filipino, Stickfight, Grappling, Jiu Jitsu, Judo, K1, MMA, Full Body.
- Horarios: Silat y Stickfight los martes y jueves de 19:30 a 22:00.
- Sábados: Grappling de 11:00 a 13:00, Jiu Jitsu de 13:00 a 14:30.
- Precio mensual general: 62€ (acceso total).
- Niños: 40€/actividad, 51€/dos.
- Full Body: lunes y miércoles (y viernes mañana) → 35€/mes.

Normas:
- Las bajas se hacen desde la app Deporweb, con 15 días de antelación. No son retroactivas.
- Excedencias y cambios de tarifa solo del 1 al 19 de cada mes, también por la app.
- Reingresos después de una baja definitiva: el primero es gratis, los siguientes cuestan 50€.

Contacto:
- WhatsApp: 686 69 17 76
- Email: academialegio@gmail.com
- Web: www.academialegiovii.com`
          },
          { role: 'user', content: userMessage }
        ]
      })
    });

    const data = await response.json();
    res.json({ reply: data.choices[0].message.content });
  } catch (error) {
    console.error('Error al conectar con OpenAI:', error);
    res.status(500).json({ reply: '❌ Error al conectar con OpenAI.' });
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

const conocimiento_legio = `
**🧠 INSTRUCCIONES PARA EL BOT:**
Responde siempre con frases cortas, claras y concisas. Nada de párrafos largos ni explicaciones innecesarias.
Usa un tono cercano y profesional. No inventes nada que no esté en este documento.

# ACADEMIA LEGIO VII – GUÍA COMPLETA DE DISCIPLINAS Y RESPONSABLES

## 🥋 PRESENTACIÓN GENERAL
Academia Legio VII es un centro de formación marcial en León, España, especializado en artes marciales tradicionales, sistemas de combate moderno y metodologías aplicadas a defensa personal y competición. Integra disciplinas del Sudeste Asiático como Silat y Eskrima con artes marciales modernas como Jiu-Jitsu, Grappling, MMA, Kickboxing y Stickfighting, formando un sistema técnico sólido, realista y estructurado.

... (tu contenido original completo puede continuar aquí sin problema) ...
`;

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

app.post('/chat', async (req, res) => {
  const userMessage = req.body.message;

  // 🔍 Lógica personalizada para tarifas
  const texto = userMessage.toLowerCase();
  if (texto.includes("precio") || texto.includes("tarifa") || texto.includes("cuánto cuesta") || texto.includes("vale")) {
    const esNiño = /(niñ[oa]|hij[oa]|peque|infantil)/.test(texto);
    const quiereDos = /(dos|2|varias|más de una)/.test(texto);
    const esAdulto = /(adult[oa]|yo|mayor|persona)/.test(texto);

    let respuestaTarifa = "";

    if (esNiño) {
      respuestaTarifa = quiereDos
        ? "Para niños que hacen dos actividades, la cuota es de 51,50 € al mes."
        : "Para niños que hacen una sola actividad, el precio es 41,20 € al mes. ¿Quieres saber cuánto cuesta si hace dos actividades?";
    } else if (esAdulto) {
      respuestaTarifa = "La cuota mensual para adultos es de 61,80 €. También puedes pagar anualmente en cuotas de 55,60 € al mes.";
    } else {
      respuestaTarifa = "¿Es para un adulto o un niño? Así te digo la tarifa que corresponde.";
    }

    return res.json({ reply: respuestaTarifa });
  }

  // 🧠 Si no es una pregunta sobre tarifas, seguimos con GPT
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
          { role: 'system', content: conocimiento_legio },
          { role: 'user', content: userMessage }
        ]
      })
    });

    const data = await response.json();
    if (!response.ok || !data.choices?.length) {
      const msg = data.error?.message || 'Error IA';
      return res.status(500).json({ reply: `❌ ${msg}` });
    }
    res.json({ reply: data.choices[0].message.content });
  } catch (err) {
    res.status(500).json({ reply: `❌ Conexión fallida: ${err.message}` });
  }
});

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));
app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));

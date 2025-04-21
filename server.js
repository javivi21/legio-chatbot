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

# ACADEMIA LEGIO VII – DISCIPLINAS

Las disciplinas disponibles en la academia son: Silat, Kali, Stickfighting, MMA, Grappling, K1, Jiu-Jitsu, Judo, Defensa Personal, Full Body y Boxeo.

## BOXEO
Disciplina de golpeo enfocada en puños, desplazamientos, defensa y ritmo. Apta para adultos desde los 14 años.  
Modalidad técnica (sin contacto) y con contacto progresivo según nivel.  
Clases: Martes y Jueves de 18:30 a 20:00.  
Responsable: Fran Robles.

## TARIFAS 2025
• Adulto mensual: 61,80 €  
• Adulto anual (compromiso 12 meses): 55,60 €/mes  
• Niño (1 actividad): 41,20 €  
• Niño (2 actividades): 51,50 €  
• Full Body: 36,05 €/mes  
(No mostrar tarifa de excedencia salvo que se solicite explícitamente)
`;

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

app.post('/chat', async (req, res) => {
  const userMessage = req.body.message;
  const texto = userMessage.toLowerCase();

  // 🔍 Lógica personalizada para tarifas
  if (texto.includes("precio") || texto.includes("tarifa") || texto.includes("cuánto cuesta") || texto.includes("vale")) {
    const esNiño = /(niñ[oa]s?|hij[oa]s?|peque|infantil)/.test(texto);
    const quiereDos = /(dos|2|varias|más de una|doble|dos actividades)/.test(texto);
    const esAdulto = /(adult[oa]s?|mayor(es)?|yo|para mí|persona(s)?|gente grande)/.test(texto);

    let respuestaTarifa = "";

    if (esNiño) {
      respuestaTarifa = quiereDos
        ? "Para niños que hacen dos actividades, la cuota es de 51,50 € al mes."
        : "Para niños que hacen una sola actividad, el precio es 41,20 € al mes.";
    } else if (esAdulto) {
      respuestaTarifa = "Para adultos, la cuota mensual es de 61,80 €. También puedes pagar anualmente: 55,60 € al mes con compromiso de 12 meses.";
    } else {
      respuestaTarifa = `👉 Para adultos: 61,80 € al mes (o 55,60 € si pagas el año).  
👉 Para niños: 41,20 € por una actividad.  
¿Quieres saber cuánto cuesta hacer dos actividades infantiles? Te lo cuento.`;
    }

    return res.json({ reply: respuestaTarifa });
  }

  // 🧠 Si no es sobre precios, delegamos a OpenAI
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



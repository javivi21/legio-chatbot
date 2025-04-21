const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Aquí metemos TODO el contenido directamente:
const conocimiento_legio = `
**🧠 INSTRUCCIONES PARA EL BOT:**
Responde siempre con frases cortas, claras y concisas. Nada de párrafos largos ni explicaciones innecesarias.
Usa un tono cercano y profesional. No inventes nada que no esté en este documento.

# ACADEMIA LEGIO VII – GUÍA COMPLETA DE DISCIPLINAS Y RESPONSABLES

## 🥋 PRESENTACIÓN GENERAL
Academia Legio VII es un centro de formación marcial en León, España, especializado en artes marciales tradicionales, sistemas de combate moderno y metodologías aplicadas a defensa personal y competición. Integra disciplinas del Sudeste Asiático como Silat y Eskrima con artes marciales modernas como Jiu-Jitsu, Grappling, MMA, Kickboxing y Stickfighting, formando un sistema técnico sólido, realista y estructurado.

## 🥊 MMA – ARTES MARCIALES MIXTAS
Combina boxeo, kickboxing, muay thai, jiu-jitsu brasileño, lucha libre, sambo y judo. Derribos, sumisiones y golpeo de pie.
Beneficios físicos: fuerza, cardio, agilidad.  
Mentales: calma bajo presión, disciplina.  
Sociales: compañerismo y respeto.  
Seguridad: protección y tap.  
Principiantes: guarda la guardia, aprende jab, cross, derribos.
Responsable: Jonatan González. 
Responsable de mañanas de 11:30 Lunes y Miércoles: Isam Rachid.

## 🥋 KICKBOXING K1
Boxeo + patadas. Rodillazos OK, clinch corto, sin codos.
Beneficios: cardio brutal, fuerza de piernas y brazos.
Principiantes: precisión > potencia.
Responsable: Jonatan González.

## 🤼‍♂️ GRAPPLING
Fusión de BJJ no‑gi, lucha libre, sambo, judo suelo. Control y sumisión.
Beneficios: fuerza funcional y resistencia.  
Principiantes: posiciones básicas y shrimp.

## 🐅 PENCAK SILAT – BUKTI NEGARA
Biomecánica, palancas, sensibilidad (rasa), trabajo de pies (langkah).
Responsable: Javier Arias.

## 🇵🇭 KALI/Eskrima
Bastón, daga, espada, Panantukan, Dumog.
Responsable: Javier Arias.

## 🥢 STICKFIGHTING (DBMA)
Real contact con bastón.  
Responsable: Javier Arias.

## 🛡️ DEFENSA PERSONAL
Silat, Kali, Stickfight y Sambo aplicado a agresiones reales.
Responsable: Javier Arias.

## 🧒 JUDO
- Infantil: juegos y caídas (Alejandro García).
- Adultos: nage‑waza y randori (Alex Álvarez).

## 🥋 JIU‑JITSU
- Infantil: control sin sumisiones (Fran Crego).
- Principiantes: guardia y escapes (Sergio Patricio).
- Adultos: posiciones avanzadas (Jonatan González, Nikolay Dimitrov).

## BOXEO
- Adultos a partir de los 14 años. 
- Principiantes y avanzados, boxeo sin contacto, y con contacto según las adaptaciones
y deseos de los alumnos. 
Responsable es: Fran Robles. 

## 💪 FULL BODY LEGIO
Circuitos HIIT de fuerza y movilidad.  
Responsable: Equipo técnico Legio VII.

## 💰 TARIFAS (2025)
• Todo incluido: 61,80 €/mes  
• Anual (fracc.): 55,60 €/mes (total 667,20 €)  
• Estudiantes: 55,62 €/mes  
• Niños 1 act.: 41,20 €/mes  
• Niños 2 acts.: 51,50 €/mes  
• Full Body: 36,05 €/mes  
• Excedencia: 12,88 €/mes

## 📆 HORARIOS
**L y X:** 10:30–11:30 Full Body; 11:30–12:30 MMA/K1/Grappling; 17–18 MMA; 18–19 Grappling; 19–20 K1; 20–21:30 Jiu-Jitsu  
**M y J:** 12:30–13:30 Jiu-Jitsu; 17–18 K1 Infantil; 18–19 Judo/Jiu-Jitsu alternos; 18:30–20 Boxeo; 19:30–21:30 Silat/Kali/Stickfight; 20–21 Jiu-Jitsu principiantes  
**V:** Mañana libre / Tarde Open Mat  
**S:** 11–13 Grappling / 13–14:30 Jiu-Jitsu

## 📍 UBICACIÓN
Av. Emilio Hurtado, s/n – Resid. Emilio Hurtado (bajo), Local 6, 24007 León, España

## 📞 CONTACTO
WhatsApp: +34 654 75 65 46  
Email: academialegio@gmail.com  
Web: www.academialegiovii.com  
Instagram: @academia_legiovii

## 📲 APP
Deporweb: https://play.google.com/store/apps/details?id=com.sportconsulting.legiovii&pcampaignid=web_share
`;

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

// Este script carga el chatbot desde cualquier web externa (Hostinger, etc)
(function () {
  const style = document.createElement('style');
  style.innerHTML = `
    #chatbot-button-legio {
      position: fixed;
      bottom: 20px;
      right: 20px;
      background-color: #000;
      border: none;
      border-radius: 50%;
      width: 60px;
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
      cursor: pointer;
      z-index: 9999;
    }
    #chatbot-button-legio img {
      width: 30px;
      height: 30px;
    }
    #chatbot-container-legio {
      position: fixed;
      bottom: 90px;
      right: 20px;
      width: 320px;
      max-height: 500px;
      background-color: #1a1a1a;
      color: white;
      border-radius: 10px;
      box-shadow: 0 0 10px rgba(0,0,0,0.6);
      overflow: hidden;
      display: none;
      flex-direction: column;
      z-index: 9999;
    }
    #chatbot-header-legio {
      background-color: #000;
      display: flex;
      align-items: center;
      padding: 10px;
    }
    #chatbot-header-legio img {
      height: 32px;
      width: 32px;
      border-radius: 50%;
      margin-right: 10px;
    }
    #chatbot-header-legio span {
      font-weight: bold;
      font-size: 14px;
    }
    #chatbot-messages-legio {
      padding: 10px;
      flex: 1;
      overflow-y: auto;
      font-size: 14px;
      line-height: 1.4;
    }
    .user-msg, .bot-msg {
      margin-bottom: 10px;
    }
    .user-msg {
      text-align: right;
      color: #61dafb;
    }
    .bot-msg {
      text-align: left;
      color: #eee;
    }
    #chatbot-input-legio {
      display: flex;
      border-top: 1px solid #444;
    }
    #chatbot-input-legio input {
      flex: 1;
      padding: 10px;
      border: none;
      background: #2a2a2a;
      color: white;
    }
    #chatbot-input-legio button {
      padding: 0 15px;
      border: none;
      background: #444;
      color: white;
      cursor: pointer;
    }
  `;
  document.head.appendChild(style);

  const button = document.createElement('div');
  button.id = 'chatbot-button-legio';
  button.innerHTML = '<img src="https://raw.githubusercontent.com/javivi21/legio-chatbot/main/fondo%20-%20LEGIO%20CIRCULO%20NEGRO%20PECHO.png" alt="Chat" />';
  document.body.appendChild(button);

  const container = document.createElement('div');
  container.id = 'chatbot-container-legio';
  container.innerHTML = `
    <div id="chatbot-header-legio">
      <img src="https://raw.githubusercontent.com/javivi21/legio-chatbot/main/fondo%20-%20LEGIO%20CIRCULO%20NEGRO%20PECHO.png" alt="Logo">
      <span>Asistente Legio VII</span>
    </div>
    <div id="chatbot-messages-legio"></div>
    <div id="chatbot-input-legio">
      <input type="text" id="chat-input-legio" placeholder="Escribe aquí...">
      <button onclick="window.sendLegioChat()">Enviar</button>
    </div>
  `;
  document.body.appendChild(container);

  document.getElementById('chat-input-legio').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') window.sendLegioChat();
  });

  window.sendLegioChat = async function () {
    const input = document.getElementById('chat-input-legio');
    const messages = document.getElementById('chatbot-messages-legio');
    const text = input.value.trim();
    if (!text) return;
    messages.innerHTML += `<div class='user-msg'>Tú:<br>${text}</div>`;
    input.value = '';
    messages.scrollTop = messages.scrollHeight;
    try {
      const res = await fetch('https://legio-chatbot.onrender.com/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text })
      });
      const data = await res.json();
      messages.innerHTML += `<div class='bot-msg'>Bot:<br>${data.reply}</div>`;
      messages.scrollTop = messages.scrollHeight;
    } catch (err) {
      messages.innerHTML += `<div class='bot-msg'>Bot:<br>❌ Error al conectar con el servidor</div>`;
    }
  };

  button.onclick = () => {
    const c = document.getElementById('chatbot-container-legio');
    c.style.display = c.style.display === 'none' ? 'flex' : 'none';
  };
})();

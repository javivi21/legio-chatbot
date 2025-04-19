document.addEventListener("DOMContentLoaded", function () {
  const chatBubble = document.createElement("div");
  chatBubble.id = "chat-bubble";
  chatBubble.style = "position: fixed; bottom: 20px; right: 20px; width: 60px; height: 60px; border-radius: 50%; background: #000; cursor: pointer; z-index: 9999; box-shadow: 0 4px 12px rgba(0,0,0,0.3);";
  chatBubble.innerHTML = '<img src="https://raw.githubusercontent.com/javivi21/legio-chatbot/main/legio-logo.png" alt="Chat LegioBot" style="width: 100%; height: 100%; border-radius: 50%;">';
  
  const chatWindow = document.createElement("div");
  chatWindow.id = "chat-window";
  chatWindow.style = "position: fixed; bottom: 90px; right: 20px; width: 360px; height: 500px; background: #fff; border-radius: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.3); display: none; flex-direction: column; overflow: hidden; z-index: 9998;";
  chatWindow.innerHTML = '<iframe id="chat-frame" src="https://legio-chatbot.onrender.com" allow="clipboard-write" style="width: 100%; height: 100%; border: none;"></iframe>';

  document.body.appendChild(chatBubble);
  document.body.appendChild(chatWindow);

  chatBubble.addEventListener("click", () => {
    chatWindow.style.display = chatWindow.style.display === "flex" ? "none" : "flex";
  });
});
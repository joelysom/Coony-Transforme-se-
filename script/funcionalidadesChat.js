
  /* ===============================
     SELEÇÃO DOS ELEMENTOS
  ================================ */
  const emojiBtn = document.querySelector('.emoji-btn');
  const picker   = document.getElementById('emojiPicker');
  const msgInput = document.getElementById('msgInput');
  const sendBtn  = document.getElementById('sendBtn');
  const rolagem  = document.getElementById('rolagem'); // Div que segura todas as mensagens


  /* ===============================
     SISTEMA DE EMOJIS
  =============================== */

  // Abre/fecha o picker ao clicar no botão
  emojiBtn.addEventListener('click', () => {
    picker.classList.toggle('hidden');
  });

  // Fecha o picker clicando fora dele
  document.addEventListener('click', (e) => {
    const clicouFora =
      !picker.classList.contains('hidden') &&
      !picker.contains(e.target) &&
      !emojiBtn.contains(e.target);

    if (clicouFora) picker.classList.add('hidden');
  });

  // Insere o emoji selecionado no input
  picker.addEventListener('emoji-click', (event) => {
    msgInput.value += event.detail.unicode;
    msgInput.focus();
  });



  /* ===============================
     ENVIO DE MENSAGENS DE TEXTO
  =============================== */

  // Botão enviar
  sendBtn.addEventListener('click', sendMessage);

  // Enviar com Enter
  msgInput.addEventListener('keypress', e => {
    if (e.key === 'Enter') sendMessage();
  });

  // Função que cria e adiciona a mensagem
  function sendMessage() {
    const text = msgInput.value.trim();
    if (!text) return; // evita enviar vazio

    // Cria a div da mensagem
    const msg = document.createElement('div');
    msg.classList.add('message', 'sent');

    // Estrutura interna da mensagem
    msg.innerHTML = `
      <div class="bubble">
        <h3>Eu</h3>
        <p>${text}</p>
      </div>
      <img src="../../img/imgChat/persona2.jpg" class="avatar">
      <span class="time">${new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span>
    `;

    // Adiciona na área de rolagem
    rolagem.appendChild(msg);

    // Mantém a rolagem no final
    rolagem.scrollTop = rolagem.scrollHeight;

    msgInput.value = "";
  }


  /* ===============================
     ENVIO DE IMAGENS
  =============================== */
  const imgBtn   = document.getElementById('imgBtn');
  const imgInput = document.getElementById('imgInput');

  // Abre a galeria
  imgBtn.addEventListener('click', () => imgInput.click());

  // Quando o usuário escolhe a imagem
  imgInput.addEventListener('change', () => {
    const file = imgInput.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = function(e) {
      const imgURL = e.target.result;

      // Cria a mensagem
      const msg = document.createElement('div');
      msg.classList.add('message', 'sent');

      msg.innerHTML = `
        <div class="bubble image-bubble">
          <h3>Eu</h3>
          <img src="${imgURL}" class="sent-image">
        </div>
        <img src="../../img/imgChat/persona2.jpg" class="avatar">
        <span class="time">${new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span>
      `;

      rolagem.appendChild(msg);
      rolagem.scrollTop = rolagem.scrollHeight;

      imgInput.value = "";
    };

    reader.readAsDataURL(file);
  });



  /* ===============================
     GRAVAÇÃO E ENVIO DE ÁUDIO
  =============================== */

  const audioBtn    = document.getElementById("audioBtn");
  const recordTimer = document.getElementById("recordTimer");

  let mediaRecorder;
  let audioChunks = [];
  let isRecording = false;
  let timerInterval;
  let seconds = 0;

  // Inicia ou finaliza gravação ao clicar no botão
  audioBtn.addEventListener("click", async () => {
    if (!isRecording) {
      startRecording();
    } else {
      stopRecording();
    }
  });

  /* Inicia gravação de áudio */
  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      mediaRecorder = new MediaRecorder(stream);
      mediaRecorder.start();
      isRecording = true;

      audioChunks = [];

      mediaRecorder.ondataavailable = e => audioChunks.push(e.data);

      // Quando parar - envia automaticamente
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
        const audioURL = URL.createObjectURL(audioBlob);
        sendAudioMessage(audioURL);
      };

      // Inicia o timer
      seconds = 0;
      recordTimer.textContent = "00:00";
      recordTimer.classList.remove("hidden");
      audioBtn.classList.add("recording");

      timerInterval = setInterval(() => {
        seconds++;
        recordTimer.textContent = formatTime(seconds);
      }, 1000);

    } catch (err) {
      alert("Permissão ao microfone negada!");
    }
  }

  /* Finaliza a gravação */
  function stopRecording() {
    isRecording = false;
    audioBtn.classList.remove("recording");
    recordTimer.classList.add("hidden");

    clearInterval(timerInterval);
    mediaRecorder.stop();
  }

  /* Formata mm:ss */
  function formatTime(sec) {
    let m = String(Math.floor(sec / 60)).padStart(2, "0");
    let s = String(sec % 60).padStart(2, "0");
    return `${m}:${s}`;
  }

  /* Monta a mensagem de áudio no chat */
  function sendAudioMessage(audioURL) {
    const msg = document.createElement("div");
    msg.classList.add("message", "sent");

    msg.innerHTML = `
      <div class="bubble audio-bubble">
        <h3>Eu</h3>
        <audio controls src="${audioURL}" class="audio-msg"></audio>
      </div>
      <img src="../../img/imgChat/persona2.jpg" class="avatar">
      <span class="time">${new Date().toLocaleTimeString([], {hour:"2-digit", minute:"2-digit"})}</span>
    `;

    rolagem.appendChild(msg);
    rolagem.scrollTop = rolagem.scrollHeight;
  }
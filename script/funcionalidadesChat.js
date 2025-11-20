/* ===============================
   SELEÇÃO DOS ELEMENTOS
================================ */
const emojiBtn = document.querySelector('.emoji-btn');
const picker   = document.getElementById('emojiPicker');
const msgInput = document.getElementById('msgInput');
const sendBtn  = document.getElementById('sendBtn');
const rolagem  = document.getElementById('rolagem'); // Div que segura todas as mensagens


/* ===============================
   BOTÃO ENVIAR (ATIVO/DESATIVADO)
================================ */
function atualizarBotao() {
  const temTexto = msgInput.value.trim() !== "";

  sendBtn.classList.toggle("botaoEnviarAtivo", temTexto);
  sendBtn.classList.toggle("botaoDesativo", !temTexto);
  sendBtn.disabled = !temTexto; 
}

msgInput.addEventListener("input", atualizarBotao);


/* ===============================
   SISTEMA DE EMOJIS
================================ */

// Abre/fecha o picker ao clicar
emojiBtn.addEventListener('click', () => {
  picker.classList.toggle('hidden');
});

// Fecha o picker quando clica fora
document.addEventListener('click', (e) => {
  const clicouFora =
    !picker.classList.contains('hidden') &&
    !picker.contains(e.target) &&
    !emojiBtn.contains(e.target);

  if (clicouFora) picker.classList.add('hidden');
});

// Insere emoji no input
picker.addEventListener('emoji-click', (event) => {
  msgInput.value += event.detail.unicode;
  msgInput.focus();
  atualizarBotao(); // ativa botão se tiver emoji
});


/* ===============================
   ENVIO DE MENSAGENS (TEXTO)
================================ */

// Click no botão
sendBtn.addEventListener('click', sendMessage);

// Enter envia mensagem
msgInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    e.preventDefault();
    sendMessage();
  }
});

// Função principal de envio
function sendMessage() {
  const text = msgInput.value.trim();
  if (!text) return; // evita enviar vazio

  // cria div da mensagem
  const msg = document.createElement('div');
  msg.classList.add('message', 'sent');

  msg.innerHTML = `
    <div class="bubble">
      <h3>Eu</h3>
      <p>${text}</p>
    </div>
    <img src="../../img/imgChat/persona2.jpg" class="avatar">
    <span class="time">${new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}<span class="confirmacaoMsg">✓</span></span>
  `;

  rolagem.appendChild(msg);
  rolagem.scrollTop = rolagem.scrollHeight;

  // limpa e desativa botão
  msgInput.value = "";
  atualizarBotao();
}


/* ===============================
   ENVIO DE IMAGENS
================================ */
const imgBtn   = document.getElementById('imgBtn');
const imgInput = document.getElementById('imgInput');

// abre galeria
imgBtn.addEventListener('click', () => imgInput.click());

// após escolher imagem
imgInput.addEventListener('change', () => {
  const file = imgInput.files[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = function(e) {
    const imgURL = e.target.result;

    const msg = document.createElement('div');
    msg.classList.add('message', 'sent');

    msg.innerHTML = `
      <div class="bubble image-bubble">
        <h3>Eu</h3>
        <img src="${imgURL}" class="sent-image">
      </div>
      <img src="../../img/imgChat/persona2.jpg" class="avatar">
      <span class="time">${new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}<span class="confirmacaoMsg">✓</span></span>
    `;

    rolagem.appendChild(msg);
    rolagem.scrollTop = rolagem.scrollHeight;

    imgInput.value = "";
  };

  reader.readAsDataURL(file);
});


/* ===============================
   GRAVAÇÃO E ENVIO DE ÁUDIO
================================ */

const audioBtn    = document.getElementById("audioBtn");
const recordTimer = document.getElementById("recordTimer");

let mediaRecorder;
let audioChunks = [];
let isRecording = false;
let timerInterval;
let seconds = 0;

// Inicia/finaliza gravação
audioBtn.addEventListener("click", async () => {
  if (!isRecording) startRecording();
  else stopRecording();
});


/* Inicia gravação */
async function startRecording() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.start();
    isRecording = true;

    audioChunks = [];

    mediaRecorder.ondataavailable = e => audioChunks.push(e.data);

    mediaRecorder.onstop = () => {
      const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
      const audioURL = URL.createObjectURL(audioBlob);
      sendAudioMessage(audioURL);
    };

    // timer
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

/* Finaliza gravação */
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

/* Envia a mensagem de áudio */
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


/* ===============================
   CONTATOS ↔ CHAT NO MOBILE
================================ */

const contatosEl = document.querySelector(".contatos");
const chatEl = document.querySelector(".chat");
const voltarBtn = document.querySelector(".voltarBtn");
const listaContatos = document.getElementById("lista");

/* Botão voltar */
voltarBtn.addEventListener("click", () => {
  contatosEl.classList.remove("escondido");
  chatEl.classList.remove("ativo");
});


/* Mudança de páginas no mobile */
const sidebar = document.querySelector(".sidebar.contatos");
const chatArea = document.querySelector(".chat-app");

// Detecta se está no mobile
function isMobile() {
  return window.innerWidth <= 768;
}


// Botão de voltar, volta para lista de contatos
voltarBtn.addEventListener("click", () => {
  if (isMobile()) {
    sidebar.style.display = "flex";
    chatArea.style.display = "none";  
  }
});

// Quando a tela muda de tamanho (gira celular, etc.)
window.addEventListener("resize", () => {
  if (!isMobile()) {
    // no computador, tudo aparece
    sidebar.style.display = "block";
    chatArea.style.display = "flex";
  }
});


/* ---------- DADOS MOCK ---------- */
const contatosMock = [
  { nome: "Layza", avatar: "https://i.pravatar.cc/48?img=1", ultima: "Oi, tudo bem?", unread: 2 },
  { nome: "Bruno Dias", avatar: "https://i.pravatar.cc/48?img=2", ultima: "Até mais!", unread: 5 },
  { nome: "Carla Souza", avatar: "https://i.pravatar.cc/48?img=3", ultima: "Você viu o email?", unread: 1 },
  { nome: "Diego Rocha", avatar: "https://i.pravatar.cc/48?img=4", ultima: "Bora marcar?", unread: 4 },
  { nome: "Evelyn Lima", avatar: "https://i.pravatar.cc/48?img=5", ultima: "😂😂", unread: 3 },
  { nome: "Felipe Araújo", avatar: "https://i.pravatar.cc/48?img=6", ultima: "Ok, combinado.", unread: 0 },
  { nome: "Giovanna M.", avatar: "https://i.pravatar.cc/48?img=7", ultima: "Te ligo depois.", unread: 0 },
  { nome: "Henrique S.", avatar: "https://i.pravatar.cc/48?img=8", ultima: "Valeu!", unread: 5 }
];

/* ---------- UTILS ---------- */
const $ = (s) => document.querySelector(s);
const LS_KEY = "coony_chat_contato";

/* ELEMENTOS */

const chat = document.querySelector(".chat-app");

/* ---------- TELA CONTATOS ---------- */
function initContatos() {
  const lista = $("#lista");
  const busca = $("#busca");

  function renderiza(filtro = "") {
    lista.innerHTML = "";

    contatosMock
      .filter((c) => c.nome.toLowerCase().includes(filtro.toLowerCase()))
      .forEach((c) => {
        const li = document.createElement("li");
        li.className = "contact-card";

        li.innerHTML = `
          <img src="${c.avatar}" alt="${c.nome}" class="contact-card__avatar">
          <div class="contact-card__info">
            <div class="contact-card__name">${c.nome}</div>
            <div class="contact-card__last">${c.ultima}</div>
          </div>
          ${c.unread > 0 ? `<span class="contact-card__badge">${c.unread}</span>` : ''}
        `;

        // ABRIR CHAT AO CLICAR
        li.onclick = () => {
          c.unread = 0;
          localStorage.setItem(LS_KEY, JSON.stringify(c));
          abrirChat(c);
        };

        lista.appendChild(li);
      });
  }

  renderiza();
  busca.oninput = () => renderiza(busca.value);
}

/* ---------- ABRIR CHAT (CORRIGIDO) ---------- */
function abrirChat(contato) {
  const headerImg = document.querySelector(".chat-header .user img");
  const headerNome = document.querySelector(".chat-header .user-info h3");
  const mensagem = document.querySelector(".received"); 
  const sidebar = document.querySelector(".sidebar.contatos");
  const chat = document.querySelector(".chat-app");

  // atualizar o topo do chat
  headerImg.src = contato.avatar;
  headerNome.textContent = contato.nome;

  // Mensagem correta
  mensagem.innerHTML = `
    <div class="message received">
      <img src="${contato.avatar}" alt="${contato.nome}" class="avatar">
      <div class="bubble">
        <h3>${contato.nome}</h3>
        <p>oi!</p>
      </div>
      <span class="time">20:30</span>
    </div>
  `;

  // MODO MOBILE
  if (window.innerWidth <= 768) {
    sidebar.classList.add("escondido");  // esconde a lista
    chat.classList.add("ativo");         // mostra o chat
  }
}

/* ---------- BOTÃO VOLTAR ---------- */
voltarBtn.addEventListener("click", () => {
  if (window.innerWidth <= 768) {
    sidebar.classList.remove("escondido");
    chat.classList.remove("ativo");
  }
});

/* ---------- RESPONSIVIDADE ---------- */
window.addEventListener("resize", () => {
  if (window.innerWidth > 768) {
    sidebar.classList.remove("escondido");
    chat.classList.add("ativo");
  }
});

/* ---------- ROTEAMENTO ---------- */
window.onload = () => {
  if (location.pathname.includes("tela-chat.html")) {
    initContatos();
  }
};
 /* ===============================
   CONTATOS → ABRIR CHAT (MOBILE E DESKTOP)
================================ */

/* Detecta se está no mobile */
function isMobile() {
  return window.innerWidth <= 768;
}

/* ABRIR CHAT AO CLICAR NO CONTATO */
document.addEventListener("click", (e) => {
  const card = e.target.closest(".contact-card");
  if (!card) return;

  // Evita bugs de duplo clique
  const nome = card.querySelector(".contact-card__name")?.textContent;
  const avatar = card.querySelector(".contact-card__avatar")?.src;

  // Atualiza cabeçalho
  document.querySelector(".chat-header .user img").src = avatar;
  document.querySelector(".chat-header .user-info h3").textContent = nome;

  // Quando for mobile → troca para tela do chat
  if (isMobile()) {
    sidebar.classList.add("escondido"); 
    chatArea.classList.add("ativo");
  }
});

/* VOLTAR PARA LISTA DE CONTATOS */
voltarBtn.addEventListener("click", () => {
  if (isMobile()) {
    sidebar.classList.remove("escondido");
    chatArea.classList.remove("ativo");
  }
});

/* RESPONSIVIDADE (quando gira tela) */
window.addEventListener("resize", () => {
  if (!isMobile()) {
    sidebar.classList.remove("escondido");
    chatArea.classList.add("ativo");
  }
});

let pontuacao = 0;
let conquista = 0;
let cliqueMultiplicador = 1;
let ovosCaindo = false;
let cpsBonusAtivo = false;
let cliquesRecentes = [];
let intervaloOvos = null;
const body = document.getElementById('body');
localStorage.clear();
// localStorage.setItem("pontuacao", 0);

// CONFIGURAÇÃO DOS CURSORES
const cursores = {
  preto: { preco: 0, bonus: 1, nome: "Padrão", comprado: true },
  amarelo: { preco: 100, bonus: 2, nome: "Amarelo", comprado: false },
  azul: { preco: 500, bonus: 3, nome: "Rosa", comprado: false },
  cinza: { preco: 1000, bonus: 5, nome: "Cinza", comprado: false },
  //cinza: { preco: 3000, bonus: 8, nome: "Cinza", comprado: false },
};

let ponteirosAtivos = "preto";

// ---------------- Funções principais -----------------

function multiplicaPonto(vl) {
  return vl * cliqueMultiplicador;
}

function shop() {
  atualizarLoja();
  document.getElementById("modalShop").classList.remove("hidden");
}

function fecharShop() {
  document.getElementById("modalShop").classList.add("hidden");
}

function atualizarLoja() {
  const container = document.getElementById("itensLoja");
  container.innerHTML = "";

  for (const tipo in cursores) {
    if (tipo === "preto") continue; // não mostra o padrão
    const cursor = cursores[tipo];
    const botao = document.createElement("button");
    botao.textContent = `${cursor.nome} - ${cursor.preco} ovos ${cursor.comprado ? "(Comprado)" : ""}`;
    botao.onclick = () => setPonteiro(tipo);
    botao.disabled = cursor.comprado;
    container.appendChild(botao);
  }
}

function setPonteiro(tipo) {
  const cursor = cursores[tipo];

  if (!cursor.comprado) {
    if (pontuacao >= cursor.preco) {
      pontuacao -= cursor.preco;
      cursor.comprado = true;
      alert(`Você comprou o cursor ${cursor.nome}!`);
    } else {
      alert(`Você precisa de ${cursor.preco} ovos para comprar o cursor ${cursor.nome}.`);
      return;
    }
  }

  ponteirosAtivos = tipo;
  cliqueMultiplicador = cursor.bonus;

  switch (tipo) {
    case "preto":
      body.style.cursor = "auto";
      break;
    case "amarelo":
      body.style.cursor = "url('./img/poxa.png'), auto";
      break;
    case "azul":
      body.style.cursor = "url('./img/poxafotor.png'), auto";
      break;
    case "gold":
      body.style.cursor = "url('./img/gold.png'), auto";
      break;
    case "cinza":
      body.style.cursor = "url('./img/block.png'), auto";
      break;
  }

  document.getElementById("ovo").textContent = "Egg Score: " + pontuacao;
  fecharShop();
  salvarProgresso();
}

// ---------------- Efeitos e lógica do jogo -----------------

function iniciarQuedaDeOvos() {
  if (intervaloOvos !== null) return;
  ovosCaindo = true;
  intervaloOvos = setInterval(() => {
    const ovo = document.createElement("div");
    ovo.classList.add("ovo");
    ovo.style.left = Math.random() * 100 + "vw";
    document.getElementById("campo-ovos").appendChild(ovo);
    setTimeout(() => ovo.remove(), 3000);
  }, 800);
}

// ---------------- Sistema de progresso -----------------

function salvarProgresso() {
  localStorage.setItem("pontuacao", pontuacao);
  localStorage.setItem("conquista", conquista);
  localStorage.setItem("cursores", JSON.stringify(cursores));
}

function carregarProgresso() {
  pontuacao = parseInt(localStorage.getItem("pontuacao")) || 0;
  conquista = parseInt(localStorage.getItem("conquista")) || 0;

  const savedCursores = JSON.parse(localStorage.getItem("cursores"));
  if (savedCursores) Object.assign(cursores, savedCursores);

  document.getElementById("ovo").textContent = "Egg Score: " + pontuacao;
  document.getElementById("conquista").textContent = "Achievement: " + conquista;
}

// ---------------- Clique principal -----------------

document.getElementById("botao").addEventListener("click", function (event) {
  pontuacao += cliqueMultiplicador;
  document.getElementById("ovo").textContent = "Egg Score: " + pontuacao;
  salvarProgresso();

  const agora = Date.now();
  cliquesRecentes.push(agora);
  cliquesRecentes = cliquesRecentes.filter(t => agora - t <= 1000);
  const cps = cliquesRecentes.length;
  document.getElementById("cps").textContent = "CPS: " + cps;
  // Sistema de conquistas por CPS (pode expandir fácil)
  if (cps >= 20 && conquista < 3) {
    conquista = 3;
    alert("INSANO! 20 CPS! 🏆🏆🏆");
  } else if (cps >= 15 && conquista < 2) {
    conquista = 2;
    alert("CONQUISTA: 15 CPS! Muito rápido! 🔥");
  } else if (cps >= 10 && conquista < 1) {
    conquista = 1;
    alert("CONQUISTA DESBLOQUEADA: 10 CLICKS POR SEGUNDO! 🏆");
  }

  document.getElementById("conquista").textContent = "Achievement: " + conquista;
  salvarProgresso();
  const efeito = document.getElementById("efeito");
  efeito.style.left = event.clientX + "px";
  efeito.style.top = event.clientY + "px";
  efeito.style.opacity = 1;
  setTimeout(() => {
    efeito.style.opacity = 0;
  }, 300);
});

// ---------------- Inicialização -----------------

window.onload = function () {
  carregarProgresso();
  iniciarQuedaDeOvos();
};

const gameView = document.getElementById("gameView");
const achievementView = document.getElementById("achievementView");
const backButton = document.getElementById("backButton");

const conquistasPorJogo = {};

fetch("https://gist.githubusercontent.com/MarcosPCavaleiro/b7269a421e58380c3ce57b37597280ed/raw?nocache=" + Date.now())
  .then((res) => res.json())
  .then((data) => {
    Object.assign(conquistasPorJogo, data);
    renderGames();
    console.log("✅ conquistas.json carregado automaticamente do Gist");
  })
  .catch((err) => {
    console.warn("⚠️ Não foi possível carregar conquistas.json do Gist:", err);
  });



function renderGames() {
  gameView.innerHTML = "";
  for (const appID in conquistasPorJogo) {
    const jogo = conquistasPorJogo[appID];
    const card = document.createElement("div");
    card.onclick = () => openGame(appID);

    const img = document.createElement("img");
    img.src = `https://cdn.cloudflare.steamstatic.com/steam/apps/${appID}/library_600x900.jpg`;
    img.onerror = () => { img.src = "https://via.placeholder.com/200x300?text=Sem+Capa"; };

    const title = document.createElement("div");
    title.className = "game-title";
    title.textContent = jogo.game;

    card.appendChild(img);
    card.appendChild(title);
    gameView.appendChild(card);
    card.classList.add("game-card", "fade-in");
  }	
}

function openGame(appID) {
  gameView.style.display = "none";
  achievementView.style.display = "grid";
  backButton.style.display = "inline-block";
  achievementView.dataset.appID = appID;
  renderConquistas(appID);
}

function renderConquistas(appID) {
  const jogo = conquistasPorJogo[appID];
  const container = achievementView;
  container.innerHTML = "";

  const conquistasOrdenadas = [...jogo.conquistas].reverse();
  const conquistasRenderizadas = new Set();

  conquistasOrdenadas.forEach(data => {
    if (conquistasRenderizadas.has(data.achievement)) return;
    conquistasRenderizadas.add(data.achievement);

    const box = document.createElement("div");
    box.className = "achievement fade-in";

    const img = document.createElement("img");
    img.src = data.icon || "https://via.placeholder.com/64";

    const info = document.createElement("div");
    info.className = "achievement-info";

    const title = document.createElement("div");
    title.className = "achievement-title";

    let titleText = data.displayName;
    if (data.progress && !data.achieved) {
      const { current, max } = data.progress;
      const porcentagem = Math.floor((current / max) * 100);
      titleText += ` (${current}/${max} - ${porcentagem}%)`;
    }


    title.textContent = titleText;

    const desc = document.createElement("div");
    desc.className = "achievement-desc";
    desc.textContent = data.description || "Sem descrição";

    info.appendChild(title);
    info.appendChild(desc);

    if (data.progress && !data.achieved) {
       const bar = document.createElement("div");
       bar.className = "progress-bar";
       const fill = document.createElement("div");
       fill.className = "progress-fill";
       fill.style.width = `${(data.progress.current / data.progress.max) * 100}%`;
       bar.appendChild(fill);
       info.appendChild(bar);
    }


    if (data.time) {
      const timestampDiv = document.createElement("div");
      timestampDiv.className = "achievement-timestamp";
      const date = new Date(data.time * 1000);
      timestampDiv.textContent = `🕒 Conquistado em: ${date.toLocaleString("pt-BR")}`;
      info.appendChild(timestampDiv);
    }

    box.appendChild(img);
    box.appendChild(info);
    container.appendChild(box);
  });
}

backButton.onclick = () => {
  gameView.style.display = "grid";
  achievementView.style.display = "none";
  backButton.style.display = "none";
};


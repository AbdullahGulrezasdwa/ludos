document.addEventListener("DOMContentLoaded", () => {

  const startBtn = document.getElementById("startBtn");
  const playerCountInput = document.getElementById("playerCount");
  const namesDiv = document.getElementById("names");
  const gameSection = document.getElementById("game");
  const setupSection = document.getElementById("setup");
  const turnText = document.getElementById("turnText");
  const diceText = document.getElementById("diceText");
  const rollBtn = document.getElementById("rollBtn");

  const TOKENS_PER_PLAYER = 4;
  const COLORS = ["red","green","yellow","blue"];
  let players = [];
  let currentPlayerIndex = 0;

  // Create name inputs dynamically
  function createNameInputs() {
    namesDiv.innerHTML = "";
    for (let i = 0; i < playerCountInput.value; i++) {
      namesDiv.innerHTML += `<input id="name${i}" placeholder="Player ${i+1}"><br>`;
    }
  }

  playerCountInput.addEventListener("change", createNameInputs);
  createNameInputs();

  // Start game
  startBtn.onclick = () => {
    const numPlayers = parseInt(playerCountInput.value);
    players = [];

    for (let i = 0; i < numPlayers; i++) {
      const name = document.getElementById(`name${i}`).value || COLORS[i];
      players.push({
        name,
        color: COLORS[i],
        tokens: Array(TOKENS_PER_PLAYER).fill(0), // all tokens start at home (0)
        isCodeRed: name.toLowerCase() === "codered"
      });
    }

    setupSection.classList.add("hidden");
    gameSection.classList.remove("hidden");

    createBoard();
    renderTokens(players);
    turnText.textContent = `${players[currentPlayerIndex].name}'s turn`;
  };

  // Roll dice
  rollBtn.onclick = () => {
    const player = players[currentPlayerIndex];
    const dice = rollDice(player); // prank.js
    diceText.textContent = `Dice: ${dice}`;

    // Move first available token
    const tokenIndex = player.tokens.findIndex(t => t === 0 && dice === 6 || t > 0);
    if (tokenIndex !== -1) {
      moveToken(player, tokenIndex, dice);
      handleKills(players, currentPlayerIndex);
    }

    renderTokens(players);

    // Change turn if dice is not 6
    if (dice !== 6) {
      currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
    }

    turnText.textContent = `${players[currentPlayerIndex].name}'s turn`;
  };

  // Simplified token movement along 52-path
  function moveToken(player, index, dice) {
    if (player.tokens[index] === 0 && dice === 6) player.tokens[index] = 1;
    else if (player.tokens[index] > 0) {
      player.tokens[index] += dice;
      if (player.tokens[index] > 52) player.tokens[index] = 52;
    }
  }

  // Simplified kill logic
  function handleKills(players, currentIndex) {
    const current = players[currentIndex];
    current.tokens.forEach(pos => {
      if (pos === 0) return;
      players.forEach((other, idx) => {
        if (idx === currentIndex) return;
        other.tokens = other.tokens.map(t => t === pos ? 0 : t);
      });
    });
  }

  // Render tokens on board
  function renderTokens(players) {
    document.querySelectorAll(".cell").forEach(c => c.innerHTML = "");

    players.forEach(player => {
      player.tokens.forEach(pos => {
        if (pos === 0) return; // still at home
        const coord = PATH_POSITIONS[pos-1];
        if (!coord) return;

        const cell = document.querySelector(`.cell[data-row="${coord.row}"][data-col="${coord.col}"]`);
        if (!cell) return;

        const tokenDiv = document.createElement("div");
        tokenDiv.className = `token ${player.color}`;
        cell.appendChild(tokenDiv);
      });
    });
  }

});

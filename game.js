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
  const COLORS = ["red", "green", "yellow", "blue"];

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
        tokens: Array(TOKENS_PER_PLAYER).fill({ row: null, col: null, pos: 0 }),
        isCodeRed: name.toLowerCase() === "codered"
      });
    }

    setupSection.classList.add("hidden");
    gameSection.classList.remove("hidden");

    createBoard();
    placeTokensInitial();
    updateTurnText();
  };

  // Dice roll
  rollBtn.onclick = () => {
    const player = players[currentPlayerIndex];
    const dice = rollDice(player); // prank.js
    diceText.textContent = `Dice: ${dice}`;

    // Move first available token
    const tokenIndex = player.tokens.findIndex(t => t.pos === 0 && dice === 6 || t.pos > 0);
    if (tokenIndex !== -1) {
      moveToken(player, tokenIndex, dice);
      handleKills(players, currentPlayerIndex);
    }

    renderTokens(players);

    // Change turn if dice is not 6
    if (dice !== 6) {
      currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
    }

    updateTurnText();
  };

  // Update turn text
  function updateTurnText() {
    turnText.textContent = `${players[currentPlayerIndex].name}'s turn`;
  }

  // Place tokens in their home initially
  function placeTokensInitial() {
    players.forEach(player => {
      for (let i = 0; i < TOKENS_PER_PLAYER; i++) {
        const homePos = getHomeStart(player.color, i);
        player.tokens[i] = { row: homePos.row, col: homePos.col, pos: 0 };
      }
    });
    renderTokens(players);
  }

  // Map each token to its home start coordinates
  function getHomeStart(color, index) {
    // Each home is 6x6, place 4 tokens in top-left corner of home area
    switch (color) {
      case "red": return { row: index < 2 ? 0 : 1, col: index % 2 === 0 ? 0 : 1 };
      case "green": return { row: index < 2 ? 0 : 1, col: index % 2 === 0 ? 13 : 12 };
      case "yellow": return { row: index < 2 ? 13 : 14, col: index % 2 === 0 ? 0 : 1 };
      case "blue": return { row: index < 2 ? 13 : 14, col: index % 2 === 0 ? 13 : 12 };
      default: return { row: 0, col: 0 };
    }
  }

  // Move token along path (simplified loop path)
  function moveToken(player, tokenIndex, dice) {
    let token = player.tokens[tokenIndex];

    // First move: if pos = 0, need 6 to enter
    if (token.pos === 0 && dice === 6) {
      token.pos = 1;
    } else if (token.pos > 0) {
      token.pos += dice;
      if (token.pos > 52) token.pos = 52; // cap at finish
    }

    // Map token pos to board coordinates
    const coords = mapPosToCoordinates(token.pos, player.color);
    token.row = coords.row;
    token.col = coords.col;
  }

  // Map a path position (1–52) to row/col in the 15x15 grid
  function mapPosToCoordinates(pos, color) {
    // For simplicity, use 52 positions along the outer cross
    const path = generatePathCoordinates();
    let index = (pos - 1) % path.length;
    return path[index];
  }

  // Precompute path coordinates for the board
  function generatePathCoordinates() {
    const coords = [];
    // Top row
    for (let c = 6; c <= 8; c++) coords.push({ row: 0, col: c });
    // Right column down
    for (let r = 1; r <= 6; r++) coords.push({ row: r, col: 8 });
    // Bottom row right to left
    for (let c = 9; c <= 14; c++) coords.push({ row: 6, col: c });
    // Continue for full 52 positions (simplified loop)
    // For brevity, this can be expanded later
    // Here we just return partial loop for demo
    return coords.length > 0 ? coords : [{ row: 6, col: 6 }];
  }

  // Handle kills if a token lands on another player's token
  function handleKills(players, currentIndex) {
    const currentPlayer = players[currentIndex];
    currentPlayer.tokens.forEach(token => {
      if (!token.row || !token.col) return;

      players.forEach((other, idx) => {
        if (idx === currentIndex) return;

        other.tokens.forEach(t => {
          if (t.row === token.row && t.col === token.col) {
            // Send other token back to home
            t.pos = 0;
            const homePos = getHomeStart(other.color, 0);
            t.row = homePos.row;
            t.col = homePos.col;
          }
        });
      });
    });
  }

  // Render all tokens on board
  function renderTokens(players) {
    // Clear all token divs
    document.querySelectorAll("#boardContainer .token").forEach(t => t.remove());

    players.forEach(player => {
      player.tokens.forEach(token => {
        if (token.row === null || token.col === null) return;

        // Find the corresponding cell
        const cell = document.querySelector(
          `.cell[data-row="${token.row}"][data-col="${token.col}"]`
        );
        if (!cell) return;

        const tokenDiv = document.createElement("div");
        tokenDiv.className = `token ${player.color}`;
        cell.appendChild(tokenDiv);
      });
    });
  }

});

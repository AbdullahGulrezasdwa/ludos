// Map token position to board coordinates, including finishing lane
function mapPosToCoordinates(pos, playerColor) {
  if (pos === 0) return { row: null, col: null }; // at home

  // Main path 1–52
  if (pos >= 1 && pos <= 52) {
    return PATH_POSITIONS[pos - 1];
  }

  // Finish lane 53+
  const finishIndex = pos - 53; // 53–58 for finish lane
  if (finishIndex >= 0 && finishIndex < FINISH_POSITIONS[playerColor].length) {
    return FINISH_POSITIONS[playerColor][finishIndex];
  }

  // Center reached
  return { row: 7, col: 7 };
}

// Move token along path + finishing lane
function moveToken(player, tokenIndex, dice) {
  let token = player.tokens[tokenIndex];

  if (token === 0 && dice === 6) {
    player.tokens[tokenIndex] = 1; // enter path
  } else if (token > 0 && token <= 52) {
    let nextPos = token + dice;
    if (nextPos > 52) nextPos = 52 + (nextPos - 52); // move to finish lane
    player.tokens[tokenIndex] = nextPos;
  } else if (token > 52) {
    let nextFinish = token + dice;
    if (nextFinish > 58) nextFinish = 58; // cap at center
    player.tokens[tokenIndex] = nextFinish;
  }
}        color: COLORS[i],
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

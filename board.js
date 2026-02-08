// Updated board.js with finishing lanes

const BOARD_SIZE = 15;
const PATH_POSITIONS = []; // 52 main path positions
const FINISH_POSITIONS = { red: [], green: [], yellow: [], blue: [] };
const SAFE_CELLS = [];

function createBoard() {
  const container = document.getElementById("boardContainer");
  container.innerHTML = "";

  // Generate 15x15 grid
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");

      // Home areas
      if (row < 6 && col < 6) cell.classList.add("home", "red");
      else if (row < 6 && col > 8) cell.classList.add("home", "green");
      else if (row > 8 && col < 6) cell.classList.add("home", "yellow");
      else if (row > 8 && col > 8) cell.classList.add("home", "blue");
      // Central cross path
      else if ((row === 6 || row === 8) || (col === 6 || col === 8)) cell.classList.add("path");
      // Center safe
      else if ((row === 6 || row === 7 || row === 8) && (col === 6 || col === 7 || col === 8)) cell.classList.add("safe");
      else cell.style.backgroundColor = "#f9f9f9";

      cell.dataset.row = row;
      cell.dataset.col = col;

      container.appendChild(cell);
    }
  }

  generatePathCoordinates();
  generateFinishCoordinates();
}

// Main 52-position path (clockwise)
function generatePathCoordinates() {
  PATH_POSITIONS.length = 0;

  // Top column
  for (let r = 0; r <= 5; r++) PATH_POSITIONS.push({ row: r, col: 6 });
  // Top row
  for (let c = 6; c <= 13; c++) PATH_POSITIONS.push({ row: 5, col: c });
  // Right column
  for (let r = 5; r <= 12; r++) PATH_POSITIONS.push({ row: r, col: 13 });
  // Bottom row
  for (let c = 12; c >= 1; c--) PATH_POSITIONS.push({ row: 12, col: c });
  // Left column
  for (let r = 11; r >= 0; r--) PATH_POSITIONS.push({ row: r, col: 1 });
  // Top row to center
  for (let c = 1; c <= 6; c++) PATH_POSITIONS.push({ row: 0, col: c });

  // Safe zones (classic Ludo)
  SAFE_CELLS.length = 0;
  SAFE_CELLS.push(0, 8, 13, 21, 26, 34, 39, 47);
}

// Finish lanes for each color (6 positions each)
function generateFinishCoordinates() {
  FINISH_POSITIONS.red = [];
  for (let r = 1; r <= 6; r++) FINISH_POSITIONS.red.push({ row: r, col: 7 });

  FINISH_POSITIONS.green = [];
  for (let c = 7; c <= 12; c++) FINISH_POSITIONS.green.push({ row: 7, col: c });

  FINISH_POSITIONS.yellow = [];
  for (let r = 7; r <= 12; r++) FINISH_POSITIONS.yellow.push({ row: r, col: 7 });

  FINISH_POSITIONS.blue = [];
  for (let c = 1; c <= 6; c++) FINISH_POSITIONS.blue.push({ row: 7, col: c });
}

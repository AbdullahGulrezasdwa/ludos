// Full Ludo Board with cross and path positions

const BOARD_SIZE = 15; // 15x15 grid
const PATH_POSITIONS = []; // Will hold 52 main path coordinates
const SAFE_CELLS = [];    // Positions in path that are safe

function createBoard() {
  const container = document.getElementById("boardContainer");
  container.innerHTML = "";

  // Generate 15x15 cells
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");

      // Home areas
      if (row < 6 && col < 6) cell.classList.add("home", "red");
      else if (row < 6 && col > 8) cell.classList.add("home", "green");
      else if (row > 8 && col < 6) cell.classList.add("home", "yellow");
      else if (row > 8 && col > 8) cell.classList.add("home", "blue");
      // Path cells (central cross)
      else if ((row === 6 || row === 8) || (col === 6 || col === 8)) {
        cell.classList.add("path");
      } 
      // Center safe zone
      else if ((row === 6 || row === 7 || row === 8) && (col === 6 || col === 7 || col === 8)) {
        cell.classList.add("safe");
      } 
      else {
        cell.style.backgroundColor = "#f9f9f9";
      }

      cell.dataset.row = row;
      cell.dataset.col = col;

      container.appendChild(cell);
    }
  }

  // Generate 52 path coordinates in clockwise order
  generatePathCoordinates();
}

// Create the 52 positions around the board
function generatePathCoordinates() {
  PATH_POSITIONS.length = 0;

  // Top row (left to right)
  for (let c = 6; c <= 8; c++) PATH_POSITIONS.push({ row: 0, col: c });
  for (let r = 1; r <= 5; r++) PATH_POSITIONS.push({ row: r, col: 8 });
  for (let c = 9; c <= 14; c++) PATH_POSITIONS.push({ row: 6, col: c });
  for (let r = 7; r <= 8; r++) PATH_POSITIONS.push({ row: r, col: 14 });
  for (let c = 13; c >= 8; c--) PATH_POSITIONS.push({ row: 8, col: c });
  for (let r = 9; r <= 14; r++) PATH_POSITIONS.push({ row: r, col: 8 });
  for (let c = 7; c >= 0; c--) PATH_POSITIONS.push({ row: 8, col: c });
  for (let r = 7; r >= 6; r--) PATH_POSITIONS.push({ row: r, col: 0 });

  // 52 positions completed

  // Mark safe zones
  SAFE_CELLS.length = 0;
  SAFE_CELLS.push(0, 8, 13, 21, 26, 34, 39, 47); // indices in PATH_POSITIONS array
}

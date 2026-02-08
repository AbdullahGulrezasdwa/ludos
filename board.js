// Board.js — renders the classic Ludo King board

const BOARD_SIZE = 15; // 15x15 grid
const HOME_SIZE = 6;   // 6x6 home areas

// Safe path positions (for reference)
const SAFE_CELLS = [
  {row: 0, col: 6}, {row: 0, col: 8},
  {row: 6, col: 0}, {row: 8, col: 0},
  {row: 14, col: 6}, {row: 14, col: 8},
  {row: 6, col: 14}, {row: 8, col: 14},
  {row: 6, col: 6}, {row: 6, col: 8},
  {row: 8, col: 6}, {row: 8, col: 8}
];

function createBoard() {
  const container = document.getElementById("boardContainer");
  container.innerHTML = "";
  
  // Create 15x15 grid
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");

      // Determine type of cell
      // Top-left home
      if (row < 6 && col < 6) cell.classList.add("home", "red");
      // Top-right home
      else if (row < 6 && col > 8) cell.classList.add("home", "green");
      // Bottom-left home
      else if (row > 8 && col < 6) cell.classList.add("home", "yellow");
      // Bottom-right home
      else if (row > 8 && col > 8) cell.classList.add("home", "blue");
      // Path cells (central cross)
      else if (
        (col === 6 || col === 8) || 
        (row === 6 || row === 8)
      ) {
        cell.classList.add("path");

        // Safe zones
        if (SAFE_CELLS.some(pos => pos.row === row && pos.col === col)) {
          cell.classList.add("safe");
        }
      } 
      // Middle 2x2 square (center)
      else if ((row === 6 || row === 7 || row === 8) && (col === 6 || col === 7 || col === 8)) {
        cell.classList.add("safe"); // center is safe
      } 
      else {
        cell.style.backgroundColor = "#f9f9f9"; // empty cell
      }

      // Set data-row and data-col for token placement
      cell.dataset.row = row;
      cell.dataset.col = col;

      container.appendChild(cell);
    }
  }
}

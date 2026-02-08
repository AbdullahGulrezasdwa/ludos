// prank.js — subtle advantage for player named "codered"

// dice roll function with prank
function rollDice(player) {
  let roll = Math.floor(Math.random() * 6) + 1; // normal dice 1–6

  // Codered advantage: ~12% chance to increase dice by 1
  if (player.isCodeRed && roll < 6 && Math.random() < 0.12) {
    roll += 1;
    console.log("Codered bonus activated!"); // optional debug
  }

  return roll;
}

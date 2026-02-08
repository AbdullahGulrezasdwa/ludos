// Map token position to coordinates
function mapPosToCoordinates(pos, playerColor) {
  if (pos === 0) {
    // Token still in home
    return { row: null, col: null };
  } else if (pos > 0 && pos <= 52) {
    return PATH_POSITIONS[pos - 1];
  } else {
    // Finishing lane: can extend later
    return { row: 7, col: 7 }; // center for now
  }
}

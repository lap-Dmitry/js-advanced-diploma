export function calcTileType(index, boardSize) {
  // TODO: write logic here
  if (index % 8 === 0) {
    if (index < boardSize) {
      return 'top-left';
    }
    if (index >= boardSize ** 2 - boardSize) {
      return 'bottom-left';
    }
    return 'left';
  }
  if (index % 8 === 7) {
    if (index < boardSize) {
      return 'top-right';
    }
    if (index >= boardSize ** 2 - boardSize) {
      return 'bottom-right';
    }
    return 'right';
  }
  if (index < boardSize) {
    return 'top';
  }
  if (index >= boardSize ** 2 - boardSize) {
    return 'bottom';
  }
  return 'center';
}

export function calcHealthLevel(health) {
  if (health < 15) {
    return 'critical';
  }

  if (health < 50) {
    return 'normal';
  }

  return 'high';
}

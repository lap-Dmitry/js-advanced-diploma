/**
 * Generates random characters
 *
 * @param allowedTypes iterable of classes
 * @param maxLevel max character level
 * @returns Character type children (ex. Magician, Bowman, etc)
 */
export function* characterGenerator(allowedTypes, maxLevel) {
  // TODO: write logic here
  const rand = Math.floor(Math.random() * allowedTypes.length);
  const genCharacter = Object.create(allowedTypes[rand]);

  genCharacter.level = Math.floor(1 + Math.random() * maxLevel);
  yield genCharacter;
}

export function generateTeam(allowedTypes, maxLevel, characterCount) {
  // TODO: write logic here
  const team = [];
  for (let i = 0; i < characterCount; i += 1) {
    team.push(characterGenerator(allowedTypes, maxLevel).next().value);
  }
  return team;
}

export function* positionGenerator(lines, boarSize) {
  if (Math.floor(lines) > boarSize - 1) {
    throw new Error('Line`s number greater than board size!');
  }

  const allBoard = [...Array(boarSize ** 2).keys()];
  const positionsArray = allBoard.filter((position) => lines.includes(position % boarSize));

  for (let i = positionsArray.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [positionsArray[i], positionsArray[j]] = [positionsArray[j], positionsArray[i]];
  }

  for (const position of positionsArray) {
    yield position;
  }
}

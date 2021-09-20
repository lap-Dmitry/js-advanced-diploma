import Character from './Character';

export default class PositionedCharacter {
  constructor(character, position) {
    if (!(character instanceof Character)) {
      throw new Error('character must be instance of Character or its children');
    }

    if (typeof position !== 'number') {
      throw new Error('position must be a number');
    }

    this.character = character;
    this.position = position;
  }

  get stepCells() {
    const boarSize = 8;
    const stepsArray = [this.position];
    const positionLine = this.position % boarSize;

    for (let i = 1; i < this.character.stepRadius; i += 1) {
      const top = this.position - boarSize * i;
      const bottom = this.position + boarSize * i;
      const left = this.position - 1 * i;
      const right = this.position + 1 * i;
      const topLeft = this.position - boarSize * i - i;
      const topRight = this.position - boarSize * i + i;
      const bottomLeft = this.position + boarSize * i - i;
      const bottomRight = this.position + boarSize * i + i;

      if (top >= 0) {
        stepsArray.push(top);
      }
      if (bottom < boarSize ** 2) {
        stepsArray.push(bottom);
      }
      if (left % boarSize < positionLine && left >= 0) {
        stepsArray.push(left);
      }
      if (right % boarSize > positionLine && left < boarSize ** 2) {
        stepsArray.push(right);
      }
      if (topLeft % boarSize < positionLine && topLeft >= 0) {
        stepsArray.push(topLeft);
      }
      if (topRight % boarSize > positionLine && topRight >= 0) {
        stepsArray.push(topRight);
      }
      if (bottomLeft % boarSize < positionLine && bottomLeft < boarSize ** 2) {
        stepsArray.push(bottomLeft);
      }
      if (bottomRight % boarSize > positionLine && bottomRight < boarSize ** 2) {
        stepsArray.push(bottomRight);
      }
    }
    return stepsArray;
  }

  get attackCells() {
    const boarSize = 8;
    const attackArray = [];

    const rowStart = Math.floor(this.position / boarSize) - this.character.attackRadius >= 0
      ? Math.floor(this.position / boarSize) - this.character.attackRadius : 0;
    const rowEnd = Math.floor(this.position / boarSize) + this.character.attackRadius < boarSize
      ? Math.floor(this.position / boarSize) + this.character.attackRadius : boarSize - 1;
    const lineStart = (this.position % boarSize) - this.character.attackRadius >= 0
      ? (this.position % boarSize) - this.character.attackRadius : 0;
    const lineEnd = (this.position % boarSize) + this.character.attackRadius < boarSize
      ? (this.position % boarSize) + this.character.attackRadius : boarSize - 1;

    for (let i = rowStart; i <= rowEnd; i += 1) {
      for (let j = lineStart; j <= lineEnd; j += 1) {
        attackArray.push(i * boarSize + j);
      }
    }
    return attackArray;
  }
}

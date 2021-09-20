export default class Character {
  constructor(level, type) {
    this.level = level;
    this.attack = 0;
    this.defence = 0;
    this.health = 50;
    this.type = type;
    this.type = 'generic';
    // TODO: throw error if user use "new Character()"
    if (new.target.name === 'Character') {
      throw new Error('Do not use new Character()');
    }
  }
}

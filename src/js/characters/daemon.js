import Character from '../Character';

export default class Daemon extends Character {
  constructor(level, type) {
    super(level, type);
    this.attack = 10;
    this.defence = 40;
    this.stepRadius = 1;
    this.attackRadius = 4;
    this.type = 'daemon';
  }
}

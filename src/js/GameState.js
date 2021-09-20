import Bowman from './characters/bowman';
import Daemon from './characters/daemon';
import Magician from './characters/magician';
import Swordsman from './characters/swordsman';
import Undead from './characters/undead';
import Vampire from './characters/vampire';
import PositionedCharacter from './PositionedCharacter';

export default class GameState {
  constructor(turn, level, score, bestScore, player, enemy) {
    // TODO: create object
    this.turn = turn;
    this.level = level;
    this.score = score;
    this.bestScore = bestScore;
    this.playerTeam = player;
    this.enemyTeam = enemy;
  }

  from(object) {
    this.turn = object.turn;
    this.level = object.level;
    this.score = object.score;
    this.bestScore = object.bestScore;
    this.player = [];
    this.enemy = [];

    for (const anotherOne of object.player) {
      let newChar = 0;
      switch (anotherOne.type) {
        case 'swordsman':
          newChar = new Swordsman(anotherOne.member.character.level);
          break;
        case 'bowman':
          newChar = new Bowman(anotherOne.member.character.level);
          break;
        case 'magician':
          newChar = new Magician(anotherOne.member.character.level);
          break;
        default:
          throw new Error('It is not player classes!');
      }

      for (const stats in anotherOne.member.character) {
        if ({}.hasOwnProperty.call(anotherOne.member.character, stats)) {
          newChar[stats] = anotherOne.member.character[stats];
        }
      }
      this.player.push(
        {
          type: anotherOne.type,
          member: new PositionedCharacter(newChar, anotherOne.member.position),
        },
      );
    }

    for (const anotherOne of object.enemy) {
      let newChar = 0;
      switch (anotherOne.type) {
        case 'vampire':
          newChar = new Vampire(anotherOne.member.character.level);
          break;
        case 'daemon':
          newChar = new Daemon(anotherOne.member.character.level);
          break;
        case 'undead':
          newChar = new Undead(anotherOne.member.character.level);
          break;
        default:
          throw new Error('It is not enemy classes!');
      }

      for (const stats in anotherOne.member.character) {
        if ({}.hasOwnProperty.call(anotherOne.member.character, stats)) {
          newChar[stats] = anotherOne.member.character[stats];
        }
      }
      this.enemy.push(
        {
          type: anotherOne.type,
          member: new PositionedCharacter(newChar, anotherOne.member.position),
        },
      );
    }
  }

  set playerTeam(positioned) {
    this.player = [];
    for (const member of positioned) {
      this.player.push({ type: member.character.type, member });
    }
  }

  get playerTeam() {
    return this.player.map((anotherOne) => anotherOne.member);
  }

  set enemyTeam(positioned) {
    this.enemy = [];
    for (const member of positioned) {
      this.enemy.push({ type: member.character.type, member });
    }
  }

  get enemyTeam() {
    return this.enemy.map((anotherOne) => anotherOne.member);
  }
}

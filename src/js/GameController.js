import GamePlay from './GamePlay';
import GameState from './GameState';
import themes from './themes';
import Team from './Team';
import EnemyTeam from './EnemyTeam';

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.playerTeam = new Team();
    this.enemyTeam = new EnemyTeam();
    this.selectedCharacter = 0;
  }

  init() {
    // TODO: add event listeners to gamePlay events
    // TODO: load saved stated from stateService
    this.playerTeam.init();
    this.enemyTeam.init();

    const bestScore = this.state !== undefined ? this.state.bestScore : 0;
    this.state = new GameState(
      0, 0, 0, bestScore, this.playerTeam.positioned, this.enemyTeam.positioned,
    );

    this.gamePlay.drawUi(themes[this.state.level % 4]);
    this.gamePlay.redrawPositions([...this.playerTeam.positioned, ...this.enemyTeam.positioned]);
    this.gamePlay.setBestScore(this.state.bestScore);

    this.addListeners();
  }

  addListeners() {
    this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this));
    this.gamePlay.addCellLeaveListener(this.onCellLeave.bind(this));
    this.gamePlay.addCellClickListener(this.onCellClick.bind(this));
    this.gamePlay.addNewGameListener(this.onNewGameClick.bind(this));
    this.gamePlay.addSaveGameListener(this.onSaveGameClick.bind(this));
    this.gamePlay.addLoadGameListener(this.onLoadGameClick.bind(this));
  }

  onCellClick(index) {
    // TODO: react to click
    if (this.state.turn === 0) {
      if (!this.selectedCharacter || this.checkCell(index).action === 'team') {
        const characterOnIndex = this.playerTeam.positioned
          .find((character) => character.position === index);
        if (characterOnIndex !== undefined) {
          if (this.selectedCharacter) {
            this.gamePlay.deselectCell(this.selectedCharacter.position);
          }
          this.gamePlay.selectCell(index);
          this.selectedCharacter = characterOnIndex;
        } else {
          GamePlay.showMessage('Select your warrior!');
        }
      } else if (this.checkCell(index).action === 'not') {
        GamePlay.showMessage('This move is not allowed!');
      } else if (this.checkCell(index).action === 'step') {
        this.gamePlay.deselectCell(this.selectedCharacter.position);
        this.selectedCharacter.position = index;
        this.changeTurn(index);
      } else if (this.checkCell(index).action === 'attack') {
        const promise = this.attack(this.selectedCharacter.position, index);
        promise.then(() => this.changeTurn(index));
      }
    }
  }

  onCellEnter(index) {
    // TODO: react to mouse enter
    const characterOnIndex = [...this.playerTeam.positioned, ...this.enemyTeam.positioned]
      .find((character) => character.position === index);
    if (this.characterOnIndex !== undefined) {
      this.gamePlay.showCellTooltip(`🎖${characterOnIndex.character.level} ⚔${characterOnIndex.character.attack} 🛡${characterOnIndex.character.defence} ❤${+characterOnIndex.character.health.toFixed(2)}`, index);
    }
    if (this.selectedCharacter) {
      const selector = this.checkCell(index);
      if (selector.color) {
        this.gamePlay.selectCell(index, selector.color);
      }
      this.gamePlay.setCursor(selector.cursor);
    }
  }

  onCellLeave(index) {
    // TODO: react to mouse leave
    this.gamePlay.hideCellTooltip(index);
    this.gamePlay.setCursor('auto');
    if (this.selectedCharacter.position !== index) {
      this.gamePlay.deselectCell(index);
    }
  }

  onNewGameClick() {
    this.playerTeam.positioned = [];
    this.enemyTeam.positioned = [];
    this.selectedCharacter = 0;
    this.gamePlay.cellClickListeners = [];
    this.gamePlay.cellEnterListeners = [];
    this.gamePlay.cellLeaveListeners = [];
    this.gamePlay.newGameListeners = [];
    this.gamePlay.saveGameListeners = [];
    this.gamePlay.loadGameListeners = [];
    this.init();
  }

  onSaveGameClick() {
    this.state.playerTeam = this.playerTeam.positioned;
    this.state.enemyTeam = this.enemyTeam.positioned;
    this.stateService.save(this.state);
    GamePlay.showMessage('Game saved!');
  }

  onLoadGameClick() {
    try {
      this.state.from(this.stateService.load());
    } catch (e) {
      GamePlay.showError(e.message);
    }
    this.playerTeam.positioned = this.state.playerTeam;
    this.enemyTeam.positioned = this.state.enemyTeam;
    this.gamePlay.drawUi(themes[this.state.level % 4]);
    this.gamePlay.redrawPositions([...this.playerTeam.positioned, ...this.enemyTeam.positioned]);
    this.gamePlay.setScore(this.state.score);
    this.gamePlay.setBestScore(this.state.bestScore);
    this.gamePlay.setLevel(this.state.level);
  }

  checkCell(index) {
    if (this.selectedCharacter.position === index) {
      return { action: 'self', cursor: 'auto' };
    }
    if (this.playerTeam.positioned.find((character) => character.position === index)) {
      return { action: 'team', cursor: 'pointer' };
    }
    if (this.selectedCharacter.attackCells.includes(index)
    && this.enemyTeam.positioned.find((character) => character.position === index)) {
      return { action: 'attack', cursor: 'crosshair', color: 'red' };
    }
    if (this.selectedCharacter.stepCells.includes(index)
    && !this.enemyTeam.positioned.find((character) => character.position === index)) {
      return { action: 'step', cursor: 'pointer', color: 'green' };
    }
    return { action: 'not', cursor: 'not-allowed' };
  }

  attack(index, attackIndex) {
    return new Promise((resolve) => {
      const attacker = [...this.playerTeam.positioned, ...this.enemyTeam.positioned]
        .find((character) => character.position === index);
      const victim = [...this.playerTeam.positioned, ...this.enemyTeam.positioned]
        .find((character) => character.position === attackIndex);
      const damage = Math.max(
        attacker.character.attack - victim.character.defence,
        attacker.character.attack * 0.1,
      );
      const promise = this.gamePlay.showDamage(attackIndex, damage);
      promise.then(() => {
        victim.character.health -= damage;

        if (victim.character.health <= 0) {
          if (this.enemyTeam.positioned.includes(victim)) {
            this.enemyTeam.positioned.splice(this.enemyTeam.positioned.indexOf(victim), 1);
          } else {
            this.playerTeam.positioned.splice(this.playerTeam.positioned.indexOf(victim), 1);
          }
        }
        resolve();
      });
    });
  }

  changeTurn(index) {
    this.gamePlay.deselectCell(this.selectedCharacter.position);
    this.gamePlay.deselectCell(index);
    this.selectedCharacter = 0;
    this.gamePlay.redrawPositions([...this.playerTeam.positioned, ...this.enemyTeam.positioned]);
    if (this.enemyTeam.positioned.length === 0) {
      this.levelUp();
    } else {
      this.state.turn = 1 - this.state.turn;
    }
    if (this.state.turn === 1) {
      const enemyAttack = this.enemyTeam.turn(this.playerTeam.positioned);
      if (enemyAttack) {
        this.gamePlay.selectCell(enemyAttack.index);
        this.gamePlay.selectCell(enemyAttack.attackIndex, 'red');
        const promise = this.attack(enemyAttack.index, enemyAttack.attackIndex);
        promise.then(() => {
          this.gamePlay.redrawPositions(
            [...this.playerTeam.positioned, ...this.enemyTeam.positioned],
          );
          this.gamePlay.deselectCell(enemyAttack.index);
          this.gamePlay.deselectCell(enemyAttack.attackIndex);

          if (this.playerTeam.positioned.length === 0) {
            GamePlay.showMessage('You dead!');
          } else {
            this.state.turn = 1 - this.state.turn;
          }
        });
      } else {
        this.gamePlay.redrawPositions(
          [...this.playerTeam.positioned, ...this.enemyTeam.positioned],
        );
        this.state.turn = 1 - this.state.turn;
      }
    }
  }

  levelUp() {
    this.state.level += 1;
    this.gamePlay.drawUi(themes[this.state.level % 4]);

    this.state.score += this.playerTeam.positioned.reduce(
      (sum, member) => sum + member.character.health, 0,
    );
    if (this.state.bestScore < this.state.score) {
      this.state.bestScore = this.state.score;
    }
    this.gamePlay.setScore(this.state.score);
    this.gamePlay.setBestScore(this.state.bestScore);
    this.gamePlay.setLevel(this.state.level);

    this.playerTeam.levelUp(this.state.level + 1);
    this.enemyTeam.levelUp(this.state.level + 1, this.playerTeam.positioned.length);

    this.gamePlay.redrawPositions([...this.playerTeam.positioned, ...this.enemyTeam.positioned]);
  }
}

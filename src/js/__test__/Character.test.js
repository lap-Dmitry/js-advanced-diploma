import Character from '../Character';
import Bowman from '../characters/bowman';

test('new character error', () => {
  expect(() => new Character(1, 'bowman')).toThrowError(new Error('Do not use new Character()'));
});

test('new Bowman', () => {
  expect(() => new Bowman(1, 'bowman')).not.toThrowError();
});

test('info about a character player', () => {
  const info = new Bowman(3);
  const result = `🎖 ${info.level} ⚔ ${info.attack} 🛡 ${info.defence} ❤ ${info.health}`;
  expect(result).toBe('🎖 3 ⚔ 25 🛡 25 ❤ 50');
});

import GameStateService from '../GameStateService';

const gameStateService = new GameStateService(localStorage);
const data = 'test';
gameStateService.save(data);

describe('succes save()', () => {
  test('save data', () => {
    expect(localStorage.getItem('state')).toEqual(JSON.stringify(data));
  });
});

describe('succes load()', () => {
  test('load data', () => {
    expect(gameStateService.load()).toBeTruthy();
  });
});

describe('fail load()', () => {
  test('load game invalid state', () => {
    const stateService = new GameStateService('{state: ""}');
    const expected = 'Invalid state';
    expect(() => { stateService.load(); }).toThrow(expected);
  });
});

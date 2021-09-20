import { calcTileType, calcHealthLevel } from '../utils';

test('tile type cornes 1', () => {
  expect(calcTileType(0, 8)).toBe('top-left');
});

test('tile type cornes 2', () => {
  expect(calcTileType(7, 8)).toBe('top-right');
});

test('tile type cornes 3', () => {
  expect(calcTileType(56, 8)).toBe('bottom-left');
});

test('tile type cornes 4', () => {
  expect(calcTileType(63, 8)).toBe('bottom-right');
});

test('tile type side 1', () => {
  expect(calcTileType(2, 8)).toBe('top');
});

test('tile type side 2', () => {
  expect(calcTileType(32, 8)).toBe('left');
});

test('tile type side 3', () => {
  expect(calcTileType(23, 8)).toBe('right');
});

test('tile type side 4', () => {
  expect(calcTileType(60, 8)).toBe('bottom');
});

test('tile type center 1', () => {
  expect(calcTileType(18, 8)).toBe('center');
});

test('tile type center 2', () => {
  expect(calcTileType(45, 8)).toBe('center');
});

test.each([
  [3, 'critical'],
  [35, 'normal'],
  [55, 'high'],
])('correctly returns the health status', (health, expected) => {
  expect(calcHealthLevel(health)).toBe(expected);
});

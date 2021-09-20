import cursors from '../cursors';
import GamePlay from '../GamePlay';

test('test cursor: auto', () => {
  const received = new GamePlay();
  received.boardEl = document.createElement('div');
  received.setCursor(cursors.auto);
  expect(received.boardEl.style.cursor).toBe(cursors.auto);
});

test('test cursor: pointer', () => {
  const received = new GamePlay();
  received.boardEl = document.createElement('div');
  received.setCursor(cursors.pointer);
  expect(received.boardEl.style.cursor).toBe('pointer');
});

test('test cursor: crosshair', () => {
  const received = new GamePlay();
  received.boardEl = document.createElement('div');
  received.setCursor(cursors.crosshair);
  expect(received.boardEl.style.cursor).toBe('crosshair');
});

test('test cursor: notallowed', () => {
  const received = new GamePlay();
  received.boardEl = document.createElement('div');
  received.setCursor(cursors.notallowed);
  expect(received.boardEl.style.cursor).toBe('not-allowed');
});

test('cursor choice personage', () => {
  const received = new GamePlay();
  received.cells[0] = document.createElement('div');
  received.selectCell(0);
  expect(Array.from(received.cells[0].classList)).toEqual(['selected', 'selected-yellow']);
});

test('cursor attack personage', () => {
  const received = new GamePlay();
  received.cells[0] = document.createElement('div');
  received.selectCell(0, 'red');
  expect(Array.from(received.cells[0].classList)).toEqual(['selected', 'selected-red']);
});

test('cursor run personage', () => {
  const received = new GamePlay();
  received.cells[0] = document.createElement('div');
  received.selectCell(0, 'green');
  expect(Array.from(received.cells[0].classList)).toEqual(['selected', 'selected-green']);
});

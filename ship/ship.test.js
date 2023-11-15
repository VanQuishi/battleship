const Ship = require('./ship')

var shipObj;

beforeEach(() => {
  shipObj = new Ship(3);
});

test('ship object is an instance of Ship class', () => {
  expect(shipObj).toBeInstanceOf(Ship);
})

test('setting ship length', () => {
  expect(shipObj.length).toBe(3);
})

test('ship\'s hits is 0 by default', () => {
  expect(shipObj.hits).toBe(0);
})

test('hit() increase the number of hits in the ship', () => {
  shipObj.hit(2);
  expect(shipObj.hits).toBe(2);
})

test('isSunk() returns false when hits are smaller than ship\'s length', () => {
  shipObj.hit(2);
  expect(shipObj.isSunk()).toBe(false);
})

test('isSunk() returns true when hits are equal ship\'s length', () => {
  shipObj.hit(3);
  expect(shipObj.isSunk()).toBe(true);
})
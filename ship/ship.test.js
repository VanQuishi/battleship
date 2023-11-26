import { Ship } from './ship';

var shipObj;

beforeEach(() => {
  shipObj = new Ship(3);
});

describe('ship object', () => {
  test('is an instance of Ship class', () => {
    expect(shipObj).toBeInstanceOf(Ship);
  });

  test('sets ship length', () => {
    expect(shipObj.length).toBe(3);
  });

  test('has hits as 0 by default', () => {
    expect(shipObj.hits).toBe(0);
  });
});

describe('hit()', () => {
  test('increases the number of hits in the ship', () => {
    shipObj.hit(2);
    expect(shipObj.hits).toBe(2);
  });
});

describe('isSunk()', () => {
  test('returns false when hits are smaller than ship\'s length', () => {
    shipObj.hit(2);
    expect(shipObj.isSunk()).toBe(false);
  });
  
  test('returns true when hits are equal ship\'s length', () => {
    shipObj.hit(3);
    expect(shipObj.isSunk()).toBe(true);
  });
});

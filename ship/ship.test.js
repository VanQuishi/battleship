import { Ship, hori, verti } from './ship';

var shipObj;

beforeEach(() => {
  shipObj = new Ship(3, hori);
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

describe('findNonPlaceableCells()', () => {
  test('findNonPlaceableCells() for vertical ship', () => {
    let expectedNonPlaceableCells = [[0,0], [0,1], [0,2], [1,0], [1,2], [2,0], [2,2], [3,0], [3,2], [4,0], [4,1], [4,2]];
    shipObj.axial = verti;
    shipObj.locations = [[1,1], [2,1], [3,1]];
    shipObj.findNonPlaceableCells();

    expect(shipObj.nonPlaceableCells.length).toEqual(expectedNonPlaceableCells.length);
    expect(shipObj.nonPlaceableCells).toEqual(expect.arrayContaining(expectedNonPlaceableCells));
  });

  test('findNonPlaceableCells() for vertical ship', () => {
    let expectedNonPlaceableCells = [[1,0], [1,1], [1,2], [0,2]];
    shipObj.axial = hori;
    shipObj.locations = [[0,0], [0,1]];
    shipObj.findNonPlaceableCells();

    expect(shipObj.nonPlaceableCells.length).toEqual(expectedNonPlaceableCells.length);
    expect(shipObj.nonPlaceableCells).toEqual(expect.arrayContaining(expectedNonPlaceableCells));
  });
})

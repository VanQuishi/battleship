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
    let expectedNonPlaceableCells = [[2,0], [2,1], [2,2], [2,3], [3,3], [4,0], [4,1], [4,2], [4,2], [4,3]];
    shipObj.axial = verti;
    shipObj.locations = [[3,0], [3,1], [3,2]];
    shipObj.findNonPlaceableCells();

    //expect(shipObj.nonPlaceableCells.length).toEqual(expectedNonPlaceableCells.length);
    expect(shipObj.nonPlaceableCells).toEqual(expect.arrayContaining(expectedNonPlaceableCells));
  });

  test('findNonPlaceableCells() for horizontal ship', () => { 
    let expectedNonPlaceableCells = [[2,0], [0,1], [1,1], [2,1]];
    shipObj.axial = hori;
    shipObj.locations = [[0,0], [1,0]];
    shipObj.findNonPlaceableCells();

    //expect(shipObj.nonPlaceableCells.length).toEqual(expectedNonPlaceableCells.length);
    expect(shipObj.nonPlaceableCells).toEqual(expect.arrayContaining(expectedNonPlaceableCells));
  });

  test('findNonPlaceableCells() for vertical ship - length of 1', () => {
    let expectedNonPlaceableCells = [[0,0], [1,0], [2,0], [0,1], [2,1], [0,2], [1,2], [2,2]];
    shipObj.axial = verti;
    shipObj.locations = [[1,1]];
    shipObj.findNonPlaceableCells();

    expect(shipObj.locations.length).toEqual(1)
    //expect(shipObj.nonPlaceableCells.length).toEqual(expectedNonPlaceableCells.length);
    expect(shipObj.nonPlaceableCells).toEqual(expect.arrayContaining(expectedNonPlaceableCells));
  });

  test('findNonPlaceableCells() for horizontal ship - length of 2', () => { 
    let expectedNonPlaceableCells = [[2,4], [5,4], [2,3], [3,3], [4,3], [5,3], [2,5], [3,5], [4,5], [5,5]];
    shipObj.axial = hori;
    shipObj.locations = [[3,4], [4,4]];
    shipObj.findNonPlaceableCells();

    //expect(shipObj.nonPlaceableCells.length).toEqual(expectedNonPlaceableCells.length);
    expect(shipObj.nonPlaceableCells).toEqual(expect.arrayContaining(expectedNonPlaceableCells));
  });

  test('findNonPlaceableCells() for horizontal ship - length of 3', () => { 
    let expectedNonPlaceableCells = [[4, 7], [3, 7], [5, 7], [3, 9], [5, 9], [6, 7], [4, 9], [6, 9], [7, 7], [7, 9], [3, 8], [7, 8]];
    shipObj.axial = hori;
    shipObj.locations = [[4, 8], [5, 8], [6, 8]];
    shipObj.findNonPlaceableCells();

    expect(shipObj.nonPlaceableCells).toEqual(expect.arrayContaining(expectedNonPlaceableCells));
  });
})

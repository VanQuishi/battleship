const Gameboard = require('./gameboard');
const Ship = require('../ship/ship');
jest.mock('../ship/ship');

var gb;

beforeEach(() => {
  gb = new Gameboard();
  Ship.mockClear();
})

test('gameboard obj is an instance of Gameboard class', () => {
  expect(gb).toBeInstanceOf(Gameboard);
})

test('board is created with 100 cells', () => {
  const arr = [];
  for (let x = 0; x < 100; x++) {
    for (let y = 0; y < 100; y++) {
      arr[x,y] = {ship: null, isHit: false};
    }
  }

  expect(gb.board).toEqual(arr);
})

test('all cells in gameboard have never been hit yet as default', () => {
  for (let i = 0; i < gb.board.length; i++) {
    expect(gb.board[i].isHit).toBe(false);
  }
})

test('aliveShips is set to 0 as default', () => {
  expect(gb.aliveShips).toBe(0);
})

test('placeShip() places ship obj at a specified location', () => {
  var ship = {"hits": 0, "length": 3};
  var locationArr = [[0,0], [0,1], [0,2]];
  gb.placeShip(ship, locationArr);
  
  expect(gb.board[0,0]).toBe(ship);
  expect(gb.board[0,1]).toBe(ship);
  expect(gb.board[0,2]).toBe(ship);
})

test('placeShip() increases aliveShips field by 1', () => {
  var ship = {"hits": 0, "length": 3};
  var locationArr = [[0,0], [0,1], [0,2]];
  gb.placeShip(ship, locationArr);

  expect(gb.aliveShips).toBe(1);
})

test('receiveAttack() calls ship.hit() when it\'s a hit', () => {
  //make sure that Ship constructor is not called yet
  expect(Ship).not.toHaveBeenCalled();
  //call Ship constructor
  const ship = new Ship(3);

  const mockShipInstance = Ship.mock.instances[0];
  const mockHit = mockShipInstance.hit;
  gb.board[0,0].ship = mockShipInstance;

  gb.receiveAttack([0,0]);
  expect(mockHit).toHaveBeenCalled();
})

test('receiveAttack() does not call ship.hit() when it\'s an empty cell', () => {
  //make sure that Ship constructor is not called yet
  expect(Ship).not.toHaveBeenCalled();
  //call Ship constructor
  const ship = new Ship(3);

  const mockShipInstance = Ship.mock.instances[0];
  const mockHit = mockShipInstance.hit;
  gb.board[0,0].ship = mockShipInstance;

  gb.receiveAttack([0,1]);
  expect(mockHit).not.toHaveBeenCalled();
})

test('receiveAttack() decreases aliveShips field by 1 when a ship is sunk', () => {
  //make sure that Ship constructor is not called yet
  expect(Ship).not.toHaveBeenCalled();
  //call Ship constructor
  const ship = new Ship(3);
  //set aliveShips to 1
  gb.aliveShips = 1;

  const mockShipInstance = Ship.mock.instances[0];
  const mockIsSunk = mockShipInstance.isSunk.mockReturnValue(true);
  gb.board[0,0].ship = mockShipInstance;

  gb.receiveAttack([0,0]);
  expect(mockIsSunk).toHaveBeenCalled();
  expect(gb.aliveShips).toBe(0);
})

test('receiveAttack() does not affect aliveShips when a ship is sunk', () => {
  //make sure that Ship constructor is not called yet
  expect(Ship).not.toHaveBeenCalled();
  //call Ship constructor
  const ship = new Ship(3);
  //set aliveShips to 1
  gb.aliveShips = 1;

  const mockShipInstance = Ship.mock.instances[0];
  const mockIsSunk = mockShipInstance.isSunk.mockReturnValue(false);
  gb.board[0,0].ship = mockShipInstance;

  gb.receiveAttack([0,0]);
  expect(mockIsSunk).toHaveBeenCalled();
  expect(gb.aliveShips).toBe(1);
})

test('areAllShipsSunk() returns false when aliveShip is greater than 0', () => {
  gb.aliveShips = 3;

  expect(gb.areAllShipsSunk()).toBe(false);
})

test('areAllShipsSunk() returns true when aliveShip equals 0', () => {
  gb.aliveShips = 0;

  expect(gb.areAllShipsSunk()).toBe(true);
})
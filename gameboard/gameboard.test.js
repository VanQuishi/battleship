const Gameboard = require('./gameboard');

var gb;

beforeEach(() => {
  gb = new Gameboard();
})

test('gameboard obj is an instance of Gameboard class', () => {
  expect(gb).toBeInstanceOf(Gameboard);
})

test('place ship obj at a specified location', () => {
  var gb = new Gameboard();
  var ship = {"hits": 0, "length": 3};
  var location = [[0,0], [0,1], [0,2]];
  gb.placeShip(ship, location);
  
  expect(gb.board[0,0]).toBe(ship);
  expect(gb.board[0,1]).toBe(ship);
  expect(gb.board[0,2]).toBe(ship);
})
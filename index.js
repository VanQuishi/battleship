const Player = require('./player');
const Gameboard = require('../gameboard/gameboard');
const Ship = require('./ship');

const playerHuman = new Player('Nin');
const playerPC = new Player('Bot');

const gbHuman = new Gameboard();
const gbPC = new Gameboard();

var _5cShip = new Ship(5);

var _4cShip1 = new Ship(4);
var _4cShip2 = new Ship(4);

var _3cShip1 = new Ship(3);
var _3cShip2 = new Ship(3);
var _3cShip3 = new Ship(3);

var _2cShip1 = new Ship(2);
var _2cShip2 = new Ship(2);
var _2cShip3 = new Ship(2);
var _2cShip4 = new Ship(2);

var __5cShip = new Ship(5);

var __4cShip1 = new Ship(4);
var __4cShip2 = new Ship(4);

var __3cShip1 = new Ship(3);
var __3cShip2 = new Ship(3);
var __3cShip3 = new Ship(3);

var __2cShip1 = new Ship(2);
var __2cShip2 = new Ship(2);
var __2cShip3 = new Ship(2);
var __2cShip4 = new Ship(2);

function main() {
  //preset gameboardHuman
  gbHuman.placeShip(_5cShip, [[4,9], [5,9], [6,9], [7,9], [8,9], [9,9]]);

  gbHuman.placeShip(_4cShip1, [[6,0], [7,0], [8,0], [9,0]]);
  gbHuman.placeShip(_4cShip2, [[0,2], [0,3], [0,4], [0,5]]);

  gbHuman.placeShip(_3cShip1, [[3,0], [3,1], [3,2]]);
  gbHuman.placeShip(_3cShip2, [[5,2], [6,2], [7,2]]);
  gbHuman.placeShip(_3cShip3, [[9,5], [9,6], [9,7]]);

  gbHuman.placeShip(_2cShip1, [[0,0], [1,0]]);
  gbHuman.placeShip(_2cShip2, [[0, 7], [1,7]]);
  gbHuman.placeShip(_2cShip3, [[5,5], [5,6]]);
  gbHuman.placeShip(_2cShip4, [[9,2], [9,3]]);

  gbHuman.placeShip(_2cShip1, [[0,0], [1,0]]);
  gbHuman.placeShip(_2cShip2, [[9,2], [9,3]]);
  gbHuman.placeShip(_2cShip3, [[5,5], [5,6]]);
  gbHuman.placeShip(_2cShip4, [[0,7], [1,7]]);

  //preset gameboardPC
  gbPC.placeShip(__5cShip, [[4,9], [5,9], [6,9], [7,9], [8,9], [9,9]]);

  gbPC.placeShip(__4cShip1, [[6,0], [7,0], [8,0], [9,0]]);
  gbPC.placeShip(_4cShip2, [[0,2], [0,3], [0,4], [0,5]]);

  gbPC.placeShip(__3cShip1, [[3,0], [3,1], [3,2]]);
  gbPC.placeShip(__3cShip2, [[5,2], [6,2], [7,2]]);
  gbPC.placeShip(_3cShip3, [[9,5], [9,6], [9,7]]);

  gbPC.placeShip(__2cShip1, [[0,0], [1,0]]);
  gbPC.placeShip(__2cShip2, [[0, 7], [1,7]]);
  gbPC.placeShip(__2cShip3, [[5,5], [5,6]]);
  gbPC.placeShip(__2cShip4, [[9,2], [9,3]]);

  gbPC.placeShip(__2cShip1, [[0,0], [1,0]]);
  gbPC.placeShip(__2cShip2, [[9,2], [9,3]]);
  gbPC.placeShip(__2cShip3, [[5,5], [5,6]]);
  gbPC.placeShip(__2cShip4, [[0,7], [1,7]]);
}
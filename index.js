import {Player} from '../player/player.js';
import {Gameboard} from './gameboard/gameboard.js';
import {Ship, hori, verti} from './ship/ship.js';

const boardsWrapper = document.getElementById('boardsWrapper');
const boards = document.getElementsByClassName('board');
const humanBoard = document.getElementById('humanBoard');
const pcBoard = document.getElementById('pcBoard');

const boardWidth = 10;

const playerHuman = new Player('Nin');
const playerPC = new Player('Bot');
const playerHumanPrefix = '0';
const playerPCPrefix = '1';

const gbHuman = new Gameboard();
const gbPC = new Gameboard();

var _5cShip = new Ship(5, hori);

var _4cShip1 = new Ship(4, hori);
var _4cShip2 = new Ship(4, verti);

var _3cShip1 = new Ship(3, verti);
var _3cShip2 = new Ship(3, hori);
var _3cShip3 = new Ship(3, verti);

var _2cShip1 = new Ship(2, hori);
var _2cShip2 = new Ship(2, hori);
var _2cShip3 = new Ship(2, verti);
var _2cShip4 = new Ship(2, verti);

var __5cShip = new Ship(5, hori);

var __4cShip1 = new Ship(4, hori);
var __4cShip2 = new Ship(4, verti);

var __3cShip1 = new Ship(3, verti);
var __3cShip2 = new Ship(3, hori);
var __3cShip3 = new Ship(3, verti);

var __2cShip1 = new Ship(2, hori);
var __2cShip2 = new Ship(2, hori);
var __2cShip3 = new Ship(2, verti);
var __2cShip4 = new Ship(2, verti);

function makeGrid() {
  for (let j = 0; j < boards.length; j++) {
    boards[j].style.setProperty('--grid-rows', boardWidth);
    boards[j].style.setProperty('--grid-cols', boardWidth);
  }

  // Create 2 boards. Assign xy coordinate to the cells' ids
  for (let j = 0; j < boards.length; j++) {
    for (let i = 0; i < boardWidth; i++) {
      for (let k = 0; k < boardWidth; k++) {
        let gridItem = document.createElement('div');
        gridItem.id = `${j}-${k}${i}`;
        gridItem.classList.add('cell');
        if (j == playerHumanPrefix) {
          gridItem.classList.add('humanCell');
        } else {
          gridItem.classList.add('pcCell');
        }
        boards[j].appendChild(gridItem);
      }
    }
  }
}

function displayShips(user, gameboard) {
  //console.log(gameboard.board);

  for (let y = 0; y < boardWidth; y++) {
    for (let x = 0; x < boardWidth; x++) {
      console.log(gameboard.board[x][y].ship)
      if (gameboard.board[x][y].ship != null) {
        let cellID = `${user}-${x}${y}`;
        console.log({cellID});
        let cell = document.getElementById(cellID);

        // only display the user's ships. hide the bot's
        if (user == playerHumanPrefix) {
          cell.classList.add('chosenCell');
        }      
      }
    }
  }
}

function displayNonPlaceableCells(user, ship) {
  console.log('gray cells', ship.nonPlaceableCells)
  for (let i = 0; i < ship.nonPlaceableCells.length; i++) {
    let cellID = `${user}-${ship.nonPlaceableCells[i][0]}${ship.nonPlaceableCells[i][1]}`;
    let cell = document.getElementById(cellID);
    cell.classList.add('missedCell');
  }
}

function hitACell(cell) {
  if (cell.classList.contains('hitCell') || cell.classList.contains('missedCell')) {
    return false;
  }

  let idArr = cell.id.split('');
  let x = idArr[2];
  let y = idArr[3];

  let gb = idArr[0] == playerHumanPrefix ? gbHuman : gbPC;

  gb.receiveAttack([x, y]);

  if (gb.board[x][y].ship != null) {
    cell.classList.add('hitCell');
    if (gb.board[x][y].ship.isSunk()) {
      console.log('sunk');
      displayNonPlaceableCells(idArr[0], gb.board[x][y].ship);
    }
    
    //if the ship is sunk then display the gray area around it
    console.log(gb.board[x][y].ship.isSunk());
  } else {
    cell.classList.add('missedCell');
  } 

  return true;
}

function checkForWinner() {
  if (gbPC.areAllShipsSunk()) {
    //announce human won
    console.log("PC won");
    return true;
  }
  if (gbHuman.areAllShipsSunk()) {
    //announce human won
    console.log("PC won");
    return true;
  }

  return false;
}

function setup() {
  //preset gameboardHuman
  gbHuman.placeShip(_5cShip, [[4,9], [5,9], [6,9], [7,9], [8,9]]);
  _5cShip.findNonPlaceableCells();

  gbHuman.placeShip(_4cShip1, [[6,0], [7,0], [8,0], [9,0]]);
  _4cShip1.findNonPlaceableCells();
  gbHuman.placeShip(_4cShip2, [[0,2], [0,3], [0,4], [0,5]]);
  _4cShip2.findNonPlaceableCells();

  gbHuman.placeShip(_3cShip1, [[3,0], [3,1], [3,2]]);
  _3cShip1.findNonPlaceableCells();
  gbHuman.placeShip(_3cShip2, [[5,2], [6,2], [7,2]]);
  _3cShip2.findNonPlaceableCells();
  gbHuman.placeShip(_3cShip3, [[9,5], [9,6], [9,7]]);
  _3cShip3.findNonPlaceableCells();

  gbHuman.placeShip(_2cShip1, [[0,0], [1,0]]);
  _2cShip1.findNonPlaceableCells();
  gbHuman.placeShip(_2cShip2, [[0, 7], [1,7]]);
  _2cShip2.findNonPlaceableCells();
  gbHuman.placeShip(_2cShip3, [[5,5], [5,6]]);
  _2cShip3.findNonPlaceableCells();
  gbHuman.placeShip(_2cShip4, [[9,2], [9,3]]);
  _2cShip4.findNonPlaceableCells();

  //preset gameboardPC
  gbPC.placeShip(__5cShip, [[4,9], [5,9], [6,9], [7,9], [8,9]]);
  __5cShip.findNonPlaceableCells();

  gbPC.placeShip(__4cShip1, [[6,0], [7,0], [8,0], [9,0]]);
  __4cShip1.findNonPlaceableCells();
  gbPC.placeShip(__4cShip2, [[0,2], [0,3], [0,4], [0,5]]);
  __4cShip2.findNonPlaceableCells();

  gbPC.placeShip(__3cShip1, [[3,0], [3,1], [3,2]]);
  __3cShip1.findNonPlaceableCells();
  gbPC.placeShip(__3cShip2, [[5,2], [6,2], [7,2]]);
  __3cShip2.findNonPlaceableCells();
  gbPC.placeShip(__3cShip3, [[9,5], [9,6], [9,7]]);
  __3cShip3.findNonPlaceableCells();

  gbPC.placeShip(__2cShip1, [[0,0], [1,0]]);
  __2cShip1.findNonPlaceableCells();
  gbPC.placeShip(__2cShip2, [[0, 7], [1,7]]);
  __2cShip2.findNonPlaceableCells();
  gbPC.placeShip(__2cShip3, [[5,5], [5,6]]);
  __2cShip3.findNonPlaceableCells();
  gbPC.placeShip(__2cShip4, [[9,2], [9,3]]);
  __2cShip4.findNonPlaceableCells();

  //render boards - TODO
  //console.log(boardsWrapper)
  makeGrid();
  //display human ships on board - Done
  displayShips(playerHumanPrefix, gbHuman);

  //call hitACell when onlick for a cell
  const humanCells = document.getElementsByClassName('humanCell');
  const pcCells = document.getElementsByClassName('pcCell');

  //let human play first
  // disable click for humanBoard
  humanBoard.style.pointerEvents = 'none';
  // enable click for pcBoard
  pcBoard.style.pointerEvents = 'auto';

  for (let i = 0; i < humanCells.length; i++) {
    humanCells[i].addEventListener("click", () => {
      console.log("hit human cell");
      hitACell(humanCells[i]);
      console.log('gbPC sunk', gbPC.areAllShipsSunk())
      if (checkForWinner() == false) {
        // disable click for humanBoard
        humanBoard.style.pointerEvents = 'none';
        // enable click for pcBoard
        pcBoard.style.pointerEvents = 'auto';
      }  
    })
  }

  for (let i = 0; i < pcCells.length; i++) {
    pcCells[i].addEventListener("click", () => {
      console.log("hit pc cell");
      hitACell(pcCells[i]);
      if (checkForWinner() == false) {
        // enable click for humanBoard
        humanBoard.style.pointerEvents = 'auto';
        // disable click for pcBoard
        pcBoard.style.pointerEvents = 'none';
      }  
    })
  }

  //TODO: Decrease opacity of board that's not in use
  //TODO: when there's a winner, stop both board and announce winner
}

setup();
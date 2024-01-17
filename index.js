import {Player} from '../player/player.js';
import {Gameboard} from './gameboard/gameboard.js';
import {Ship} from './ship/ship.js';

const boardsWrapper = document.getElementById('boardsWrapper');
const boards = document.getElementsByClassName('board');

const boardWidth = 10;

const playerHuman = new Player('Nin');
const playerPC = new Player('Bot');
const playerHumanPrefix = '0';
const playerPCPrefix = '1';

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
        gridItem.id = `${j}-${i}${k}`;
        gridItem.classList.add('cell');
        boards[j].appendChild(gridItem);
      }
    }
  }
}

function displayShips(user, gameboard) {
  //console.log(gameboard.board);

  for (let x = 0; x < boardWidth; x++) {
    for (let y = 0; y < boardWidth; y++) {
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
}

function gameLoop() {
  //preset gameboardHuman
  gbHuman.placeShip(_5cShip, [[4,9], [5,9], [6,9], [7,9], [8,9]]);

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
  gbPC.placeShip(__4cShip2, [[0,2], [0,3], [0,4], [0,5]]);

  gbPC.placeShip(__3cShip1, [[3,0], [3,1], [3,2]]);
  gbPC.placeShip(__3cShip2, [[5,2], [6,2], [7,2]]);
  gbPC.placeShip(__3cShip3, [[9,5], [9,6], [9,7]]);

  gbPC.placeShip(__2cShip1, [[0,0], [1,0]]);
  gbPC.placeShip(__2cShip2, [[0, 7], [1,7]]);
  gbPC.placeShip(__2cShip3, [[5,5], [5,6]]);
  gbPC.placeShip(__2cShip4, [[9,2], [9,3]]);

  gbPC.placeShip(__2cShip1, [[0,0], [1,0]]);
  gbPC.placeShip(__2cShip2, [[9,2], [9,3]]);
  gbPC.placeShip(__2cShip3, [[5,5], [5,6]]);
  gbPC.placeShip(__2cShip4, [[0,7], [1,7]]);

  //render boards - TODO
  //console.log(boardsWrapper)
  makeGrid();
  //display ships on board - Done
  displayShips(playerHumanPrefix, gbHuman);

  //call hitACell when onlick for a cell
  const cells = document.getElementsByClassName('cell');
  for (let i = 0; i < cells.length; i++) {
    cells[i].addEventListener("click", () => {
      hitACell(cells[i]);
    })
  }

  //loop turn by turn for each player
  /* do {
    if (gbHuman.areAllShipsSunk()) {
      //announce human won
      console.log("human won");
      return;
    } else if (gbPC.areAllShipsSunk()) {
      //announce PC won
      console.log("PC won");
    }
  } while (true) */
}

gameLoop();
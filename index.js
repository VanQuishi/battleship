import {Player} from '../player/player.js';
import {Gameboard} from './gameboard/gameboard.js';
import {Ship, hori, verti} from './ship/ship.js';

const boardsWrapper = document.getElementById('boardsWrapper');
const boards = document.getElementsByClassName('board');
const humanBoard = document.getElementById('humanBoard');
const pcBoard = document.getElementById('pcBoard');
const msgBox = document.getElementById('msg');

const boardWidth = 10;

const playerHuman = new Player('Nin');
const playerPC = new Player('Bot');
const playerHumanPrefix = '0';
const playerPCPrefix = '1';

const hitEmptyCell = '0';
const hitShipCell = '1';
const hitUnavailableCell = '2';

var botMoves = [];
var prevMoveLocation = [];
const botPrevTurn = 'rand';

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
    return hitUnavailableCell;
  }

  let idArr = cell.id.split('');
  let x = idArr[2];
  let y = idArr[3];

  let gb = idArr[0] == playerHumanPrefix ? gbHuman : gbPC;

  gb.receiveAttack([x, y]);

  if (gb.board[x][y].ship != null) {
    cell.classList.add('hitCell');
    //if the ship is sunk then display the gray area around it
    if (gb.board[x][y].ship.isSunk()) {
      console.log('sunk');
      displayNonPlaceableCells(idArr[0], gb.board[x][y].ship);
    }
    return hitShipCell;
  } else {
    cell.classList.add('missedCell');
    return hitEmptyCell;
  } 
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

function displayMsg(msg) {
  msgBox.innerHTML = msg;
}

function isLegitLocation(location) {
  if (0 <= location[0] && location[0] <= 9) {
    if (0 <= location[1] && location[1] <= 9) {
      return true;
    }
  }

  return false;
}

//TODO: when there's a winner, stop both board and announce winner
//TODO: allows user to rotate ship's axis

function botNextMove() {
  let x = 0;
  let y = 0;

  if (botMoves.length == 0) {
    //if no ship is hit and botMoves array is empty, then return new random location
    if (botPrevTurn == 'rand') {
      console.log({x}, {y})
      do {
        x = Math.floor(Math.random() * boardWidth);
        y = Math.floor(Math.random() * boardWidth);
        console.log({x}, {y})
      } while(gbHuman.board[x][y].isHit == true);
      
      return [x, y];
    }
    //if part of ship is hit and botMoves array is empty, fill botMoves array with legal locations in 4 directions
    else if (botPrevTurn == 'hit') {
      //top
      x = prevMoveLocation[0];
      y = prevMoveLocation[1] - 1;
      if (isLegitLocation([x,y]) && gbHuman.board[x][y].isHit == false) {
        botMoves.push([x,y]);
      }

      //bottom
      x = prevMoveLocation[0];
      y = prevMoveLocation[1] + 1;
      if (isLegitLocation([x,y]) && gbHuman.board[x][y].isHit == false) {
        botMoves.push([x,y]);
      }

      //left
      x = prevMoveLocation[0] - 1;
      y = prevMoveLocation[1];
      if (isLegitLocation([x,y]) && gbHuman.board[x][y].isHit == false) {
        botMoves.push([x,y]);
      }

      //right
      x = prevMoveLocation[0] + 1;
      y = prevMoveLocation[1];
      if (isLegitLocation([x,y]) && gbHuman.board[x][y].isHit == false) {
        botMoves.push([x,y]);
      }
    }
  }

  // Either ways, return one move from the array
  return (botMoves.pop());
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
  humanBoard.classList.add('dimmed');
  // enable click for pcBoard
  pcBoard.style.pointerEvents = 'auto';

  for (let i = 0; i < humanCells.length; i++) {
    humanCells[i].addEventListener("click", () => {
      console.log("hit human cell");
      let hitCellResult = hitACell(humanCells[i]);
      if (hitCellResult == hitUnavailableCell) {
        console.log("hit unavail cell");
      }
      else if (hitCellResult == hitShipCell) {
        if (checkForWinner() == true) {
          displayMsg("Bot won! Better luck next time!");
        } 
      }
      else {
        if (checkForWinner() == false) {
          // disable click for humanBoard
          humanBoard.style.pointerEvents = 'none';
          humanBoard.classList.add('dimmed');
          // enable click for pcBoard
          pcBoard.style.pointerEvents = 'auto';
          pcBoard.classList.remove('dimmed');
        }  
      }
    })
  }

  for (let i = 0; i < pcCells.length; i++) {
    pcCells[i].addEventListener("click", () => {
      console.log("hit pc cell");
      let hitCellResult = hitACell(pcCells[i]);
      if (hitCellResult == hitUnavailableCell) {
        console.log("hit unavail cell");
      }
      else if (hitCellResult == hitShipCell) {
        if (checkForWinner() == true) {
          displayMsg("You won!");
        }
      }
      else {
        if (checkForWinner() == false) {
          // enable click for humanBoard
          humanBoard.style.pointerEvents = 'auto';
          humanBoard.classList.remove('dimmed');
          // disable click for pcBoard
          pcBoard.style.pointerEvents = 'none';
          pcBoard.classList.add('dimmed');
          console.log('bot next move', botNextMove())
        }  
      }
    })
  }
}

function drawShip(axis, cellID, length) {
  console.log('hit drawShip')
  let idArr = cellID.split('');
  let x = parseInt(idArr[2]);
  let y = idArr[3];

  if (axis == 'hori') {
    console.log('reached if in drawship')
    let lastX = x + length - 1;
    console.log({lastX})
    if (isLegitLocation([lastX, y])) {
      console.log('hit 2nd if')
      for (let i = x; i <= lastX; i++) {
        console.log('inside loop')
        let id = `${playerHumanPrefix}-${i}${y}`;
        let cell = document.getElementById(id);
        //cell.style.border = '2px solid #88AB8E';
        //cell.style.backgroundColor = '#C3E2C2';
        cell.classList.add('chosenCell');
      }
    } else {
      //TODO: Print to screen "Ship is out of bound, can't be placed"
      displayMsg("Ship is out of bound. Can't be placed");
      //Prevent user to clicked
    }
  }
}

function undrawShip(axis, cellID, length) {
  console.log('hit drawShip')
  let idArr = cellID.split('');
  let x = parseInt(idArr[2]);
  let y = idArr[3];

  if (axis == 'hori') {
    let lastX = x + length - 1;
    console.log({lastX})
    if (isLegitLocation([lastX, y])) {
      for (let i = x; i <= lastX; i++) {
        let id = `${playerHumanPrefix}-${i}${y}`;
        let cell = document.getElementById(id);
        //cell.style.border = '1px solid black';
        //cell.style.backgroundColor = 'inherit';
        cell.classList.remove('chosenCell');
      }
    }
  }
}

function userPlaceShip() {
  let shipSizes = [4,3,3,2,2,2,1,1,1,1];
  let currentShipSize = shipSizes.shift();
  let axis = 'hori';

  window.addEventListener("keydown", (event) => {
    if (event.code === "KeyR") {
      axis = axis == 'hori' ? 'verti' : 'hori';
      console.log({axis});
    }
  });

  const humanCells = document.querySelectorAll('.humanCell');

  humanCells.forEach((cell) => {
    cell.addEventListener('mouseenter', (e) => {
      console.log("mouse enterred humancell", cell.id);  
      drawShip(axis, cell.id, currentShipSize);
    });

    cell.addEventListener('mouseleave', (e) => {
      undrawShip(axis, cell.id, currentShipSize);
    });

    cell.addEventListener('click', (e) => {
      //TODO: only allow ship to be placed if it's not out of bound
      //TODO: create ship, add to board, display it
    })
  });
}

makeGrid();
userPlaceShip();
//setup();
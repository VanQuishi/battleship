import {Player} from '../player/player.js';
import {Gameboard} from './gameboard/gameboard.js';
import {Ship, hori, verti} from './ship/ship.js';

const boardsWrapper = document.getElementById('boardsWrapper');
const boards = document.getElementsByClassName('board');
const placementBoard = document.getElementById('placementBoard');
const humanBoard = document.getElementById('humanBoard');
const pcBoard = document.getElementById('pcBoard');
const msgBox = document.getElementById('msg');

const boardWidth = 10;

const playerHuman = new Player('Nin');
const playerPC = new Player('Bot');
const playerHumanPrefix = '0';
const playerPCPrefix = '1';
const placementPrefix = '2';

const hitEmptyCell = '0';
const hitShipCell = '1';
const hitUnavailableCell = '2';
const hitAndSunkShip = '3';

var botMovesHori = [];
var botMovesVerti = [];
var botMoveLocation = [];
var botPrevTurn = 'rand';
var guessAxis = hori;
var isUserShipSunk = true;

const gbHuman = new Gameboard();
const gbPC = new Gameboard();


var _4cShip1 = new Ship(4, hori);

var _3cShip1 = new Ship(3, verti);
var _3cShip2 = new Ship(3, hori);

var _2cShip1 = new Ship(2, hori);
var _2cShip2 = new Ship(2, hori);
var _2cShip3 = new Ship(2, verti);

var _1cShip1 = new Ship(1, hori);
var _1cShip2 = new Ship(1, hori);
var _1cShip3 = new Ship(1, verti);
var _1cShip4 = new Ship(1, verti);


var __4cShip1 = new Ship(4, hori);

var __3cShip1 = new Ship(3, verti);
var __3cShip2 = new Ship(3, hori);

var __2cShip1 = new Ship(2, hori);
var __2cShip2 = new Ship(2, hori);
var __2cShip3 = new Ship(2, verti);

var __1cShip1 = new Ship(1, hori);
var __1cShip2 = new Ship(1, hori);
var __1cShip3 = new Ship(1, verti);
var __1cShip4 = new Ship(1, verti);

const outOfBoundErrMsg = "Ship is out of bound. Can't be placed.";
const overlappedErrMsg = "Cannot overlap your ship";

function makeGrid(board) {

  //set property should be the same for all boards
  board.style.setProperty('--grid-rows', boardWidth);
  board.style.setProperty('--grid-cols', boardWidth);

  //assign cells id for different board's id
  for (let i = 0; i < boardWidth; i++) {
    for (let k = 0; k < boardWidth; k++) {
      let gridItem = document.createElement('div');
      switch (board.id) {
        case "humanBoard":
          console.log("reached makeGrad human")
          gridItem.id = `${playerHumanPrefix}-${k}${i}`;
          gridItem.classList.add('humanCell');
          break;
        case "pcBoard":
          gridItem.id = `${playerPCPrefix}-${k}${i}`;
          gridItem.classList.add('pcCell');
          break;
        case "placementBoard":
          console.log("reached makeGrad placement")
          gridItem.id = `${placementPrefix}-${k}${i}`;
          gridItem.classList.add('placementCell');
          break;
      }
      
      gridItem.classList.add('cell');
      board.appendChild(gridItem);
    }
  }
  
}

function displayShips(user, gameboard) {
  for (let y = 0; y < boardWidth; y++) {
    for (let x = 0; x < boardWidth; x++) {
      if (gameboard.board[x][y].ship != null) {
        let cellID = `${user}-${x}${y}`;
        console.log({cellID});
        let cell = document.getElementById(cellID);
        console.log({cell})
        cell.classList.add('chosenCell');
        // only display the user's ships. hide the bot's
/*         if (user == playerHumanPrefix) {
          cell.classList.add('chosenCell');
        } */      
      }
    }
  }
}

function drawNonPlaceableCells(user, ship, isPermanent) {
  console.log("hit display gray cells")
  for (let i = 0; i < ship.nonPlaceableCells.length; i++) {
    let cellID = `${user}-${ship.nonPlaceableCells[i][0]}${ship.nonPlaceableCells[i][1]}`;
    let cell = document.getElementById(cellID);
    if (isPermanent) {
      cell.classList.add('permanentMissedCell');
    } else {
      cell.classList.add('missedCell');
    }  
  }
}

function undrawNonPlaceableCells(user, ship) {
  //console.log('gray cells', ship.nonPlaceableCells)
  for (let i = 0; i < ship.nonPlaceableCells.length; i++) {
    let cellID = `${user}-${ship.nonPlaceableCells[i][0]}${ship.nonPlaceableCells[i][1]}`;
    let cell = document.getElementById(cellID);
    cell.classList.remove('missedCell');
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
      drawNonPlaceableCells(idArr[0], gb.board[x][y].ship, true);
      return hitAndSunkShip;
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

  if (botMovesHori.length == 0 && botMovesVerti.length == 0) {
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
    //if part of ship is hit and both botMoves array are empty, fill botMoves arrays with legal locations in 4 directions
    else if (botPrevTurn == 'hit' && botMovesHori.length == 0 && botMovesVerti.length == 0) {
      //top
      x = botMoveLocation[0];
      y = botMoveLocation[1] - 1;
      if (isLegitLocation([x,y]) && gbHuman.board[x][y].isHit == false) {
        botMovesVerti.push([x,y]);
      }

      //bottom
      x = botMoveLocation[0];
      y = botMoveLocation[1] + 1;
      if (isLegitLocation([x,y]) && gbHuman.board[x][y].isHit == false) {
        botMovesVerti.push([x,y]);
      }

      //left
      x = botMoveLocation[0] - 1;
      y = botMoveLocation[1];
      if (isLegitLocation([x,y]) && gbHuman.board[x][y].isHit == false) {
        botMovesHori.push([x,y]);
      }

      //right
      x = botMoveLocation[0] + 1;
      y = botMoveLocation[1];
      if (isLegitLocation([x,y]) && gbHuman.board[x][y].isHit == false) {
        botMovesHori.push([x,y]);
      }
    }
  }

  // Either ways, return one move from the array based on guessAxis
  if (guessAxis == hori && botMovesHori.length != 0) {
    return botMovesHori.pop();
  }
  else if (guessAxis == verti && botMovesVerti.length != 0) {
    return botMovesVerti.pop();
  }
}

function drawShip(axis, cellID, length) {
  //console.log("hit drawShip", cellID);
  let idArr = cellID.split('');
  let prefix = idArr[0];
  let x = parseInt(idArr[2]);
  let y = parseInt(idArr[3]);
  let shipLocationArr = [];

  if (axis == hori) {
    let lastX = x + length - 1;
    if (isLegitLocation([lastX, y])) {
      for (let i = x; i <= lastX; i++) {
        let id = `${prefix}-${i}${y}`;
        let cell = document.getElementById(id);
        if (cell.classList.contains('chosenCell') || cell.classList.contains('permanentMissedCell')) {
          console.log('reached overlapped')
          displayMsg(overlappedErrMsg);
          return [];
        }
        cell.classList.add('drawnCell');
        shipLocationArr.push([i, y]);
      }
      displayMsg("Place your ship.");
    } else {
      displayMsg(outOfBoundErrMsg);
      return [];
    }
  }
  else {
    let lastY = y + length - 1;
    if (isLegitLocation([x, lastY])) {
      for (let i = y; i <= lastY; i++) {
        let id = `${prefix}-${x}${i}`;
        let cell = document.getElementById(id);
        if (cell.classList.contains('chosenCell') || cell.classList.contains('permanentMissedCell')) {
          console.log('reached overlapped');
          displayMsg(overlappedErrMsg);
          return [];
        }
        cell.classList.add('drawnCell');
        shipLocationArr.push([x, i]);
      }
      displayMsg("Place your ship.");
    } else {
      displayMsg(outOfBoundErrMsg);
      return [];
    }
  }

  return shipLocationArr;
}

function undrawShip(axis, cellID, length) {
  //console.log('hit undrawShip', cellID)
  let idArr = cellID.split('');
  let prefix = idArr[0];
  let x = parseInt(idArr[2]);
  let y = parseInt(idArr[3]);

  if (axis == hori) {
    let lastX = x + length - 1;
    if (isLegitLocation([lastX, y])) {
      for (let i = x; i <= lastX; i++) {
        let id = `${prefix}-${i}${y}`;
        let cell = document.getElementById(id);
        cell.classList.remove('drawnCell');
      }
    }
  }
  else {
    let lastY = y + length - 1;
    if (isLegitLocation([x, lastY])) {
      for (let i = y; i <= lastY; i++) {
        let id = `${prefix}-${x}${i}`;
        let cell = document.getElementById(id);
        cell.classList.remove('drawnCell');
      }
    }
  }
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function search2DArray(arr, item) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i][0] == item[0] && arr[i][1] == item[1]) {
      return true;
    }
  }
  return false;
}

function botPlaceShip() {
  let ships = [__4cShip1, __3cShip1, __3cShip2, __2cShip1, __2cShip2, __2cShip3, __1cShip1, __1cShip2, __1cShip3, __1cShip4];
  let occupiedShipLocation = [];
  let occupiedNonPlaceableLocation = [];
  let chooseAgainFlag = false;

  for (let k = 0; k < ships.length; k++) {
    let currentShip = ships[k];
    do {
      chooseAgainFlag = false;
      //random axis choice (0 or 1)
      let randAxis = getRandomInt(2);
      let axis = randAxis == 0 ? hori : verti;
      //random x and y value from 0 to 9 - this is first cell location
      let x = getRandomInt(10);
      let y = getRandomInt(10);
      if (search2DArray(occupiedShipLocation, [x,y]) == true || search2DArray(occupiedNonPlaceableLocation, [x,y]) == true) {
        //console.log('inside first location check failed', x, y)
        chooseAgainFlag = true;
        continue;
      }
  
      //console.log("first location of ship:", x, y, axis)
      if (axis == hori) {
        let lastX = x + currentShip.length - 1;
        if (isLegitLocation([lastX, y])) {
          for (let i = x; i <= lastX; i++) {
            if (search2DArray(occupiedShipLocation, [i, y]) || search2DArray(occupiedNonPlaceableLocation, [i, y])) {
              chooseAgainFlag = true;
              break;
            }
          }
          //console.log({chooseAgainFlag});
          if (chooseAgainFlag == false) {
            for (let i = x; i <= lastX; i++) {
              occupiedShipLocation.push([i, y]);
              currentShip.locations.push([i, y]);
            } 
            currentShip.findNonPlaceableCells();
            for (let i = 0; i < currentShip.nonPlaceableCells.length; i++) {
              occupiedNonPlaceableLocation.push(currentShip.nonPlaceableCells[i]);
            }
            currentShip.axial = axis;
            gbPC.placeShip(currentShip, currentShip.locations);
            /* console.log({currentShip});
            console.log({occupiedShipLocation});
            console.log({occupiedNonPlaceableLocation}); */
          }
        }
        else {
          chooseAgainFlag = true;
          continue;
        }
      }
      else {
        let lastY = y + currentShip.length - 1;
        if (isLegitLocation([x, lastY])) {
          for (let i = y; i <= lastY; i++) {
            if (search2DArray(occupiedShipLocation, [x, i]) || search2DArray(occupiedNonPlaceableLocation, [x, i])) {
              chooseAgainFlag = true;
              break;
            }
          } 
          //console.log({chooseAgainFlag});
          if (chooseAgainFlag == false) {
            for (let i = y; i <= lastY; i++) {
              occupiedShipLocation.push([x, i]);
              currentShip.locations.push([x, i]);
            } 
            currentShip.findNonPlaceableCells();
            for (let i = 0; i < currentShip.nonPlaceableCells.length; i++) {
              occupiedNonPlaceableLocation.push(currentShip.nonPlaceableCells[i]);
            }
            currentShip.axial = axis;
            gbPC.placeShip(currentShip, currentShip.locations);
            /* console.log({currentShip});
            console.log({occupiedShipLocation});
            console.log({occupiedNonPlaceableLocation}); */
          }
        }
        else {
          chooseAgainFlag = true;
          continue;
        }
      }
    } while (chooseAgainFlag)
  }
}

function userPlaceShip() {
  let ships = [_4cShip1, _3cShip1, _3cShip2, _2cShip1, _2cShip2, _2cShip3, _1cShip1, _1cShip2, _1cShip3, _1cShip4];
  let currentShip = ships.shift();
  let axis = hori;
  let cellID = '';
  let shipLocationArr = [];

  const mouseenterAction = (axis, id, shipLength) => {
    shipLocationArr = drawShip(axis, id, shipLength);
    currentShip.locations = shipLocationArr;
    currentShip.axial = axis;
    currentShip.findNonPlaceableCells();
    //console.log(currentShip.nonPlaceableCells)

    //draw non placeable cells
    drawNonPlaceableCells(placementPrefix, currentShip, false);
  }
  const mouseleaveAction = (axis, id, shipLength) => {
    undrawShip(axis, id, shipLength);

    //undrawNonPlaceable cells
    undrawNonPlaceableCells(placementPrefix, currentShip);
  }

   //if axis is changed, draw again
   window.addEventListener("keydown", (event) => {
    if (event.code === "KeyR") {
      axis = axis == hori ? verti : hori;
      console.log('hit R', axis, cellID, currentShip.length)
      //check if cellID is populated (meaning mouse pointer has entered a cell)
      if (cellID !== '') {
        //remove any display from the old axis
        let oldaxis = axis == hori ? verti : hori;
        mouseleaveAction(oldaxis, cellID, currentShip.length);

        //display ship with current axis
        mouseenterAction(axis, cellID, currentShip.length);
      } 
    }
  });

  var placementCells = document.querySelectorAll('.placementCell');

  placementCells.forEach((cell) => {
      cell.addEventListener('mouseenter', function eventHandler() {
        if (!cell.classList.contains('chosenCell') && !cell.classList.contains('permanentMissedCell')) {
          cellID = cell.id;
          mouseenterAction(axis, cellID, currentShip.length);
        }
        else {
          displayMsg('Cannot place your ship here');
        }
      });

      cell.addEventListener('mouseleave', (e) => {
        if (!cell.classList.contains('chosenCell') && !cell.classList.contains('permanentMissedCell')) {
          mouseleaveAction(axis, cellID, currentShip.length);
          cellID = '';
        }
      });

      cell.addEventListener('click', (e) => {
        if (!cell.classList.contains('chosenCell') && !cell.classList.contains('permanentMissedCell')) {
          if (msgBox.innerHTML != outOfBoundErrMsg || msgBox.innerHTML != overlappedErrMsg) {
            gbHuman.placeShip(currentShip, shipLocationArr);

            for (let i = 0; i < shipLocationArr.length; i++) {
              let cellID = `${placementPrefix}-${[shipLocationArr[i][0]]}${[shipLocationArr[i][1]]}`;
              let c = document.getElementById(cellID);
              c.classList.add('chosenCell');
            }

            //make non placeable cells stayed
            drawNonPlaceableCells(placementPrefix, currentShip, true);

            if (ships.length > 0) {
              currentShip = ships.shift();
            }
            else {
              placementBoard.style.display = 'none';

              humanBoard.style.display = 'grid';
              pcBoard.style.display = 'grid';
              displayShips(playerHumanPrefix, gbHuman);
              //call function to place bot's ships here
              botPlaceShip();
              //displayShips(playerPCPrefix, gbPC);

              //start game here
              //call hitACell when onlick for a cell
              const humanCells = document.getElementsByClassName('humanCell');
              const pcCells = document.getElementsByClassName('pcCell');

              //let human play first
              // disable click for humanBoard
              //humanBoard.style.pointerEvents = 'none';
              //humanBoard.classList.add('dimmed');
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
                    displayMsg("Bot hit your ship!");
                    botPrevTurn = "hit";
                    isUserShipSunk = false;                   

                    console.log({botMovesHori}, {botMovesVerti});
                    botMoveLocation = botNextMove();
                    console.log({botMoveLocation})
                    let botCell = document.getElementById(`${0}-${botMoveLocation[0]}${botMoveLocation[1]}`);
                    setTimeout(() => {
                      botCell.click();
                    }, 1000);                 
                  }
                  else if (hitCellResult == hitAndSunkShip) {
                    if (checkForWinner() == true) {
                      displayMsg("Bot won! Better luck next time!");
                    } 
                    else {
                      isUserShipSunk = true;
                      botPrevTurn = "rand";
                      botMovesHori = [];
                      botMovesVerti = [];

                      console.log({botMovesHori}, {botMovesVerti});
                      botMoveLocation = botNextMove();
                      console.log({botMoveLocation})
                      let botCell = document.getElementById(`${0}-${botMoveLocation[0]}${botMoveLocation[1]}`);
                      setTimeout(() => {
                        botCell.click();
                      }, 1000);
                    }
                  }
                  else {
                    if (isUserShipSunk == false) {
                      guessAxis = guessAxis == hori ? verti : hori;
                    }
                    else {
                      botPrevTurn = "rand";
                    }
                    
                    botMovesHori = [];
                    botMovesVerti = [];

                    // disable click for humanBoard
                    humanBoard.style.pointerEvents = 'none';
                    humanBoard.classList.add('dimmed');
                    // enable click for pcBoard
                    pcBoard.style.pointerEvents = 'auto';
                    pcBoard.classList.remove('dimmed');
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
                      botMoveLocation = botNextMove();
                      //console.log('bot next move', botNextMove());
                      let botCell = document.getElementById(`${0}-${botMoveLocation[0]}${botMoveLocation[1]}`);
                      setTimeout(() => { 
                        botCell.click();
                      }, 1000)
                      //if the above is a hit we need to let PC to continue hitting
                    }  
                  }
                })
              }
            }
          }  
        }
      });
  });
}

function setup() {
  //preset gameboardHuman
  /* gbHuman.placeShip(_5cShip, [[4,9], [5,9], [6,9], [7,9], [8,9]]);
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
  _2cShip4.findNonPlaceableCells(); */

  userPlaceShip();

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

makeGrid(placementBoard);
makeGrid(humanBoard);
makeGrid(pcBoard);

userPlaceShip();
/* placementBoard.style.display = 'none';

humanBoard.style.display = 'grid';
pcBoard.style.display = 'grid';
displayShips(playerHumanPrefix, gbHuman);
//call function to place bot's ships here
botPlaceShip();
displayShips(playerPCPrefix, gbPC); */
 
/*TODO: recode setup() - maybe change name?
  
*/       
class Gameboard {
  constructor() {
    this.board = [];
    for (let x = 0; x < 100; x++) {
      this.board[x] = [];
      for (let y = 0; y < 100; y++) {
        this.board[x][y] = {ship: null, isHit: false};
      }
    }

    this.aliveShips = 0;
  }

  placeShip(ship, locationArr) {
    ship.locations = locationArr;
    for (let i = 0; i < locationArr.length; i++) {
      this.board[locationArr[i][0]][locationArr[i][1]] = {ship: ship, isHit: false};
    }
    this.board[locationArr[0][0]][locationArr[0][1]].ship.findNonPlaceableCells();
    this.aliveShips++;
  }

  receiveAttack(location) {
    let x = location[0];
    let y = location[1];
    this.board[x][y].isHit = true;
    
    if (this.board[x][y].ship != null) {
      this.board[x][y].ship.hit(1);
    } 

    if (this.board[x][y].ship != null && this.board[x][y].ship.isSunk()) {
      this.aliveShips--;
    } 
  }

  areAllShipsSunk() {
    return this.aliveShips == 0 ? true : false;
  }
}

export {Gameboard};
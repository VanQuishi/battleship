class Gameboard {
  constructor() {
    this.board = [];
  }

  placeShip(ship, location) {
    for (let i = 0; i < location.length; i++) {
      this.board[location[i][0], location[i][1]] = ship;
    }
  }
}

module.exports = Gameboard
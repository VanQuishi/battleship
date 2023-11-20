class Player {
  constructor(name) {
    this.name = name;
  }

  attack(gameboard, location) {
    gameboard.receiveAttack(location);
  }

  checkRandomAttack(gameboard, location) {
    if (gameboard.board[location[0], location[1]].isHit == true) {
      throw new Error('error: cell has been hit already');
    }
  }

  randomAttack(gameboard) {
    var min = 0;
    var max = 99;
    var x = Math.floor(Math.random() * (max - min + 1) + min);
    var y = Math.floor(Math.random() * (max - min + 1) + min);
    var counter = 0;

    do {
      try {
        counter++;
        this.checkRandomAttack(gameboard, location[x,y]);
      }
      catch(err) {
        x = Math.floor(Math.random() * (max - min + 1) + min);
        y = Math.floor(Math.random() * (max - min + 1) + min);
      }
    } while (counter < 10);

    if (counter >= 10) {
      throw new Error('error: randomAttack reached maximum re-tries of 10');
    }

    attack(gameboard, location);
  }
}

module.exports = Player;

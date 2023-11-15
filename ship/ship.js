class Ship {
  constructor(length) {
    this.length = length;
    this.hits = 0;
  }

  hit(n) {
    this.hits += n;
  }

  isSunk() {
    return this.hits == this.length ? true : false;
  }
}

module.exports = Ship
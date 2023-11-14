class Ship {
  constructor(length) {
    this.length = length;
    this.hits = 0;
  }

  hit(n) {
    this.hits += n;
  }
}

module.exports = Ship
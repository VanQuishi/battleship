const Gameboard = require('./gameboard');

test('gameboard obj is an instanc of Gameboard class', () => {
  var gb = new Gameboard();
  expect(gb).toBeInstanceOf(Gameboard);
})
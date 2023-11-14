const Ship = require('./ship')

test('ship object is an instance of Ship class', () => {
  var shipObj = new Ship();
  expect(shipObj).toBeInstanceOf(Ship);
})

test('setting ship length', () => {
  var shipObj = new Ship(3);
  expect(shipObj.length).toBe(3);
})

test('ship\'s hits is 0 by default', () => {
  var shipObj = new Ship(1);
  expect(shipObj.hits).toBe(0);
})

test('hit() increase the number of hits in the ship', () => {
  var shipObj = new Ship(3);
  shipObj.hit(2);
  expect(shipObj.hits).toBe(2);
})
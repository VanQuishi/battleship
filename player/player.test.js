const Player = require('./player');
const Gameboard = require('../gameboard/gameboard');
jest.mock('../gameboard/gameboard');

var player;

beforeEach(() => {
  player = new Player("user_1");
  Gameboard.mockClear();
})

test('player obj is an instance of Player class', () => {
  expect(player).toBeInstanceOf(Player);
})

test('attack() calls receiveAttack() from Gameboard class', () => {
  //make sure that Gameboard constructor is not called yet
  expect(Gameboard).not.toHaveBeenCalled();

  const gb = new Gameboard();


  const mockGameboardInstance = Gameboard.mock.instances[0];
  const mockReceiveAttack = mockGameboardInstance.receiveAttack;
  player.attack(mockGameboardInstance, [0,0]);

  //add an expect for to have been called with correct argument
  expect(mockReceiveAttack).toHaveBeenCalledWith([0,0]);
})

test('checkRandomAttack() throws error when a given move is illegal (already been hit)', () => {
  //make sure that Gameboard constructor is not called yet
  expect(Gameboard).not.toHaveBeenCalled();

  var expectedBoardField = [];
  expectedBoardField[0,0] = {isHit: true};

  //set location [0,0] to already been hit
  const gb = new Gameboard();

  var mockGameboardInstance = Gameboard.mock.instances[0];
  mockGameboardInstance = {
    board: expectedBoardField,
  }

  function checkRandomAttackCall() {
    player.checkRandomAttack(mockGameboardInstance, [0,0]);
  } 

  expect(() => {
    checkRandomAttackCall();
  }).toThrow(/error/);
})

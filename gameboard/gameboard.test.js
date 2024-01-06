import { Gameboard } from './gameboard';
import { Ship } from '../ship/ship';
jest.mock('../ship/ship');

var gb;

beforeEach(() => {
  gb = new Gameboard();
  Ship.mockClear();
});

describe('gameboard object', () => {
  test('is an instance of Gameboard class', () => {
    expect(gb).toBeInstanceOf(Gameboard);
  });

  test('has board field created with 100 cells', () => {
    const arr = [];
    for (let x = 0; x < 100; x++) {
      arr[x] = [];
      for (let y = 0; y < 100; y++) {
        arr[x][y] = {ship: null, isHit: false};
      }
    }
  
    expect(gb.board).toEqual(arr);
  });

  test('has all cells that have never been hit yet as default', () => {
    for (let i = 0; i < gb.board.length; i++) {
      for (let j = 0; j < gb.board.length; j++) {
        expect(gb.board[i][j].isHit).toBe(false);
      }
    }
  });

  test('aliveShips is set to 0 as default', () => {
    expect(gb.aliveShips).toBe(0);
  });
})

describe('placeShip()', () => {
  var ship;
  var locationArr;
  beforeEach(() => {
    ship = {"hits": 0, "length": 3};
    locationArr = [[0,0], [0,1], [0,2]];
    gb.placeShip(ship, locationArr);
  });
  
  test('places ship obj at a specified location', () => {   
    expect(gb.board[0][0].ship).toBe(ship);
    expect(gb.board[0][1].ship).toBe(ship);
    expect(gb.board[0][2].ship).toBe(ship);
  });

  test('increases aliveShips field by 1', () => {
    expect(gb.aliveShips).toBe(1);
  })
});

describe('receiveAttack()', () => {
  var mockHit;
  var mockShipInstance;
  beforeEach(() => {
    //make sure that Ship constructor is not called yet
    expect(Ship).not.toHaveBeenCalled();
    //call Ship constructor
    const ship = new Ship(3);

    mockShipInstance = Ship.mock.instances[0];
    mockHit = mockShipInstance.hit;
    gb.board[0][0].ship = mockShipInstance;
  });

  test('set the location\'s isHit to true', () => {
    gb.receiveAttack([0,0]);
    expect(gb.board[0][0].isHit).toBe(true);
  })

  test('calls ship.hit() when it\'s a hit', () => {
    gb.receiveAttack([0,0]);
    expect(mockHit).toHaveBeenCalled();
  });

  test('does not call ship.hit() when it\'s an empty cell', () => {
    gb.receiveAttack([0,1]);
    expect(mockHit).not.toHaveBeenCalled();
  });

  test('decreases aliveShips field by 1 when a ship is sunk', () => {
    gb.aliveShips = 1;

    const mockIsSunk = mockShipInstance.isSunk.mockReturnValue(true);
    gb.board[0][0].ship = mockShipInstance;

    gb.receiveAttack([0,0]);
    expect(mockIsSunk).toHaveBeenCalled();
    expect(gb.aliveShips).toBe(0);
  });

  test('does not affect aliveShips when a ship is not sunk', () => {
    //set aliveShips to 1
    gb.aliveShips = 1;

    gb.board[0][0].ship = mockShipInstance;
    mockIsSunk = mockShipInstance.isSunk.mockReturnValue(false);
    gb.board[0][0].ship = mockShipInstance;

    gb.receiveAttack([0,0]);
    expect(mockIsSunk).toHaveBeenCalled();
    expect(gb.aliveShips).toBe(1);
  });
});

describe('areAllShipsSunk()', () => {
  test('returns false when aliveShip is greater than 0', () => {
    gb.aliveShips = 3;
  
    expect(gb.areAllShipsSunk()).toBe(false);
  });

  test('returns true when aliveShip equals 0', () => {
    gb.aliveShips = 0;
  
    expect(gb.areAllShipsSunk()).toBe(true);
  });
});

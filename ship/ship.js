const hori = 'horizontal';
const verti = 'vertical';

class Ship {
  constructor(length, axial) {
    this.length = length;
    this.axial = axial;
    this.hits = 0;
    this.locations = [];
    this.nonPlaceableCells = [];
  }

  hit(n) {
    this.hits += n;
  }

  isSunk() {
    return this.hits == this.length ? true : false;
  }

  checkValidLocation(x,y) {
    if (0 <= x && x <= 9) {
      if (0 <= y && y <= 9) {
        return true;
      }
    }

    return false;
  }

  findNonPlaceableCells() {
    let x = 0;
    let y = 0;
    for (let i = 0; i < this.locations.length; i++) {
      // first cell
      if (i == 0) {
        if (this.axial == hori) {
          x = this.locations[i][0];
          y = this.locations[i][1] - 1;
          if (this.checkValidLocation(x,y)) {
            this.nonPlaceableCells.push([x,y]);
          }      
        }
        else {
          x = this.locations[i][0] - 1;
          y = this.locations[i][1];
          if (this.checkValidLocation(x,y)) {
            this.nonPlaceableCells.push([x,y]);
          }     
        }
      }

      // find nonPlaceableCells in a four corner for all cells except last cell
      if (i != this.locations.length - 1) {
        // top-left corner
        x = this.locations[i][0] - 1;
        y = this.locations[i][1] - 1;
        if (this.checkValidLocation(x,y)) {
          this.nonPlaceableCells.push([x,y]);
        }     

        // top-right corner
        x = this.locations[i][0] - 1;
        y = this.locations[i][1] + 1;
        if (this.checkValidLocation(x,y)) {
          this.nonPlaceableCells.push([x,y]);
        }     

        // bottom-left corner
        x = this.locations[i][0] + 1;
        y = this.locations[i][1] - 1;
        if (this.checkValidLocation(x,y)) {
          this.nonPlaceableCells.push([x,y]);
        }    

        // bottom-right corner
        x = this.locations[i][0] + 1;
        y = this.locations[i][1] + 1;
        if (this.checkValidLocation(x,y)) {
          this.nonPlaceableCells.push([x,y]);
        }    
      }

      // last cell
      if (i == (this.locations.length - 1)) {
        if (this.axial == hori) {
          x = this.locations[i][0];
          y = this.locations[i][1] + 1;
          if (this.checkValidLocation(x,y)) {
            this.nonPlaceableCells.push([x,y]);
          }     
        }
        else {
          x = this.locations[i][0] + 1;
          y = this.locations[i][1];
          if (this.checkValidLocation(x,y)) {
            this.nonPlaceableCells.push([x,y]);
          }     
        }

        // top-right corner OR bottom-left corner (for verti)
        x = this.locations[i][0] + 1;
        y = this.locations[i][1] - 1;
        if (this.checkValidLocation(x,y)) {
          this.nonPlaceableCells.push([x,y]);
        }    

        // bottom-right corner
        x = this.locations[i][0] + 1;
        y = this.locations[i][1] + 1;
        if (this.checkValidLocation(x,y)) {
          this.nonPlaceableCells.push([x,y]);
        }    
      }
    }
  }
}

export {Ship, hori, verti};
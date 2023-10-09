import { Injectable } from '@angular/core'; // INYECTABLE DEL SERVICIO
import { Room, Player } from '../models/interfaces'; // IMPORTAMOS LAS INTERFACES

@Injectable({
  providedIn: 'root'
})
export class GameService {

  // PROPIEDADES DE LA CLASE

  rooms: Room[][] = [];
  player!: Player;
  numRows!: number;
  numCols!: number;

  currentRows!: number;
  currentCols!: number;
  currentPits!: number;
  currentArrows!: number;

  // FUNCIONES PRINCIPALES

  constructor() {
    this.initializeGame();
  }

  initializeGame(rows: number = 4, cols: number = 4, pits: number = 3, arrows: number = 1) {
    this.currentRows = rows;
    this.currentCols = cols;
    this.currentPits = pits;
    this.currentArrows = arrows;
    
    this.setMazeDimensions(rows, cols);
    this.generateMaze();
    this.placeGameElements(pits);
    this.initializePlayer(arrows);
    this.rooms[this.numRows - 1][0].isVisited = true;
  }

  restartGame() {
    this.initializeGame(this.currentRows, this.currentCols, this.currentPits, this.currentArrows);
  }
    
  setMazeDimensions(rows: number, cols: number) {
    this.numRows = rows;
    this.numCols = cols;
  }

  generateMaze() {
    for (let i = 0; i < this.numRows; i++) {
      this.rooms[i] = [];
      for (let j = 0; j < this.numCols; j++) {
        this.rooms[i][j] = {
          hasWumpus: false,
          hasPit: false,
          hasTreasure: false,
          hasStench: false,
          hasBreeze: false,
          hasGlitter: false,
          isVisited: false
        };
      }
    }
  }

  placeGameElements(numPits: number) {
    this.placeItemRandomly('hasWumpus', 1);
    this.placeItemRandomly('hasPit', numPits);
    this.placeItemRandomly('hasTreasure', 1);
    this.setPerceptions();
  }
  
  initializePlayer(arrows: number) {
    this.player = {
        rowPosition: this.numRows - 1,
        colPosition: 0,
        direction: 'EAST',
        isAlive: true,
        hasGold: false,
        arrows: arrows
    };
  }
  
  // LÓGICA DEL JUEGO

  placeItemRandomly(item: keyof Room, count: number) {
    for (let i = 0; i < count; i++) {
      let placed = false;

      while (!placed) {
        let randomRow = Math.floor(Math.random() * this.numRows);
        let randomCol = Math.floor(Math.random() * this.numCols);
      
        const cell = this.rooms[randomRow][randomCol];
      
        if (!cell.hasWumpus && !cell.hasPit && !cell.hasTreasure && (randomRow !== this.numRows - 1 || randomCol !== 0)) {
          cell[item] = true;
          placed = true;
        }
      }
    }
  }

  setPerceptions() {
    for (let i = 0; i < this.numRows; i++) {
      for (let j = 0; j < this.numCols; j++) {
        if (this.rooms[i][j].hasWumpus) {
          this.setPerceptionForAdjacentRooms(i, j, 'hasStench');
        }
        if (this.rooms[i][j].hasPit) {
          this.setPerceptionForAdjacentRooms(i, j, 'hasBreeze');
        }
        if (this.rooms[i][j].hasTreasure) {
          this.setPerceptionForAdjacentRooms(i, j, 'hasGlitter');
        }
      }
    }
  }

  movePlayer(direction: 'NORTH' | 'SOUTH' | 'EAST' | 'WEST') {
    let newRow = this.player.rowPosition;
    let newCol = this.player.colPosition;

    switch (direction) {
      case 'NORTH':
        newRow -= 1;
        break;
      case 'EAST':
        newCol += 1;
        break;
      case 'SOUTH':
        newRow += 1;
        break;
      case 'WEST':
        newCol -= 1;
        break;
    }

    if (this.isValidMove(newRow, newCol)) {
      this.player.rowPosition = newRow;
      this.player.colPosition = newCol;
      this.rooms[newRow][newCol].isVisited = true;
      this.checkPlayerStatus();
    } else {
      alert('¡Has chocado contra un muro!');
    }
  }

  turnPlayer(direction: 'LEFT' | 'RIGHT') {
    const directions = ['NORTH', 'EAST', 'SOUTH', 'WEST'];
    const currentIndex = directions.indexOf(this.player.direction);

    if (direction === 'RIGHT') {
      this.player.direction = directions[(currentIndex + 1) % 4] as 'NORTH' | 'EAST' | 'SOUTH' | 'WEST';
    } else {
      this.player.direction = directions[(currentIndex - 1 + 4) % 4] as 'NORTH' | 'EAST' | 'SOUTH' | 'WEST';
    }
  }

  shootArrow() {
    if (this.player.arrows > 0) {
      let row = this.player.rowPosition;
      let col = this.player.colPosition;

      while (this.isValidMove(row, col)) {
        if (this.rooms[row][col].hasWumpus) {
          this.rooms[row][col].hasWumpus = false;
          alert('¡Has matado al Wumpus!');
          return;
        }

        switch (this.player.direction) {
          case 'NORTH':
            row -= 1;
            break;
          case 'EAST':
            col += 1;
            break;
          case 'SOUTH':
            row += 1;
            break;
          case 'WEST':
            col -= 1;
            break;
        }
      }
      this.player.arrows--;
    } else {
      console.log('¡Te has quedado sin flechas!');
    }
  }

  pickGold() {
    if (this.rooms[this.player.rowPosition][this.player.colPosition].hasTreasure) {
      this.player.hasGold = true;
      this.rooms[this.player.rowPosition][this.player.colPosition].hasTreasure = false;
      alert('¡Has encontrado el oro!');
    } else {
      alert('No hay oro aquí.');
    }
  }

  checkPlayerStatus() {
    const currentRoom = this.rooms[this.player.rowPosition][this.player.colPosition];

    if (currentRoom.hasPit) {
        this.player.isAlive = false;
        alert('¡Has caído en un pozo!');
        this.restartGame();
        return;
    }

    if (currentRoom.hasWumpus) {
        this.player.isAlive = false;
        alert('¡El Wumpus te ha comido!');
        this.restartGame();
        return;
    }
  }

  exitMaze() {
    console.log("Intentando salir del laberinto");
    if (this.player.rowPosition === this.numRows - 1 && this.player.colPosition === 0) {
      if (this.player.hasGold) {
        this.playerWins();
      } else {
        alert('Debes tener el oro para salir del laberinto.');
      }
    } else {
      alert('Debes estar en la casilla de inicio para intentar salir.');
    }
  }

  playerWins() {
    alert('¡Has ganado el juego!');
    this.restartGame();
  }

  // FUNCIONES DE AYUDA

  setPerceptionForAdjacentRooms(row: number, col: number, perception: keyof Room) {
    const adjacentRooms = [
      { r: row - 1, c: col },
      { r: row + 1, c: col },
      { r: row, c: col - 1 },
      { r: row, c: col + 1 }
    ];
  
    for (const room of adjacentRooms) {
      if (this.isValidMove(room.r, room.c)) {
        this.rooms[room.r][room.c][perception] = true;
      }
    }
  }

  isValidMove(row: number, col: number): boolean {
    return row >= 0 && row < this.numRows && col >= 0 && col < this.numCols;
  }
}
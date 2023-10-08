import { Injectable } from '@angular/core';
import { Room } from '../models/interfaces';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  // PROPIEDADES DE LA CLASE
  rooms: Room[][] = [];
  numRows!: number;
  numCols!: number;

  // FUNCIONES PRINCIPALES

  constructor() {
    this.initializeGame();
  }

  initializeGame() {
    this.setMazeDimensions(4, 4);
    this.generateMaze();
    this.placeGameElements();
  }

  restartGame() {
    this.initializeGame();
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
          hasGlitter: false
        };
      }
    }
  }

  placeGameElements() {
    this.placeItemRandomly('hasWumpus', 1);
    this.placeItemRandomly('hasPit', 3);
    this.placeItemRandomly('hasTreasure', 1);
    this.setPerceptions();
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
        // Añade estas líneas
        if (this.rooms[i][j].hasTreasure) {
          this.setPerceptionForAdjacentRooms(i, j, 'hasGlitter');
        }
      }
    }
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

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

  // FUNCIONES PRINCIPALES

  constructor() {
    this.initializeGame();
  }

  initializeGame() {
    this.setMazeDimensions(4, 4);
    this.generateMaze();
    this.placeGameElements();
    this.initializePlayer();
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
  
  initializePlayer() {
    this.player = {
      rowPosition: this.numRows - 1,
      colPosition: 0,
      direction: 'EAST',
      isAlive: true,
      hasGold: false,
      arrows: 1
    };
  }
  
  // LÓGICA DEL JUEGO

  placeItemRandomly(item: keyof Room, count: number) {
    for (let i = 0; i < count; i++) {
      let placed = false;

      while (!placed) {
        let randomRow = Math.floor(Math.random() * this.numRows);
        let randomCol = Math.floor(Math.random() * this.numCols);
      
        // Verifica que la celda no tiene ninguno de los otros elementos antes de colocar el nuevo.
        const cell = this.rooms[randomRow][randomCol];
      
        // Asegúrate de que las coordenadas no sean las mismas que las del punto de partida del jugador
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
      // Check for player's death or victory after the move.
      this.checkPlayerStatus();
    } else {
      console.log('Player bumped into a wall');
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
      console.log('No arrows left');
    }
  }

  pickGold() {
    if (this.rooms[this.player.rowPosition][this.player.colPosition].hasTreasure) {
      this.player.hasGold = true;
      this.rooms[this.player.rowPosition][this.player.colPosition].hasTreasure = false;
      console.log('Gold collected!');
    } else {
      console.log('No gold here');
    }
  }

  checkPlayerStatus() {
    const currentRoom = this.rooms[this.player.rowPosition][this.player.colPosition];

    if (currentRoom.hasPit) {
        this.player.isAlive = false;
        alert('¡Has caído en un pozo!'); // Mostrar alerta
        this.restartGame(); // Llamar a una función para reiniciar el juego
        return;
    }

    if (currentRoom.hasWumpus) {
        this.player.isAlive = false;
        alert('¡El Wumpus te ha comido!'); // Mostrar alerta
        this.restartGame(); // Llamar a una función para reiniciar el juego
        return;
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
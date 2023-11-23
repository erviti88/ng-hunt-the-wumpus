import { Injectable } from '@angular/core'; // INYECTABLE DEL SERVICIO
import { Room, Player } from '../models/interfaces'; // IMPORTAMOS LAS INTERFACES

@Injectable({
  providedIn: 'root'
})
export class GameService {

  // VARIABLES DE ESTADO PARA LAS HABITACIONES Y EL JUGADOR
  rooms: Room[][] = [];
  player!: Player;

  // DIMENSIONES DEL LABERINTO
  numRows!: number;
  numCols!: number;

  // CONFIGURACIÓN ACTUAL
  currentRows!: number;
  currentCols!: number;
  currentPits!: number;
  currentArrows!: number;

  constructor() {
    this.initializeGame();
  }

  //  INICIALIZA EL JUEGO CON PARÁMETROS POR DEFECTO
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

  // REINICIA EL JUEGO MANTENIENDO LA CONFIGURACIÓN ACTUAL
  restartGame() {
    this.initializeGame(this.currentRows, this.currentCols, this.currentPits, this.currentArrows);
  }
  
  // CONFIGURA LAS DIMENSIONES DEL LABERINTO
  setMazeDimensions(rows: number, cols: number) {
    this.numRows = rows;
    this.numCols = cols;
  }

  // CONSTRUYE EL LABERIBNTO VACÍO BASÁNDOSE EN LAS DIMENSIONES ESPECIFICADAS
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

  // COLOCA LOS ELEMENTOS DEL JUEGO EN EL LABERINTO
  placeGameElements(numPits: number) {
    this.placeItemRandomly('hasWumpus', 1);
    this.placeItemRandomly('hasPit', numPits);
    this.placeItemRandomly('hasTreasure', 1);
    this.setPerceptions();
  }
  
  // ESTABLECE LAS PROPIEDADES INICIALES DEL JUGADOR
  initializePlayer(arrows: number) {
    this.player = {
        rowPosition: this.numRows - 1,
        colPosition: 0,
        direction: 'EAST',
        isPlayerAlive: true,
        isWumpusDead: false,
        hasGold: false,
        arrows: arrows
    };
    console.log('Estado del jugador:', this.player); // Agregar esta línea
  }
  
  // COLOCA LOS ELEMENTOS DEL JUEGO EN UNA POSICIÓN ALEATORIA
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
  
  //ESTABLECE LAS PERCEPCIONES EN LAS HABITACIONES EN FUNCIÓN DE LOS ELEMENTOS
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

  // MUEVE AL JUGARDOR EN LA DIRECCIÓN ESPECIFICADA SI ES UN MOVIMIENTO VÁLIDO
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
      console.log('¡Has chocado contra un muro!');
    }
    console.log('Estado del jugador:', this.player); // Agregar esta línea
  }

  // CAMBIA LA DIRECCIÓN DEL JUGADOR
  turnPlayer(direction: 'LEFT' | 'RIGHT') {
    const directions = ['NORTH', 'EAST', 'SOUTH', 'WEST'];
    const currentIndex = directions.indexOf(this.player.direction);

    if (direction === 'RIGHT') {
      this.player.direction = directions[(currentIndex + 1) % 4] as 'NORTH' | 'EAST' | 'SOUTH' | 'WEST';
    } else {
      this.player.direction = directions[(currentIndex - 1 + 4) % 4] as 'NORTH' | 'EAST' | 'SOUTH' | 'WEST';
    }
  }

  // EL JUGADOR DISPARA UNA FLECHA DESDE EN SU DIRECCIÓN ACTUAL
  shootArrow() {
    if (this.player.arrows > 0) {
      let row = this.player.rowPosition;
      let col = this.player.colPosition;

      while (this.isValidMove(row, col)) {
        if (this.rooms[row][col].hasWumpus) {
          this.rooms[row][col].hasWumpus = false;
          this.player.isWumpusDead = true;
          alert('¡Has matado al Wumpus!');
          console.log('¡Has matado al Wumpus!');
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

      alert('¡Has fallado!');
      console.log('¡Has fallado!');

      this.player.arrows--;

    } else {
      alert('¡Te has quedado sin flechas!');
      console.log('¡Te has quedado sin flechas!');
    }
  }

  // EL JUGADOR RECOGE EL ORO SI ESTÁ EN SU MISMA HABITACIÓN
  pickGold() {
    if (this.rooms[this.player.rowPosition][this.player.colPosition].hasTreasure) {
      this.player.hasGold = true;
      this.rooms[this.player.rowPosition][this.player.colPosition].hasTreasure = false;
      alert('¡Has encontrado el oro!');
      console.log('¡Has encontrado el oro!');
    } else {
      alert('No hay oro aquí.');
      console.log('No hay oro aquí.');
    }
  }

  // COMPRUEBA SI EL JUGADOR SE ENCUENTRA CON UN POZO O AL WUMPUS
  checkPlayerStatus() {
    const currentRoom = this.rooms[this.player.rowPosition][this.player.colPosition];

    if (currentRoom.hasPit) {
      this.player.isPlayerAlive = false;
      alert('¡Has caído en un pozo!');
      console.log('¡Has caído en un pozo!')
      this.restartGame();
      return;
    }

    if (currentRoom.hasWumpus) {
      this.player.isPlayerAlive = false;
      alert('¡El Wumpus te ha comido!');
      console.log('¡El Wumpus te ha comido!')
      this.restartGame();
      return;
    }

    if (this.player.isWumpusDead && this.player.hasGold && this.player.rowPosition === this.numRows - 1 && this.player.colPosition === 0) {
      this.playerWins();
    }
  }

  /* // EL JUGADOR INTENTA SALIR DEL LABERINTO
  exitMaze() {
    if (this.player.rowPosition === this.numRows - 1 && this.player.colPosition === 0) {
      if (this.player.hasGold) {
        this.playerWins();
      } else {
        alert('Debes tener el oro para salir del laberinto.');
        console.log('Debes tener el oro para salir del laberinto.')
      }
    } else {
      alert('Debes estar en la casilla de inicio para intentar salir.');
      console.log('Debes estar en la casilla de inicio para intentar salir.')
    }
  } */

  // ANUNCIA QUE EL JUGADOR HA GANADO Y EL JUEGO SE REINICA
  playerWins() {
    alert('¡Has ganado el juego!');
    console.log('¡Has ganado el juego!')
    this.restartGame();
  }

  // FUNCIONES DE AYUDA

  // ESTABLECE LA PERCEPCIÓN EN LAS CASILLAS ADYACENTES A LOS ELEMENTOS
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

  // COMPRUEBA SI UN MOVIMIENTO ES VÁLIDO
  isValidMove(row: number, col: number): boolean {
    return row >= 0 && row < this.numRows && col >= 0 && col < this.numCols;
  }
}
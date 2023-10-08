export interface Player {
    direction: 'NORTH' | 'EAST' | 'SOUTH' | 'WEST';  // Dirección en la que está mirando.
    arrows: number;  // Cantidad de flechas disponibles.
    hasGold: boolean;  // Si el jugador ha recogido el oro.
    isAlive: boolean;  // Si el jugador está vivo o no.
    rowPosition: number;  // Posición actual en filas.
    colPosition: number;  // Posición actual en columnas.
}
  
export interface Room {
    hasWumpus?: boolean;
    hasTreasure?: boolean;
    hasPit?: boolean;
    hasBreeze?: boolean;  // Breeze se siente si hay un pit cerca.
    hasStench?: boolean;  // Stench se siente si hay un Wumpus cerca.
    hasGlitter?: boolean; // Glitter es visto si hay un tesoro.
    isPlayerHere?: boolean;
}
export interface Room {
    hasWumpus?: boolean;
    hasTreasure?: boolean;
    hasPit?: boolean;
    hasBreeze?: boolean;  // Breeze se siente si hay un pit cerca.
    hasStench?: boolean;  // Stench se siente si hay un Wumpus cerca.
    hasGlitter?: boolean; // Glitter es visto si hay un tesoro.
    isPlayerHere?: boolean;
}
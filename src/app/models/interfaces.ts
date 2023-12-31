export interface Player {
    direction: 'NORTH' | 'EAST' | 'SOUTH' | 'WEST';
    arrows: number;
    hasGold: boolean;
    isPlayerAlive: boolean;
    isWumpusDead: boolean;
    rowPosition: number;
    colPosition: number;
}
  
export interface Room {
    hasWumpus?: boolean;
    hasTreasure?: boolean;
    hasPit?: boolean;
    hasBreeze?: boolean;
    hasStench?: boolean;
    hasGlitter?: boolean;
    isPlayerHere?: boolean;
    isVisited?: boolean;
}
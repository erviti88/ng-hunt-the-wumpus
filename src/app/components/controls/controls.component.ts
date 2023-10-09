import { Component, EventEmitter, Output } from '@angular/core';
import { GameService } from '../../services/game.service';

@Component({
  selector: 'app-controls',
  templateUrl: './controls.component.html',
  styleUrls: ['./controls.component.scss']
})
export class ControlsComponent {

  constructor(public gameService: GameService) { }

  // MÉTODO PARA MOVER AL JUGADOR
  move(direction: 'NORTH' | 'SOUTH' | 'EAST' | 'WEST') {
    this.gameService.movePlayer(direction);
  }

  // MÉTODO PARA GIRAR AL JUGADOR
  turn(direction: 'LEFT' | 'RIGHT') {
    this.gameService.turnPlayer(direction);
  }

  // MÉTODO PARA DISPARAR UNA FLECHA
  shoot() {
    this.gameService.shootArrow();
  }

  // MÉTODO PARA RECOGER EL ORO
  pickGold() {
    this.gameService.pickGold();
  }
}

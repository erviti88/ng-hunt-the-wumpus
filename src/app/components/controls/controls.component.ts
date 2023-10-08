import { Component, EventEmitter, Output } from '@angular/core';
import { GameService } from '../../services/game.service';

@Component({
  selector: 'app-controls',
  templateUrl: './controls.component.html',
  styleUrls: ['./controls.component.scss']
})
export class ControlsComponent {

  constructor(public gameService: GameService) { }

  move(direction: 'NORTH' | 'SOUTH' | 'EAST' | 'WEST') {
    this.gameService.movePlayer(direction);
  }

  turn(direction: 'LEFT' | 'RIGHT') {
    this.gameService.turnPlayer(direction);
  }

  shoot() {
    this.gameService.shootArrow();
  }

  pickGold() {
    this.gameService.pickGold();
  }
}

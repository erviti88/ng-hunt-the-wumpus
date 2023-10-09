import { Component } from '@angular/core';
import { GameService } from 'src/app/services/game.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.scss']
})
export class StartComponent {

  boardSize: number = 4;
  numberOfPits: number = 3;
  arrows: number = 1; 

  constructor(private gameService: GameService, private router: Router) { }

  startGame(): void {
    this.gameService.initializeGame(this.boardSize, this.boardSize, this.numberOfPits, this.arrows);
    this.router.navigate(['/game']);
  }

  restartGame(): void {
    this.gameService.initializeGame(this.boardSize, this.boardSize, this.numberOfPits, this.arrows);
}
}
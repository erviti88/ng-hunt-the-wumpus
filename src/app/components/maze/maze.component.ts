import { Component, OnInit } from '@angular/core';
import { GameService } from '../../services/game.service';

@Component({
  selector: 'app-maze',
  templateUrl: './maze.component.html',
  styleUrls: ['./maze.component.scss']
})
export class MazeComponent implements OnInit {

  constructor(public gameService: GameService) { }

  // MÉTODO QUE SE EJECUTA CUANDO SE INICIA EL COMPONENTE
  ngOnInit(): void { }
}
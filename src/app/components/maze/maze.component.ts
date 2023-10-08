import { Component, OnInit } from '@angular/core';
import { GameService } from '../../services/game.service';

@Component({
  selector: 'app-maze',
  templateUrl: './maze.component.html',
  styleUrls: ['./maze.component.css']
})
export class MazeComponent implements OnInit {

  constructor(public gameService: GameService) { } // Hacemos el servicio público para que pueda ser accesible desde el HTML.


  ngOnInit(): void { }
}
import { Component, Input } from '@angular/core';
import { Player } from '../../models/interfaces';


@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent {
  @Input() player!: Player;

  // FUNCION PARA ESTABLECER ESTILOS DINÁMICAMENTE BASADOS EN SU DIRECCIÓN 
  get playerDirectionClass(): string {
    return `direction-${this.player.direction.toLowerCase()}`;
  }
}

import { Component, Input } from '@angular/core';
import { Room } from '../../models/interfaces';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent {
  @Input() room!: Room;

  constructor() { }

  // MÉTODO QUE SE EJECUTA CUANDO SE INICIA EL COMPONENTE
  ngOnInit(): void {
    
  }
}
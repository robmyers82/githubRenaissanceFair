import { Component, Input } from '@angular/core';

@Component({
	selector: 'player-card',
  	templateUrl: 'app/player.component.html',
  	styleUrls: ['app/player.component.css']
})

export class PlayerComponent { 
	@Input() player: any;
}

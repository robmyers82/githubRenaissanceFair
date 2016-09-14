import { Component, Observable } from '@angular/core';
import { Store } from '@ngrx/store';
import 'rxjs/add/operator/first';
import { PlayerDataService } from './player-data.service';
import { AngularFire, FirebaseObjectObservable, FirebaseListObservable } from 'angularfire2';
import { Router } from '@angular/router';
import { PlayerComponent } from './player.component';

@Component({
  templateUrl: 'app/duel.component.html',
  styleUrls: ['app/duel.component.css'],
  directives: [PlayerComponent]
})

export class DuelComponent {
	
	screenState: string;
	loggedUser: Observable<any>;
	player: any;
	opponent: any;
	opponentsList: FirebaseListObservable<any[]>;
	duelResult: string;

	constructor(private playerDataService: PlayerDataService, public af: AngularFire, public store: Store<AppState>, private router: Router) {
  		store.select('user')
  			.subscribe(user => {
  				if (user.id === '') {
  					this.router.navigate(['/join']);
  				}
  				else {
  					this.loggedUser = user;
  					let playerSnapshot = af.database.object('/players/'+this.loggedUser.id);
  					playerSnapshot.subscribe(snapshot => {
  						this.player = snapshot;
  					});
  					
  					this.opponentsList = af.database.list('/players');
  				}
  			});
  	}

	private rollDice() {
		return 1 + Math.floor(Math.random() * 6);
	}

	public chooseOpponent(theOpponent) {
		this.opponent = theOpponent;
		this.screenState = "yourOpponent";
	}

	public runAway() {
		this.screenState = "chooseOpponent";
	}

	public loadDuel() {
		this.screenState = "duelLoading";
	}

	public performDuel() {
		let yourHealth = this.player.power * 10,
			opponentHealth = this.opponent.power * 10;

		// begin the battle; the logic works as follows:
		// each attack is 3 rolls * accuracy, highest total scores the blow
		// blow is 1 roll * power, total is deducted from HP
		// first to reach a health of 0 loses
		while (yourHealth > 0 && opponentHealth > 0) {

			// initiate an attack
			let opponentRoll = 0, yourRoll = 0;

			for (let i = 0; i < 3; i++) {
	 			yourRoll += this.rollDice();
	 			opponentRoll += this.rollDice();
	 		}
	 		opponentRoll *= this.opponent.accuracy;
	 		yourRoll *= this.player.accuracy;

	 		// Note: a tie is a push
	 		if (yourRoll > opponentRoll) {
	 			opponentHealth -= (this.player.power * this.rollDice());
	 		}
	 		else if (opponentRoll > yourRoll) {
	 			yourHealth -= (this.opponent.power * this.rollDice());
	 		}

		}

		let yourStats = {
			name: this.opponent.title+" "+this.opponent.name+" the "+this.opponent.descriptor,
			result: ''
		},
		opponentStats = {
			name: this.player.title+" "+this.player.name+" the "+this.player.descriptor,
			result: ''
		}

		this.player.totalduels++;
		this.opponent.totalduels++;
		if (yourHealth <= 0) {
			this.duelResult = "lost";
			yourStats.result = "lost";
			opponentStats.result = "won";
			this.opponent.wins++;
			this.player.losses++;
		}
		else {
			this.duelResult = "won";
			yourStats.result = "won";
			opponentStats.result = "lost";
			this.player.wins++;
			this.opponent.losses++;
		}

		let updatePlayerObject = this.af.database.object('/players/'+this.loggedUser.id);
		updatePlayerObject.update({ wins: this.player.wins, losses: this.player.losses, totalduels: this.player.totalduels});

		let updateOpponentObject = this.af.database.object('/players/'+this.opponent.$key);
		updateOpponentObject.update({ wins: this.opponent.wins, losses: this.opponent.losses, totalduels: this.opponent.totalduels});

		let yourDuelList = this.af.database.list('/duels/'+this.loggedUser.id);
		yourDuelList.push(yourStats);

		let opponentDuelList = this.af.database.list('/duels/'+this.opponent.$key);
		opponentDuelList.push(opponentStats);

		this.screenState = "duelResults";
	}

	ngOnInit() {
		this.screenState = 'chooseOpponent';
	}
}

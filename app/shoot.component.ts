import { Component, Observable } from '@angular/core';
import { Store } from '@ngrx/store';
import 'rxjs/add/operator/first';
import { PlayerDataService } from './player-data.service';
import { AngularFire, FirebaseObjectObservable, FirebaseListObservable } from 'angularfire2';
import { Router } from '@angular/router';
import { PlayerComponent } from './player.component';

@Component({
  templateUrl: 'app/shoot.component.html',
  styleUrls: ['app/shoot.component.css']
})

export class ShootComponent {
	screenState: string;
	shootingRangeLevel: string;
	loggedUser: Observable<any>;
	player: any;
	totalScore: any;

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
  				}
  			});
  	}

	private rollDice() {
		return 1 + Math.floor(Math.random() * 6);
	}

	private placeArrow(score) {

		let result = {
			placement: 0,
			score: 0
		};

		switch (this.shootingRangeLevel) {

			case "beginner":
				if (score > 75) {
					result.placement = 1;
					result.score = 100;
				}
				else if (score > 50 && score <= 75) {
					result.placement = 3;
					result.score = 25;
				}
				else if (score > 25 && score <= 50) {
					result.placement = 2;
					result.score = 50;
				}
				else {
					result.placement = 4;
					result.score = 0;
				}
				break;

			case "intermediate":
				if (score > 375) {
					result.placement = 1;
					result.score = 100;
				}
				else if (score > 250 && score <= 375) {
					result.placement = 3;
					result.score = 25;
				}
				else if (score > 125 && score <= 250) {
					result.placement = 2;
					result.score = 50;
				}
				else {
					result.placement = 4;
					result.score = 0;
				}
				break;

			case "expert":
				if (score > 750) {
					result.placement = 1;
					result.score = 100;
				}
				else if (score > 500 && score <= 750) {
					result.placement = 3;
					result.score = 25;
				}
				else if (score > 250 && score <= 500) {
					result.placement = 2;
					result.score = 50;
				}
				else {
					result.placement = 4;
					result.score = 0;
				}
				break;
		}

		return result;
	}

	chooseRangeLevel(level) {

		this.shootingRangeLevel = level;
		this.screenState = "rangeLoading";
	}

	shootTargets() {

		this.totalScore = {
			rangeResults: [],
			total: 0,
			level: this.shootingRangeLevel
		};

		// calculate each arrow's score (5 total arrows)
		for (let i = 0; i < 5; i++) {

			// calculate each arrow's score (3 dice rolls)
			let totalRoll = 0;
			for (let i = 0; i < 3; i++) {
				totalRoll += this.rollDice();
			}

			let arrow = this.placeArrow(totalRoll*this.player.accuracy);

			this.totalScore.total += arrow.score;
			this.totalScore.rangeResults.push(arrow);
		}

		this.screenState = "rangeResults";

		// update the user
		this.player.totalshoots++;

		let updatePlayerObject = this.af.database.object('/players/'+this.loggedUser.id);
		if (this.player.bestlevel === '') {
			this.player.bestlevel = this.shootingRangeLevel;
			this.player.bestscore = this.totalScore.total;
		}
		else {

			// place the total best
			if (this.player.bestlevel === "beginner" && this.player.bestscore <= this.totalScore.total) {
				this.player.bestlevel = this.shootingRangeLevel;
				this.player.bestscore = this.totalScore.total;
			}
			else if (this.player.bestlevel === "beginner" && this.shootingRangeLevel !== "beginner" && this.player.bestscore <= this.totalScore.total) {
				this.player.bestlevel = this.shootingRangeLevel;
				this.player.bestscore = this.totalScore.total;
			}
			else if (this.player.bestlevel === "expert" && this.shootingRangeLevel === "expert" && this.player.bestscore <= this.totalScore.total) {
				this.player.bestlevel = this.shootingRangeLevel;
				this.player.bestscore = this.totalScore.total;
			}
		}

		// place the individual best scores
		if (this.shootingRangeLevel === "beginner" && this.player.beginnerbest < this.totalScore.total) {
			this.player.beginnerbest = this.totalScore.total;
		}
		else if (this.shootingRangeLevel === "intermediate" && this.player.intermediatebest < this.totalScore.total) {
			this.player.intermediatebest = this.totalScore.total;
		}
		else if (this.shootingRangeLevel === "expert" && this.player.expertbest < this.totalScore.total) {
			this.player.expertbest = this.totalScore.total;
		}

		updatePlayerObject.update({ bestlevel: this.player.bestlevel, bestscore: this.player.bestscore, totalshoots: this.player.totalshoots, beginnerbest: this.player.beginnerbest, intermediatebest: this.player.intermediatebest, expertbest: this.player.expertbest });

		let shootsList = this.af.database.list('/shoots/'+this.loggedUser.id);
		shootsList.push(this.totalScore);
	}

	ngOnInit() {
		this.screenState = 'chooseRange';
	}
}
